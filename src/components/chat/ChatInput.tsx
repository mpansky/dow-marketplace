import { useState, useRef, useEffect, useCallback } from 'react'
import { Send } from 'lucide-react'

const PLACEHOLDERS = [
  'Ask about vendors...',
  'Compare capabilities...',
  'Pipeline status...',
  'Challenge insights...',
  'Domain analysis...',
  'Match recommendations...',
]

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const maxHeight = 4 * 24 // ~4 lines
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [value])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }, [value, disabled, onSend])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="flex items-end gap-2 border-t border-border/50 bg-background/50 p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDERS[placeholderIndex]}
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none rounded-xl border border-border/50 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--storefront-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--storefront-accent)]/30 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: canSend ? 'var(--storefront-accent)' : undefined,
        }}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  )
}
