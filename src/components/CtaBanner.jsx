import SectionWrapper from './SectionWrapper'
import { SmartLink } from '../lib/text'

/** The purple "Join the chapter" strip at the bottom of most pages. */
export default function CtaBanner({ cta, className = 'bg-mid-purple' }) {
  if (!cta?.title && !cta?.button?.label) return null
  return (
    <section className={`${className} py-16 md:py-20`}>
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {cta.title && <h2 className="font-rajdhani font-bold text-white text-3xl md:text-4xl mb-2">{cta.title}</h2>}
              {cta.text && <p className="font-dm-sans text-white/70 text-base">{cta.text}</p>}
            </div>
            {cta.button?.label && (
              <SmartLink
                to={cta.button.url}
                className="shrink-0 text-center bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
              >
                {cta.button.label}
              </SmartLink>
            )}
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
