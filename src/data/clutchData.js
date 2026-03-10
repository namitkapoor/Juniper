/**
 * Clutch Case Study Data
 * Post-game analytics experience for padel sports tech
 */

export const clutchData = {
  projectId: 'clutch',

  // Hero Section
  hero: {
    imageSrc: '/images/Case Studies/CLUTCH/clutch-hero.png',
    posterSrc: '/images/Case Studies/CLUTCH/clutch-hero.png',
    subtitle: 'Designing a data-dense post-game experience that fuels competitive banter'
  },

  // Project Metadata
  meta: {
    role: 'Head of Product Design (Interview Exercise)',
    timeline: 'Multi-week design sprint',
    team: 'Solo designer, stakeholder collaboration',
    platform: 'iOS (iPhone 15 Pro)',
    impact: 'Rejected — but demonstrated systems thinking depth',
    context: 'AI court cameras for padel'
  },

  // Overview
  overview: {
    title: 'The Challenge',
    paragraphs: [
      'Clutch has AI-powered court cameras that capture every padel match. They needed a post-game experience for competitive players aged 35–55 — people who live for the numbers and the WhatsApp group chat after a match.',
      'The brief was clear: show players what happened, make the data meaningful, and give them something worth sharing. The tricky part was balancing analytical depth with the social, competitive energy that makes padel culture unique.'
    ],
    image: {
      src: '/images/Case Studies/CLUTCH/s1-match-overview.png',
      alt: 'Match overview screen showing stats grid with winners, errors, distance, and rally metrics',
      caption: 'The final S1 match overview — data-first, built for competitive players'
    }
  },

  // The Pivot - V1 to V2
  pivot: {
    title: 'The Pivot: From Celebration to Data',
    paragraphs: [
      'My first submission leaned into a Duolingo-style celebratory tone — gamified, colorful, encouraging. The founder\'s feedback was direct: "This isn\'t right. Our users are competitive players. They want Strava, not Duolingo."',
      'That feedback reframed everything. These players don\'t need encouragement — they need ammunition. Stats to dissect with their partner, metrics to throw at opponents, data that fuels the post-match conversation.'
    ],
    before: {
      src: '/images/Case Studies/CLUTCH/v2-data-first.png',
      alt: 'V1 gamified design with celebratory UI, colorful badges and encouraging tone',
      caption: 'V1: Too celebratory — missed the competitive player mindset'
    },
    after: {
      src: '/images/Case Studies/CLUTCH/v1-gamified.png',
      alt: 'V2 data-first redesign with dense analytics, dark theme, and performance metrics',
      caption: 'V2: Data-first — designed for players who live in the numbers'
    }
  },

  // Information Architecture
  ia: {
    title: 'Four Screens, Three Entry Points',
    paragraphs: [
      'The post-game experience is a 4-screen flow: Match Overview → Match Card & Player Detail → Video Browser → Progress. Players can enter from a push notification after a match, the Community tab, or their Profile.',
      'Every screen serves a different need — quick glance, deep comparison, video sharing, and long-term tracking. The architecture had to support both the "30 seconds in the car park" check and the "20 minutes on the sofa" deep dive.'
    ],
    image: {
      src: '/images/Case Studies/CLUTCH/ia-flow.png',
      alt: 'Information architecture diagram showing 4-screen flow from Match Overview to Progress',
      caption: 'S1 → S2 → S3 → S4: each screen serves a different depth of engagement'
    }
  },

  // Key Interaction: Expandable Stat Cards
  expandableCards: {
    title: 'Expandable Stat Cards: Data on Demand',
    paragraphs: [
      'The core challenge was density vs. clarity. Players want to see everything at a glance, but "everything" is a lot — winners, errors, W/E ratio, distance, calories, rally length, each with breakdowns, comparisons, and AI insights.',
      'The solution: collapsed cards show the headline number with enough context to be useful. Tap to expand and get comparison bars against your opponent, sparklines of your last 10 matches, tier reference lines, and a one-line AI insight. The data is always there — you just choose how deep to go.'
    ],
    image: {
      src: '/images/Case Studies/CLUTCH/expanded-stat-card-detail.png',
      alt: 'Expanded stat card showing comparison bars, sparkline trends, and AI insight text',
      caption: 'Collapsed → expanded: headline number → full context with comparison, trend, and AI insight'
    },
    details: [
      { stat: 'Winners', insight: 'Shot-type breakdown — "7 of 11 from net play"' },
      { stat: 'Errors', insight: 'By shot type — "Backhand drives = 48% of errors"' },
      { stat: 'W/E Ratio', insight: 'Semicircle gauge with your avg + tier reference' },
      { stat: 'Distance', insight: '4-player comparison + "62% lateral movement"' },
      { stat: 'Calories', insight: 'Equivalence — "≈30 min running" + per-set split' },
      { stat: 'Avg Rally', insight: 'Distribution histogram + longest rally with video link' }
    ]
  },

  // Key Interaction: Multi-Select Player Comparison
  multiSelect: {
    title: 'Multi-Select: Select Any Number of Players, Know Your Comparison',
    paragraphs: [
      'The original design used a Pair/Partner segmented control — but partners play complementary roles, so raw stat comparison between them is misleading. A "Baseline Grinder" and a "Net Attacker" will always have different numbers.',
      'The redesign lets you tap any 2 of 4 players to compare. That\'s 6 possible pairings — you vs. your opponent, you vs. your partner, cross-team matchups. Three states: no selection, one player highlighted, two players with a full comparison panel. This is where the banter lives.'
    ],
    image: {
      src: '/images/Case Studies/CLUTCH/multi-select-interaction.png',
      alt: 'Three states of multi-select: no selection, one player selected with green border, two players compared with side-by-side stats',
      caption: 'State 0 → State 1 → State 2: select any two players for head-to-head comparison'
    },
    comparisonDetails: [
      'Side-by-side bars for Winners, Errors, W/E Ratio, Distance, Calories',
      'Two mini donut charts showing shot distribution',
      'Two mini court POVs for shot placement',
      'AI comparison insight — "NK dominated net play while CM controlled baseline rallies"'
    ]
  },

  // Screen Walkthroughs
  screens: {
    s2: {
      title: 'S2: Match Card — The Social Layer',
      paragraphs: [
        'The match card is where data meets banter. Each player row shows their avatar, name, style label ("Baseline Grinder", "Net Attacker"), and one signature stat. The MVP gets a crown.',
        'Share Match Card exports the current view as a static image for WhatsApp or iMessage — designed for the group chat moment right after the match.'
      ],
      image: {
        src: '/images/Case Studies/CLUTCH/s2-match-card-default.png',
        alt: 'Match card showing 4 players in a team layout with style labels and signature stats',
        caption: 'Player rows with style labels and signature stats — built for sharing'
      },
      comparisonImage: {
        src: '/images/Case Studies/CLUTCH/s2-comparison-panel.png',
        alt: 'Comparison panel showing two selected players with side-by-side performance metrics',
        caption: 'Two players selected — full comparison panel with stats, shot distribution, and court POVs'
      }
    },
    s3: {
      title: 'S3: Video Browser — Three States, One Purpose',
      paragraphs: [
        'Video had a format problem: players browse in portrait, share in portrait (9:16 for stories), but watch in landscape (16:9 for analysis). Instead of forcing one format, the browser adapts: Browse shows letterboxed 16:9 with swipable thumbnails below, Share fills 9:16 with a prominent share CTA, and Watch goes landscape.',
        'Four swipable categories — AI Highlights, Your Highlights, Personalized, Full Match — with the Full Match view replacing thumbnails with a timeline scrubber and chapter markers.'
      ],
      browseImage: {
        src: '/images/Case Studies/CLUTCH/s3-video-browse.png',
        alt: 'Video browser in portrait browse mode with 16:9 video letterboxed and category thumbnails below',
        caption: 'Browse state: 16:9 letterboxed with swipable category thumbnails'
      },
      shareImage: {
        src: '/images/Case Studies/CLUTCH/s3-video-share.png',
        alt: 'Video browser in share mode with 9:16 fullscreen video and share CTA',
        caption: 'Share state: 9:16 fills screen for stories and group chat sharing'
      }
    },
    s4: {
      title: 'S4: Progress — The Long Game',
      paragraphs: [
        'The Clutch Score (e.g. 4.7, "Upper Intermediate") is the vanity metric — something to chase and brag about. Below it, score drivers show what\'s pulling the number up (winners, shot variety, court coverage) and what\'s dragging it down (errors, W/E ratio).',
        'A trend chart over the last 10 matches with tier boundary lines gives trajectory. Strength and Growth Area cards provide actionable insight. And the Smart Match suggestion — recommending an opponent based on complementary weaknesses — closes the loop back to playing.'
      ],
      image: {
        src: '/images/Case Studies/CLUTCH/s4-progress.png',
        alt: 'Progress screen showing Clutch Score, trend chart, score drivers, and smart match suggestion',
        caption: 'Clutch Score + trend — tracking long-term improvement'
      },
      smartMatchImage: {
        src: '/images/Case Studies/CLUTCH/s4-smart-suggestion.png',
        alt: 'Smart match suggestion showing recommended opponent with complementary weaknesses and book match CTA',
        caption: 'Smart Match: suggests opponents based on complementary weaknesses — keeps players coming back'
      }
    }
  },

  // Court Data
  courtData: {
    title: 'Court POV Visualizations',
    paragraphs: [
      'Shot patterns use a behind-the-baseline POV with scatter dots on the opponent\'s side — green for winners, red for errors, gray for neutral. Zone labels show left/center/right percentages, and filter pills let you isolate by shot type.',
    ],
    image: {
      src: '/images/Case Studies/CLUTCH/court-shot-patterns.png',
      alt: 'Court POV visualization showing shot placement scatter dots with winner/error color coding',
      caption: 'Shot patterns: behind-the-baseline POV with color-coded placement data'
    }
  },

  // Reflection
  reflection: {
    title: 'What I\'d Do Differently',
    paragraphs: [
      'The project was ultimately rejected, but the depth of the systems thinking — multi-select comparison logic, three-state video browser, progressive disclosure stat cards — resonated with the stakeholder throughout the process.',
      'The V1-to-V2 pivot was the most valuable lesson: knowing your users isn\'t optional. My initial instinct was wrong. Competitive 35-55 year old padel players don\'t want to be congratulated — they want data that fuels their competitive edge and their post-match group chat.'
    ],
    learnings: [
      {
        title: 'Design for the group chat, not just the user',
        description: 'The most engaged moment isn\'t when a player checks their stats — it\'s when they screenshot and send to the WhatsApp group. Every screen had to be worth sharing.'
      },
      {
        title: 'Kill your darlings early',
        description: 'The Duolingo approach wasn\'t bad design — it was wrong design. Recognizing the mismatch quickly and pivoting completely was more valuable than iterating on the wrong direction.'
      },
      {
        title: 'Density isn\'t the enemy of usability',
        description: 'Progressive disclosure (expandable cards, multi-select states) lets you pack real analytical depth into a mobile experience without overwhelming on first glance.'
      }
    ]
  },

  // Next Project
  nextProject: {
    title: 'Improve Beauty School Enrollment',
    description: 'How user research killed my clever bento grid and led to a 143% increase in enrollments',
    href: '/case-study/christine-valmy',
    videoSrc: '/videos/Case Studies/CV/christine-valmy-laptop.mp4',
    coverImage: '/images/Project Cover Photos/CV on Laptop.png'
  }
};

export default clutchData;
