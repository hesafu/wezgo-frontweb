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
 * Onboarding Page - wezgo Brand Update
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

  const handleFinish = async () => {
    if (!name.trim()) {
      toast.error("Por favor, introduce tu nombre.")
      return
    }

    setIsLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error("Authenticated user not found")

      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: name.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id)

      if (error) throw error

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
    <div className="relative min-h-[85vh] flex items-center justify-center p-6 overflow-hidden font-body">
      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border-white/5 shadow-2xl p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in duration-500 rounded-3xl">
        {/* Step Indicator */}
        <div className="flex gap-2 mb-12">
          <div className={`h-1.5 flex-grow rounded-full transition-colors duration-500 ${step >= 0 ? "bg-brand-coral" : "bg-white/10"}`} />
          <div className={`h-1.5 flex-grow rounded-full transition-colors duration-500 ${step >= 1 ? "bg-brand-coral" : "bg-white/10"}`} />
        </div>

        {step === 0 && (
          <div className="space-y-10 text-center animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-brand-coral to-brand-sun rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-coral/20 rotate-3 transform hover:rotate-0 transition-transform duration-500">
                <Plane className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-tight">
                Empezad vuestra aventura con <span className="text-brand-coral">wezgo</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-md mx-auto leading-relaxed">
                La forma definitiva de organizar viajes colectivos con una experiencia premium y veloz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <div className="p-2.5 rounded-xl bg-brand-coral/10"><Sparkles className="w-6 h-6 text-brand-coral" /></div>
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Organización con IA</h4>
                        <p className="text-xs text-slate-500 mt-1">Planificad rutas inteligentes en segundos.</p>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <div className="p-2.5 rounded-xl bg-brand-teal/10"><Map className="w-6 h-6 text-brand-teal" /></div>
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Mapas Compartidos</h4>
                        <p className="text-xs text-slate-500 mt-1">Ubicación en tiempo real y puntos de interés.</p>
                    </div>
                </div>
            </div>

            <Button 
                size="lg" 
                onClick={() => setStep(1)}
                className="w-full py-10 text-2xl font-black bg-white text-brand-night hover:bg-brand-mist transition-all rounded-2xl group shadow-2xl shadow-white/10"
            >
              Comenzad la Configuración
              <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right-5 duration-500">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-4xl font-display font-black text-white flex items-center justify-center md:justify-start gap-4">
                <User className="text-brand-coral w-10 h-10" /> Configurad vuestro perfil
              </h2>
              <p className="text-lg text-slate-400">Decidnos cómo queréis que os llamen vuestros amigos en wezgo.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Tu Nombre Público</label>
                <div className="relative group">
                    <Input 
                        placeholder="Ej. OMAR"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border-white/10 h-18 text-2xl text-white rounded-2xl focus:ring-brand-coral/50 pl-8 transition-all"
                        disabled={isLoading}
                    />
                    {name.length > 2 && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-brand-teal/20 p-2 rounded-full border border-brand-teal/30">
                            <Check className="w-6 h-6 text-brand-teal" />
                        </div>
                    )}
                </div>
              </div>

              <div className="bg-brand-sun/5 border border-brand-sun/20 rounded-2xl p-8 flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-sun/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-7 h-7 text-brand-sun" />
                  </div>
                  <p className="text-sm text-brand-sun/80 leading-relaxed font-medium">
                    <strong className="text-brand-sun block mb-1">Consejo wezgo:</strong> 
                    Usa un nombre por el que tus amigos te reconozcan fácilmente en el chat y el mapa del viaje.
                  </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                    variant="ghost" 
                    onClick={() => setStep(0)}
                    disabled={isLoading}
                    className="text-slate-500 hover:text-white hover:bg-white/5 py-8 px-10 rounded-2xl text-lg font-bold"
                >
                  Atrás
                </Button>
                <Button 
                    size="lg" 
                    onClick={handleFinish}
                    disabled={isLoading || name.length < 2}
                    className="flex-grow py-10 text-2xl font-black bg-brand-coral hover:bg-brand-coral/90 text-white border-0 hover:shadow-2xl hover:shadow-brand-coral/30 rounded-2xl transition-all"
                >
                  {isLoading ? "Guardando..." : "Finalizar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
