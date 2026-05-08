import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'
import toast from 'react-hot-toast'
import { RealtimeChannel } from '@supabase/supabase-js'
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
// --- 1. REALTIME LISTENER (For Tab B) ---
useEffect(() => {
  let channel: RealtimeChannel;

  const setupRealtime = async () => {
    // 1. Force the Supabase client to load the auth token first!
    await supabase.auth.getSession();
    
    console.log("📡 Session loaded. Subscribing to Realtime for user:", userId)

    // 2. Now open the websocket securely
    channel = supabase
      .channel(`realtime-bookmarks-${userId}`) // Give it a unique name
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          console.log("🚀 REALTIME EVENT RECEIVED:", payload)
          
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => {
              if (prev.some((b) => b.id === newBookmark.id)) return prev
              return [newBookmark, ...prev]
            })
          }
          
          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()
  }

  setupRealtime();

  return () => {
    if (channel) supabase.removeChannel(channel)
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