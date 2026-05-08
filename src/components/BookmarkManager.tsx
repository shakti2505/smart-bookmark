'use client'
import { useState } from 'react'
import { Bookmark, useBookmarks } from '../hooks/useBookmarks'
import { Trash2, ExternalLink, Plus, Loader2, Bookmark as BookmarkIcon } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

export default function BookmarkManager({ initialBookmarks, userId }:{initialBookmarks:Bookmark[], userId:string}) {
    const {
        bookmarks,
        newUrl,
        setNewUrl,
        newTitle,
        setNewTitle,
        isAdding,
        addBookmark,
        deleteBookmark
    } = useBookmarks(initialBookmarks, userId)

    // --- ADDED: Auto-Scrape Logic ---
    const [isScraping, setIsScraping] = useState(false)

    const handleUrlBlur = async () => {
        // If the URL is empty, or the user already typed their own title, do nothing!
        if (!newUrl || newTitle) return
        
        setIsScraping(true)
        try {
            const res = await fetch(`/api/scrape?url=${encodeURIComponent(newUrl)}`)
            const data = await res.json()
            
            if (data.title) {
                setNewTitle(data.title)
                // Optional: You can import toast and trigger toast.success('Title auto-filled!') here
            }
        } catch (error) {
            console.error("Failed to scrape title", error)
        } finally {
            setIsScraping(false)
        }
    }

    return (
        <div className="space-y-12">
            <Toaster position="bottom-right" />

            {/* Form Container */}
            <form
                onSubmit={addBookmark}
                className="flex flex-col gap-4 sm:flex-row sm:items-end rounded-xl bg-white p-6 shadow-sm border border-gray-200"
            >
             <div className="flex-1 space-y-1">
                    <label htmlFor="title" className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>Title</span>
                        {/* loading indicator when scraping */}
                        {isScraping && <span className="text-xs text-indigo-500 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Fetching Title for you..</span>}
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder={isScraping ? "Fetching..." : "e.g., Supabase Docs"}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        disabled={isScraping} // Prevent typing while fetch
                        required
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label htmlFor="url" className="text-sm font-medium text-gray-700">
                        URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        placeholder="https://..."
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        onBlur={handleUrlBlur} // TRIGGER FETCH WHEN USER LEAVES THIS FIELD
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAdding}
                    className="flex h-[38px] w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 text-sm font-medium text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
                >
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add
                </button>
            </form>

            {/* Empty State vs Grid */}
            {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                        <BookmarkIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-gray-900">No bookmarks yet</h3>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        You haven't saved any links. Add your first bookmark above to get started!
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {bookmarks.map((bookmark) => (
                        <a
                            key={bookmark.id}
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-300"
                        >
                            <div className="pr-10">
                                <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                                    {bookmark.title}
                                </h3>
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                    <span className="line-clamp-1">{bookmark.url}</span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    deleteBookmark(bookmark.id)
                                }}
                                className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-300  shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:bg-red-50 text-red-600 ring-red-200"
                                aria-label="Delete bookmark"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}