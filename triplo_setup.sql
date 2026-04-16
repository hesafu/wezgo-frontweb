-- ============================================================
--  TRIPLO — DATABASE SETUP SCRIPT v1.0
--  PostgreSQL 16 + PostGIS · Supabase
-- ============================================================
--  Run this script once against a fresh Supabase project.
--  Requires: PostGIS extension (enabled below).
--  Auth tables (auth.users) are managed by Supabase — do NOT
--  recreate them. profiles references auth.users(id).
--
--  Execution order:
--    1. Extensions
--    2. Enum types
--    3. Shared utility function (set_updated_at)
--    4. Tables  (in FK-dependency order)
--    5. Indexes
--    6. Triggers
--    7. Domain functions
--    8. Views
--    9. Seed data (subscription_plans)
--
--  To reset and re-run: uncomment the DROP block at the
--  bottom of this file and run it FIRST. All data will
--  be lost.
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS postgis;        -- Spatial types & indexes
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- gen_random_uuid() for PG < 13


-- ============================================================
-- 2. ENUM TYPES
-- ============================================================

CREATE TYPE trip_phase            AS ENUM ('preparation', 'active', 'closed');
CREATE TYPE member_role           AS ENUM ('admin', 'member');
CREATE TYPE member_status         AS ENUM ('active', 'left', 'removed');
CREATE TYPE message_type          AS ENUM ('text', 'image', 'system');
CREATE TYPE media_type            AS ENUM ('photo', 'video');
CREATE TYPE poi_category          AS ENUM (
    'restaurant', 'bar', 'cafe', 'hotel', 'accommodation',
    'monument', 'museum', 'viewpoint', 'beach', 'nature',
    'transport', 'shopping', 'emergency', 'danger_zone', 'other'
);
CREATE TYPE poi_source            AS ENUM ('manual', 'ia_script', 'user');
CREATE TYPE event_type            AS ENUM (
    'meetup', 'meal', 'excursion', 'transport',
    'accommodation', 'activity', 'other'
);
CREATE TYPE expense_category      AS ENUM (
    'food', 'transport', 'accommodation',
    'activity', 'shopping', 'other'
);
CREATE TYPE subscription_status   AS ENUM ('active', 'trialing', 'cancelled', 'expired');
CREATE TYPE subscription_platform AS ENUM ('web', 'ios', 'android');
CREATE TYPE push_platform         AS ENUM ('ios', 'android');
CREATE TYPE settlement_status     AS ENUM ('pending', 'paid');
CREATE TYPE report_status         AS ENUM ('pending', 'resolved', 'dismissed');
CREATE TYPE discount_type         AS ENUM ('percentage', 'fixed_eur');


-- ============================================================
-- 3. SHARED UTILITY FUNCTION
--    (declared before triggers that reference it)
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at IS
    'Generic BEFORE UPDATE trigger function: sets updated_at = now().';


-- ============================================================
-- 4. TABLES  (dependency order)
-- ============================================================

