import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { useApp } from '@/context/AppContext'

const LANDING_ROUTES = ['/indopacom', '/cybercom']

export function AppLayout() {
  const { state, dispatch } = useApp()
  const location = useLocation()
  const isLanding = LANDING_ROUTES.includes(location.pathname)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav transparent={isLanding} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay backdrop */}
        {state.mobileSidebarOpen && (
          <div
            className="mobile-overlay md:hidden"
            onClick={() => dispatch({ type: 'SET_MOBILE_SIDEBAR_OPEN', payload: false })}
          />
        )}
        <Sidebar />
        <main className={`flex-1 overflow-y-auto ${isLanding ? 'p-0' : 'p-3 md:p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
