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
 * Onboarding Page — wezgo
 * Manual §2: type-h1/h2/body-m for headings and text.
 * Manual §3: buttons 8px (rounded-lg), cards 12px (rounded-xl).
 * Manual §4: "wezgo" always lowercase.
 * Manual §5: vosotros in all copy, toasts ≤40 chars.
 */
export default function Onboarding() {
  const [step, setStep]         = useState(0)
  const [name, setName]         = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router   = useRouter()
  const supabase = createClient()
  const { user, setUser } = useAppStore()

  useEffect(() => {
    if (user?.display_name && !name) setName(user.display_name)
  }, [user, name])

  const handleFinish = async () => {
    if (!name.trim()) {
      /* Manual §5: error ≤40 chars */
      toast.error("Introducid vuestro nombre primero.")
      return
    }
    setIsLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error("Authenticated user not found")

      const { error } = await supabase
        .from("profiles")
        .update({ display_name: name.trim(), updated_at: new Date().toISOString() })
        .eq("id", authUser.id)

      if (error) throw error

      setUser({ ...user, display_name: name.trim() })
      /* Manual §5: toast vosotros, ≤40 chars */
      toast.success("Perfil guardado. Bienvenidos a wezgo.")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Error al guardar el perfil. Intentadlo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-6 overflow-hidden">
      {/* Manual §3: card 12px radius (rounded-xl) */}
      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border-white/8 shadow-2xl p-8 md:p-12 relative overflow-hidden rounded-xl">
        {/* Step progress bar */}
        <div className="flex gap-2 mb-12">
          <div className={`h-1 flex-grow rounded-full transition-colors duration-500 ${step >= 0 ? "bg-brand-coral" : "bg-white/10"}`} />
          <div className={`h-1 flex-grow rounded-full transition-colors duration-500 ${step >= 1 ? "bg-brand-coral" : "bg-white/10"}`} />
        </div>

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <div className="space-y-10 text-center">
            <div className="flex justify-center">
              {/* Icon container — Manual §3: 12px radius for panels */}
              <div className="w-20 h-20 bg-gradient-to-tr from-brand-coral to-brand-sun rounded-xl flex items-center justify-center">
                <Plane className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Manual §2: type-h1 for step title */}
              <h1 className="type-h1 text-white">
                Empezad vuestra aventura con <span className="text-brand-coral">wezgo</span>
              </h1>
              {/* Manual §2: type-body-l for subtitle */}
              <p className="type-body-l text-brand-mgray max-w-md mx-auto leading-relaxed">
                La forma definitiva de organizar viajes colectivos con una experiencia premium.
              </p>
            </div>

            {/* Feature highlights — Manual §3: card 12px */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
              <div className="p-5 rounded-xl bg-white/5 border border-white/8 flex gap-4 items-start hover:bg-white/8 transition-colors">
                <div className="p-2 rounded-lg bg-brand-coral-10">
                  <Sparkles className="w-5 h-5 text-brand-coral" />
                </div>
                <div>
                  {/* Manual §2: type-h3 for feature title */}
                  <h4 className="type-h3 text-white">Organización con IA</h4>
                  <p className="type-body-m text-brand-mgray mt-1">Planificad rutas inteligentes en segundos.</p>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/8 flex gap-4 items-start hover:bg-white/8 transition-colors">
                <div className="p-2 rounded-lg bg-brand-teal-10">
                  <Map className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <h4 className="type-h3 text-white">Mapas Compartidos</h4>
                  <p className="type-body-m text-brand-mgray mt-1">Ubicacion en tiempo real y puntos de interes.</p>
                </div>
              </div>
            </div>

            {/* CTA — Manual §3: 8px radius, Manual §5: ≤3 words */}
            <Button
              size="lg"
              onClick={() => setStep(1)}
              className="w-full h-12 rounded-lg bg-white text-brand-night hover:bg-brand-mist border-0 type-label uppercase shadow-none"
            >
              Comenzar configuracion
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 1: Profile Setup ── */}
        {step === 1 && (
          <div className="space-y-10">
            <div className="space-y-3 text-center md:text-left">
              {/* Manual §2: type-h2 for step heading */}
              <h2 className="type-h2 text-white flex items-center justify-center md:justify-start gap-3">
                <User className="text-brand-coral w-6 h-6" /> Configurad vuestro perfil
              </h2>
              <p className="type-body-m text-brand-mgray">
                Decidnos como quereis que os llamen vuestros amigos en wezgo.
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                {/* Manual §2: type-label for form label, Manual §5: vosotros */}
                <label className="type-label text-brand-mgray ml-1 uppercase">Vuestro nombre público</label>
                <div className="relative">
                  <Input
                    placeholder="Ej. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    /* Manual §3: 8px radius */
                    className="bg-white/5 border-white/10 h-12 text-white rounded-lg focus:ring-brand-coral/40 type-body-m"
                    disabled={isLoading}
                  />
                  {name.length > 2 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-teal-10 rounded-full flex items-center justify-center border border-brand-teal/30">
                      <Check className="w-3.5 h-3.5 text-brand-teal" />
                    </div>
                  )}
                </div>
              </div>

              {/* Tip box — Manual §1: Sun-10 for warning/pending */}
              <div className="bg-brand-sun-10 border border-brand-sun/20 rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-sun/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-brand-sun" />
                </div>
                <div>
                  <p className="type-label text-brand-sun uppercase mb-1">Consejo wezgo</p>
                  {/* Manual §5: vosotros */}
                  <p className="type-body-m text-brand-dgray leading-relaxed">
                    Usad un nombre por el que vuestros amigos os reconozcan en el chat y el mapa del viaje.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(0)}
                  disabled={isLoading}
                  /* Manual §3: 8px radius */
                  className="text-brand-mgray hover:text-white hover:bg-white/5 h-12 px-6 rounded-lg type-label uppercase"
                >
                  Volver
                </Button>
                <Button
                  size="lg"
                  onClick={handleFinish}
                  disabled={isLoading || name.length < 2}
                  className="flex-grow h-12 rounded-lg bg-brand-coral hover:bg-brand-coral/90 text-white border-0 type-label uppercase shadow-none"
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
