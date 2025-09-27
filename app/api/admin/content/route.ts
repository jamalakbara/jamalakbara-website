import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Allowed content types to prevent unauthorized file writing
const ALLOWED_CONTENT_TYPES = [
  'site-config',
  'hero',
  'services', 
  'projects',
  'about',
  'navigation',
  'cta'
] as const

type ContentType = typeof ALLOWED_CONTENT_TYPES[number]

// Validate content type
function isValidContentType(type: string): type is ContentType {
  return ALLOWED_CONTENT_TYPES.includes(type as ContentType)
}

// GET - Retrieve content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type || !isValidContentType(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    const filePath = path.join(CONTENT_DIR, `${type}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const content = JSON.parse(fileContent)

    return NextResponse.json({ 
      success: true, 
      data: content,
      type 
    })
  } catch (error) {
    console.error('Error reading content:', error)
    return NextResponse.json(
      { error: 'Failed to read content file' },
      { status: 500 }
    )
  }
}

// POST - Save content
export async function POST(request: NextRequest) {
  try {
    const { type, content } = await request.json()

    if (!type || !isValidContentType(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Validate JSON structure
    const jsonContent = JSON.stringify(content, null, 2)

    // Write to file
    const filePath = path.join(CONTENT_DIR, `${type}.json`)
    await fs.writeFile(filePath, jsonContent, 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: `${type} content saved successfully`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { error: 'Failed to save content file' },
      { status: 500 }
    )
  }
}

// PUT - Update specific content
export async function PUT(request: NextRequest) {
  try {
    const { type, content, merge = false } = await request.json()

    if (!type || !isValidContentType(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    const filePath = path.join(CONTENT_DIR, `${type}.json`)

    let finalContent = content

    if (merge) {
      // Read existing content and merge
      const existingContent = await fs.readFile(filePath, 'utf-8')
      const existingData = JSON.parse(existingContent)
      finalContent = { ...existingData, ...content }
    }

    const jsonContent = JSON.stringify(finalContent, null, 2)
    await fs.writeFile(filePath, jsonContent, 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: `${type} content updated successfully`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content file' },
      { status: 500 }
    )
  }
}

// DELETE - Reset content to default (optional)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type || !isValidContentType(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // You could implement default content reset here
    return NextResponse.json(
      { error: 'Content reset not implemented' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content file' },
      { status: 500 }
    )
  }
}