'use client'

import { Bookmark as BookmarkIcon, LogOut } from 'lucide-react'
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'
import BookmarkManager from './BookmarkManager'
import { Bookmark } from '../hooks/useBookmarks'

export default function Dashboard({ initialBookmarks, userId }:{initialBookmarks:Bookmark[], userId:string}) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sleek Navigation Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <BookmarkIcon className="h-6 w-6 fill-current" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Marked.</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Your Bookmarks</h2>
          <p className="mt-2 text-gray-500">Save and organize your favorite links in real-time.</p>
        </div>

        {/* Bookmark Manager handles the form, list, and empty state */}
        <BookmarkManager initialBookmarks={initialBookmarks} userId={userId} />
      </main>
    </div>
  )
}