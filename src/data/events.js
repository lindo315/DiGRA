// ── Events ─────────────────────────────────────────────────────────────
// Each event moves from "Upcoming" to "Past" automatically the day after
// its `endDate` (YYYY-MM-DD). Events without an endDate stay where
// `status` puts them ("upcoming" or "past").
//
// Optional fields:
//   locationUrl  — makes the location a link
//   links        — extra buttons, e.g. [{ label: "Tickets", url: "https://..." }]
//   newsSlug     — links the event to a news article (/news/<slug>)

const rawEvents = [
  {
    id: 7,
    title: "DiGRA South Africa at Africa Games Week and Playtopia 2026",
    type: "Industry Event",
    date: "3–8 December 2026",
    day: "03",
    month: "Dec",
    startDate: "2026-12-03",
    endDate: "2026-12-08",
    location: "Cape Town",
    links: [
      {
        label: "Africa Games Week (6–8 Dec)",
        url: "https://gamesweek.africa/",
      },
      { label: "Playtopia (3–5 Dec)", url: "https://playtopiafestival.co.za/" },
    ],
    description:
      "Whether you're interested in game development, game studies, game-based learning, or the growing role of games in society, DiGRA South Africa is excited to be part of Africa Games Week and Playtopia 2026. These two events bring together developers, researchers, educators, students, and industry professionals from across the continent to celebrate African games, share ideas, and explore the future of play. It is a space where conversations about creativity, technology, culture, education, and innovation come together.\n\nAs the South African chapter of the Digital Games Research Association, we are looking forward to connecting with the broader African games community, showcasing emerging research, and engaging in discussions about how games can inform learning, storytelling, social impact, and industry growth. If you're attending Africa Games Week, come and say hello. We'd love to meet fellow game enthusiasts, researchers, developers, and anyone curious about the power of play.",
    status: "upcoming",
  },
  {
    id: 4,
    title: "DiGRA SA Inaugural Webinar Series",
    type: "Webinar",
    date: "From June 2026 (dates TBA)",
    day: "TBA",
    month: "TBA",
    location: "Online",
    description:
      "A series of scholarly and community-facing webinars exploring game studies, play, and game research in African and Global South contexts. Speakers and themes to be announced.",
    status: "upcoming",
  },
  {
    id: 6,
    title: "Who Makes the Rules? DiGRA SA Panel at SACOMM 2026",
    type: "Panel",
    date: "9–11 September 2026",
    day: "",
    month: "Sep",
    startDate: "2026-09-09",
    endDate: "2026-09-11",
    location: "Wits University, Johannesburg",
    newsSlug: "sacomm-2026-who-makes-the-rules",
    description:
      "A 90-minute DiGRA South Africa panel at the South African Communication Association conference. Facilitated by Dr Andrea Hayes with panellists Vuyo Tswago, Amanda Jankowitz and Dr Lance Bunt, the conversation moved from ludification and the game-like systems we use every day to what makes a game South African, and how local games get discovered.",
    status: "past",
  },
  {
    id: 5,
    title: "DiGRA SA Panel at the eFundanathi Gaming Symposium",
    type: "Panel",
    date: "2026 (soft-launch programme)",
    day: "",
    month: "2026",
    startDate: "2026-06-01", // TODO: exact date not known; only used for ordering. Replace with the real date.
    location: "University of the Witwatersrand, Johannesburg",
    description:
      "As part of its soft-launch activities, DiGRA South Africa hosted and facilitated a panel discussion at the eFundanathi Gaming Symposium, bringing together researchers, educators, and industry practitioners to explore critical questions around games, play, and digital culture in South Africa and the African context.",
    status: "past",
  },
  {
    id: 1,
    title: "Official Launch of DiGRA South Africa",
    type: "Launch Event",
    date: "18:00 SAST, 2 June 2026",
    day: "02",
    month: "Jun",
    startDate: "2026-06-02",
    endDate: "2026-06-02",
    location: "Online",
    newsSlug: "launch-panel",
    description:
      "The official launch of the Digital Games Research Association South Africa (DiGRA SA), a space where play meets scholarship to explore the transformative role of games in society. Under the theme 'Why Games Matter', the launch brought together researchers, educators, developers, students, and industry professionals to engage in meaningful dialogue on games as cultural, educational, and innovative practices in South Africa and beyond.",
    status: "past",
  },
  {
    id: 3,
    title: "DiGRA SA Soft Launch Webinar",
    type: "Launch Event",
    date: "26 May 2026",
    day: "26",
    month: "May",
    startDate: "2026-05-26",
    endDate: "2026-05-26",
    location: "Online",
    newsSlug: "digra-sa-soft-launch",
    description:
      "The official soft launch of DiGRA South Africa. This online event introduced the chapter, its founding members, and its vision for game studies in and from Africa. Open to researchers, students, educators, and industry practitioners.",
    status: "past",
  },
  {
    id: 2,
    title: "DiGRA SA Founding Workshop",
    type: "Founding Workshop",
    date: "13 April 2026",
    day: "13",
    month: "Apr",
    startDate: "2026-04-13",
    endDate: "2026-04-13",
    location: "University of the Witwatersrand, Johannesburg (Hybrid)",
    newsSlug: "founding-members-announced",
    description:
      "DiGRA South Africa’s founding members convened for their first official workshop to formalise the chapter, agree on its mission, and begin shaping governance, programmes, and future activities.",
    status: "past",
  },
];

function resolveStatus(event, today) {
  if (event.endDate) return event.endDate < today ? "past" : "upcoming";
  return event.status;
}

const today = new Date().toISOString().slice(0, 10);

export const events = rawEvents.map((e) => ({
  ...e,
  status: resolveStatus(e, today),
}));

// Upcoming: soonest first (undated events last). Past: most recent first.
export const upcomingEvents = events
  .filter((e) => e.status === "upcoming")
  .sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999"));

export const pastEvents = events
  .filter((e) => e.status === "past")
  .sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
