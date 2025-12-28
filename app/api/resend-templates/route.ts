import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// GET - List all templates from Resend
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const apiKey = searchParams.get('apiKey')

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    const resend = new Resend(apiKey)
    const { data, error } = await resend.get<{ data: unknown[] }>('/templates')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, templates: data?.data || [] })
  } catch (error) {
    console.error('List templates error:', error)
    return NextResponse.json(
      { error: 'Failed to list templates' },
      { status: 500 }
    )
  }
}

// POST - Create a new template on Resend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, name, html, variables, publish } = body

    if (!apiKey || !name || !html) {
      return NextResponse.json(
        { error: 'API key, name, and html are required' },
        { status: 400 }
      )
    }

    const resend = new Resend(apiKey)

    // Create the template
    const { data: createData, error: createError } = await resend.post<{ id: string }>('/templates', {
      name,
      html,
      variables: variables || [],
    })

    if (createError) {
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      )
    }

    // Optionally publish the template
    if (publish && createData?.id) {
      const { error: publishError } = await resend.post(`/templates/${createData.id}/publish`, {})
      if (publishError) {
        return NextResponse.json(
          { error: publishError.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      template: createData,
      published: publish || false,
    })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
