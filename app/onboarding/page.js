"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Plane, User, Check, ArrowRight, Sparkles, Map } from "lucide-react"

/**
 * Onboarding Page - Part of Task TK-009
 * * Features: Welcome Screen + Initial Profile Setup
 * * Design: Premium Glassmorphism
 * * Language: UI in Spanish, Code in English
 */
export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { user, setUser } = useAppStore()

  // Initialize name from store if available
  useEffect(() => {
    if (user?.display_name && !name) {
      setName(user.display_name)
    }
  }, [user, name])

  /**
   * Finalize the onboarding process and update profile.
   */
  const handleFinish = async () => {
    if (!name.trim()) {
      toast.error("Por favor, introduce tu nombre.")
      return
    }

    setIsLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error("Authenticated user not found")

      // Update public.profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: name.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id)

      if (error) throw error

      // Update local store state
      setUser({
        ...user,
        display_name: name.trim()
      })

      toast.success("¡Bienvenido a bordo, " + name.trim() + "!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding setup error:", error)
      toast.error("Hubo un error al guardar tu perfil. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[#020617]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* Step Indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-grow rounded-full transition-colors duration-500 ${step >= 0 ? "bg-cyan-500" : "bg-white/10"}`} />
          <div className={`h-1.5 flex-grow rounded-full transition-colors duration-500 ${step >= 1 ? "bg-cyan-500" : "bg-white/10"}`} />
        </div>

        {step === 0 && (
          <div className="space-y-8 text-center animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-500/20 rotate-3 transform hover:rotate-0 transition-transform">
                <Plane className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Empieza tu aventura con <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Wezgo</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-md mx-auto">
                La forma definitiva de organizar viajes colectivos con una experiencia premium y veloz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-cyan-500/10"><Sparkles className="w-5 h-5 text-cyan-400" /></div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Organización con IA</h4>
                        <p className="text-xs text-slate-500">Planifica rutas inteligentes en segundos.</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-blue-500/10"><Map className="w-5 h-5 text-blue-400" /></div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Mapas Compartidos</h4>
                        <p className="text-xs text-slate-500">Ubicación en tiempo real y puntos de interés.</p>
                    </div>
                </div>
            </div>

            <Button 
                size="lg" 
                onClick={() => setStep(1)}
                className="w-full py-8 text-xl font-bold bg-white text-black hover:bg-slate-200 transition-all rounded-2xl group"
            >
              Comenzar Configuración
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-4">
                <User className="text-cyan-400 w-8 h-8" /> Configura tu perfil
              </h2>
              <p className="text-slate-400">Dinos cómo quieres que te llamen tus amigos en Wezgo.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300 ml-1">Tu Nombre Público</label>
                <div className="relative">
                    <Input 
                        placeholder="Ej. OMAR"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border-white/10 h-16 text-xl text-white rounded-2xl focus:ring-cyan-500/50 pl-6"
                        disabled={isLoading}
                    />
                    {name.length > 2 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500/10 p-1.5 rounded-full">
                            <Check className="w-5 h-5 text-green-500" />
                        </div>
                    )}
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-sm text-blue-200 leading-relaxed">
                    <strong>Consejo Wezgo:</strong> Usa un nombre por el que tus amigos te reconozcan fácilmente en el chat y el mapa del viaje.
                  </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                    variant="ghost" 
                    onClick={() => setStep(0)}
                    disabled={isLoading}
                    className="text-slate-500 hover:text-white hover:bg-white/5 py-8 px-8 rounded-2xl"
                >
                  Atrás
                </Button>
                <Button 
                    size="lg" 
                    onClick={handleFinish}
                    disabled={isLoading || name.length < 2}
                    className="flex-grow py-8 text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 border-0 hover:shadow-lg hover:shadow-cyan-500/25 rounded-2xl transition-all"
                >
                  {isLoading ? "Guardando..." : "Finalizar y Entrar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Decorative Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] noise-overlay" />
    </div>
  )
}
