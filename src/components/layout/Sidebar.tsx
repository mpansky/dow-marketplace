import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Target, Building2, FlaskConical, GitBranch,
  BarChart3, User, Inbox, Compass, FileText, AlertTriangle,
  ClipboardList, PanelLeftClose, PanelLeft, X, ArrowLeftRight,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { storefronts } from '@/lib/themes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { UserRole, StorefrontId } from '@/types'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navByRole: Record<UserRole, NavItem[]> = {
  pae: [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Challenges', to: '/challenges', icon: <Target className="w-4 h-4" /> },
    { label: 'Vendors', to: '/vendors', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Market Research', to: '/market-research', icon: <FlaskConical className="w-4 h-4" /> },
    { label: 'OT Pipeline', to: '/pipeline', icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Breaking Barriers', to: '/barriers', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Analytics', to: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ],
  ndc: [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Company Profile', to: '/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Discover', to: '/challenges', icon: <Compass className="w-4 h-4" /> },
    { label: 'Submissions', to: '/submissions', icon: <Inbox className="w-4 h-4" /> },
    { label: 'OT Pipeline', to: '/pipeline', icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Breaking Barriers', to: '/barriers', icon: <AlertTriangle className="w-4 h-4" /> },
  ],
  admin: [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Challenges', to: '/challenges', icon: <Target className="w-4 h-4" /> },
    { label: 'Match Curation', to: '/admin/curation', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Vendors', to: '/vendors', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Breaking Barriers', to: '/barriers', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'OT Pipeline', to: '/pipeline', icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Reports', to: '/admin/reports', icon: <FileText className="w-4 h-4" /> },
  ],
}

const storefrontTabs: { id: StorefrontId; label: string }[] = [
  { id: 'indopacom', label: 'INDOPACOM' },
  { id: 'cybercom', label: 'CYBERCOM' },
]

const roleLabels = {
  pae: 'PAE',
  ndc: 'NDC',
  admin: 'Admin',
}

export function Sidebar() {
  const { state, dispatch } = useApp()
  const items = navByRole[state.currentRole]
  const collapsed = state.sidebarCollapsed
  const mobileOpen = state.mobileSidebarOpen

  function closeMobile() {
    dispatch({ type: 'SET_MOBILE_SIDEBAR_OPEN', payload: false })
  }

  return (
    <aside
      className={cn(
        'border-r border-border bg-card/50 flex flex-col transition-all duration-300',
        // Mobile: fixed drawer overlay
        'fixed inset-y-0 left-0 z-40 w-[280px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: static inline sidebar
        'md:static md:translate-x-0 md:z-auto',
        collapsed ? 'md:w-14' : 'md:w-52'
      )}
    >
      {/* Mobile: close button + storefront switcher */}
      <div className="flex items-center justify-between p-3 border-b border-border md:hidden">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
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
        <button
          onClick={closeMobile}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-2.5 py-2.5 md:py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[var(--storefront-accent-dim)] text-[var(--storefront-accent)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )
            }
          >
            {item.icon}
            {/* On mobile always show label; on desktop respect collapsed state */}
            <span className={cn('md:hidden', !collapsed && 'md:inline')}>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Storefront Info - desktop only */}
      {!collapsed && (
        <div className="hidden md:block p-3 border-t border-border">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Storefront</div>
          <div className="text-xs font-medium" style={{ color: 'var(--storefront-accent)' }}>
            {state.currentStorefront === 'indopacom' ? 'INDOPACOM' : state.currentStorefront === 'cybercom' ? 'CYBERCOM' : 'Global'}
          </div>
        </div>
      )}

      {/* Mobile: role badge + switch role */}
      <div className="p-3 border-t border-border md:hidden">
        <div className="flex items-center justify-between">
          <Badge variant="accent" className="text-xs">
            {roleLabels[state.currentRole]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => {
              closeMobile()
              dispatch({ type: 'SET_AUTHENTICATED', payload: false })
            }}
          >
            <ArrowLeftRight className="w-3 h-3 mr-1" />
            Switch Role
          </Button>
        </div>
      </div>

      {/* Collapse Toggle - desktop only */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="hidden md:block p-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>
    </aside>
  )
}
