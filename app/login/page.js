"use client"

import { useState } from "react"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Welcome back!")
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <Card className="animate-fade-in">
        <CardHeader 
          title="Sign In" 
          subtitle="Enter your credentials to access your trips" 
          gradientTitle 
        />
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1">Email Address</label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-text-muted">Password</label>
              <Link href="#" className="text-xs text-brand-cyan hover:underline">Forgot password?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6">
            Continue with Email
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-text-muted">
            New to Triplo?{" "}
            <Link href="/registro" className="text-brand-cyan font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}