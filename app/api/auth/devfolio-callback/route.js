import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const ticket = searchParams.get('ticket');
  const state = searchParams.get('state') ?? '/';
  const redirectPath = state.startsWith('/') ? state : `/${state}`;

  if (!ticket) {
    return NextResponse.redirect(`${origin}/?error=missing_ticket`);
  }

  const devfolioUrl = process.env.NEXT_PUBLIC_DEVFOLIO_URL || 'https://dev-folio-two-rho.vercel.app';

  let tokens = null;
  try {
    const res = await fetch(`${devfolioUrl}/api/cross-app/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ ticket }),
    });

    if (res.ok) {
      tokens = await res.json();
    }
  } catch {
    // DevFolio unreachable
  }

  if (!tokens?.access_token || !tokens?.refresh_token) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  const cookieStore = await cookies();
  const pending = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { pending.push(...cookiesToSet); },
      },
    },
  );

  const { error } = await supabase.auth.setSession({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  if (error) {
    return NextResponse.redirect(`${origin}/?error=session_failed`);
  }

  const response = NextResponse.redirect(`${origin}${redirectPath}`);
  pending.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}
