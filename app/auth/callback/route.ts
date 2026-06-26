import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const cbfor = searchParams.get('cbfor')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      const userEmail = data.session.user.email

      if (cbfor === 'admin') {
        const adminEmail = process.env.ADMIN_EMAIL
        if (userEmail !== adminEmail) {
          return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`)
        }
        return NextResponse.redirect(`${origin}/admin`)
      }

      if (cbfor === 'recovery' && userEmail) {
        const service = await createServiceClient()
        const { data: dbUser } = await service
          .from('users')
          .select('browser_token')
          .eq('email', userEmail)
          .single()

        if (dbUser?.browser_token) {
          const redirectUrl = new URL(`${origin}/auth/restore`)
          redirectUrl.searchParams.set('token', dbUser.browser_token)
          return NextResponse.redirect(redirectUrl.toString())
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
