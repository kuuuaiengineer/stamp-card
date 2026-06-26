const KEY = 'stamp_browser_token'

export function getBrowserToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY)
}

export function setBrowserToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, token)
}

export function clearBrowserToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}
