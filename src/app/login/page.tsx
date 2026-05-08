'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { Bookmark, Zap, Globe, Lock, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// 1. Create our array of reviews (outside the component so it doesn't recreate on render)
const TESTIMONIALS = [
  {
    quote: "I used to have 100 tabs open at all times. Now I just use Marked. It has completely changed how I organize my research.",
    name: "Sarah Jenkins",
    role: "Senior Product Manager",
    initials: "SJ",
    color: "bg-indigo-600"
  },
  {
    quote: "The real-time sync is pure magic. I save an article on my phone during my commute, and it's waiting on my desktop when I arrive.",
    name: "David Chen",
    role: "Software Engineer",
    initials: "DC",
    color: "bg-emerald-600"
  },
  {
    quote: "Finally, a bookmarking tool that doesn't feel like it was built in 2005. The auto-fetching feature alone saves me so much time.",
    name: "Elena Rodriguez",
    role: "UX Designer",
    initials: "ER",
    color: "bg-rose-600"
  }
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  // 2. Add state for our slider
  const [currentIndex, setCurrentIndex] = useState(0)
  const supabase = createClient()

  // 3. Auto-play the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const loginWithGoogle = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* LEFT COLUMN: Branding & Features (Stays exactly the same) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Clean organized workspace"
        />
        <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply" />
        
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white xl:p-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-md">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Marked.</span>
          </div>

          <div className="max-w-lg pb-10">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Your digital life, <br />
              <span className="text-indigo-400">beautifully organized.</span>
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Stop losing links in your browser tabs. Save, organize, and access your most important resources from anywhere.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Zap className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Real-time Sync</h3>
                  <p className="text-sm text-gray-400">Updates instantly across all your devices.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Globe className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Auto-fetching</h3>
                  <p className="text-sm text-gray-400">Paste a URL and we pull the metadata automatically.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Lock className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Secure by Design</h3>
                  <p className="text-sm text-gray-400">Enterprise-grade security powered by Supabase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-white px-4 py-8 sm:px-6 lg:flex-none lg:w-[500px] xl:w-[600px]">
        
        <div className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-50/80 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 h-[500px] w-[500px] rounded-full bg-purple-50/80 blur-3xl"></div>

        <div className="relative z-10 flex justify-end">
          <a href="#" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
            Need help?
          </a>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center lg:w-[400px]">
          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-md shadow-indigo-200">
              <Bookmark className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">Marked.</h2>
            <p className="mt-2 text-sm text-gray-600">Your digital life, organized.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl px-6 py-10 shadow-2xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 ring-1 ring-black/5">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-500">Sign in to access your dashboard</p>
            </div>

            <button
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:shadow-md hover:ring-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10">{isLoading ? 'Connecting securely...' : 'Continue with Google'}</span>
            </button>

            <p className="mt-10 text-center text-xs leading-relaxed text-gray-400">
              By clicking continue, you agree to our <br/>
              <a href="#" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a> and <a href="#" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="relative z-10 hidden pb-6 lg:block">
          <div className="rounded-2xl bg-white/60 backdrop-blur-sm p-6 border border-gray-100 shadow-sm ring-1 ring-black/5 min-h-[170px] flex flex-col justify-between">
            
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* The Framer Motion Wrapper */} 
            <div className="relative overflow-hidden h-[80px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <p className="text-sm italic leading-relaxed text-gray-700">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-[10px] shadow-sm ${TESTIMONIALS[currentIndex].color}`}>
                      {TESTIMONIALS[currentIndex].initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{TESTIMONIALS[currentIndex].name}</p>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{TESTIMONIALS[currentIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between px-2 text-xs font-medium text-gray-400">
            <span>© {new Date().getFullYear()} Marked Inc.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}