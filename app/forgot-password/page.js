"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

/**
 * Forgot Password Page — wezgo
 * Manual §3: cards 12px r, buttons 8px r.
 * Manual §2: type-h2 for title, type-label for label.
 * Manual §5: vosotros form, toasts ≤40 chars.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleResetRequest = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/reset-password`,
      })

      if (error) throw error
      
      /* Manual §5: toast vosotros, concise */
      toast.success("Enlace enviado. Revisad vuestro correo.")
    } catch (error) {
      toast.error("Error al enviar el enlace. Intentadlo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      {/* Manual §3: card 12px radius */}
      <Card className="glass-card relative overflow-hidden border-white/8 rounded-xl">
        {/* Coral accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-coral to-brand-sun" />

        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center gap-2 type-caption text-brand-mgray hover:text-brand-teal transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio de sesión
          </Link>
        </div>

        <CardHeader 
          title="Recuperar acceso" 
          /* Manual §5: vosotros */
          subtitle="Os enviaremos un enlace seguro a vuestro correo" 
          gradientTitle 
        />
        
        <form onSubmit={handleResetRequest} className="space-y-6 mt-4">
          <div className="space-y-2">
            {/* Manual §2: type-label */}
            <label className="type-label text-brand-mgray px-1 flex items-center gap-2 uppercase">
              <Mail className="w-3.5 h-3.5" /> Correo electrónico
            </label>
            <Input
              type="email"
              /* Manual §5: no emoji, vosotros */
              placeholder="vuestro@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              /* Manual §3: 8px radius */
              className="bg-white/5 border-white/10 h-12 rounded-lg text-white focus:ring-brand-coral/40 type-body-m"
            />
          </div>

          {/* CTA — Manual §3: 8px, Manual §5: ≤3 words */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-lg border-0 type-label uppercase shadow-none" 
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar enlace"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          {/* Manual §5: vosotros */}
          <p className="type-body-m text-brand-mgray">
            ¿Necesitáis ayuda?{" "}
            <Link href="#" className="text-brand-teal hover:underline transition-all font-semibold italic">
              Contactad con soporte
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
