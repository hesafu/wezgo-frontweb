"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { Mail, Compass } from "lucide-react"

/**
 * Login Page - Part of Task TK-006
 * UI: Spanish | Code & Comments: English
 * Premium Glassmorphism styling with Tailwind CSS v4
 */
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    // Integration logic will follow in Task TK-007
    setIsLoading(true)
    setTimeout(() => {
      toast.success("¡Bienvenido de nuevo!")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <Card className="animate-fade-in relative overflow-hidden">
        {/* Animated brand colored top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink" />
        
        <CardHeader 
          title="Hola de nuevo" 
          subtitle="Accede a tus aventuras con Triplo" 
          gradientTitle 
        />
        
        <div className="space-y-4 mb-8">
          <Button variant="outline" className="w-full gap-3 justify-center py-6 text-base" disabled={isLoading}>
            <Compass className="w-5 h-5 text-brand-cyan" />
            Continuar con Google
          </Button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-background px-2 text-text-muted">O accede con tu correo</span></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-text-muted">Contraseña</label>
              <Link href="/forgot-password" size="sm" className="text-xs text-brand-cyan hover:underline transition-all font-medium">¿Has olvidado tu contraseña?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-text-muted">
            ¿No tienes una cuenta aún?{" "}
            <Link href="/registro" className="text-brand-pink font-bold hover:underline transition-all">
              Empieza ahora
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}