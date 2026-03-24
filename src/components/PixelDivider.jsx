import { useId } from 'react'

// Space Invaders style alien sprite grids — 8 cols × 7 rows, 1 = filled
const ALIEN_A = [
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,0,1,1,0,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,0,1,1,0,1,0],
  [0,0,1,0,0,1,0,0],
  [0,1,0,0,0,0,1,0],
]

const ALIEN_B = [
  [0,1,0,0,0,0,1,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,0,1,1,0,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,0,0,1,1,0],
  [1,0,0,0,0,0,0,1],
]

const ALIEN_C = [
  [0,0,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1],
  [1,0,1,0,0,1,0,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,0,0,1,0,0],
  [0,1,0,1,1,0,1,0],
  [1,0,1,0,0,1,0,1],
]

const ALIENS = [ALIEN_A, ALIEN_B, ALIEN_C]

const PALETTE = {
  warm: ['#F5A623', '#E94560', '#FF6B35'],
  cool: ['#00CFDD', '#B45FFF', '#3DE87A'],
  full: ['#F5A623', '#00CFDD', '#3DE87A', '#B45FFF', '#E94560', '#FF6B35'],
}

const PX = 3           // each "pixel" = 3 svg units
const ALIEN_W = 8 * PX // 24
const ALIEN_H = 7 * PX // 21
const GAP_X = 14       // horizontal gap between aliens
const PAD_Y = 10       // top/bottom padding
const TILE_H = ALIEN_H + PAD_Y * 2  // 41
const TILE_W = (ALIEN_W + GAP_X) * 3 // 114

function AlienSprite({ grid, x, y, fill, px }) {
  return (
    <>
      {grid.flatMap((row, ri) =>
        row.map((cell, ci) =>
          cell ? (
            <rect
              key={`${ri}-${ci}`}
              x={x + ci * px}
              y={y + ri * px}
              width={px}
              height={px}
              fill={fill}
            />
          ) : null
        )
      )}
    </>
  )
}

export default function PixelDivider({ variant = 'full', height }) {
  const rawId = useId()
  const safeId = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const patternId = `pdiv-${safeId}`
  const colours = PALETTE[variant] ?? PALETTE.full
  const h = height ?? TILE_H
  const scale = h / TILE_H
  const px = PX * scale
  const gapX = GAP_X * scale
  const padY = PAD_Y * scale
  const tileW = (8 * px + gapX) * 3

  return (
    <div aria-hidden="true" style={{ height: h, overflow: 'hidden', lineHeight: 0 }}>
      <svg
        width="100%"
        height={h}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={tileW}
            height={h}
            patternUnits="userSpaceOnUse"
          >
            <rect width={tileW} height={h} fill="#1C0A3A" />
            {ALIENS.map((grid, i) => (
              <AlienSprite
                key={i}
                grid={grid}
                x={i * (8 * px + gapX)}
                y={padY}
                fill={colours[i % colours.length]}
                px={px}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
