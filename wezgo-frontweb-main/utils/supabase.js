import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Configuration
 * Uses environment variables with placeholders to prevent build-time crashes
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)