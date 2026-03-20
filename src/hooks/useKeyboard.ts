import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'

export function useKeyboard() {
  const { dispatch } = useApp()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K / Ctrl+K → Global Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        dispatch({ type: 'SET_SEARCH_OPEN', payload: true })
      }

      // Cmd+J / Ctrl+J → Chat Panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault()
        dispatch({ type: 'SET_CHAT_OPEN', payload: true })
      }

      // Escape → Close overlays
      if (e.key === 'Escape') {
        dispatch({ type: 'SET_SEARCH_OPEN', payload: false })
        dispatch({ type: 'SET_CHAT_OPEN', payload: false })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])
}
