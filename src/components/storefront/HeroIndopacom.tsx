import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface HeroStat {
  label: string
  value: number
  icon: React.ReactNode
}

export function HeroIndopacom({ stats }: { stats: HeroStat[] }) {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col overflow-hidden bg-gradient-to-b from-[#000d1a] via-[#001a33] to-[#0a0a0f] indopacom-topo">
      {/* Radial glow — light source effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 20%, rgba(0,119,182,0.12), transparent 65%)',
        }}
      />

      {/* Secondary glow — bottom left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(0,119,182,0.06), transparent 50%)',
        }}
      />

      {/* Decorative SVG — Pacific theater contour map */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Major contour arcs */}
          <path d="M-50,400 Q150,300 350,350 T650,300 T950,350 T1250,300" fill="none" stroke="#0077B6" strokeWidth="1.5" opacity="0.5" />
          <path d="M-50,350 Q100,250 300,300 T600,250 T900,300 T1250,250" fill="none" stroke="#0077B6" strokeWidth="1" opacity="0.4" />
          <path d="M-50,450 Q200,350 400,400 T700,350 T1000,400 T1250,350" fill="none" stroke="#0077B6" strokeWidth="0.8" opacity="0.3" />
          <path d="M-50,300 Q150,200 350,250 T650,200 T950,250 T1250,200" fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.25" />
          <path d="M-50,500 Q250,400 450,450 T750,400 T1050,450 T1250,400" fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.2" />

          {/* Island clusters — glowing nodes */}
          {[
            [380, 320, 6], [420, 290, 4], [460, 310, 3], [520, 280, 5],
            [580, 300, 3], [640, 270, 4], [700, 310, 6], [750, 280, 3],
            [810, 300, 4], [870, 270, 3], [930, 310, 5], [350, 360, 3],
            [480, 340, 4], [620, 340, 3], [760, 340, 4],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#0077B6" opacity="0.5" />
              <circle cx={cx} cy={cy} r={r! * 2.5} fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.2" />
            </g>
          ))}

          {/* Connection routes — shipping/flight paths */}
          <path d="M380,320 Q450,270 520,280" fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.15" strokeDasharray="4,4" />
          <path d="M520,280 Q600,260 700,310" fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.15" strokeDasharray="4,4" />
          <path d="M700,310 Q800,270 930,310" fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.15" strokeDasharray="4,4" />

          {/* Grid overlay — subtle latitude/longitude */}
          {[150, 250, 350, 450, 550].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} stroke="#0077B6" strokeWidth="0.3" opacity="0.08" />
          ))}
          {[200, 400, 600, 800, 1000].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" stroke="#0077B6" strokeWidth="0.3" opacity="0.08" />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pt-14">
        <div className="max-w-5xl">
          {/* Command label + ChBA badge */}
          <div className="animate-fade-in-up flex items-center gap-3 mb-6 flex-wrap">
            <div className="h-px w-10 bg-indopacom" />
            <span className="text-xs font-semibold text-indopacom uppercase tracking-[0.2em]">
              U.S. Indo-Pacific Command
            </span>
            <span className="text-[10px] font-mono text-indopacom/60 uppercase tracking-wider px-2 py-0.5 border border-indopacom/20 rounded">
              ChBA — Challenge-Based Acquisition
            </span>
          </div>

          {/* Display headline */}
          <h1 className="animate-fade-in-up animate-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
              Arsenal of
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-100 to-indopacom bg-clip-text text-transparent">
              Freedom
            </span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up animate-delay-2 text-base md:text-lg text-blue-200/50 max-w-2xl leading-relaxed mb-10">
            Closing INDOPACOM kill chain gaps by unleashing American industry.
            OT awards in days, not years. Challenge-Based Acquisition that puts DoW on a war footing.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up animate-delay-3 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="text-sm font-semibold px-6 bg-indopacom hover:bg-indopacom/90 text-white"
              onClick={() => navigate('/challenges')}
            >
              View Kill Chain Gaps
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm font-semibold px-6 border-white/15 bg-white/5 hover:bg-white/10 text-white"
              onClick={() => navigate('/vendors')}
            >
              Browse Vendors
            </Button>
          </div>
        </div>
      </div>

      {/* Stats strip — glass cards at bottom */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 pb-10 md:pb-14">
        <div className="animate-fade-in-up animate-delay-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-stat px-4 py-3.5">
              <div className="flex items-center gap-2 text-indopacom mb-1.5">
                {stat.icon}
                <span className="text-2xl md:text-3xl font-bold font-mono">{stat.value}</span>
              </div>
              <div className="text-[11px] text-blue-200/40 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <ChevronDown className="w-5 h-5 text-white/30 animate-bounce-down" />
      </div>
    </div>
  )
}
