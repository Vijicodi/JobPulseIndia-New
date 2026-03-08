import { NextResponse } from 'next/server'
import { scrapeAllPortals } from '@/lib/scraper'

export async function POST() {
  try {
    const result = await scrapeAllPortals()
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[POST /api/scrape]', error)
    return NextResponse.json(
      { error: 'Scraping failed' },
      { status: 500 },
    )
  }
}
