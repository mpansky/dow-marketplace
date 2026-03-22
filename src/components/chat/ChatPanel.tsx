import { useEffect, useRef } from 'react'
import { X, MessageSquarePlus, Shield, User } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useChat } from '@/hooks/useChat'
import { Badge } from '@/components/ui/badge'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QuickChips } from './QuickChips'

const STOREFRONT_LABELS = {
  indopacom: 'INDOPACOM',
  cybercom: 'CYBERCOM',
  global: 'Global',
} as const

const ROLE_LABELS = {
  pae: 'PAE',
  ndc: 'NDC',
  admin: 'Admin',
} as const

export function ChatPanel() {
  const { state, dispatch } = useApp()
  const { messages, isTyping, sendMessage, clearMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isOpen = state.chatOpen

  // Auto-scroll to bottom on new messages or typing state change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  function handleClose() {
    dispatch({ type: 'SET_CHAT_OPEN', payload: false })
  }

  function handleSend(content: string) {
    sendMessage(content, state.currentRole, state.currentStorefront)
  }

  function handleNewConversation() {
    clearMessages()
  }

  return (
    <div
      className={`glass-panel fixed top-14 z-40 flex h-[calc(100vh-3.5rem)] flex-col border-l border-border/30 transition-transform duration-300 ease-in-out inset-x-0 sm:inset-x-auto sm:right-0 w-full sm:w-[420px] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-foreground">
            Marketplace Intelligence
          </h2>
          <div className="flex items-center gap-1.5">
            <Badge variant="accent" className="text-[10px]">
              <Shield className="mr-0.5 h-2.5 w-2.5" />
              {STOREFRONT_LABELS[state.currentStorefront]}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              <User className="mr-0.5 h-2.5 w-2.5" />
              {ROLE_LABELS[state.currentRole]}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewConversation}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="New conversation"
            aria-label="New conversation"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: 'rgba(var(--storefront-accent-rgb), 0.15)',
                }}
              >
                <MessageSquarePlus
                  className="h-6 w-6"
                  style={{ color: 'var(--storefront-accent)' }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Marketplace Intelligence
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ask about vendors, challenges, pipeline status, or domain
                  insights.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Marketplace AI
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick chips + input */}
      <QuickChips onSelect={handleSend} />
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}
