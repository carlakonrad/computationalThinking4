import type { Session, User } from '@supabase/supabase-js'
import type { Context } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { FRONTEND_URL } from './frontend.js'

// Login with Google through Supabase Auth. The tokens live in cookies only this backend
// can read; the frontend never sees them and never talks to Supabase itself.
export const auth = new Hono()

const ACCESS_COOKIE = 'sb-access-token'
const REFRESH_COOKIE = 'sb-refresh-token'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30
const VERIFIER_MAX_AGE = 60 * 10
// Without `secure`, because localhost runs on plain http. In production this needs `secure: true`.
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'Lax', path: '/' } as const

// A fresh client per request, using the publishable key: it acts for the user, not as admin.
// The only thing it stores is the PKCE verifier between /login and /callback, in a short-lived cookie.
function authClient(c: Context) {
  const isVerifier = (key: string) => key.endsWith('-code-verifier')
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: key => (isVerifier(key) ? getCookie(c, key) ?? null : null),
        setItem: (key, value) => {
          if (isVerifier(key)) setCookie(c, key, value, { ...COOKIE_OPTIONS, maxAge: VERIFIER_MAX_AGE })
        },
        removeItem: (key) => {
          if (isVerifier(key)) deleteCookie(c, key, COOKIE_OPTIONS)
        },
      },
    },
  })
}

function storeSession(c: Context, session: Session) {
  setCookie(c, ACCESS_COOKIE, session.access_token, { ...COOKIE_OPTIONS, maxAge: SESSION_MAX_AGE })
  setCookie(c, REFRESH_COOKIE, session.refresh_token, { ...COOKIE_OPTIONS, maxAge: SESSION_MAX_AGE })
}

function clearSession(c: Context) {
  deleteCookie(c, ACCESS_COOKIE, COOKIE_OPTIONS)
  deleteCookie(c, REFRESH_COOKIE, COOKIE_OPTIONS)
}

// Lets Supabase check the access token. An expired one is renewed with the refresh token.
async function currentUser(c: Context): Promise<User | undefined> {
  const client = authClient(c)
  const accessToken = getCookie(c, ACCESS_COOKIE)
  if (accessToken) {
    const { data } = await client.auth.getUser(accessToken)
    if (data.user) return data.user
  }
  const refreshToken = getCookie(c, REFRESH_COOKIE)
  if (!refreshToken) return undefined
  const { data } = await client.auth.refreshSession({ refresh_token: refreshToken })
  if (!data.session) {
    clearSession(c)
    return undefined
  }
  storeSession(c, data.session)
  return data.session.user
}

auth.get('/login', async (c) => {
  const { data, error } = await authClient(c).auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: new URL('/auth/callback', c.req.url).href, skipBrowserRedirect: true },
  })
  if (error) throw error
  return c.redirect(data.url)
})

// A cancelled or failed login also leads back to the overview, just without a session.
auth.get('/callback', async (c) => {
  const code = c.req.query('code')
  const flowId = c.req.query('sb_flow_id')
  if (code) {
    const { data } = await authClient(c).auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined)
    if (data.session) storeSession(c, data.session)
  }
  return c.redirect(FRONTEND_URL)
})

auth.get('/me', async (c) => {
  const user = await currentUser(c)
  if (!user) return c.json({ error: 'Not logged in' }, 401)
  const { full_name, name, avatar_url, picture } = user.user_metadata
  return c.json({ id: user.id, name: full_name ?? name ?? user.email, avatarUrl: avatar_url ?? picture ?? null })
})

// Ends only the session of this browser; other devices stay logged in.
auth.post('/logout', async (c) => {
  const accessToken = getCookie(c, ACCESS_COOKIE)
  const refreshToken = getCookie(c, REFRESH_COOKIE)
  if (accessToken && refreshToken) {
    const client = authClient(c)
    const { error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    if (!error) await client.auth.signOut({ scope: 'local' })
  }
  clearSession(c)
  return c.body(null, 204)
})
