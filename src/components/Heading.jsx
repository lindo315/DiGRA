// Section label + heading in the site's style.
const TONES = {
  gold: 'text-ink-gold', violet: 'text-ink-violet', green: 'text-ink-green', cyan: 'text-ink-cyan',
  orange: 'text-ink-orange', red: 'text-ink-red',
}
const DARK_TONES = {
  gold: 'text-accent-gold', violet: 'text-accent-violet', green: 'text-accent-green', cyan: 'text-accent-cyan',
  orange: 'text-accent-orange', red: 'text-[#FF7A90]',
}
const BAR = {
  gold: 'bg-accent-gold', violet: 'bg-accent-violet', green: 'bg-accent-green', cyan: 'bg-accent-cyan',
  orange: 'bg-accent-orange', red: 'bg-accent-red',
}

export default function Heading({ eyebrow, title, tone = 'gold', dark = false, rule = true, id, center = false, className = 'mb-10' }) {
  if (!eyebrow && !title) return null
  return (
    <div className={`${className} ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className={`font-rajdhani font-semibold text-sm uppercase tracking-[3px] mb-2 ${dark ? DARK_TONES[tone] : TONES[tone]}`}>
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 id={id} className={`font-rajdhani font-bold text-[32px] sm:text-[40px] leading-tight mb-3 ${dark ? 'text-white' : 'text-deep-purple'}`}>
          {title}
        </h2>
      )}
      {rule && <div className={`w-16 h-[2px] ${BAR[tone]} ${center ? 'mx-auto' : ''}`} />}
    </div>
  )
}
