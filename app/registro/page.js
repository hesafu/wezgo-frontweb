"use client"

import { useState } from "react"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    // In a real app we might want to save the name in a profile table
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name
        }
      }
    })
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Account created! Welcome to Triplo.")
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <Card className="animate-fade-in">
        <CardHeader 
          title="Join Triplo" 
          subtitle="Start organizing your dream trips with friends" 
          gradientTitle 
        />
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label className="text-sm font-medium text-text-muted px-1">Create Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-[10px] text-text-muted/60 px-1 leading-normal">
            By clicking "Create Account", you agree to our Terms of Service and Privacy Policy. We'll send you a confirmation email.
          </p>

          <Button type="submit" className="w-full mt-4">
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-pink font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}