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
    <main className="relative min-h-screen flex items-center justify-center px-4 z-10">

      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="glass rounded-3xl p-10 w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">✈️</span>
          <h1 className="text-3xl font-bold gradient-text mt-2">Bienvenido a Triplo</h1>
          <p className="text-white/50 text-sm mt-2">Inicia sesión para ver tus viajes</p>
        </div>

        {error && (
          <div className="glass border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm text-center">
            {error}
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
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          onClick={handleLogin}
          className="btn-cta w-full py-3 rounded-xl text-sm mb-5"
        >
          Entrar →
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