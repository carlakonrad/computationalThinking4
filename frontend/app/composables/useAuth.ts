export interface User {
  id: string
  name: string
  avatarUrl: string | null
}

// Who is logged in. The backend handles the whole login and keeps the tokens in its own cookies,
// so the frontend only asks it who the user is.
export function useAuth() {
  const apiBase = useRuntimeConfig().public.apiBase
  const api = $fetch.create({ baseURL: apiBase, credentials: 'include' })
  const user = useState<User | null>('user', () => null)

  // Logging in leaves the app: the browser goes to the backend, then to Google and back.
  const loginUrl = `${apiBase}/auth/login`

  async function load() {
    try {
      user.value = await api<User>('/auth/me')
    }
    catch (error) {
      if ((error as { statusCode?: number }).statusCode !== 401) throw error
      user.value = null
    }
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user: readonly(user), loginUrl, load, logout }
}
