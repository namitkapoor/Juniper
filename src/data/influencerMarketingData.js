/**
 * Influencer Marketing Case Study Data
 * B2B platform for tracking influencer campaigns
 * Narrative: Motion design explorations that didn't ship
 */

export const influencerMarketingData = {
  projectId: 'influencerMarketing',

  // Hero Section
  hero: {
    videoSrc: '/videos/Case Studies/MI/MI on laptop.mp4',
    webmSrc: '/videos/Case Studies/IM/im-hero-subway.webm',
    posterSrc: '/images/Case Studies/IM/im-hero-poster.jpg',
    subtitle: 'How elaborate motion design explorations taught me when NOT to animate'
  },

  // Project Metadata
  meta: {
    role: 'UX Designer + Motion Designer',
    timeline: '6 weeks (May - July 2023)',
    team: '1 designer (me), 1 PM, 4 Developers',
    platform: 'Web Application (B2B SaaS)',
    impact: '28% fewer missed milestones',
    challenge: 'Shipped static, learned about motion'
  },

  // Overview / Challenge Section
  overview: {
    title: 'The Challenge',
    paragraphs: [
      'My Influency helps small businesses manage influencer marketing campaigns. The problem: users were missing critical milestones because they couldn\'t quickly understand where each influencer was in the campaign pipeline.',
      'The existing interface used a simple table with text status labels. Users had to read each row carefully to understand progress—cognitive overhead that led to missed deadlines and frustrated clients.'
    ],
    image: {
      src: '/images/Case Studies/MI/Original Design/old design campaign.svg',
      alt: 'Original table-based interface with text status labels',
      caption: 'The original interface: functional but required careful reading to understand status'
    }
  },

  // Pain Points
  painPoints: [
    {
      title: 'Campaign Managers',
      icon: '/images/Case Studies/MI/logo/campaign-manager.svg',
      items: [
        'Managing 10-50 influencers per campaign',
        'Missing milestone deadlines buried in tables',
        'No quick way to see "what needs attention"',
        'Context switching between email and platform'
      ]
    },
    {
      title: 'Interface Problems',
      icon: '/images/Case Studies/MI/logo/interface-problems.svg',
      items: [
        'Text-heavy status required reading each row',
        'No visual hierarchy for urgent items',
        'All influencers looked equally important',
        'Progress not scannable at a glance'
      ]
    }
  ],

  // The Subway Metaphor
  subwayMetaphor: {
    title: 'The Subway Metaphor',
    intro: 'I proposed visualizing campaign progress as a subway line. Each influencer is a "train" moving through stations (milestones). The metaphor clicked immediately with stakeholders.',
    explanation: [
      'Each campaign is a subway line with 5 stations: Contract → Content Brief → Draft Review → Revisions → Published',
      'Influencers are "trains" that move along the line as they complete milestones',
      'Color indicates status: on track (green), delayed (yellow), blocked (red)',
      'The spatial layout lets you see all progress at once—no reading required'
    ],
    video: {
      src: '/videos/Case Studies/MI/Campaign-tracking.mp4',
      alt: 'Subway line visualization showing influencers as trains at different stations',
      caption: 'The subway metaphor: campaigns as lines, influencers as trains, milestones as stations'
    }
  },

  // Motion Design Explorations
  motionExplorations: {
    title: 'Motion Design Explorations',
    intro: 'With the subway metaphor approved, I got excited about animation opportunities. Trains should move! Stations should pulse! I spent 2 weeks creating elaborate motion concepts.',
    explorations: [
      {
        title: 'Exploration 1: Stage Progression Animation',
        description: 'When an influencer completes a milestone, their "train" would animate smoothly to the next station with a satisfying arrival animation.',
        animationPath: '/lottie/im-train-progression.json',
        technicalNote: 'Built in After Effects, exported via Bodymovin. 60fps, 2.3 second duration. Train uses spring easing (tension: 180, friction: 12) for playful arrival bounce.',
        verdict: 'Didn\'t ship',
        reason: 'Status updates happen in batches (CSV import). Animating 30 trains simultaneously was chaotic, not delightful.'
      },
      {
        title: 'Exploration 2: Attention-Seeking Pulse',
        description: 'Blocked or delayed trains would pulse with a subtle glow, drawing the eye without being annoying.',
        animationPath: '/lottie/im-attention-pulse.json',
        technicalNote: 'CSS animation with box-shadow and scale. 3 second loop, ease-in-out. Tested at 0.5x, 1x, and 2x speed to find the "noticeable but not distracting" sweet spot.',
        verdict: 'Shipped (modified)',
        reason: 'Simplified to a static red dot with subtle CSS pulse. The elaborate glow was distracting when multiple items needed attention.'
      },
      {
        title: 'Exploration 3: New Contract Line Drawing',
        description: 'When a new influencer is added, the subway line would "draw" from the start, with the train appearing at the first station.',
        animationPath: '/lottie/im-line-drawing.json',
        technicalNote: 'SVG stroke-dasharray animation. Line draws over 1.5 seconds, train fades in at 1.2 seconds for overlap. Easing: cubic-bezier(0.25, 0.1, 0.25, 1).',
        verdict: 'Didn\'t ship',
        reason: 'Users add influencers in bulk. The "wow" moment of one animated entry became tedious when adding 20 influencers.'
      }
    ]
  },

  // Technical Reality Check
  technicalReality: {
    title: 'Why the Animations Didn\'t Ship',
    intro: 'After presenting my motion concepts, the engineering team raised valid concerns. Here\'s why we scaled back:',
    reasons: [
      {
        title: 'Batch Operations',
        description: 'Users import influencers via CSV and update statuses in bulk. Animating 30+ items simultaneously created visual chaos instead of clarity.',
        icon: 'batch'
      },
      {
        title: 'Performance Budget',
        description: 'The app needed to run on budget laptops with 50+ influencers visible. Complex animations would drop frames and feel sluggish.',
        icon: 'performance'
      },
      {
        title: 'Development Time',
        description: 'Implementing smooth, interruptible animations would add 3 weeks to the timeline. The static version shipped faster with the same usability gains.',
        icon: 'time'
      },
      {
        title: 'Diminishing Returns',
        description: 'User testing showed the spatial layout itself (not the animation) drove the usability improvement. Animation was polish, not substance.',
        icon: 'chart'
      }
    ]
  },

  // What Actually Shipped
  whatShipped: {
    title: 'What Actually Shipped',
    intro: 'The final design kept the subway metaphor but used strategic micro-animations instead of elaborate transitions.',
    beforeImage: {
      src: '/images/Case Studies/IM/im-before-table.jpg',
      alt: 'Original table view with text status labels'
    },
    afterImage: {
      src: '/images/Case Studies/IM/im-after-subway.jpg',
      alt: 'New subway line visualization with color-coded status'
    },
    caption: 'Before: text-heavy table. After: scannable subway visualization with strategic color and minimal animation.'
  },

  // Micro-animations that DID ship
  microInteractions: [
    {
      animationPath: '/lottie/im-hover-expand.json',
      title: 'Hover to Expand',
      description: 'Hovering over a train reveals the influencer\'s name and next milestone. 150ms transition, no spring physics—just smooth and predictable.',
      ariaLabel: 'Animation showing train card expanding on hover',
      loop: true
    },
    {
      animationPath: '/lottie/im-status-badge.json',
      title: 'Status Badge Pulse',
      description: 'Blocked items get a subtle red pulse (CSS only). Just enough to draw attention without being annoying on a screen full of items.',
      ariaLabel: 'Animation showing subtle pulse on blocked status badge',
      loop: true
    },
    {
      animationPath: '/lottie/im-drag-feedback.json',
      title: 'Drag Reorder Feedback',
      description: 'When dragging to reorder priority, the dragged item lifts with a shadow and other items smoothly make space. Standard drag-drop affordance.',
      ariaLabel: 'Animation showing drag and drop reordering interaction',
      loop: false
    },
    {
      animationPath: '/lottie/im-filter-transition.json',
      title: 'Filter Transition',
      description: 'When filtering by status, items fade out/in with staggered timing. Helps users track what changed without jarring layout shifts.',
      ariaLabel: 'Animation showing filtered items fading in with stagger',
      loop: false
    }
  ],

  // Design Iterations
  iterations: [
    {
      title: 'Iteration 1: From Table to Timeline',
      beforeImage: {
        src: '/images/Case Studies/IM/im-iter1-before.jpg',
        alt: 'Original table layout'
      },
      afterImage: {
        src: '/images/Case Studies/IM/im-iter1-after.jpg',
        alt: 'First timeline visualization attempt'
      },
      caption: 'First attempt at visualizing progress. Users liked seeing all statuses at once but found the horizontal scroll problematic.',
      technicalNote: 'Horizontal scrolling tested poorly—users missed influencers off-screen. Pivoted to vertical subway layout that fits in viewport.',
      fix: 'Changed to vertical layout with all influencers visible. Horizontal scrolling only for the timeline portion within each card.'
    },
    {
      title: 'Iteration 2: Color System Refinement',
      beforeImage: {
        src: '/images/Case Studies/IM/im-iter2-before.jpg',
        alt: 'Initial color system with 5 status colors'
      },
      afterImage: {
        src: '/images/Case Studies/IM/im-iter2-after.jpg',
        alt: 'Simplified 3-color system'
      },
      caption: 'Reduced from 5 status colors to 3. Users only cared about: fine, needs attention, blocked.',
      technicalNote: 'Original system: green (complete), blue (in progress), yellow (pending), orange (delayed), red (blocked). Users couldn\'t remember the difference between yellow and orange. Simplified to: green (on track), yellow (attention), red (blocked).',
      fix: 'Three colors only. Any status that needs action is yellow. Only truly blocked items are red. Everything else is green.'
    }
  ],

  // Iteration Stats
  iterationStats: {
    totalIterations: '6 design versions',
    motionConcepts: '3 elaborate animations designed',
    motionShipped: '4 micro-interactions (CSS only)',
    designTime: '2 weeks on motion (mostly cut)'
  },

  // Results
  results: [
    {
      number: '28%',
      icon: '/images/Case Studies/MI/logo/fewer-milestones.svg',
      label: 'Fewer Missed Milestones',
      description: 'Users caught deadline risks earlier with visual status'
    },
    {
      number: '45%',
      icon: '/images/Case Studies/MI/logo/hourglass.svg',
      label: 'Faster Status Scanning',
      description: 'Time to identify "needs attention" items reduced'
    },
    {
      number: '3 sec',
      icon: '/images/Case Studies/MI/logo/glance-time.svg',
      label: 'Glance Understanding',
      description: 'Average time to understand campaign health'
    },
    {
      number: '0',
      icon: '/images/Case Studies/MI/logo/motion.svg',
      label: 'Elaborate Animations',
      description: 'Complex motion concepts that shipped (honest metric)'
    }
  ],

  // Results Metadata
  resultsMeta: {
    measurementPeriod: '8 weeks post-launch',
    baseline: 'Previous table-based interface',
    testParticipants: '12 campaign managers',
    methodology: 'A/B test + qualitative interviews'
  },

  // User Quotes
  userQuotes: [
    {
      text: 'I can finally see my whole campaign at once. Before, I had to scroll through a table and remember who was where. Now I just look at the colors.',
      cite: '— Jessica, Marketing Agency Owner'
    },
    {
      text: 'The red dots actually make me check on blocked influencers. Before, those rows just blended in with everything else.',
      cite: '— Marcus, Campaign Manager'
    }
  ],

  // Honest Learnings
  learnings: [
    {
      title: 'Motion is a Tool, Not a Goal',
      description: 'I spent 2 weeks on animations that didn\'t ship. The spatial layout—not the animation—drove usability gains. Animation should serve the user, not the designer\'s portfolio.'
    },
    {
      title: 'Design for Batch Operations',
      description: 'Single-item animations feel delightful in prototypes. Real users import 30 influencers at once. Design for the common case, not the demo.'
    },
    {
      title: 'CSS > Lottie for UI Animation',
      description: 'The micro-animations that shipped were all CSS. Faster to implement, easier to tune, better performance. Save Lottie for illustrations, not UI feedback.'
    },
    {
      title: 'Static Can Be Enough',
      description: 'The subway visualization worked because of spatial layout and color—not animation. Sometimes the best motion design decision is choosing not to animate.'
    }
  ],

  // Retrospective - What I'd Do Differently
  retrospective: [
    '1. Prototype with real data volumes (30+ items) from day one',
    '2. Check with engineering before deep-diving on animation',
    '3. Time-box motion explorations (1 day, not 2 weeks)',
    '4. Test static version first—add animation only if needed'
  ],

  // Motion Design Graveyard - The animations that didn't ship
  motionGraveyard: {
    title: 'The Motion Design Graveyard',
    intro: 'These concepts live in my portfolio, not in production. Each taught me something about when animation helps vs. when it\'s just showing off.',
    items: [
      {
        name: 'Train Arrival Bounce',
        description: 'Spring physics when train reaches station',
        whyCut: 'Felt playful in isolation, chaotic with 30 trains'
      },
      {
        name: 'Line Drawing Onboarding',
        description: 'Animated explanation of the subway metaphor',
        whyCut: 'Users understood the metaphor instantly—no explanation needed'
      },
      {
        name: 'Celebration Confetti',
        description: 'Confetti burst when campaign completes',
        whyCut: 'Felt patronizing for B2B users completing routine work'
      }
    ]
  },

  // Next Project
  nextProject: {
    title: 'Enroll More Students',
    description: 'AI enrollment assistant where user research killed my favorite design',
    href: '/case-study/christine-valmy'
  }
};

export default influencerMarketingData;
