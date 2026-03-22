import { Brain } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export function ChatFAB() {
  const { state, dispatch } = useApp()

  if (state.chatOpen) return null

  function handleOpen() {
    dispatch({ type: 'SET_CHAT_OPEN', payload: true })
  }

  return (
    <button
      onClick={handleOpen}
      className="fab-glow group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      style={{ backgroundColor: 'var(--storefront-accent)' }}
      aria-label="Ask Marketplace AI"
    >
      <Brain className="h-6 w-6" />

      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Ask Marketplace AI
      </span>
    </button>
  )
}
