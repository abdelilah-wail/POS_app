import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

// Hardcoded credentials — change anytime
const CREDENTIALS = {
  username: 'Omar',
  password: 'omar123321',
}

const SESSION_KEY = 'luxury-pos:session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
    const clearSession = () => setSession(null)  // 👈 add this line

  const login = useCallback(({ username, password, remember }) => {
    const ok =
      username?.trim() === CREDENTIALS.username &&
      password === CREDENTIALS.password

    if (!ok) {
      return { ok: false, error: 'Invalid username or password' }
    }

    const newSession = {
      username: CREDENTIALS.username,
      name: 'Omar',
      email: 'omar@elwael.com',
      avatar: 'O',
      remember: !!remember,
      loggedAt: new Date().toISOString(),
    }

    if (remember) {
      // Persist in localStorage (already handled by useLocalStorage)
      setSession(newSession)
    } else {
      // Persist only for this tab/session
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
      } catch {}
      setSession(newSession)
    }

    return { ok: true }
  }, [setSession])

  const logout = useCallback(() => {
    try { sessionStorage.removeItem(SESSION_KEY) } catch {}
    clearSession()
  }, [clearSession])

  const value = useMemo(() => ({
    user: session,
    isAuthenticated: !!session,
    login,
    logout,
  }), [session, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
