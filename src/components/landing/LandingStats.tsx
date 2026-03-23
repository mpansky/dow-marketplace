const stats = [
  { value: '147', suffix: '+', label: 'Registered Vendors' },
  { value: '23', suffix: '', label: 'Active Challenges' },
  { value: '11', suffix: 'd', label: 'Avg Days to Award' },
  { value: '$42', suffix: 'M', label: 'Pipeline Value' },
]

export function LandingStats() {
  return (
    <section className="py-16 px-8 bg-[#08080d] border-t border-b border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="landing-reveal">
            <div className="text-4xl md:text-5xl font-bold font-mono text-foreground">
              {stat.value}
              <span className="text-[var(--storefront-accent)]">{stat.suffix}</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
