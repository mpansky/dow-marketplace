interface HeroStat {
  label: string
  value: number
  icon: React.ReactNode
}

export function HeroIndopacom({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#001a33] via-[#002244] to-slate-950 indopacom-topo">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Stylized Pacific map contours */}
          <path d="M100,200 Q200,150 300,180 T500,160 T700,190" fill="none" stroke="#0077B6" strokeWidth="1" opacity="0.4" />
          <path d="M50,250 Q150,200 250,230 T450,210 T650,240" fill="none" stroke="#0077B6" strokeWidth="1" opacity="0.3" />
          <path d="M150,150 Q250,100 350,130 T550,110 T750,140" fill="none" stroke="#0077B6" strokeWidth="0.5" opacity="0.3" />
          {/* Island dots */}
          <circle cx="350" cy="170" r="3" fill="#0077B6" opacity="0.5" />
          <circle cx="420" cy="155" r="2" fill="#0077B6" opacity="0.4" />
          <circle cx="480" cy="175" r="4" fill="#0077B6" opacity="0.3" />
          <circle cx="550" cy="140" r="2" fill="#0077B6" opacity="0.4" />
          <circle cx="600" cy="165" r="3" fill="#0077B6" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 px-8 py-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-indopacom" />
            <span className="text-xs font-medium text-indopacom uppercase tracking-widest">
              U.S. Indo-Pacific Command
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Connecting Pacific Warfighters to American Innovation
          </h1>
          <p className="text-sm text-blue-200/60 max-w-2xl">
            Discover, match, and accelerate capability acquisition for maritime domain awareness,
            expeditionary operations, and coalition interoperability across the Indo-Pacific theater.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-2 text-indopacom mb-1">
                {stat.icon}
                <span className="text-2xl font-bold font-mono">{stat.value}</span>
              </div>
              <div className="text-[11px] text-blue-200/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
