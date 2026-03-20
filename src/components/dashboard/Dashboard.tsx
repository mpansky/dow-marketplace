import { useApp } from '@/context/AppContext'
import { PAEDashboard } from './PAEDashboard'
import { NDCDashboard } from './NDCDashboard'
import { AdminDashboard } from './AdminDashboard'

export function Dashboard() {
  const { state } = useApp()

  switch (state.currentRole) {
    case 'pae':
      return <PAEDashboard />
    case 'ndc':
      return <NDCDashboard />
    case 'admin':
      return <AdminDashboard />
  }
}
