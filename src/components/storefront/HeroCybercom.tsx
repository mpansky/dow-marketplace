import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface HeroStat {
  label: string
  value: number
  icon: React.ReactNode
}

const TICKER_TEXT = 'SYS:ONLINE  //  THREAT_LEVEL:ELEVATED  //  HUNT_FWD:ACTIVE  //  ZT_SCORE:94.2  //  ENDPOINTS:12,847  //  INCIDENTS:0  //  UPTIME:99.97%  //  SIGNATURES_UPDATED:2026-03-22T08:00Z  //  CIDR_BLOCKS:MONITORED  //  LATENCY:2.1ms  //  '

export function HeroCybercom({ stats }: { stats: HeroStat[] }) {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col overflow-hidden bg-gradient-to-b from-[#030a03] via-[#0a0f0a] to-[#0a0a0f] cybercom-grid cybercom-scanline">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(57,255,20,0.06), transparent 60%)',
        }}
      />

      {/* Secondary glow — bottom right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 70%, rgba(57,255,20,0.04), transparent 50%)',
        }}
      />

      {/* Data ticker — scrolling telemetry bar */}
      <div className="relative z-10 mt-14 border-b border-[#39FF14]/10 overflow-hidden bg-[#39FF14]/[0.02]">
        <div className="animate-ticker whitespace-nowrap py-1.5">
          <span className="text-[10px] font-mono text-[#39FF14]/30 tracking-wider">
            {TICKER_TEXT}{TICKER_TEXT}
          </span>
        </div>
      </div>

      {/* Decorative SVG — network topology */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Network nodes */}
          {[
            [120, 100, 5], [250, 180, 4], [380, 90, 6], [500, 200, 4], [620, 120, 5],
            [750, 220, 4], [880, 100, 5], [1000, 180, 4], [1100, 120, 3],
            [180, 320, 4], [320, 400, 5], [470, 350, 4], [600, 420, 6], [730, 350, 4],
            [860, 430, 5], [980, 350, 4], [200, 500, 3], [550, 500, 4], [900, 500, 3],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#39FF14" opacity="0.6">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r={r! * 3} fill="none" stroke="#39FF14" strokeWidth="0.3" opacity="0.15" />
            </g>
          ))}

          {/* Connection lines — data flows */}
          {[
            [120, 100, 250, 180], [250, 180, 380, 90], [380, 90, 500, 200],
            [500, 200, 620, 120], [620, 120, 750, 220], [750, 220, 880, 100],
            [880, 100, 1000, 180], [1000, 180, 1100, 120],
            [180, 320, 320, 400], [320, 400, 470, 350], [470, 350, 600, 420],
            [600, 420, 730, 350], [730, 350, 860, 430], [860, 430, 980, 350],
            [250, 180, 180, 320], [500, 200, 470, 350], [750, 220, 730, 350],
            [1000, 180, 980, 350], [320, 400, 200, 500], [600, 420, 550, 500],
            [860, 430, 900, 500],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#39FF14" strokeWidth="0.5" opacity="0.12"
              strokeDasharray="6,6"
            >
              <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite" />
            </line>
          ))}

          {/* Central hub — larger glowing node */}
          <circle cx="600" cy="300" r="10" fill="none" stroke="#39FF14" strokeWidth="1" opacity="0.2">
            <animate attributeName="r" values="10;14;10" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="300" r="3" fill="#39FF14" opacity="0.6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16">
        <div className="max-w-5xl">
          {/* Command label */}
          <div className="animate-fade-in-up flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-cybercom" />
            <span className="text-xs font-semibold text-cybercom uppercase tracking-[0.2em] font-mono">
              U.S. Cyber Command
            </span>
          </div>

          {/* Display headline */}
          <h1 className="animate-fade-in-up animate-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-white to-green-200 bg-clip-text text-transparent">
              Arming Cyber Warriors
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-100 to-cybercom bg-clip-text text-transparent">
              with Commercial Innovation
            </span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up animate-delay-2 text-base md:text-lg text-green-200/40 max-w-2xl leading-relaxed mb-10">
            Accelerate zero-trust adoption, empower hunt-forward teams, and integrate AI-powered
            threat detection across persistent cyber operations.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up animate-delay-3 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="text-sm font-semibold px-6 bg-[#39FF14] hover:bg-[#39FF14]/90 text-black"
              onClick={() => navigate('/challenges')}
            >
              Explore Challenges
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm font-semibold px-6 border-[#39FF14]/20 bg-[#39FF14]/5 hover:bg-[#39FF14]/10 text-white"
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
            <div key={stat.label} className="glass-stat px-4 py-3.5" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
              <div className="flex items-center gap-2 text-cybercom mb-1.5">
                {stat.icon}
                <span className="text-2xl md:text-3xl font-bold font-mono">{stat.value}</span>
              </div>
              <div className="text-[11px] text-green-200/35 uppercase tracking-wider font-medium font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <ChevronDown className="w-5 h-5 text-[#39FF14]/30 animate-bounce-down" />
      </div>
    </div>
  )
}
