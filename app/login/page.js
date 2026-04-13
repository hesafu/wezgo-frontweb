'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
    } else {
      toast.success('Bienvenido a Triplo! ✈️')
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Extra glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/15 to-violet-500/15 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="glass rounded-3xl p-10 w-full max-w-md animate-fade-in-up relative">
        {/* Subtle top-edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-3xl" aria-hidden="true" />

        <h2 className="text-3xl font-bold gradient-text mb-2 text-center">
          Bienvenido a Triplo ✈️
        </h2>
        <p className="text-center text-white/40 mb-8">Inicia sesión para ver tus viajes</p>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl text-sm text-center"
               style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="glass-input w-full rounded-xl px-4 py-3 mb-4 text-sm"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="glass-input w-full rounded-xl px-4 py-3 mb-6 text-sm"
        />
        <button
          onClick={handleLogin}
          className="btn-cta w-full py-3 rounded-xl text-base mb-5"
        >
          Entrar
        </button>
        <p className="text-center text-white/40 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}