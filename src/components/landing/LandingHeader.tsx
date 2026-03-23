import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative rounded-2xl transition-all duration-300"
            style={{
              background: isScrolled
                ? 'rgba(10, 10, 15, 0.8)'
                : 'rgba(10, 10, 15, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: isScrolled
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between px-6 py-3">
              {/* Logo */}
              <button
                onClick={() => scrollTo('hero')}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-sm transition-transform duration-200 group-hover:scale-105">
                  DW
                </div>
                <span className="hidden sm:block text-sm font-semibold tracking-tight">
                  Department of the Warfighter
                </span>
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => scrollTo('about')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollTo('mission')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mission
                </button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => scrollTo('roles')}
                  className="ml-2"
                >
                  Login / Sign Up
                </Button>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div
                className="md:hidden border-t border-white/10 px-6 py-4"
                style={{
                  background: 'rgba(10, 10, 15, 0.95)',
                }}
              >
                <nav className="flex flex-col gap-4">
                  <button
                    onClick={() => scrollTo('about')}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollTo('mission')}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Mission
                  </button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => scrollTo('roles')}
                    className="w-full"
                  >
                    Login / Sign Up
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-20" />
    </>
  )
}
