"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  ArrowLeft,
  Shield,
  MapPin,
  Calendar,
  Plane,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

/**
 * Profile Page – User Info Edit Zone
 * Glassmorphism design with animated sections
 */
export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  // Auth user
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)

  // Password state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("info") // "info" | "security"
  const [hasChanges, setHasChanges] = useState(false)

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      setFullName(user.user_metadata?.full_name || "")
      setEmail(user.email || "")
      setAvatarUrl(user.user_metadata?.avatar_url || "")
      setAvatarPreview(user.user_metadata?.avatar_url || "")
      setLoading(false)
    }
    loadUser()
  }, [router])

  // Track changes
  useEffect(() => {
    if (!user) return
    const original = user.user_metadata?.full_name || ""
    setHasChanges(fullName !== original || avatarFile !== null)
  }, [fullName, avatarFile, user])

  // Avatar selection
  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no debe superar 2MB")
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setHasChanges(true)
  }

  // Upload avatar to Supabase storage
  const uploadAvatar = async (file) => {
    const ext = file.name.split(".").pop()
    const fileName = `${user.id}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true })
    if (error) throw error
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)
    return publicUrl
  }

  // Save profile info
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let newAvatarUrl = avatarUrl

      if (avatarFile) {
        newAvatarUrl = await uploadAvatar(avatarFile)
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: newAvatarUrl,
        },
      })

      if (error) throw error

      setAvatarUrl(newAvatarUrl)
      setAvatarFile(null)
      setHasChanges(false)

      // Refresh user
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser()
      setUser(updatedUser)

      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      toast.error(error.message || "Error al actualizar el perfil")
    } finally {
      setSaving(false)
    }
  }

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error

      setNewPassword("")
      setConfirmPassword("")
      toast.success("Contraseña actualizada correctamente")
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña")
    } finally {
      setSavingPassword(false)
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-white/5 rounded-xl" />
          <div className="flex gap-8">
            <div className="w-32 h-32 bg-white/5 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="h-12 bg-white/5 rounded-xl" />
              <div className="h-12 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "info", label: "Información", icon: User },
    { id: "security", label: "Seguridad", icon: Shield },
  ]

  // Joined date calculation
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : "—"

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-4 mb-10 animate-fade-in">
        <Link
          href="/dashboard"
          className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Mi <span className="gradient-text">Perfil</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona tu información personal y seguridad
          </p>
        </div>
      </div>

      {/* ─── Profile Hero Card ─── */}
      <Card
        hover={false}
        className="relative overflow-hidden mb-8 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-pink" />

        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-cyan/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-violet/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 p-2">
          {/* Avatar */}
          <div className="relative group">
            <div
              onClick={handleAvatarClick}
              className="w-28 h-28 rounded-full cursor-pointer overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-brand-background transition-all group-hover:ring-brand-cyan/50 group-hover:scale-105"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-cyan/30 to-brand-violet/30 flex items-center justify-center text-3xl font-bold text-white/80">
                  {getInitials(fullName)}
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-brand-background" />
          </div>

          {/* User Info Summary */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {fullName || "Viajero anónimo"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">{email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Desde {joinedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Cuenta verificada
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-2 text-center">
            <div className="glass rounded-2xl px-5 py-3 min-w-[80px]">
              <p className="text-xl font-bold gradient-text">2</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
                Viajes
              </p>
            </div>
            <div className="glass rounded-2xl px-5 py-3 min-w-[80px]">
              <p className="text-xl font-bold gradient-text">5</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
                Países
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Tab Switcher ─── */}
      <div
        className="flex gap-2 mb-8 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${
                  isActive
                    ? "glass bg-white/10 text-white shadow-lg shadow-brand-cyan/10"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─── Tab Content ─── */}
      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        {/* === INFO TAB === */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <Card hover={false} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-cyan/50 to-transparent" />

              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-cyan" />
                Información personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Nombre completo
                  </label>
                  <Input
                    id="profile-full-name"
                    type="text"
                    placeholder="Tu nombre"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Email (read only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Correo electrónico
                  </label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-white/3 border-white/5 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-600 px-1">
                    El email no se puede cambiar desde aquí
                  </p>
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <div>
                  {hasChanges && (
                    <span className="text-xs text-amber-400/80 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Cambios sin guardar
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="gap-2 shadow-lg shadow-brand-cyan/20"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </Card>

            {/* ── Travel Preferences (decorative) ── */}
            <Card hover={false} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-violet/50 to-transparent" />

              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Plane className="w-5 h-5 text-brand-violet" />
                Preferencias de viaje
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Ciudad de origen
                  </label>
                  <Input
                    id="profile-city"
                    type="text"
                    placeholder="Ej. Madrid, España"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1 flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-slate-500" />
                    Tipo de viajero
                  </label>
                  <select
                    id="profile-traveler-type"
                    className="glass-input w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none bg-white/5 border border-white/10 text-white appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-slate-900">
                      Selecciona uno
                    </option>
                    <option value="aventurero" className="bg-slate-900">
                      🏔️ Aventurero
                    </option>
                    <option value="cultural" className="bg-slate-900">
                      🏛️ Cultural
                    </option>
                    <option value="relax" className="bg-slate-900">
                      🏖️ Relax
                    </option>
                    <option value="gastronomico" className="bg-slate-900">
                      🍽️ Gastronómico
                    </option>
                    <option value="nightlife" className="bg-slate-900">
                      🎉 Nocturno
                    </option>
                  </select>
                </div>
              </div>
            </Card>
          </form>
        )}

        {/* === SECURITY TAB === */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change password */}
            <Card hover={false} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-cyan/50 to-transparent" />

              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-cyan" />
                Cambiar contraseña
              </h3>

              <form
                onSubmit={handleChangePassword}
                className="space-y-6 max-w-md"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="profile-new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1">
                    Confirmar contraseña
                  </label>
                  <Input
                    id="profile-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400 px-1">
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            newPassword.length >= level * 3
                              ? level <= 1
                                ? "bg-red-400"
                                : level <= 2
                                  ? "bg-amber-400"
                                  : level <= 3
                                    ? "bg-emerald-400"
                                    : "bg-brand-cyan"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {newPassword.length < 6
                        ? "Demasiado corta"
                        : newPassword.length < 8
                          ? "Aceptable"
                          : newPassword.length < 12
                            ? "Buena"
                            : "Muy segura"}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={
                    savingPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                  className="gap-2 shadow-lg shadow-brand-cyan/20"
                >
                  <Shield className="w-4 h-4" />
                  {savingPassword
                    ? "Actualizando..."
                    : "Actualizar contraseña"}
                </Button>
              </form>
            </Card>

            {/* Danger zone */}
            <Card hover={false} className="relative overflow-hidden border-red-500/10">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/50 to-transparent" />

              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5" />
                Zona peligrosa
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Las acciones aquí son irreversibles. Procede con precaución.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="ghost"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    toast.success("Sesión cerrada en todos los dispositivos")
                    router.push("/login")
                  }}
                >
                  <Lock className="w-4 h-4" />
                  Cerrar todas las sesiones
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
                  onClick={() =>
                    toast.error(
                      "Contacta soporte para eliminar tu cuenta"
                    )
                  }
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar cuenta
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
