"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { User, Mail, Lock, Compass } from "lucide-react"

/**
 * Sign Up Page - Part of Task TK-006
 * UI: Spanish | Code & Comments: English
 * Premium Glassmorphism styling with Tailwind CSS v4
 */
export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = (e) => {
    e.preventDefault()
    // Integration logic will follow in Task TK-007
    setIsLoading(true)
    setTimeout(() => {
      toast.success("¡Cuenta creada!")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <Card className="animate-fade-in relative overflow-hidden">
        {/* Animated brand colored top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-violet to-brand-cyan" />
        
        <CardHeader 
          title="Empezar viaje" 
          subtitle="Crea tu cuenta en Triplo hoy mismo" 
          gradientTitle 
        />

        <div className="space-y-4 mb-8">
          <Button variant="outline" className="w-full gap-3 justify-center py-6 text-base" disabled={isLoading}>
            <Compass className="w-5 h-5 text-brand-pink" />
            Continuar con Google
          </Button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-background px-2 text-text-muted">O regístrate con tu correo</span></div>
          </div>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1 flex items-center gap-2">
              <User className="w-4 h-4" /> Nombre completo
            </label>
            <Input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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
            <label className="text-sm font-medium text-text-muted px-1 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Contraseña
            </label>
            <Input
              type="password"
              placeholder="Crea una clave segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <p className="text-[11px] text-text-muted/60 px-1 leading-normal italic">
            Al registrarte, aceptas nuestras Condiciones de Uso y Política de Privacidad. Recibirás un correo de confirmación.
          </p>

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Creando..." : "Registrarme"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-text-muted">
            ¿Ya eres usuario?{" "}
            <Link href="/login" className="text-brand-cyan font-bold hover:underline transition-all">
              Entrar
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}