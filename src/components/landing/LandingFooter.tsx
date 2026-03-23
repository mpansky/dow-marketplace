export function LandingFooter() {
  return (
    <footer className="py-8 px-8 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-xs">
            DW
          </div>
          <span className="text-sm font-medium">DoW Marketplace</span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-6 mb-4">
          {['About', 'Documentation', 'Contact', 'Status'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Classification */}
        <p className="text-xs text-muted-foreground">
          UNCLASSIFIED · ATS Initiative 1.7 · SWP Cadre OTA · Prototype v1.0
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-2">
          Department of the Warfighter Marketplace. For authorized use only.
        </p>
      </div>
    </footer>
  )
}
