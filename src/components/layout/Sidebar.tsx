import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Target, Building2, FlaskConical, GitBranch,
  BarChart3, User, Inbox, Compass, FileText, Shield, AlertTriangle,
  ClipboardList, PanelLeftClose, PanelLeft,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

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
    { label: 'Analytics', to: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ],
  ndc: [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Company Profile', to: '/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Discover', to: '/challenges', icon: <Compass className="w-4 h-4" /> },
    { label: 'Submissions', to: '/submissions', icon: <Inbox className="w-4 h-4" /> },
    { label: 'OT Pipeline', to: '/pipeline', icon: <GitBranch className="w-4 h-4" /> },
  ],
  admin: [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Challenges', to: '/challenges', icon: <Target className="w-4 h-4" /> },
    { label: 'Match Curation', to: '/admin/curation', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Vendors', to: '/vendors', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Barriers', to: '/admin/barriers', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'OT Pipeline', to: '/pipeline', icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Reports', to: '/admin/reports', icon: <FileText className="w-4 h-4" /> },
  ],
}

export function Sidebar() {
  const { state, dispatch } = useApp()
  const items = navByRole[state.currentRole]
  const collapsed = state.sidebarCollapsed

  return (
    <aside
      className={cn(
        'border-r border-border bg-card/50 flex flex-col transition-all duration-200',
        collapsed ? 'w-14' : 'w-52'
      )}
    >
      <div className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[var(--storefront-accent-dim)] text-[var(--storefront-accent)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Storefront Info */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Storefront</div>
          <div className="text-xs font-medium" style={{ color: 'var(--storefront-accent)' }}>
            {state.currentStorefront === 'indopacom' ? 'INDOPACOM' : state.currentStorefront === 'cybercom' ? 'CYBERCOM' : 'Global'}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="p-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>
    </aside>
  )
}
