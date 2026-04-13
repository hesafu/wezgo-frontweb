'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'

export default function Registro() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  async function handleRegistro() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('Error al registrarse: ' + error.message)
    } else {
      setMensaje('Registro correcto, ya puedes iniciar sesión')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 z-10">

      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="glass rounded-3xl p-10 w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🚀</span>
          <h1 className="text-3xl font-bold gradient-text mt-2">Crear cuenta</h1>
          <p className="text-white/50 text-sm mt-2">Únete a Triplo gratis</p>
        </div>

        {error && (
          <div className="glass border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {mensaje && (
          <div className="glass border border-emerald-500/30 rounded-xl px-4 py-3 mb-5 text-emerald-400 text-sm text-center">
            {mensaje}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          onClick={handleRegistro}
          className="btn-cta w-full py-3 rounded-xl text-sm mb-5"
        >
          Registrarse →
        </button>

        <p className="text-center text-white/40 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}