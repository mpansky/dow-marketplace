import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NetworkBackground } from './NetworkBackground'

export function LandingHero() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 landing-grid">
      {/* Background layers */}
      <NetworkBackground />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-[var(--storefront-accent)]/20 bg-[var(--storefront-accent)]/5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--storefront-accent)]">
            Department of the Warfighter
          </span>
        </div>

        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-xl mb-8 fab-glow">
          DW
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-[1.1]">
          <span className="block text-foreground">The Single Front Door</span>
          <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            to Defense Innovation
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Connecting American commercial technology to warfighter needs through AI-powered matching,
          streamlined OT acquisition, and a unified marketplace for defense innovation.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex items-center gap-4">
          <Button variant="accent" size="lg" onClick={() => scrollTo('roles')}>
            Select Your Role
          </Button>
          <Button variant="outline" size="lg" onClick={() => scrollTo('features')}>
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 landing-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  )
}
