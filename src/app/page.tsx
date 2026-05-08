import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from '../components/Dashboard'

export default async function Home() {
  const supabase = await createClient()

  // Get the user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch initial bookmarks securely on the server
  const { data: initialBookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <Dashboard initialBookmarks={initialBookmarks || []} userId={user.id} />
  )
}