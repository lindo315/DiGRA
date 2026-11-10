// ── News ───────────────────────────────────────────────────────────────
// Newest first. The first item is featured on the Home page.
// `excerpt` is the short summary shown on cards; `body` is the full article
// shown at /news/<slug>.
//
// Body blocks:
//   "Plain string"                      → paragraph
//   { h: "Heading" }                    → sub-heading
//   { list: ["item", "item"] }          → bullet list
//   { quote: "text" }                   → highlighted pull-out line
//   { note: "text" }                    → small italic note

export const news = [
  {
    id: 7,
    category: "Research",
    date: "November 2026",
    title: "Who Makes the Rules? Talking Games at SACOMM 2026",
    author: "Dr Andrea Hayes and Dr Lance Bunt",
    image: "/images/news/sacomm-2026.webp",
    imageAlt:
      "DiGRA South Africa panellists standing in front of a projected DiGRA SA slide at SACOMM 2026",
    excerpt:
      "How much of an ordinary day already feels like a game? A recap of the DiGRA South Africa panel at SACOMM 2026, from ludification to what makes a game South African.",
    slug: "sacomm-2026-who-makes-the-rules",
    body: [
      "Your fitness app wants you to close a ring. Your language app wants you to save your streak. Somewhere, a leaderboard is waiting to tell you that you came fourth at something you didn't realise was a competition. How much of an ordinary day already feels like a game?",
      "That question was our way into the DiGRA South Africa panel at SACOMM 2026, hosted at Wits University. Over 90 minutes, our facilitator, Dr Andrea Hayes, and panellists Vuyo Tswago, Amanda Jankowitz and Dr Lance Bunt took the conversation from the game-like systems we use every day to the challenges of making games in South Africa and getting them seen. For us, as the South African chapter of the Digital Games Research Association, it was a chance to bring game studies into conversation with people thinking about media, communication and culture from all sorts of angles.",
      { h: "You've unlocked a new question" },
      "We started with ludification, a wonderfully academic word for the way play and game-like systems seep into everyday life. Gamification is one way that happens. Think of a streak that nudges you to practise every day. Learning through a game can work differently. A simulation might let you make a choice, see what happens and try again. Both approaches give us a practical question to ask in education and health. What can someone actually learn or do here that would be harder to achieve another way?",
      "Thinking like a game designer also changes how you look at platforms. What does the interface reward? What choices does it give you? If the app celebrates you for showing up every day, does it care what you do when you get there? Once you start looking for the rules, a surprising number of apps start to look like games whose designers forgot to hand out the rulebook.",
      { h: "So, what makes a game South African?" },
      "Imagine a team in South Africa makes a game about a spaceship. The crew speaks English, the setting is a distant galaxy and the intended audience lives everywhere. Is it a South African game? Would your answer change if the crew spoke isiZulu? And what happens when developers feel they have to make their work recognisably South African before it gets counted as such?",
      "That question has a different bite when a game is built for a particular classroom or health setting. There, language, humour and familiar situations can shape whether the people it was made for can use it. A studio making a commercial game might face a different pressure altogether. How much of a story do you explain for an international audience, and how much do you trust players to figure out as they go?",
      { h: "Great, you made a game. Can anyone find it?" },
      "Getting a game onto Steam, PlayStation or even a mobile app store is one milestone. Getting it in front of someone who might love it is another. Search, recommendations and storefront placement can shape what people discover. That leaves game development programmes with a practical question. Alongside teaching students how to make a game, how can universities prepare them for the work of finding an audience and building a career?",
      "Even the way we count success could use a rethink. A player might spend dozens of hours in an international release without realising that South African developers helped build, illustrate or test it. If we look only for games released under a local studio's name, how much of the work happening here slips out of view?",
      "We saved some time for audience questions and ended with a fill-in-the-blank prompt that's harder than it looks. If you had to pick just one thing, what would you put in the space?",
      { quote: "The South African games industry needs more ________." },
    ],
  },
  {
    id: 6,
    category: "Announcement",
    date: "November 2026",
    title: "DiGRA South Africa Board Updates and Call for Nominations",
    excerpt:
      "We're inviting nominations for two Student Representatives, one Industry Representative and a Secretary. Nominations and self-nominations close on 31 January 2027.",
    slug: "board-call-for-nominations",
    deadline: "31 January 2027",
    body: [
      "DiGRA South Africa continues to grow as a vibrant community of researchers, educators, students, developers, and industry professionals interested in games, play, and interactive media. As our chapter expands its activities and prepares for future initiatives, we are inviting nominations to fill several vacancies on the Board.",
      "These appointments will help ensure that the Board remains representative of the diverse communities that contribute to game studies and games-related practice across South Africa.",
      { h: "Current Board vacancies" },
      "Nominations are invited for:",
      {
        list: [
          "Two Student Representative positions (undergraduate and/or postgraduate students)",
          "One Industry Representative position",
          "One Secretary position",
        ],
      },
      "We particularly encourage nominations from individuals who can bring diverse perspectives, experiences, disciplines, institutions, regions, and career stages to the chapter's leadership.",
      { h: "Who can be nominated?" },
      "Suitable nominees may include:",
      {
        list: [
          "Undergraduate or postgraduate students with an interest in game studies, game-based learning, game development, esports, interactive media, or related fields.",
          "Industry professionals working in game development, design, esports, educational technology, serious games, or related sectors.",
          "Community members who are passionate about supporting the growth and sustainability of DiGRA South Africa.",
        ],
      },
      "Both nominations and self-nominations are welcome.",
      { h: "Suggested candidates" },
      "During a recent Board discussion, several names were proposed as possible candidates:",
      {
        list: [
          "Crystal Ball for Industry Representative",
          "Vuyo for Student Representative",
          "Anusia Govender-Elshove for Secretary",
        ],
      },
      "These are not formal nominations but simply reflect names raised during discussion. Additional nominations are warmly encouraged.",
      { h: "Nomination process" },
      "To submit a nomination, please provide:",
      {
        list: [
          "The nominee's name",
          "Current affiliation or organisation",
          "A short biography",
          "A brief motivation for the nomination",
          "Confirmation that the nominee is willing to serve if appointed",
        ],
      },
      { quote: "Nominations close on 31 January 2027." },
      "Should more than one nomination be received for a position, a Board vote will be conducted in accordance with the chapter's governance processes.",
      { h: "Interested in getting involved?" },
      "If you are interested in serving on the DiGRA South Africa Board, or would like to learn more about any of the available positions, we encourage you to contact any current Board member for an informal discussion. Board members will be happy to answer questions about the roles, responsibilities, and opportunities associated with serving on the chapter's leadership team.",
      { h: "Growing our community" },
      "The continued growth of DiGRA South Africa depends on the energy and contributions of its members. By bringing new voices and perspectives into leadership, we can continue building an inclusive, collaborative, and impactful community that supports games scholarship, teaching, research, and industry engagement across the region.",
      "We look forward to welcoming new Board members and working together to shape the future of DiGRA South Africa.",
      { note: "Interested candidates can contact any DiGRA South Africa Board member before the closing date of 31 January 2027 to express their interest or discuss nomination opportunities." },
    ],
  },
  {
    id: 1,
    category: "Announcement",
    date: "2 June 2026",
    title: "DiGRA SA Launch Panel",
    excerpt:
      "DiGRA SA officially launched on 2 June 2026 with an online panel: Why Games Matter Here: Digital Games Research in South Africa and the Global South.",
    slug: "launch-panel",
    body: [
      "DiGRA SA officially launched on 2 June 2026 at 18:00 (SAST) with an online panel discussion titled: Why Games Matter Here: Digital Games Research in South Africa and the Global South.",
      "The launch panel brought together diverse voices to reflect on the relevance, impact, and future of digital games research in South Africa and across the Global South, spanning academia, industry, education, culture, and policy.",
      "DiGRA founding members and invited guests explored why games research matters here, and how local and Global South perspectives can contribute to and reshape global conversations in the field.",
    ],
  },
  {
    id: 4,
    category: "Event",
    date: "26 May 2026",
    title: "DiGRA South Africa Soft Launch",
    excerpt:
      "DiGRA SA held its soft launch on 26 May 2026, marking the beginning of a national and continent-facing community dedicated to game studies.",
    slug: "digra-sa-soft-launch",
    body: [
      "DiGRA South Africa (DiGRA SA), the official South African chapter of the Digital Games Research Association, held its soft launch on 26 May 2026.",
      "This soft launch marks the beginning of a national and continent-facing community dedicated to game studies, game research, and game-related academic activity. DiGRA SA brings together researchers, educators, students, industry practitioners, and creatives committed to growing African perspectives in global game studies.",
      "Register your interest to receive updates about upcoming events, membership opportunities, and ways to get involved.",
    ],
  },
  {
    id: 5,
    category: "Community",
    date: "April 2026",
    title: "DiGRA South Africa Founding Members Announced",
    excerpt:
      "DiGRA SA has formally convened its founding members, an important milestone in establishing the official South African chapter of DiGRA.",
    slug: "founding-members-announced",
    body: [
      "DiGRA South Africa (DiGRA SA) has formally convened its founding members, marking an important milestone in the establishment of the official South African chapter of the Digital Games Research Association.",
      "The founding group includes researchers and industry leaders from universities and creative organisations across South Africa, including:",
      {
        list: [
          "Amanda Jankowitz",
          "Oluwarotimi Randle",
          "Marguerite van der Merwe",
          "Bernice Beukes",
          "Andrea Hayes",
          "Veruschka Pelser-Carstens",
          "Lance Bunt",
          "Nick Hall",
          "Rachel van der Merwe",
          "Kyle Smith",
          "Herman van der Merwe",
          "Angus Davidson",
        ],
      },
      "The founding members held their first workshop on 13 April 2026, beginning the process of shaping DiGRA SA's mission, governance, and programmes. Further announcements about membership and activities will follow.",
    ],
  },
  {
    id: 2,
    category: "Announcement",
    date: "February 2025",
    title: "Announcing DiGRA South Africa",
    excerpt:
      "Introducing DiGRA South Africa: the official South African chapter of the Digital Games Research Association, building a home for game studies across the continent.",
    slug: "announcing-digra-sa",
    body: [
      "We are proud to announce the launch of DiGRA South Africa (DiGRA SA), the official South African chapter of the Digital Games Research Association (DiGRA).",
      "DiGRA SA has been established to build and connect a vibrant, sustainable ecosystem for game studies, game research, and game-related academic activity across South Africa and the African continent. As part of the international DiGRA network, the chapter creates a home for scholars, educators, students, designers, and industry partners interested in the study and practice of games and play.",
      { h: "Why DiGRA South Africa?" },
      "Game studies has grown rapidly worldwide, yet African perspectives, contexts, and research remain underrepresented in global conversations. DiGRA SA exists to change that by:",
      {
        list: [
          "Supporting research on games, play, and game cultures rooted in African contexts",
          "Connecting academia, industry, and creative practice",
          "Creating pathways for students and early-career researchers into international scholarship",
          "Hosting events, workshops, symposia, and game-related activities",
          "Amplifying African voices within global game studies networks",
        ],
      },
      { h: "What's next?" },
      "2026 marks DiGRA SA's founding year. Over the coming months we will be rolling out:",
      {
        list: [
          "A series of webinars and academic events",
          "Opportunities to become founding members",
          "Calls for participation in research, games, and special interest groups",
          "Formal announcements about membership, governance, and programmes",
        ],
      },
      "We invite researchers, students, educators, developers, and practitioners from South Africa and across the continent to join us in shaping the future of game studies in and from Africa.",
      "Stay connected: follow our updates, attend our upcoming events, and be part of this growing community.",
    ],
  },
]

export function getNewsBySlug(slug) {
  return news.find((n) => n.slug === slug)
}
