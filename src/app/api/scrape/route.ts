import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Get the URL from the query string (e.g., /api/scrape?url=https://github.com)
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    // 2. Format the URL nicely
    let fetchUrl = targetUrl.trim()
    if (!/^https?:\/\//i.test(fetchUrl)) {
      fetchUrl = 'https://' + fetchUrl
    }

    // 3. Fetch the webpage HTML 
    // ( User-Agent header to prevent blockage from website)
    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!response.ok) throw new Error('Failed to fetch webpage')

    const html = await response.text()
    
    // 4. Use a quick Regex to extract the text between <title> and </title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    
    // Sometimes websites put newlines in titles, so we replace them with spaces
    const title = titleMatch ? titleMatch[1].replace(/\n/g, ' ').trim() : ''

    return NextResponse.json({ title })
    
  } catch (error) {
    // If it fails (e.g., website blocks us), fail gracefully and return nothing
    return NextResponse.json({ title: '' }, { status: 500 })
  }
}