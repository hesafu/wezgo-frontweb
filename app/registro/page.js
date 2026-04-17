"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { User, Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * Registro Page — wezgo
 * Manual §3: buttons 8px radius (rounded-lg).
 * Manual §4: "wezgo" always lowercase.
 * Manual §5: vosotros form, toasts ≤40 chars, CTAs ≤3 words.
 */
export default function Registro() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password.trim(),
        options: {
          data: {
            full_name: formData.name.trim(),
            display_name: formData.name.trim(),
          },
        },
      })
      if (error) throw error
      /* Manual §5: toast ≤40 chars */
      toast.success("Cuenta creada. Verificad vuestro correo.")
      router.push("/onboarding")
    } catch (error) {
      toast.error("Error al crear la cuenta. Intentadlo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (error) {
      toast.error("Error al conectar con Google.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <Card className="relative overflow-hidden border-white/8">
        {/* Coral accent stripe */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-coral to-brand-sun" />

        <CardHeader
          title="Uníos a wezgo"
          subtitle="Empezad a planificar vuestros viajes colectivos hoy"
          gradientTitle
        />

        {/* Google OAuth */}
        <div className="space-y-4 mb-8">
          <Button
            variant="outline"
            /* Manual §3: 8px radius */
            className="w-full gap-3 justify-center h-12 type-label uppercase border-white/10 hover:bg-white/5 bg-transparent text-white rounded-lg transition-all"
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            Registrarse con Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              {/* Manual §5: vosotros */}
              <span className="bg-brand-night px-4 type-label text-brand-mgray">O rellenad vuestros datos</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="type-label text-brand-mgray px-1 uppercase">Vuestro nombre</label>
            <div className="relative">
              <Input
                placeholder="Ej. Alex Garcia"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
                /* Manual §3: 8px radius */
                className="h-12 pl-10 bg-white/5 border-white/10 rounded-lg text-white type-body-m"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mgray" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="type-label text-brand-mgray px-1 uppercase">Vuestro correo</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="hola@wezgo.app"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-12 pl-10 bg-white/5 border-white/10 rounded-lg text-white type-body-m"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mgray" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="type-label text-brand-mgray px-1 uppercase flex items-center gap-2">
              <Lock className="w-3 h-3" /> Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 h-12 rounded-lg text-white type-body-m"
            />
          </div>

          {/* CTA — Manual §3: 8px radius, coral/white. Manual §5: ≤3 words */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-lg border-0 type-label uppercase shadow-none"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          {/* Manual §5: vosotros */}
          <p className="type-body-m text-brand-mgray">
            ¿Ya tenéis una cuenta?{" "}
          </p>
          <Link href="/login" className="inline-flex items-center gap-1 mt-2 text-brand-sun font-semibold hover:text-brand-coral transition-colors type-body-m">
            Iniciar sesión <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  )
}