-- ------------------------------------------------------------
-- 4.01  profiles
--       Extends auth.users (managed by Supabase Auth).
--       Created automatically via trigger on user sign-up.
-- ------------------------------------------------------------
CREATE TABLE public.profiles (
    id            UUID         PRIMARY KEY
                               REFERENCES auth.users (id) ON DELETE CASCADE,
    display_name  TEXT         NOT NULL,
    avatar_url    TEXT,
    phone         TEXT,
    locale        TEXT         NOT NULL DEFAULT 'en'
                               CHECK (locale IN ('es','en','fr','de','it','pt')),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    suspended_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.profiles            IS 'User profile data. Extends auth.users. Auto-created on registration.';
COMMENT ON COLUMN public.profiles.is_active  IS 'FALSE = account suspended by admin (no auth deletion).';
COMMENT ON COLUMN public.profiles.locale     IS 'Preferred UI language. Auto-detected during onboarding.';

-- Auto-create profile on Supabase Auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name',
                 split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------------------------
-- 4.02  subscription_plans
--       Static catalogue. Add plans with INSERT, no DDL change.
-- ------------------------------------------------------------
CREATE TABLE public.subscription_plans (
    id                    SERIAL       PRIMARY KEY,
    name                  TEXT         NOT NULL UNIQUE
                                       CHECK (name IN ('basic','plus','premium')),
    price_eur_annual      NUMERIC(8,2) NOT NULL,
    max_groups            INTEGER      NOT NULL,
    max_members_per_group INTEGER      NOT NULL,
    max_storage_gb        NUMERIC(6,2) NOT NULL,
    features              JSONB        NOT NULL DEFAULT '{}',
    is_active             BOOLEAN      NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE  public.subscription_plans          IS 'Plan catalogue. New plans = INSERT only, no schema migration needed.';
COMMENT ON COLUMN public.subscription_plans.features IS 'Additional feature flags. E.g.: {"offline_maps": true, "priority_support": true}';


-- ------------------------------------------------------------
-- 4.03  subscriptions
-- ------------------------------------------------------------
CREATE TABLE public.subscriptions (
    id                     UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                UUID                  NOT NULL
                                                 REFERENCES public.profiles (id) ON DELETE CASCADE,
    plan_id                INTEGER               NOT NULL
                                                 REFERENCES public.subscription_plans (id),
    stripe_subscription_id TEXT                  UNIQUE,
    revenuecat_id          TEXT                  UNIQUE,
    platform               subscription_platform NOT NULL,
    status                 subscription_status   NOT NULL,
    current_period_start   TIMESTAMPTZ           NOT NULL,
    current_period_end     TIMESTAMPTZ           NOT NULL,
    cancelled_at           TIMESTAMPTZ,
    created_at             TIMESTAMPTZ           NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.subscriptions.platform IS 'web = Stripe direct; ios/android = RevenueCat IAP.';


-- ------------------------------------------------------------
-- 4.04  payment_events  (immutable Stripe webhook log)
-- ------------------------------------------------------------
CREATE TABLE public.payment_events (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id   TEXT        NOT NULL UNIQUE,   -- idempotency key
    event_type        TEXT        NOT NULL,           -- e.g. invoice.paid
    user_id           UUID        REFERENCES public.profiles (id) ON DELETE SET NULL,
    subscription_id   UUID        REFERENCES public.subscriptions (id) ON DELETE SET NULL,
    payload           JSONB       NOT NULL,           -- full Stripe event body
    processed_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.payment_events                 IS 'Immutable Stripe webhook log. Never modify or delete rows.';
COMMENT ON COLUMN public.payment_events.stripe_event_id IS 'UNIQUE ensures idempotency: duplicate webhooks are ignored.';


-- ------------------------------------------------------------
-- 4.05  invoices  (denormalised for UI; derived from payment_events)
-- ------------------------------------------------------------
CREATE TABLE public.invoices (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID         NOT NULL
                                   REFERENCES public.profiles (id) ON DELETE CASCADE,
    subscription_id   UUID         REFERENCES public.subscriptions (id) ON DELETE SET NULL,
    stripe_invoice_id TEXT         NOT NULL UNIQUE,
    amount_eur        NUMERIC(8,2) NOT NULL,
    status            TEXT         NOT NULL
                                   CHECK (status IN ('paid','void','uncollectible')),
    invoice_pdf_url   TEXT,
    paid_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.invoices IS 'Denormalised invoices for UI. Avoids parsing JSONB from payment_events on every query.';


-- ------------------------------------------------------------
-- 4.06  groups
-- ------------------------------------------------------------

-- Generates a 6-char alphanumeric code without confusable chars (I O 0 1)
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    chars TEXT    := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    code  TEXT    := '';
    i     INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        code := code || substr(chars,
                               floor(random() * length(chars))::int + 1,
                               1);
    END LOOP;
    RETURN code;
END;
$$;

CREATE TABLE public.groups (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT        NOT NULL,
    description       TEXT,
    invite_code       TEXT        NOT NULL UNIQUE
                                  DEFAULT public.generate_invite_code(),
    invite_link_token UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    owner_id          UUID        NOT NULL
                                  REFERENCES public.profiles (id) ON DELETE RESTRICT,
    destination       TEXT,
    cover_image_url   TEXT,
    trip_start_date   DATE,
    trip_end_date     DATE,
    phase             trip_phase  NOT NULL DEFAULT 'preparation',
    is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.groups.phase             IS 'preparation → active (map+wall on) → closed (read-only + settlement).';
COMMENT ON COLUMN public.groups.owner_id          IS 'ON DELETE RESTRICT: transfer ownership before deleting a user.';
COMMENT ON COLUMN public.groups.invite_code       IS '6-char alphanumeric. Regenerable without token invalidation.';
COMMENT ON COLUMN public.groups.invite_link_token IS 'UUID token for /invite/:token deep-link.';


-- ------------------------------------------------------------
-- 4.07  group_members
-- ------------------------------------------------------------
CREATE TABLE public.group_members (
    id        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id  UUID          NOT NULL
                            REFERENCES public.groups (id) ON DELETE CASCADE,
    user_id   UUID          NOT NULL
                            REFERENCES public.profiles (id) ON DELETE CASCADE,
    role      member_role   NOT NULL DEFAULT 'member',
    status    member_status NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    left_at   TIMESTAMPTZ,
    UNIQUE (group_id, user_id)
);

COMMENT ON COLUMN public.group_members.status IS 'active | left (voluntary) | removed (expelled by admin).';


-- ------------------------------------------------------------
-- 4.08  media
--       Defined before messages & expenses (both FK to media).
-- ------------------------------------------------------------
CREATE TABLE public.media (
    id             UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id       UUID       NOT NULL
                              REFERENCES public.groups (id) ON DELETE CASCADE,
    uploader_id    UUID       NOT NULL
                              REFERENCES public.profiles (id) ON DELETE SET NULL,
    s3_key         TEXT       NOT NULL UNIQUE,
    cloudfront_url TEXT       NOT NULL,
    thumbnail_url  TEXT,
    media_type     media_type NOT NULL DEFAULT 'photo',
    size_bytes     BIGINT     NOT NULL,
    width          INTEGER,
    height         INTEGER,
    latitude       NUMERIC(9,6),
    longitude      NUMERIC(9,6),
    location_point GEOMETRY(Point, 4326),  -- PostGIS WGS84
    duration_s     INTEGER,               -- NULL for photos; Phase 2: video
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.media.s3_key          IS 'Unique S3 key. Format: groups/{group_id}/{uuid}.{ext}';
COMMENT ON COLUMN public.media.cloudfront_url  IS 'Public CDN URL. Latency < 50 ms in Spain/Europe.';
COMMENT ON COLUMN public.media.location_point  IS 'PostGIS Point WGS84 derived from EXIF GPS data.';
COMMENT ON COLUMN public.media.duration_s      IS 'Duration in seconds. Phase 2: video (AWS MediaConvert).';


-- ------------------------------------------------------------
-- 4.09  messages
-- ------------------------------------------------------------
CREATE TABLE public.messages (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id     UUID         NOT NULL
                              REFERENCES public.groups (id) ON DELETE CASCADE,
    sender_id    UUID         NOT NULL
                              REFERENCES public.profiles (id) ON DELETE SET NULL,
    content      TEXT,
    message_type message_type NOT NULL DEFAULT 'text',
    media_id     UUID         REFERENCES public.media (id) ON DELETE SET NULL,
    is_deleted   BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT message_has_content CHECK (
        (message_type = 'text'   AND content  IS NOT NULL) OR
        (message_type = 'image'  AND media_id IS NOT NULL) OR
        (message_type = 'system' AND content  IS NOT NULL)
    )
);

COMMENT ON COLUMN public.messages.is_deleted IS 'Soft delete: content cleared, row kept for moderation audit trail.';
COMMENT ON COLUMN public.messages.media_id   IS 'Only populated when message_type = image.';


-- ------------------------------------------------------------
-- 4.10  message_reads
-- ------------------------------------------------------------
CREATE TABLE public.message_reads (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID        NOT NULL
                           REFERENCES public.messages (id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL
                           REFERENCES public.profiles (id) ON DELETE CASCADE,
    read_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (message_id, user_id)
);


-- ------------------------------------------------------------
-- 4.11  push_tokens
-- ------------------------------------------------------------
CREATE TABLE public.push_tokens (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID          NOT NULL
                              REFERENCES public.profiles (id) ON DELETE CASCADE,
    token       TEXT          NOT NULL,
    platform    push_platform NOT NULL,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    UNIQUE (user_id, token)
);

COMMENT ON COLUMN public.push_tokens.token IS 'FCM token (Android) or APNs token (iOS). Deactivated on invalid-token error.';


-- ------------------------------------------------------------
-- 4.12  location_snapshots
-- ------------------------------------------------------------
CREATE TABLE public.location_snapshots (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        UUID        NOT NULL
                                REFERENCES public.groups (id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL
                                REFERENCES public.profiles (id) ON DELETE CASCADE,
    latitude        NUMERIC(9,6) NOT NULL,
    longitude       NUMERIC(9,6) NOT NULL,
    altitude        NUMERIC(7,2),
    accuracy_meters NUMERIC(6,2),
    point           GEOMETRY(Point, 4326) NOT NULL,
    recorded_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.location_snapshots             IS 'GPS position history. Only active when groups.phase = active.';
COMMENT ON COLUMN public.location_snapshots.recorded_at IS 'Device timestamp (not server) for accurate route reconstruction.';


-- ------------------------------------------------------------
-- 4.13  routes
-- ------------------------------------------------------------
CREATE TABLE public.routes (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        UUID         NOT NULL
                                 REFERENCES public.groups (id) ON DELETE CASCADE,
    created_by      UUID         NOT NULL
                                 REFERENCES public.profiles (id) ON DELETE SET NULL,
    name            TEXT,
    route_type      TEXT         NOT NULL DEFAULT 'planned'
                                 CHECK (route_type IN ('planned','completed')),
    geometry        GEOMETRY(LineString, 4326),
    distance_meters NUMERIC(10,2),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.routes.route_type IS 'planned: created in preparation. completed: built from location_snapshots on stage close.';


-- ------------------------------------------------------------
-- 4.14  points_of_interest
-- ------------------------------------------------------------
CREATE TABLE public.points_of_interest (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT         NOT NULL,
    description      TEXT,
    category         poi_category NOT NULL,
    latitude         NUMERIC(9,6) NOT NULL,
    longitude        NUMERIC(9,6) NOT NULL,
    location_point   GEOMETRY(Point, 4326)   NOT NULL,
    zone_geometry    GEOMETRY(Polygon, 4326),          -- danger zones / areas
    address          TEXT,
    website_url      TEXT,
    phone            TEXT,
    opening_hours    JSONB,                             -- {"mon":"09:00-22:00","sun":"closed"}
    source           poi_source   NOT NULL DEFAULT 'manual',
    is_verified      BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    -- Sponsorship / marketing
    is_sponsored     BOOLEAN      NOT NULL DEFAULT FALSE,
    sponsor_name     TEXT,
    sponsor_priority INTEGER      NOT NULL DEFAULT 0,  -- higher = shown first
    sponsored_from   TIMESTAMPTZ,
    sponsored_until  TIMESTAMPTZ,
    -- AI load metadata
    raw_data         JSONB,                             -- original AI/API response
    external_id      TEXT,                             -- Google Place ID, OSM ID, etc.
    created_by       UUID         REFERENCES public.profiles (id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT sponsored_requires_dates CHECK (
        NOT is_sponsored
        OR (sponsored_from IS NOT NULL AND sponsored_until IS NOT NULL)
    )
);

COMMENT ON COLUMN public.points_of_interest.source           IS 'manual=admin, ia_script=auto-loaded, user=user-suggested (Phase 2).';
COMMENT ON COLUMN public.points_of_interest.is_verified      IS 'TRUE = reviewed by a human admin. AI POIs start FALSE.';
COMMENT ON COLUMN public.points_of_interest.sponsor_priority IS '0 = organic. Higher integer = displayed first on the map.';
COMMENT ON COLUMN public.points_of_interest.raw_data         IS 'Full AI/API response stored for audit and re-editing by admin.';
COMMENT ON COLUMN public.points_of_interest.zone_geometry    IS 'Polygon for danger zones or interest areas. NULL for point POIs.';


-- ------------------------------------------------------------
-- 4.15  trip_events  (agenda)
-- ------------------------------------------------------------
CREATE TABLE public.trip_events (
    id             UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id       UUID       NOT NULL
                              REFERENCES public.groups (id) ON DELETE CASCADE,
    created_by     UUID       NOT NULL
                              REFERENCES public.profiles (id) ON DELETE SET NULL,
    title          TEXT       NOT NULL,
    description    TEXT,
    event_type     event_type NOT NULL DEFAULT 'other',
    latitude       NUMERIC(9,6),
    longitude      NUMERIC(9,6),
    location_point GEOMETRY(Point, 4326),
    address        TEXT,
    poi_id         UUID       REFERENCES public.points_of_interest (id) ON DELETE SET NULL,
    starts_at      TIMESTAMPTZ NOT NULL,
    ends_at        TIMESTAMPTZ,
    is_confirmed   BOOLEAN    NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT event_end_after_start CHECK (ends_at IS NULL OR ends_at > starts_at)
);

COMMENT ON COLUMN public.trip_events.poi_id        IS 'Optional link to a known POI (e.g. event is at a registered restaurant).';
COMMENT ON COLUMN public.trip_events.is_confirmed  IS 'FALSE = tentative. TRUE = confirmed by group admin.';


-- ------------------------------------------------------------
-- 4.16  trip_expenses
-- ------------------------------------------------------------
CREATE TABLE public.trip_expenses (
    id               UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id         UUID             NOT NULL
                                      REFERENCES public.groups (id) ON DELETE CASCADE,
    paid_by          UUID             NOT NULL
                                      REFERENCES public.profiles (id) ON DELETE RESTRICT,
    amount           NUMERIC(10,2)    NOT NULL CHECK (amount > 0),
    currency         TEXT             NOT NULL DEFAULT 'EUR',
    description      TEXT             NOT NULL,
    category         expense_category NOT NULL DEFAULT 'other',
    expense_date     DATE             NOT NULL DEFAULT CURRENT_DATE,
    receipt_media_id UUID             REFERENCES public.media (id) ON DELETE SET NULL,
    notes            TEXT,
    created_at       TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ      NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.trip_expenses.paid_by          IS 'ON DELETE RESTRICT: prevents deletion of users with recorded expenses.';
COMMENT ON COLUMN public.trip_expenses.receipt_media_id IS 'Photo of receipt or invoice uploaded to S3/CloudFront.';
COMMENT ON COLUMN public.trip_expenses.amount           IS 'Total paid by paid_by. Must equal SUM(expense_splits.amount_owed).';


-- ------------------------------------------------------------
-- 4.17  expense_splits
-- ------------------------------------------------------------
CREATE TABLE public.expense_splits (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id  UUID          NOT NULL
                              REFERENCES public.trip_expenses (id) ON DELETE CASCADE,
    user_id     UUID          NOT NULL
                              REFERENCES public.profiles (id) ON DELETE RESTRICT,
    amount_owed NUMERIC(10,2) NOT NULL CHECK (amount_owed >= 0),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    UNIQUE (expense_id, user_id)
);

COMMENT ON TABLE  public.expense_splits             IS 'Per-participant share of an expense. SUM(amount_owed) = trip_expenses.amount.';
COMMENT ON COLUMN public.expense_splits.amount_owed IS 'Can be 0 if a member is included but exempt from this specific expense.';


-- ------------------------------------------------------------
-- 4.18  trip_contributions
-- ------------------------------------------------------------
CREATE TABLE public.trip_contributions (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id          UUID          NOT NULL
                                    REFERENCES public.groups (id) ON DELETE CASCADE,
    user_id           UUID          NOT NULL
                                    REFERENCES public.profiles (id) ON DELETE RESTRICT,
    amount            NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency          TEXT          NOT NULL DEFAULT 'EUR',
    description       TEXT,
    contribution_date DATE          NOT NULL DEFAULT CURRENT_DATE,
    proof_media_id    UUID          REFERENCES public.media (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.trip_contributions              IS 'Money each member adds to the group shared fund.';
COMMENT ON COLUMN public.trip_contributions.proof_media_id IS 'Photo of transfer/payment confirmation.';


-- ------------------------------------------------------------
-- 4.19  expense_settlements
-- ------------------------------------------------------------
CREATE TABLE public.expense_settlements (
    id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        UUID              NOT NULL
                                      REFERENCES public.groups (id) ON DELETE CASCADE,
    from_user_id    UUID              NOT NULL
                                      REFERENCES public.profiles (id) ON DELETE RESTRICT,
    to_user_id      UUID              NOT NULL
                                      REFERENCES public.profiles (id) ON DELETE RESTRICT,
    amount          NUMERIC(10,2)     NOT NULL CHECK (amount > 0),
    currency        TEXT              NOT NULL DEFAULT 'EUR',
    status          settlement_status NOT NULL DEFAULT 'pending',
    settled_at      TIMESTAMPTZ,
    proof_media_id  UUID              REFERENCES public.media (id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT now(),
    CONSTRAINT different_users CHECK (from_user_id != to_user_id)
);

COMMENT ON TABLE  public.expense_settlements             IS 'Final settlements when trip closes (phase=closed). from_user pays amount to to_user.';
COMMENT ON COLUMN public.expense_settlements.proof_media_id IS 'Proof of settlement payment.';


-- ------------------------------------------------------------
-- 4.20  offers
-- ------------------------------------------------------------
CREATE TABLE public.offers (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    title          TEXT          NOT NULL,
    description    TEXT,
    discount_type  discount_type NOT NULL,
    discount_value NUMERIC(8,2)  NOT NULL CHECK (discount_value > 0),
    image_url      TEXT,
    target_url     TEXT,
    target_plan    TEXT          REFERENCES public.subscription_plans (name) ON DELETE SET NULL,
    valid_from     TIMESTAMPTZ   NOT NULL,
    valid_until    TIMESTAMPTZ   NOT NULL,
    is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
    created_by     UUID          NOT NULL
                                 REFERENCES public.profiles (id) ON DELETE RESTRICT,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT valid_date_range   CHECK (valid_until > valid_from),
    CONSTRAINT percentage_max_100 CHECK (
        discount_type != 'percentage' OR discount_value <= 100
    )
);

COMMENT ON COLUMN public.offers.target_plan   IS 'NULL = visible to all plans. Value = exclusive to that plan.';
COMMENT ON COLUMN public.offers.discount_type IS 'percentage = % off; fixed_eur = euros off.';


-- ------------------------------------------------------------
-- 4.21  content_reports
-- ------------------------------------------------------------
CREATE TABLE public.content_reports (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID          NOT NULL
                              REFERENCES public.profiles (id) ON DELETE CASCADE,
    media_id    UUID          REFERENCES public.media (id) ON DELETE CASCADE,
    message_id  UUID          REFERENCES public.messages (id) ON DELETE CASCADE,
    reason      TEXT          NOT NULL,
    status      report_status NOT NULL DEFAULT 'pending',
    resolved_by UUID          REFERENCES public.profiles (id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    -- Exactly one target: media XOR message
    CONSTRAINT one_target_only CHECK (
        (media_id IS NULL) != (message_id IS NULL)
    )
);

COMMENT ON CONSTRAINT one_target_only ON public.content_reports IS
    'Guarantees each report targets exactly one resource: media XOR message.';


-- ============================================================
-- 5. INDEXES
-- ============================================================

-- profiles
CREATE INDEX idx_profiles_active
    ON public.profiles (is_active);

-- subscriptions
CREATE INDEX idx_subscriptions_user
    ON public.subscriptions (user_id);
CREATE INDEX idx_subscriptions_status
    ON public.subscriptions (status);

-- payment_events
CREATE INDEX idx_payment_events_user
    ON public.payment_events (user_id);
CREATE INDEX idx_payment_events_type
    ON public.payment_events (event_type);

-- invoices
CREATE INDEX idx_invoices_user
    ON public.invoices (user_id);

-- groups
CREATE INDEX idx_groups_owner
    ON public.groups (owner_id);
CREATE INDEX idx_groups_invite_code
    ON public.groups (invite_code);
CREATE INDEX idx_groups_phase
    ON public.groups (phase)
    WHERE is_active = TRUE;                            -- partial: active groups only

-- group_members
CREATE INDEX idx_group_members_group
    ON public.group_members (group_id);
CREATE INDEX idx_group_members_user
    ON public.group_members (user_id);
CREATE INDEX idx_group_members_active
    ON public.group_members (group_id)
    WHERE status = 'active';                           -- partial: active members only

-- media
CREATE INDEX idx_media_group
    ON public.media (group_id);
CREATE INDEX idx_media_uploader
    ON public.media (uploader_id);
CREATE INDEX idx_media_location
    ON public.media USING GIST (location_point);       -- spatial index

-- messages
CREATE INDEX idx_messages_group_time
    ON public.messages (group_id, created_at DESC);   -- pagination query
CREATE INDEX idx_messages_sender
    ON public.messages (sender_id);

-- message_reads
CREATE INDEX idx_message_reads_user
    ON public.message_reads (user_id, message_id);

-- push_tokens
CREATE INDEX idx_push_tokens_user_active
    ON public.push_tokens (user_id)
    WHERE is_active = TRUE;                            -- partial: active tokens only

-- location_snapshots
CREATE INDEX idx_location_group_time
    ON public.location_snapshots (group_id, recorded_at DESC);
CREATE INDEX idx_location_user_group
    ON public.location_snapshots (user_id, group_id);
CREATE INDEX idx_location_point
    ON public.location_snapshots USING GIST (point);  -- spatial index

-- routes
CREATE INDEX idx_routes_group
    ON public.routes (group_id);
CREATE INDEX idx_routes_geometry
    ON public.routes USING GIST (geometry);            -- spatial index

-- points_of_interest
CREATE INDEX idx_poi_location
    ON public.points_of_interest USING GIST (location_point);   -- spatial
CREATE INDEX idx_poi_zone
    ON public.points_of_interest USING GIST (zone_geometry)
    WHERE zone_geometry IS NOT NULL;                   -- partial: polygons only
CREATE INDEX idx_poi_category
    ON public.points_of_interest (category);
CREATE INDEX idx_poi_sponsored
    ON public.points_of_interest (sponsor_priority DESC, sponsored_until)
    WHERE is_sponsored = TRUE AND is_active = TRUE;    -- partial: active sponsored
CREATE INDEX idx_poi_source_verified
    ON public.points_of_interest (source, is_verified);

-- trip_events
CREATE INDEX idx_trip_events_group
    ON public.trip_events (group_id, starts_at);
CREATE INDEX idx_trip_events_location
    ON public.trip_events USING GIST (location_point)
    WHERE location_point IS NOT NULL;                  -- partial: geo events only

-- trip_expenses
CREATE INDEX idx_expenses_group
    ON public.trip_expenses (group_id, expense_date DESC);
CREATE INDEX idx_expenses_payer
    ON public.trip_expenses (paid_by);

-- expense_splits
CREATE INDEX idx_splits_expense
    ON public.expense_splits (expense_id);
CREATE INDEX idx_splits_user
    ON public.expense_splits (user_id);

-- trip_contributions
CREATE INDEX idx_contributions_group
    ON public.trip_contributions (group_id);
CREATE INDEX idx_contributions_user
    ON public.trip_contributions (user_id);

-- expense_settlements
CREATE INDEX idx_settlements_group
    ON public.expense_settlements (group_id);
CREATE INDEX idx_settlements_from
    ON public.expense_settlements (from_user_id);
CREATE INDEX idx_settlements_to
    ON public.expense_settlements (to_user_id);
CREATE INDEX idx_settlements_pending
    ON public.expense_settlements (group_id)
    WHERE status = 'pending';                          -- partial: open settlements

-- offers
CREATE INDEX idx_offers_active
    ON public.offers (valid_from, valid_until)
    WHERE is_active = TRUE;                            -- partial: active offers only
CREATE INDEX idx_offers_plan
    ON public.offers (target_plan);

-- content_reports
CREATE INDEX idx_reports_pending
    ON public.content_reports (status)
    WHERE status = 'pending';                          -- partial: unresolved reports
CREATE INDEX idx_reports_reporter
    ON public.content_reports (reporter_id);


-- ============================================================
-- 6. TRIGGERS  (updated_at automation)
-- ============================================================

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER groups_updated_at
    BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER push_tokens_updated_at
    BEFORE UPDATE ON public.push_tokens
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER poi_updated_at
    BEFORE UPDATE ON public.points_of_interest
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trip_events_updated_at
    BEFORE UPDATE ON public.trip_events
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trip_expenses_updated_at
    BEFORE UPDATE ON public.trip_expenses
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER offers_updated_at
    BEFORE UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 7. DOMAIN FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- get_active_subscription(user_id)
-- Returns the current active subscription with plan limits.
-- Use this in business-rule checks before privileged actions.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_active_subscription(
    p_user_id UUID
)
RETURNS TABLE (
    subscription_id UUID,
    plan_name       TEXT,
    status          subscription_status,
    expires_at      TIMESTAMPTZ,
    max_groups      INTEGER,
    max_members     INTEGER,
    max_storage_gb  NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT
        s.id,
        sp.name,
        s.status,
        s.current_period_end,
        sp.max_groups,
        sp.max_members_per_group,
        sp.max_storage_gb
    FROM  public.subscriptions      s
    JOIN  public.subscription_plans sp ON sp.id = s.plan_id
    WHERE s.user_id = p_user_id
      AND s.status  = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_active_subscription IS
    'Returns active subscription + plan limits for a user. Used by can_create_group() and similar validators.';


-- ------------------------------------------------------------
-- can_create_group(user_id)
-- Returns TRUE if the user has not reached their plan group limit.
-- Call this BEFORE inserting into groups.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_create_group(
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_max_groups    INTEGER;
    v_current_count INTEGER;
BEGIN
    SELECT max_groups INTO v_max_groups
    FROM   public.get_active_subscription(p_user_id);

    IF v_max_groups IS NULL THEN
        RETURN FALSE;   -- no active subscription
    END IF;

    SELECT COUNT(*) INTO v_current_count
    FROM   public.groups
    WHERE  owner_id = p_user_id
      AND  is_active = TRUE;

    RETURN v_current_count < v_max_groups;
END;
$$;

COMMENT ON FUNCTION public.can_create_group IS
    'Returns TRUE if user can create another group within their plan limit.';


-- ------------------------------------------------------------
-- calculate_settlements(group_id)
-- Computes minimum-settlement transfers from v_group_balances
-- and writes them to expense_settlements.
-- Call when groups.phase transitions to ''closed''.
-- Returns the number of settlement rows created.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_settlements(
    p_group_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER := 0;
BEGIN
    -- Remove any previous pending settlements for this group
    DELETE FROM public.expense_settlements
    WHERE  group_id = p_group_id
      AND  status   = 'pending';

    -- Insert one row per (debtor, creditor) pair
    -- Amount = lesser of |debtor balance| and creditor balance
    INSERT INTO public.expense_settlements
        (group_id, from_user_id, to_user_id, amount)
    SELECT
        p_group_id,
        d.user_id,
        c.user_id,
        LEAST(ABS(d.balance), c.balance)
    FROM
        (SELECT user_id, balance
         FROM   public.v_group_balances
         WHERE  group_id = p_group_id
           AND  balance  < 0) d
    CROSS JOIN
        (SELECT user_id, balance
         FROM   public.v_group_balances
         WHERE  group_id = p_group_id
           AND  balance  > 0) c
    WHERE LEAST(ABS(d.balance), c.balance) > 0.01;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

COMMENT ON FUNCTION public.calculate_settlements IS
    'Computes minimum-settlement transfers to clear all balances. Call on groups.phase → closed.';


-- ============================================================
-- 8. VIEWS
-- ============================================================

-- ------------------------------------------------------------
-- v_group_balances
-- Net balance per active member per group.
--   balance > 0  → the group owes this member money
--   balance < 0  → this member owes money to the group
--   balance = 0  → fully settled
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_group_balances AS
WITH
    -- Total contributed to the group shared fund
    contributions AS (
        SELECT group_id,
               user_id,
               COALESCE(SUM(amount), 0) AS total_contributed
        FROM   public.trip_contributions
        GROUP  BY group_id, user_id
    ),
    -- Total owed by each member across all expense splits
    owed AS (
        SELECT te.group_id,
               es.user_id,
               COALESCE(SUM(es.amount_owed), 0) AS total_owed
        FROM   public.expense_splits  es
        JOIN   public.trip_expenses   te ON te.id = es.expense_id
        GROUP  BY te.group_id, es.user_id
    ),
    -- Total paid out of pocket (payer of the expense)
    paid AS (
        SELECT group_id,
               paid_by                          AS user_id,
               COALESCE(SUM(amount), 0)         AS total_paid
        FROM   public.trip_expenses
        GROUP  BY group_id, paid_by
    ),
    -- All active members
    members AS (
        SELECT group_id, user_id
        FROM   public.group_members
        WHERE  status = 'active'
    )
SELECT
    m.group_id,
    m.user_id,
    COALESCE(c.total_contributed, 0)                        AS total_contributed,
    COALESCE(p.total_paid, 0)                               AS total_paid,
    COALESCE(o.total_owed, 0)                               AS total_owed,
    COALESCE(p.total_paid, 0)
        + COALESCE(c.total_contributed, 0)
        - COALESCE(o.total_owed, 0)                         AS balance
FROM  members m
LEFT JOIN contributions c USING (group_id, user_id)
LEFT JOIN owed          o USING (group_id, user_id)
LEFT JOIN paid          p USING (group_id, user_id);

COMMENT ON VIEW public.v_group_balances IS
    'Net balance per active member. balance > 0 = owed money; balance < 0 = owes money. Feeds calculate_settlements().';


-- ============================================================
-- 9. SEED DATA
-- ============================================================

INSERT INTO public.subscription_plans
    (name,      price_eur_annual, max_groups, max_members_per_group, max_storage_gb, features)
VALUES
    ('basic',   29.99,   1,  5,  1.0,  '{"offline_maps": false, "priority_support": false}'),
    ('plus',    59.99,   3, 15,  5.0,  '{"offline_maps": true,  "priority_support": false}'),
    ('premium', 99.99,  10, 50, 20.0,  '{"offline_maps": true,  "priority_support": true}')
ON CONFLICT (name) DO NOTHING;   -- safe to re-run


-- ============================================================
-- NOTES ON ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Supabase requires explicit RLS policies on all public tables.
-- Enable RLS and add your policies after this script:
--
--   ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.groups            ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.group_members     ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.message_reads     ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.media             ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.location_snapshots ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.routes            ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.trip_events       ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.trip_expenses     ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.expense_splits    ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.trip_contributions ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.expense_settlements ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.invoices          ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.payment_events    ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.push_tokens       ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.offers            ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.content_reports   ENABLE ROW LEVEL SECURITY;
--
-- Example policy pattern (users see only their own groups):
--
--   CREATE POLICY "member sees own groups"
--       ON public.group_members
--       FOR SELECT
--       USING (user_id = auth.uid());
--
-- Retention policy for location_snapshots (run via pg_cron):
--
--   SELECT cron.schedule(
--       'cleanup-old-locations',
--       '0 3 * * *',
--       'DELETE FROM public.location_snapshots
--        WHERE recorded_at < now() - INTERVAL ''30 days'''
--   );


-- ============================================================
-- OPTIONAL: FULL RESET (uncomment to drop everything and
-- re-run this script from scratch — ALL DATA WILL BE LOST)
-- ============================================================
/*
DROP VIEW  IF EXISTS public.v_group_balances          CASCADE;
DROP TABLE IF EXISTS public.content_reports           CASCADE;
DROP TABLE IF EXISTS public.offers                    CASCADE;
DROP TABLE IF EXISTS public.expense_settlements       CASCADE;
DROP TABLE IF EXISTS public.trip_contributions        CASCADE;
DROP TABLE IF EXISTS public.expense_splits            CASCADE;
DROP TABLE IF EXISTS public.trip_expenses             CASCADE;
DROP TABLE IF EXISTS public.trip_events               CASCADE;
DROP TABLE IF EXISTS public.points_of_interest        CASCADE;
DROP TABLE IF EXISTS public.routes                    CASCADE;
DROP TABLE IF EXISTS public.location_snapshots        CASCADE;
DROP TABLE IF EXISTS public.push_tokens               CASCADE;
DROP TABLE IF EXISTS public.message_reads             CASCADE;
DROP TABLE IF EXISTS public.messages                  CASCADE;
DROP TABLE IF EXISTS public.media                     CASCADE;
DROP TABLE IF EXISTS public.group_members             CASCADE;
DROP TABLE IF EXISTS public.groups                    CASCADE;
DROP TABLE IF EXISTS public.invoices                  CASCADE;
DROP TABLE IF EXISTS public.payment_events            CASCADE;
DROP TABLE IF EXISTS public.subscriptions             CASCADE;
DROP TABLE IF EXISTS public.subscription_plans        CASCADE;
DROP TABLE IF EXISTS public.profiles                  CASCADE;

DROP FUNCTION IF EXISTS public.calculate_settlements  CASCADE;
DROP FUNCTION IF EXISTS public.can_create_group       CASCADE;
DROP FUNCTION IF EXISTS public.get_active_subscription CASCADE;
DROP FUNCTION IF EXISTS public.generate_invite_code   CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user        CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at         CASCADE;

DROP TYPE IF EXISTS discount_type         CASCADE;
DROP TYPE IF EXISTS report_status         CASCADE;
DROP TYPE IF EXISTS settlement_status     CASCADE;
DROP TYPE IF EXISTS push_platform         CASCADE;
DROP TYPE IF EXISTS subscription_platform CASCADE;
DROP TYPE IF EXISTS subscription_status   CASCADE;
DROP TYPE IF EXISTS expense_category      CASCADE;
DROP TYPE IF EXISTS event_type            CASCADE;
DROP TYPE IF EXISTS poi_source            CASCADE;
DROP TYPE IF EXISTS poi_category          CASCADE;
DROP TYPE IF EXISTS media_type            CASCADE;
DROP TYPE IF EXISTS message_type          CASCADE;
DROP TYPE IF EXISTS member_status         CASCADE;
DROP TYPE IF EXISTS member_role           CASCADE;
DROP TYPE IF EXISTS trip_phase            CASCADE;
*/

-- ============================================================
-- END OF SCRIPT
-- ============================================================
