import { useMemo } from 'react'
import type { ChatMessage as ChatMessageType } from '@/types'
import { CitationBadge } from './CitationBadge'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  const timeLabel = useMemo(() => {
    const date = new Date(message.timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [message.timestamp])

  // Simple markdown-like bold rendering
  const formattedContent = useMemo(() => {
    const parts = message.content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={i}>{part}</span>
    })
  }, [message.content])

  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && (
        <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Marketplace AI
        </span>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md text-white'
            : 'rounded-bl-md bg-secondary text-foreground'
        }`}
        style={
          isUser
            ? { backgroundColor: 'var(--storefront-accent)' }
            : undefined
        }
      >
        <div className="whitespace-pre-wrap">{formattedContent}</div>
      </div>

      {message.citations && message.citations.length > 0 && (
        <div className="flex flex-wrap gap-1 px-1">
          {message.citations.map((citation, i) => (
            <CitationBadge key={`${citation.id}-${i}`} citation={citation} />
          ))}
        </div>
      )}

      <span className="px-1 text-[10px] text-muted-foreground/60">
        {timeLabel}
      </span>
    </div>
  )
}
