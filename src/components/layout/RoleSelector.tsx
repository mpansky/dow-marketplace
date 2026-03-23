import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingStats } from '@/components/landing/LandingStats'
import { LandingRoles } from '@/components/landing/LandingRoles'
import { LandingFooter } from '@/components/landing/LandingFooter'

export function RoleSelector() {
  const { dispatch } = useApp()

  function selectRole(role: UserRole) {
    dispatch({ type: 'SET_ROLE', payload: role })
    dispatch({ type: 'SET_AUTHENTICATED', payload: true })
  }

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const elements = document.querySelectorAll('.landing-reveal')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingStats />
      <LandingRoles onSelectRole={selectRole} />
      <LandingFooter />
    </div>
  )
}
