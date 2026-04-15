"use client"

import { useState } from "react"
import { supabase } from "@/utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

/**
 * Forgot Password Page - Part of Task TK-007
 * 
 * Integration: Supabase Password Reset Request
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResetRequest = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/reset-password`,
      })

      if (error) throw error
      
      toast.success("¡Correo de recuperación enviado!")
    } catch (error) {
      toast.error(error.message || "No se pudo enviar el enlace")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <Card className="animate-fade-in relative overflow-hidden">
        <div className="mb-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-cyan transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
        </div>

        <CardHeader 
          title="Recuperar acceso" 
          subtitle="Te enviaremos un enlace seguro a tu correo" 
          gradientTitle 
        />
        
        <form onSubmit={handleResetRequest} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-text-muted">
            ¿Necesitas ayuda?{" "}
            <Link href="#" className="text-brand-cyan hover:underline transition-all font-medium">
              Contactar soporte
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
