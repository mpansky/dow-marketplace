const nodes: [number, number][] = [
  [80, 60], [200, 120], [350, 50], [500, 100], [650, 70],
  [120, 180], [280, 220], [430, 190], [580, 230], [720, 160],
  [60, 300], [210, 340], [370, 310], [520, 350], [670, 290],
  [150, 400], [310, 430], [460, 380], [610, 420], [750, 370],
  [90, 480], [250, 460], [400, 500], [550, 470], [700, 500],
]

const connections: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8], [8, 9],
  [10, 11], [11, 12], [12, 13], [13, 14],
  [15, 16], [16, 17], [17, 18], [18, 19],
  [20, 21], [21, 22], [22, 23], [23, 24],
  [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
  [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
  [10, 15], [12, 17], [14, 19],
  [15, 20], [17, 22], [19, 24],
]

export function NetworkBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 800 540"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {connections.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="var(--storefront-accent)"
            strokeWidth="0.5"
            opacity="0.08"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i} className="landing-node-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
            <circle cx={x} cy={y} r="2" fill="var(--storefront-accent)" opacity="0.4" />
            <circle cx={x} cy={y} r="5" fill="none" stroke="var(--storefront-accent)" strokeWidth="0.5" opacity="0.15" />
          </g>
        ))}
      </svg>
      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, #0a0a0f 80%)',
        }}
      />
    </div>
  )
}
