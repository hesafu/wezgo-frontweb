"use client"

import React, { useState } from 'react'
import { X, Calendar, MapPin, Image as ImageIcon, Sparkles, Plane } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { tripService } from '@/services/tripService'
import { toast } from 'react-hot-toast'

/**
 * CreateTripModal - wezgo Brand Sync
 * Task FRT-TK-014: Form and Supabase insertion
 */
export const CreateTripModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: '',
    image_url: ''
  })

  if (!isOpen) return null

  // Generate a unique 6-character invite code
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const inviteCode = generateInviteCode()
      const newTrip = await tripService.createTrip({
        ...formData,
        invite_code: inviteCode,
        status: 'Upcoming'
      })

      toast.success("¡Viaje creado con éxito! Invitad a vuestra gente.")
      if (onSuccess) onSuccess(newTrip)
      onClose()
    } catch (error) {
      toast.error("Error al crear el viaje. Intentadlo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-night/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-lg relative overflow-hidden border-white/10 shadow-2xl p-0" hover={false}>
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-coral via-brand-sun to-brand-coral" />
        
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-black text-white tracking-tight flex items-center gap-3">
              <Plane className="text-brand-coral w-8 h-8" /> Cread vuestro <span className="text-brand-coral">viaje</span>
            </h2>
            <p className="text-slate-400 text-sm font-body">Organizad vuestra próxima aventura grupal en segundos.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 font-body">
          <div className="space-y-4">
            {/* Trip Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre del viaje</label>
              <Input 
                required
                placeholder="Ej. Summer in Lisbon"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="h-14 text-base"
              />
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Destino</label>
              <div className="relative">
                <Input 
                  required
                  placeholder="¿A dónde vais?"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="h-14 pl-12"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-teal" />
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Fecha Inicio</label>
                <div className="relative">
                  <Input 
                    required
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="h-14 pl-12 text-sm"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-sun" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Fecha Fin</label>
                <div className="relative">
                  <Input 
                    required
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="h-14 pl-12 text-sm"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-sun" />
                </div>
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Imagen de portada (opcional)</label>
              <div className="relative">
                <Input 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="h-14 pl-12 text-sm"
                />
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 rounded-lg bg-brand-coral hover:bg-brand-coral/90 text-white border-0 type-label uppercase"
            >
              {loading ? "Creando..." : "Crear viaje"}
            </Button>
            <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
              Al crear el viaje se generará un código único para vuestra gente.
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}
