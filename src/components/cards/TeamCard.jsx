import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ink, onDark } from "../../lib/theme";
import PixelSprite from "../PixelSprite";
import { safeUrl } from "../../lib/text";

const ACCENT_COLOURS = [
  "#F5A623",
  "#00CFDD",
  "#E94560",
  "#3DE87A",
  "#B45FFF",
  "#FF6B35",
];

function hashColour(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_COLOURS[Math.abs(hash) % ACCENT_COLOURS.length];
}

function getInitials(name) {
  return (name || "")
    .replace(/^(Dr|Prof|Mr|Ms|Mrs|Dr\.|Prof\.)\s+/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── Leader variant: same dimensions as default, dark bg, elevated styling ── */
function TeamCardLeader({ member, onClick, labels = {} }) {
  const colour = hashColour(member.name);
  const initials = getInitials(member.name);

  return (
    <motion.article
      className="bg-deep-purple overflow-hidden flex flex-col cursor-pointer relative"
      style={{ borderTop: `4px solid ${colour}` }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      aria-label={`View profile for ${member.name}`}
    >
      {/* Leadership badge */}
      {/* <div className="absolute top-3 right-3 z-10">
        <span
          className="font-rajdhani font-bold text-sm uppercase tracking-[2px] px-2 py-0.5"
          style={{ background: `${colour}25`, color: colour, border: `1px solid ${colour}50` }}
        >
          ◆ Leadership
        </span>
      </div> */}

      {/* Photo / Avatar */}
      <div
        className="relative overflow-hidden flex items-center justify-center aspect-[4/3]"
        style={{ background: `${colour}18` }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-[50%_20%]"
          />
        ) : (
          <div
            className="w-24 h-24 flex items-center justify-center font-rajdhani font-bold text-white text-3xl"
            style={{ background: colour }}
          >
            {initials}
          </div>
        )}
        {member.photo && (
          <div className="absolute bottom-0 left-0 right-0 h-12" />
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p
          className="font-rajdhani font-bold text-sm uppercase tracking-[2px] mb-1"
          style={{ color: onDark(colour) }}
        >
          {member.role}
        </p>
        <h3 className="font-rajdhani font-bold text-white text-xl leading-tight mb-1">
          {member.name}
        </h3>
        <p className="font-dm-sans italic text-white/70 text-base mb-3 border-b border-white/10 pb-3">
          {member.institution}
        </p>
        {member.bio ? (
          <p className="font-dm-sans text-white/60 text-base leading-relaxed line-clamp-3 mb-4">
            {member.bio}
          </p>
        ) : (
          <p className="font-dm-sans text-white/70 text-base italic mb-4">
            {labels.no_bio || "Bio coming soon."}
          </p>
        )}
        <p
          className="font-rajdhani font-bold text-sm uppercase tracking-wider mt-auto"
          style={{ color: onDark(colour) }}
        >
          {labels.profile_label || "View Profile →"}
        </p>
      </div>
    </motion.article>
  );
}

/* ── Vacant seat: dashed "nominations open" card ── */
function TeamCardVacant({ member, labels = {} }) {
  const colour = "#F5A623";
  const to = safeUrl(member.vacancy_link);
  const inner = (
    <>
      <div className="relative flex flex-col items-center justify-center gap-3 aspect-[4/3] bg-[repeating-linear-gradient(45deg,rgba(245,166,35,0.08)_0,rgba(245,166,35,0.08)_6px,transparent_6px,transparent_12px)]">
        <PixelSprite name="star" colour={colour} size={44} />
        <span className="font-rajdhani font-bold text-sm uppercase tracking-[3px] text-ink-gold bg-white px-3 py-1 border-2 border-accent-gold">
          Nominations open
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="font-rajdhani font-bold text-sm uppercase tracking-[2px] mb-1 text-ink-gold">{member.role}</p>
        <h3 className="font-rajdhani font-bold text-text-primary text-xl leading-tight mb-3 pb-3 border-b border-dashed border-accent-gold/60">
          {labels.vacant_name || "Vacant Seat"}
        </h3>
        {member.vacancy_text && (
          <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">{member.vacancy_text}</p>
        )}
        {to && (
          <p className="font-rajdhani font-bold text-sm uppercase tracking-wider mt-auto text-ink-gold">
            {labels.vacant_button || "How to Stand →"}
          </p>
        )}
      </div>
    </>
  );
  const cls = "bg-surface overflow-hidden flex flex-col h-full border-2 border-dashed border-accent-gold/70 hover:border-accent-gold hover:-translate-y-1 transition-all duration-200";
  if (!to) return <article className={cls}>{inner}</article>;
  return /^https?:/.test(to) ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link to={to} className={cls}>{inner}</Link>
  );
}

/* ── Default variant: vertical card for committee grid ── */
export default function TeamCard({ member, onClick, variant = "default", labels = {} }) {
  if (member.vacant) return <TeamCardVacant member={member} labels={labels} />;
  if (variant === "leader")
    return <TeamCardLeader member={member} onClick={onClick} labels={labels} />;

  const colour = hashColour(member.name);
  const initials = getInitials(member.name);

  return (
    <motion.article
      className="bg-surface overflow-hidden flex flex-col cursor-pointer"
      style={{ borderTop: `3px solid ${colour}` }}
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      aria-label={`View profile for ${member.name}`}
    >
      {/* Photo / Avatar */}
      <div
        className="relative overflow-hidden flex items-center justify-center aspect-[4/3]"
        style={{ background: `${colour}12` }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-[50%_20%]"
          />
        ) : (
          <div
            className="w-24 h-24 flex items-center justify-center font-rajdhani font-bold text-white text-3xl"
            style={{ background: colour }}
          >
            {initials}
          </div>
        )}
        {member.photo && (
          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))",
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p
          className="font-rajdhani font-bold text-sm uppercase tracking-[2px] mb-1"
          style={{ color: ink(colour) }}
        >
          {member.role}
        </p>
        <h3 className="font-rajdhani font-bold text-text-primary text-xl leading-tight mb-1">
          {member.name}
        </h3>
        <p className="font-dm-sans italic text-text-secondary text-base mb-3 border-b border-border-light pb-3">
          {member.institution}
        </p>
        {member.bio ? (
          <p className="font-dm-sans text-text-secondary text-base leading-relaxed line-clamp-3 mb-4">
            {member.bio}
          </p>
        ) : (
          <p className="font-dm-sans text-text-secondary text-base italic mb-4">
            {labels.no_bio || "Bio coming soon."}
          </p>
        )}
        <p
          className="font-rajdhani font-bold text-sm uppercase tracking-wider mt-auto"
          style={{ color: ink(colour) }}
        >
          {labels.profile_label || "View Profile →"}
        </p>
      </div>
    </motion.article>
  );
}
