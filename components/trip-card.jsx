"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'

/**
 * TripCard — wezgo
 * Manual §3: 12-16px card radius, pill badges 100px.
 * Manual §2: type-h3 for card title, type-body-m for meta, type-label for badge.
 * Manual §1: Teal=active, Sun=upcoming, Gray=past.
 * Manual §5: Vosotros. No emojis. Dates with day·month short format.
 */
export const TripCard = ({ trip }) => {
  const { name, destination, start_date, end_date, status, image_url } = trip

  /* Status badge — Manual §1 colour roles */
  const badge = (() => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'en curso':
        return { label: 'En curso',       bg: 'bg-brand-teal-10',    text: 'text-brand-teal',  border: 'border-brand-teal/30' }
      case 'past':
      case 'finalizado':
        return { label: 'Finalizado',     bg: 'bg-white/10',          text: 'text-brand-mgray', border: 'border-white/10' }
      default:
        return { label: 'Próximamente',   bg: 'bg-brand-sun-10',      text: 'text-brand-sun',   border: 'border-brand-sun/30' }
    }
  })()

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    /* Manual §3: card 12px radius */
    <Card className="glass-card group p-0 overflow-hidden flex flex-col">
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-brand-night/60">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=900&auto=format&fit=crop'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-90"
        />
        {/* Status pill — Manual §3: 100px radius */}
        <div className="absolute top-3 left-3">
          <span className={`badge-pill ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-grow">
        {/* Trip name — Manual §2: type-h3 */}
        <h3 className="type-h3 text-white group-hover:text-brand-coral transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Meta — Manual §2: type-body-m, Manual §1: Gray for secondary text */}
        <div className="flex flex-col gap-1.5">
          {destination && (
            <div className="flex items-center gap-2 type-body-m text-brand-mgray">
              <MapPin className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
              <span className="line-clamp-1">{destination}</span>
            </div>
          )}
          <div className="flex items-center gap-2 type-body-m text-brand-mgray">
            <Calendar className="w-3.5 h-3.5 text-brand-sun flex-shrink-0" />
            <span>{formatDate(start_date)} — {formatDate(end_date)}</span>
          </div>
        </div>

        {/* Footer CTA — Manual §3: 8px radius, Manual §1: Coral/White */}
        <button className="mt-auto w-full h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-brand-coral hover:border-brand-coral text-white type-label uppercase transition-all duration-200">
          Ver detalles
        </button>
      </div>
    </Card>
  )
}
