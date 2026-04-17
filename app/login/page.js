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
 * Login Page - wezgo Brand Update
 */
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Password-based authentication
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      })
      
      if (error) throw error
      
      toast.success("¡Bienvenido de nuevo a wezgo!")
      router.push("/dashboard")
    } catch (error) {
      toast.error(error.message || "Credenciales incorrectas")
    } finally {
      setIsLoading(false)
    }
  }

  // Google OAuth authentication
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      toast.error(error.message || "Error al conectar con Google")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6 animate-fade-in font-body">
      <Card className="relative overflow-hidden border-white/5">
        {/* Decorative branding glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-coral to-brand-sun" />
        
        <CardHeader 
          title="Hola de nuevo" 
          subtitle="Acceded a vuestras aventuras con wezgo" 
          gradientTitle 
        />
        
        <div className="space-y-4 mb-8">
          <Button 
            variant="outline" 
            className="w-full gap-3 justify-center py-7 text-sm font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 bg-transparent text-white rounded-2xl transition-all" 
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            Continuar con Google
          </Button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#14162e] px-4 text-slate-500 font-bold tracking-[0.2em]">O acceded con vuestro correo</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:ring-brand-coral/50"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Contraseña</label>
              <Link href="/forgot-password" size="sm" className="text-xs text-brand-coral hover:underline transition-all font-bold">¿Olvidasteis vuestra contraseña?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:ring-brand-coral/50"
            />
          </div>

          <Button type="submit" className="w-full h-14 mt-4 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-xl shadow-lg shadow-brand-coral/20 border-0 font-bold text-base" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-slate-400">
            ¿No tenéis una cuenta aún?{" "}
            <Link href="/registro" className="text-brand-sun font-bold hover:text-brand-coral transition-colors flex items-center justify-center gap-1 mt-2">
              Empezad ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}