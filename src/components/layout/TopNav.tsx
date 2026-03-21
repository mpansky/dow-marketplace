import { Search, Bell, ArrowLeftRight, Menu } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { storefronts } from '@/lib/themes'
import { getInitials } from '@/lib/utils'
import type { StorefrontId } from '@/types'

const storefrontTabs: { id: StorefrontId; label: string }[] = [
  { id: 'indopacom', label: 'INDOPACOM' },
  { id: 'cybercom', label: 'CYBERCOM' },
]

const roleLabels = {
  pae: 'PAE',
  ndc: 'NDC',
  admin: 'Admin',
}

export function TopNav() {
  const { state, dispatch } = useApp()
  const sf = storefronts[state.currentStorefront]
  const unreadCount = state.notifications.filter((n) => !n.read && n.role === state.currentRole).length

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-3 md:px-4 gap-2 md:gap-4 sticky top-0 z-40">
      {/* Mobile Hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden flex-shrink-0"
        onClick={() => dispatch({ type: 'SET_MOBILE_SIDEBAR_OPEN', payload: true })}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${sf.accentColor}, ${sf.accentColor}88)` }}>
          DW
        </div>
        <span className="font-semibold text-sm hidden md:inline">DoW Marketplace</span>
      </div>

      {/* Storefront Switcher - desktop only */}
      <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-0.5">
        {storefrontTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_STOREFRONT', payload: tab.id })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              state.currentStorefront === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={
              state.currentStorefront === tab.id
                ? { borderBottom: `2px solid ${storefronts[tab.id].accentColor}` }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Global Search Trigger - desktop */}
      <button
        onClick={() => dispatch({ type: 'SET_SEARCH_OPEN', payload: true })}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors flex-1 max-w-md"
      >
        <Search className="w-4 h-4" />
        <span>Search challenges, vendors, capabilities...</span>
        <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Mobile search icon */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden flex-shrink-0"
        onClick={() => dispatch({ type: 'SET_SEARCH_OPEN', payload: true })}
      >
        <Search className="w-4 h-4" />
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative flex-shrink-0">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Role Badge - desktop only */}
      <Badge variant="accent" className="cursor-pointer hidden md:inline-flex">
        {roleLabels[state.currentRole]}
      </Badge>

      {/* Role Switcher - desktop only */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground hidden md:inline-flex"
        onClick={() => dispatch({ type: 'SET_AUTHENTICATED', payload: false })}
      >
        <ArrowLeftRight className="w-3 h-3 mr-1" />
        Switch Role
      </Button>

      {/* User Avatar */}
      {state.currentUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">
          {getInitials(state.currentUser.name)}
        </div>
      )}
    </header>
  )
}
