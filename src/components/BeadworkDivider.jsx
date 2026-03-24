const PALETTES = {
  warm: ['#F5A623', '#E94560', '#FF6B35', '#F5A623', '#E94560', '#FF6B35', '#F5A623', '#FF6B35'],
  cool: ['#00CFDD', '#B45FFF', '#3DE87A', '#00CFDD', '#B45FFF', '#3DE87A', '#00CFDD', '#3DE87A'],
  full: ['#F5A623', '#E94560', '#00CFDD', '#3DE87A', '#FF6B35', '#B45FFF', '#F5A623', '#00CFDD'],
}

export default function BeadworkDivider({ variant = 'full', height = 20 }) {
  const palette = PALETTES[variant] || PALETTES.full
  const beadSize = 6
  const gap = 2
  const step = beadSize + gap
  const rows = 3
  const totalHeight = rows * step + gap
  const patternId = `bead-${variant}`

  // Build bead rects for pattern
  const beads = []
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 1 ? step / 2 : 0
    for (let col = 0; col < 16; col++) {
      const colour = palette[(col + row) % palette.length]
      beads.push(
        <rect
          key={`${row}-${col}`}
          x={col * step + offset}
          y={row * step}
          width={beadSize}
          height={beadSize}
          fill={colour}
          rx="0.5"
        />
      )
    }
  }

  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={16 * step}
            height={totalHeight}
            patternUnits="userSpaceOnUse"
          >
            {beads}
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
