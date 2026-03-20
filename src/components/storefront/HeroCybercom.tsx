interface HeroStat {
  label: string
  value: number
  icon: React.ReactNode
}

export function HeroCybercom({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f0a] via-[#0d1117] to-slate-950 cybercom-grid cybercom-scanline">
      {/* Decorative network topology */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Network nodes */}
          {[
            [150, 80], [300, 120], [450, 70], [600, 130], [250, 200],
            [400, 180], [550, 210], [700, 90], [100, 170], [350, 250],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#39FF14" opacity="0.6" />
              <circle cx={x} cy={y} r="8" fill="none" stroke="#39FF14" strokeWidth="0.5" opacity="0.3" />
            </g>
          ))}
          {/* Connection lines */}
          <line x1="150" y1="80" x2="300" y2="120" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
          <line x1="300" y1="120" x2="450" y2="70" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
          <line x1="450" y1="70" x2="600" y2="130" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
          <line x1="250" y1="200" x2="400" y2="180" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
          <line x1="400" y1="180" x2="550" y2="210" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
          <line x1="300" y1="120" x2="250" y2="200" stroke="#39FF14" strokeWidth="0.5" opacity="0.1" />
          <line x1="450" y1="70" x2="400" y2="180" stroke="#39FF14" strokeWidth="0.5" opacity="0.1" />
          <line x1="600" y1="130" x2="550" y2="210" stroke="#39FF14" strokeWidth="0.5" opacity="0.1" />
          <line x1="100" y1="170" x2="250" y2="200" stroke="#39FF14" strokeWidth="0.5" opacity="0.1" />
          <line x1="700" y1="90" x2="600" y2="130" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
        </svg>
      </div>

      <div className="relative z-10 px-8 py-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-cybercom" />
            <span className="text-xs font-medium text-cybercom uppercase tracking-widest">
              U.S. Cyber Command
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Arming Cyber Warriors with Commercial Innovation
          </h1>
          <p className="text-sm text-green-200/50 max-w-2xl">
            Accelerate zero-trust adoption, empower hunt-forward teams, and integrate AI-powered
            threat detection across persistent cyber operations.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm border border-[#39FF14]/10 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-2 text-cybercom mb-1">
                {stat.icon}
                <span className="text-2xl font-bold font-mono">{stat.value}</span>
              </div>
              <div className="text-[11px] text-green-200/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
