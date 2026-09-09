import { useEffect, useRef, useState } from 'react'

export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>, key: string) {
  const load = useRef(loader)
  load.current = loader
  const [state, setState] = useState<{ key: string; data?: T; loading: boolean; error: Error | null }>({ key, loading: true, error: null })
  const [attempt, retry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setState({ key, loading: true, error: null })
    load.current(controller.signal).then((data) => {
      if (!controller.signal.aborted) setState({ key, data, loading: false, error: null })
    }).catch((error: Error) => {
      if (!controller.signal.aborted) setState({ key, loading: false, error })
    })
    return () => controller.abort()
  }, [key, attempt])
  return { ...(state.key === key ? state : { data: undefined, loading: true, error: null }), retry: () => retry((value) => value + 1) }
}
