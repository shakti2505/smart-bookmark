import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'
import toast from 'react-hot-toast'

export type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export function useBookmarks(initialBookmarks: Bookmark[], userId: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  
  const supabase = createClient()

  // --- 1. REALTIME LISTENER (For Tab B) ---
  useEffect(() => {
    console.log("📡 Subscribing to Realtime for user:", userId)

    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("🚀 REALTIME EVENT RECEIVED IN THIS TAB:", payload)
          
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => {
              // Duplicate check: If Tab A already added this locally, ignore it.
              // If this is Tab B, it won't exist yet, so add it!
              if (prev.some((b) => b.id === newBookmark.id)) {
                console.log("Duplicate prevented.")
                return prev
              }
              return [newBookmark, ...prev]
            })
          }
          
          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  // --- 2. ADD LOGIC (Instant for Tab A) ---
  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl || !newTitle) return

    let formattedUrl = newUrl.trim()
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl
    }

    setIsAdding(true)
    
    // .select().single() returns the new row immediately from the database
    const { data, error } = await supabase.from('bookmarks').insert({
      url: formattedUrl,
      title: newTitle.trim(),
      user_id: userId,
    }).select().single()

    if (error) {
      toast.error('Failed to add bookmark')
      console.error(error)
    } else {
      toast.success('Bookmark added!')
      setNewUrl('')
      setNewTitle('')
      
      // INSTANT UPDATE: Add to Tab A immediately
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === data.id)) return prev
        return [data, ...prev]
      })
    }
    setIsAdding(false)
  }

  // --- 3. DELETE LOGIC (Instant for Tab A) ---
  const deleteBookmark = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return

    // INSTANT UPDATE: Remove from Tab A immediately
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) toast.error('Failed to delete')
    else toast.success('Deleted')
  }

  return {
    bookmarks,
    newUrl,
    setNewUrl,
    newTitle,
    setNewTitle,
    isAdding,
    addBookmark,
    deleteBookmark,
  }
}