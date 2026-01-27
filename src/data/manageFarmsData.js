/**
 * Manage Small Farms Case Study Data
 * Mobile app for low-literacy farmers with accessibility constraints
 */

export const manageFarmsData = {
  projectId: 'manageFarms',

  // Hero Section
  hero: {
    videoSrc: '/videos/Case Studies/JD/Animations/Farmer w: phone anim-left.mp4',
    webmSrc: '/videos/Case Studies/JD/mf-hero.webm',
    posterSrc: '/images/Case Studies/JD/mf-hero-poster.jpg',
    subtitle: 'How accessibility constraints led to a cleaner, more intuitive farm management app'
  },

  // Project Metadata
  meta: {
    role: 'UX Designer + Researcher',
    timeline: '4 months (Aug - Dec 2022)',
    team: '2 Designers, 2 Researchers',
    platform: 'iOS Mobile App',
    impact: 'SUS Score: 70 (Above Average)',
    methods: 'Field studies, usability testing, A/B testing'
  },

  // Overview / Challenge Section
  overview: {
    title: 'The Challenge',
    paragraphs: [
      'John Deere\'s existing farm management app was built for large commercial operations with dedicated office staff. Small farm owners—often working alone in the field with dirty hands and bright sunlight—couldn\'t effectively use it.',
      'The app required reading dense text, navigating complex menus, and inputting precise data. For farmers with limited literacy or those who spoke English as a second language, these barriers meant the app sat unused while paper notebooks remained the default.'
    ],
    image: {
      src: '/images/Case Studies/JD/OCM Original app.svg',
      alt: 'Screenshot of the original complex farm management interface with dense menus',
      caption: 'The original app: designed for desk work, not field work'
    }
  },

  // Pain Points
  painPoints: [
    {
      title: 'Small Farm Owners',
      items: [
        'Working in bright sunlight with dirty/wet hands',
        'Limited time between physical tasks',
        'Varying literacy levels and languages',
        'No dedicated office or desk space'
      ]
    },
    {
      title: 'Existing App Problems',
      items: [
        'Small tap targets required precision',
        'Text-heavy interface hard to scan',
        'No offline functionality for remote fields',
        'Complex navigation buried key features'
      ]
    }
  ],

  // User Research Section
  userResearch: {
    visualCards: [
      {
        step: 1,
        src: '/images/Case Studies/JD/Team at JD Dealership 2.jpg',
        alt: 'Researcher observing farmer using phone in field'
      },
      {
        step: 2,
        src: '/images/Case Studies/JD/me at farmers market.jpg',
        alt: 'Affinity mapping session with research insights'
      },
      {
        step: 3,
        src: '/images/Case Studies/JD/first interview w sam.jpg',
        alt: 'Design principles document showing visual hierarchy'
      }
    ],
    contentBlocks: [
      {
        trigger: 1,
        title: 'Going to the Field',
        paragraphs: [
          'We spent 2 weeks visiting 8 small farms across different regions. Instead of asking farmers to describe their workflow, we observed them in action—during planting, harvesting, and daily maintenance.',
          'Key observation method: We asked farmers to "think aloud" while checking their crops, noting every moment they reached for their phone, a notebook, or asked for help.'
        ],
        highlight: 'Critical insight: Farmers checked their phones in 30-second bursts between physical tasks, not during dedicated "app time."'
      },
      {
        trigger: 2,
        title: 'Three Key Insights',
        findings: [
          { stat: 'Insight 1: Glanceability', description: 'Farmers needed to understand status in under 3 seconds—no reading required' },
          { stat: 'Insight 2: Spatial Thinking', description: 'Farmers think in terms of physical location ("the tomatoes by the fence"), not categories' },
          { stat: 'Insight 3: Forgiveness', description: 'Dirty hands and bright sun meant frequent mistaps—the app needed to be forgiving' }
        ],
        quote: {
          text: 'I don\'t have time to read paragraphs. Show me red or green—that\'s all I need to know if something\'s wrong.',
          cite: '— Miguel, vegetable farmer, 12 years experience'
        }
      },
      {
        trigger: 3,
        title: 'Design Principles',
        paragraphs: [
          'From our research, we developed four design principles that guided every decision:'
        ],
        kept: [
          { title: 'Show, Don\'t Tell', description: 'Use color, icons, and spatial layout instead of text' },
          { title: 'Think Spatially', description: 'Organize information by physical location on the farm' },
          { title: 'Go Big', description: 'Minimum 48px tap targets, high contrast colors' },
          { title: 'Forgive Mistakes', description: 'Easy undo, confirmation for destructive actions' }
        ],
        lesson: 'These principles became our north star—every design decision was evaluated against them.'
      }
    ]
  },

  // Design Principles (expanded section)
  designPrinciples: [
    {
      title: 'Show, Don\'t Tell',
      description: 'Replace text with visual indicators wherever possible. Color-coded status, iconography, and spatial relationships communicate faster than words.',
      icon: 'eye',
      example: 'Plant health shown as green/yellow/red dots instead of "Healthy/Needs attention/Critical"'
    },
    {
      title: 'Think Spatially',
      description: 'Mirror the physical layout of the farm. Users tap on a visual map to access bed details, matching their mental model of walking through fields.',
      icon: 'map',
      example: 'Main navigation is a top-down farm map, not a list of categories'
    },
    {
      title: 'Go Big',
      description: 'All interactive elements are minimum 48x48px. High contrast colors work in direct sunlight. Text is secondary to visual hierarchy.',
      icon: 'resize',
      example: 'Action buttons are 64px tall with 4.5:1 contrast ratio minimum'
    },
    {
      title: 'Forgive Mistakes',
      description: 'Dirty hands and glare cause mistaps. Every action can be undone within 5 seconds. Destructive actions require explicit confirmation.',
      icon: 'undo',
      example: 'Swipe-to-delete shows "Undo" toast for 5 seconds before committing'
    }
  ],

  // Map View Design
  mapView: {
    title: 'The Map View: Spatial Navigation',
    intro: 'The centerpiece of the redesign is a top-down map of the farm. Instead of navigating menus, farmers tap directly on plant beds to see details and take actions.',
    features: [
      {
        title: 'Color-Coded Status',
        description: 'Each bed shows health at a glance: green (healthy), yellow (needs attention), red (urgent). No reading required.'
      },
      {
        title: 'Tap to Expand',
        description: 'Tapping a bed reveals a detail card with recent activity, upcoming tasks, and quick actions.'
      },
      {
        title: 'Offline-First',
        description: 'The map and recent data are cached locally. Changes sync when connection returns.'
      }
    ],
    image: {
      src: '/images/Case Studies/JD/Redesigns/Map.png',
      alt: 'Farm map view showing color-coded plant beds with status indicators',
      caption: 'The map view: farmers tap beds to see details, matching how they think about their land'
    }
  },

  // Design Iterations
  iterations: [
    {
      title: 'Iteration 1: Icon-Only Navigation',
      beforeImage: {
        src: '/images/Case Studies/JD/mf-nav-before.jpg',
        alt: 'Original text-based navigation menu'
      },
      afterImage: {
        src: '/images/Case Studies/JD/mf-nav-after.jpg',
        alt: 'New icon-based navigation with large tap targets'
      },
      caption: 'Navigation reduced from 8 text items to 4 large icons. Testing showed 40% faster task completion.',
      technicalNote: 'Icons tested with 20 users across 3 literacy levels. We iterated on the "Tasks" icon 4 times before landing on a checklist that tested well universally.',
      fix: 'Replaced hamburger menu with persistent bottom navigation. Each icon is 64px with a subtle text label below for accessibility.'
    },
    {
      title: 'Iteration 2: Status Visualization',
      beforeImage: {
        src: '/images/Case Studies/JD/mf-status-before.jpg',
        alt: 'Text-based status list showing plant health'
      },
      afterImage: {
        src: '/images/Case Studies/JD/mf-status-after.jpg',
        alt: 'Color-coded visual status with iconography'
      },
      caption: 'Replaced text status with color + icon system. "Critical" became a red circle with exclamation mark.',
      technicalNote: 'Colors chosen for colorblind accessibility (tested with Coblis simulator). Added pattern/icon as secondary indicator—never color alone.',
      fix: 'Triple-coded all status: color + icon + position. Works for colorblind users and in bright sunlight where colors wash out.'
    },
    {
      title: 'Iteration 3: Task Input Simplification',
      beforeImage: {
        src: '/images/Case Studies/JD/mf-input-before.jpg',
        alt: 'Complex form with multiple text fields'
      },
      afterImage: {
        src: '/images/Case Studies/JD/mf-input-after.jpg',
        alt: 'Simplified input with large buttons and voice option'
      },
      caption: 'Reduced task creation from 6 fields to 3 taps. Added voice input as primary option.',
      technicalNote: 'Voice input uses on-device speech recognition (no network required). Supports English and Spanish with automatic language detection.',
      fix: 'Made voice input the default, with manual entry as fallback. Most farmers preferred speaking over typing with dirty hands.'
    }
  ],

  // Iteration Stats
  iterationStats: {
    totalIterations: '8 major versions',
    userTests: '4 rounds, 24 farmers total',
    featuresCut: '12 (simplified to essentials)',
    accessibilityScore: 'WCAG AA compliant'
  },

  // Micro-interactions
  microInteractions: [
    {
      animationPath: '/lottie/mf-bed-tap.json',
      title: 'Bed Selection Feedback',
      description: 'When a farmer taps a plant bed, it pulses and lifts slightly before expanding. This 200ms feedback confirms the tap registered—critical for uncertain touches with wet hands.',
      ariaLabel: 'Animation showing plant bed responding to tap with pulse and lift',
      loop: true
    },
    {
      animationPath: '/lottie/mf-status-change.json',
      title: 'Status Transition',
      description: 'When plant status changes (e.g., watered), the color smoothly transitions with a subtle particle effect. This celebrates the action and confirms the update.',
      ariaLabel: 'Animation showing status color transitioning from yellow to green',
      loop: false
    },
    {
      animationPath: '/lottie/mf-voice-listening.json',
      title: 'Voice Input Active',
      description: 'Sound waves animate while voice input is active. Amplitude responds to actual input volume, giving real-time feedback that the mic is working.',
      ariaLabel: 'Animation showing sound wave visualization during voice input',
      loop: true
    }
  ],

  // Accessibility Features
  accessibilityFeatures: [
    {
      title: 'Voice Input',
      description: 'Speak tasks and notes instead of typing. Works offline with on-device processing.',
      icon: 'mic'
    },
    {
      title: 'Screen Reader Optimized',
      description: 'Full VoiceOver/TalkBack support with meaningful labels and logical focus order.',
      icon: 'accessibility'
    },
    {
      title: 'High Contrast Mode',
      description: 'Optional high contrast theme for bright sunlight. All text meets WCAG AAA (7:1 ratio).',
      icon: 'contrast'
    },
    {
      title: 'Offline Capable',
      description: 'Core features work without internet. Data syncs automatically when connection returns.',
      icon: 'cloud-offline'
    },
    {
      title: 'Large Touch Targets',
      description: 'Minimum 48px targets, with primary actions at 64px. Spacing prevents accidental taps.',
      icon: 'hand-pointer'
    },
    {
      title: 'Bilingual Support',
      description: 'Full Spanish translation. Voice input auto-detects language.',
      icon: 'language'
    }
  ],

  // Final Design
  finalDesign: {
    title: 'The Final Design',
    intro: 'After 8 iterations and 4 rounds of testing with real farmers, we shipped an app that prioritizes glanceability, spatial thinking, and forgiveness.',
    screens: [
      {
        src: '/images/Case Studies/JD/mf-final-map.jpg',
        alt: 'Final map view with color-coded beds',
        caption: 'Map View: The primary interface'
      },
      {
        src: '/images/Case Studies/JD/mf-final-detail.jpg',
        alt: 'Bed detail view with status and actions',
        caption: 'Bed Detail: Quick status and actions'
      },
      {
        src: '/images/Case Studies/JD/mf-final-tasks.jpg',
        alt: 'Task list with visual status indicators',
        caption: 'Tasks: Visual checklist'
      },
      {
        src: '/images/Case Studies/JD/mf-final-voice.jpg',
        alt: 'Voice input interface',
        caption: 'Voice Input: Hands-free operation'
      }
    ]
  },

  // Results
  results: [
    {
      number: '70',
      label: 'SUS Score',
      description: 'System Usability Scale score (industry average: 68)'
    },
    {
      number: '40%',
      label: 'Faster Task Completion',
      description: 'Compared to previous app version'
    },
    {
      number: '3 sec',
      label: 'Average Glance Time',
      description: 'Time to understand farm status from map view'
    },
    {
      number: '89%',
      label: 'Task Success Rate',
      description: 'First-time users completing core tasks without help'
    }
  ],

  // Results Metadata
  resultsMeta: {
    measurementPeriod: '6 weeks post-launch',
    testParticipants: '8 farmers across 3 regions',
    baseline: 'Previous app version (SUS: 52)',
    methodology: 'In-field usability testing + analytics'
  },

  // User Quotes
  userQuotes: [
    {
      text: 'I can actually use this with one hand while I\'m carrying a crate. The big buttons and colors make sense even when the sun\'s in my eyes.',
      cite: '— Sarah, organic vegetable farmer'
    },
    {
      text: 'My English isn\'t great, but I don\'t need to read anything. Green means good, red means check it out. Simple.',
      cite: '— Carlos, small farm owner'
    }
  ],

  // Learnings
  learnings: [
    {
      title: 'Constraints Drive Creativity',
      description: 'Designing for low literacy, outdoor use, and dirty hands forced us to strip away complexity. The result was better for everyone—not just the edge cases we designed for.'
    },
    {
      title: 'Observe, Don\'t Just Ask',
      description: 'In interviews, farmers said they wanted "more features." In observation, they struggled with basic tasks. Field research revealed the real problems.'
    },
    {
      title: 'Accessibility Benefits Everyone',
      description: 'High contrast mode? Great for sunlight. Large tap targets? Great for gloves. Voice input? Great for multitasking. "Accessibility features" became "everyone features."'
    },
    {
      title: 'Test in Context',
      description: 'Lab testing missed critical issues. Testing in actual fields—with sun glare, dirty hands, and time pressure—revealed problems we never would have found otherwise.'
    }
  ],

  // Retrospective
  retrospective: [
    '1. Start field research earlier—our first 2 weeks of design work was wasted',
    '2. Prototype with real farmers weekly, not just at milestones',
    '3. Design for offline-first from day one (we had to retrofit)',
    '4. Include more Spanish-speaking farmers in early research'
  ],

  // Next Project
  nextProject: {
    title: 'Hire Influencer Marketing',
    description: 'Redesigning B2B campaign tracking with motion design explorations',
    href: '/case-study/influencer-marketing'
  }
};

export default manageFarmsData;
