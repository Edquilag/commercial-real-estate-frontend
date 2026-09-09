import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCurrentUser } from '../api/client'
import { ApiError, backendOrigin, isDemo, request } from '../api/http'
import { demoUser } from '../data/mock'
import type { User } from '../domain/types'
import { readStorage, writeStorage } from '../lib/format'

interface MarketplaceState {
  user: User | null
  authLoading: boolean
  authError: string
  savedIds: number[]
  toggleSaved: (id: number) => void
  signInDemo: () => void
  logout: () => Promise<void>
  revision: number
  refresh: () => void
  notify: (message: string) => void
}
const MarketplaceContext = createContext<MarketplaceState | null>(null)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [revision, setRevision] = useState(0)
  const [toast, setToast] = useState('')
  const savedKey = `meridian:${isDemo ? 'demo' : 'live'}:${user?.id ?? 'guest'}:saved:v1`
  const [saved, setSaved] = useState<{ key: string; ids: number[] }>({ key: '', ids: [] })
  const savedIds = saved.key === savedKey ? saved.ids : readStorage<number[]>(savedKey, isDemo && user ? [1, 4, 7] : [])

  useEffect(() => {
    const controller = new AbortController()
    getCurrentUser(controller.signal).then((account) => { if (!controller.signal.aborted) setUser(account) })
      .catch((error) => { if (!controller.signal.aborted && (!(error instanceof ApiError) || error.status !== 401)) setAuthError('We could not check your session. Refresh the page to try again.') })
      .finally(() => { if (!controller.signal.aborted) setAuthLoading(false) })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  const toggleSaved = (id: number) => {
    const removing = savedIds.includes(id)
    const ids = removing ? savedIds.filter((value) => value !== id) : [...savedIds, id]
    setSaved({ key: savedKey, ids })
    writeStorage(savedKey, ids)
    setToast(removing ? 'Property removed from your saved list.' : 'Property saved on this device.')
  }
  const logout = async () => {
    if (!isDemo) {
      // Laravel logout is a web POST with CSRF; use its origin via the same-origin proxy in production.
      try { await request('/sanctum/csrf-cookie'); await request('/logout', { method: 'POST', redirect: 'follow' }) }
      catch { window.location.assign(`${backendOrigin}/profile`); return }
    } else writeStorage('meridian:demo:session', false)
    setUser(null)
  }
  return <MarketplaceContext.Provider value={{ user, authLoading, authError, savedIds, toggleSaved, logout, revision, refresh: () => setRevision((value) => value + 1), notify: setToast, signInDemo: () => { writeStorage('meridian:demo:session', true); setUser(demoUser) } }}>
    {children}
    {toast && <div role="status" className="toast">{toast}</div>}
  </MarketplaceContext.Provider>
}
export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (!context) throw new Error('MarketplaceProvider is required')
  return context
}
