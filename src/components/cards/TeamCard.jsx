import { motion } from "framer-motion";

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
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── Leader variant: same dimensions as default, dark bg, elevated styling ── */
function TeamCardLeader({ member, onClick }) {
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
          className="font-rajdhani font-bold text-[10px] uppercase tracking-[2px] px-2 py-0.5"
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
          className="font-rajdhani font-bold text-xs uppercase tracking-[2px] mb-1"
          style={{ color: colour }}
        >
          {member.role}
        </p>
        <h3 className="font-rajdhani font-bold text-white text-xl leading-tight mb-1">
          {member.name}
        </h3>
        <p className="font-dm-sans italic text-white/40 text-sm mb-3 border-b border-white/10 pb-3">
          {member.institution}
        </p>
        {member.bio ? (
          <p className="font-dm-sans text-white/60 text-sm leading-relaxed line-clamp-3 mb-4">
            {member.bio}
          </p>
        ) : (
          <p className="font-dm-sans text-white/25 text-sm italic mb-4">
            Bio coming soon.
          </p>
        )}
        <p
          className="font-rajdhani font-bold text-xs uppercase tracking-wider mt-auto"
          style={{ color: colour }}
        >
          View Profile →
        </p>
      </div>
    </motion.article>
  );
}

/* ── Default variant: vertical card for committee grid ── */
export default function TeamCard({ member, onClick, variant = "default" }) {
  if (variant === "leader")
    return <TeamCardLeader member={member} onClick={onClick} />;

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
          className="font-rajdhani font-bold text-xs uppercase tracking-[2px] mb-1"
          style={{ color: colour }}
        >
          {member.role}
        </p>
        <h3 className="font-rajdhani font-bold text-text-primary text-xl leading-tight mb-1">
          {member.name}
        </h3>
        <p className="font-dm-sans italic text-text-secondary text-sm mb-3 border-b border-border-light pb-3">
          {member.institution}
        </p>
        {member.bio ? (
          <p className="font-dm-sans text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
            {member.bio}
          </p>
        ) : (
          <p className="font-dm-sans text-text-secondary/40 text-sm italic mb-4">
            Bio coming soon.
          </p>
        )}
        <p
          className="font-rajdhani font-bold text-xs uppercase tracking-wider mt-auto"
          style={{ color: colour }}
        >
          View Profile →
        </p>
      </div>
    </motion.article>
  );
}
