'use client'

import { useAuth } from '../hooks/useAuth'
import { LogOut, Loader2 } from 'lucide-react'

export default function LogoutButton() {
  const { logout, isLoading } = useAuth()

  return (
    <button
      onClick={logout}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-red-600 hover:border-red-100 disabled:opacity-50 shadow-sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>Logout</span>
    </button>
  )
}