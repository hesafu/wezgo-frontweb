"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"

/**
 * Login Page — wezgo
 * Manual §3: buttons 8px radius (rounded-lg).
 * Manual §4: "wezgo" always lowercase.
 * Manual §5: vosotros form, toasts ≤40 chars.
 */
export default function Login() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })
      if (error) throw error
      /* Manual §5: toast ≤40 chars, vosotros */
      toast.success("Bienvenidos de nuevo a wezgo.")
      router.push("/dashboard")
    } catch (error) {
      /* Manual §5: error message concise */
      toast.error("Credenciales incorrectas. Intentadlo de nuevo.")
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
          title="Hola de nuevo"
          subtitle="Acceded a vuestras aventuras con wezgo"
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
            Continuar con Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              {/* Manual §2: type-label */}
              <span className="bg-brand-night px-4 type-label text-brand-mgray">O acceded con vuestro correo</span>
            </div>
          </div>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            {/* Manual §2: type-label for form labels */}
            <label className="type-label text-brand-mgray ml-1 flex items-center gap-2 uppercase">
              <Mail className="w-3 h-3" /> Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="nombre@wezgo.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              /* Manual §3: inputs rounded-lg (8px) */
              className="bg-white/5 border-white/10 h-12 rounded-lg text-white focus:ring-brand-coral/40 type-body-m"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="type-label text-brand-mgray uppercase">Contraseña</label>
              <Link href="/forgot-password" className="type-caption text-brand-coral hover:underline">
                ¿Olvidasteis vuestra contraseña?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 h-12 rounded-lg text-white focus:ring-brand-coral/40 type-body-m"
            />
          </div>

          {/* CTA — Manual §3: 8px radius, coral/white. Manual §5: ≤3 words */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-lg border-0 type-label uppercase shadow-none"
          >
            {isLoading ? "Entrando..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          {/* Manual §5: vosotros */}
          <p className="type-body-m text-brand-mgray">
            ¿No tenéis una cuenta aún?{" "}
          </p>
          <Link href="/registro" className="inline-flex items-center gap-1 mt-2 text-brand-sun font-semibold hover:text-brand-coral transition-colors type-body-m">
            Empezad ahora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  )
}