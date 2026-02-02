/**
 * Manage Small Farms Case Study Data
 * Spatial visualization for diverse small-farm crop management
 */

export const manageFarmsData = {
  projectId: 'manageFarms',

  // Hero Section
  hero: {
    videoSrc: '/videos/Case Studies/JD/Animations/Farmer w: phone anim-left.mp4',
    posterSrc: '/images/Case Studies/JD/mf-hero-poster.jpg',
    subtitle: 'Spatial visualization for small farms with diverse crops'
  },

  // Project Metadata
  meta: {
    role: 'UX Designer + Researcher',
    timeline: '4 months (Aug - Dec 2022)',
    team: '2 Designers, 2 Researchers',
    platform: 'iOS Mobile App',
    impact: 'SUS Score: 70 (up from 52)',
    methods: 'Remote interviews, surveys, task analysis, usability testing'
  },

  // Overview / Challenge Section
  overview: {
    title: 'The Challenge',
    paragraphs: [
      'John Deere\'s Operations Center Mobile was built for large commercial farms—acres of single crops with predictable layouts. Small farm owners manage diverse crops in limited space, thinking spatially about "the tomatoes by the fence" rather than abstract categories.',
      'The existing app forced farmers into list-based navigation that didn\'t match their mental model. Task completion averaged 5.1 minutes with a 50% success rate.'
    ],
    image: {
      src: '/images/Case Studies/JD/OCM Original app.svg',
      alt: 'Screenshot of the original OCM interface with list-based navigation',
      caption: 'The original OCM: built for large farms, not diverse small operations'
    }
  },

  // Research Discovery
  research: {
    title: 'Discovery',
    
    // Survey Data - Animated Bar Chart
    surveyData: {
      title: 'What Small Farmers Actually Use',
      subtitle: 'Survey of ~11 small farm owners at local farmers markets',
      chartData: [
        { tool: 'Paper & Notebook', count: 9, color: '#4A90E2' },
        { tool: 'Electronic Tools\n(Excel, Google Sheets, Apps)', count: 7, color: '#4A90E2' },
        { tool: 'Outsourcing\n(hired 3rd party)', count: 0, color: '#4A90E2' },
        { tool: 'Other', count: 1, color: '#4A90E2' }
      ],
      insight: 'Most farmers used paper notebooks + spreadsheets, indicating no existing app met their needs.'
    },

    // Interview Insights
    interviews: {
      title: 'Remote Interviews with 5 Farmers',
      subtitle: '14 interview sessions across homesteading, volunteer, and for-profit small farms',
      keyInsight: 'Small farms = diverse crops in limited space. Large farms = same crop for acres. This fundamental difference requires granular, customizable tracking at the plant bed level.',
      photos: [
        {
          src: '/images/Case Studies/JD/Team at JD Dealership 2.jpg',
          alt: 'Interview session at JD dealership'
        },
        {
          src: '/images/Case Studies/JD/me at farmers market.jpg',
          alt: 'Survey collection at farmers market'
        },
        {
          src: '/images/Case Studies/JD/first interview w sam.jpg',
          alt: 'First remote interview with Sam'
        }
      ]
    },

    // Core Insights
    insights: [
      {
        title: 'Spatial Thinking',
        description: 'Farmers reference crops by physical location: "the tomatoes by the fence", not by category or list position.',
        icon: '/images/Case Studies/JD/logo/spatial.svg'
      },
      {
        title: 'Diverse Crops',
        description: 'Small farms maximize space and soil with 10-30+ different crops, unlike large farms with monoculture.',
        icon: '/images/Case Studies/JD/logo/farm-owner.svg'
      },
      {
        title: 'Glanceability',
        description: 'Farmers check status between physical tasks in 30-second bursts—no time for deep reading.',
        icon: '/images/Case Studies/JD/logo/show-no-tell.svg'
      }
    ]
  },

  // Product Analysis & Task Analysis
  problemAnalysis: {
    title: 'Baseline Problems',
    
    // Product Critique
    productIssues: {
      coverImage: '/images/Case Studies/JD/OCM Critique.avif',
      findings: [
        {
          category: 'List-Based Navigation',
          icon: '/images/Case Studies/JD/logo/existing-app.svg',
          issue: 'OCM organized by feature menus (Tasks, Fields, Equipment), not spatial layout',
          impact: 'Farmers couldn\'t map mental model to interface—"where\'s the section with the tomatoes?"'
        },
        {
          category: 'Built for Large Farms',
          icon: '/images/Case Studies/JD/logo/existing-app.svg',
          issue: 'Equipment tracking, bulk operations, and analytics irrelevant to small operations',
          impact: 'Cognitive overload from unused features cluttering core workflows'
        }
      ]
    },

    // Task Analysis
    taskAnalysis: {
      title: 'Task Analysis with Original OCM',
      subtitle: '5 core tasks tested with 10 small farm owners',
      overallMetrics: {
        avgCompletionTime: '5.1 minutes',
        successRate: '50%',
        participantCount: 10
      },
      tasks: [
        {
          name: 'Choose a Crop to Plant',
          completionTime: '5 min',
          successRate: '70%',
          issue: 'Feature buried under unrelated menus'
        },
        {
          name: 'Identify and Customize Flags',
          completionTime: '4.5 min',
          successRate: '50%',
          issue: 'Unclear customization, inconsistent terminology'
        },
        {
          name: 'Find Troubleshoot',
          completionTime: '6 min',
          successRate: '40%',
          issue: 'Poor navigation pathways'
        },
        {
          name: 'Create Harvest Plans',
          completionTime: '7 min',
          successRate: '30%',
          issue: 'Overwhelming steps, no visual guidance'
        },
        {
          name: 'Remove Flags',
          completionTime: '3 min',
          successRate: '60%',
          issue: 'Delete action buried in secondary menus'
        }
      ]
    }
  },

  // Pain Points (for PainPointsGrid)
  painPoints: [
    {
      title: 'Farm Owner',
      icon: '/images/Case Studies/JD/logo/farm-owner.svg',
      items: [
        'Can\'t find crops by location—forced to scroll through lists',
        'Too many features for equipment I don\'t own',
        'Hard to see status at a glance in bright sunlight'
      ]
    },
    {
      title: 'Existing App Problems',
      icon: '/images/Case Studies/JD/logo/existing-app.svg',
      items: [
        'Small tap targets required precision',
        'Text-heavy interface hard to scan',
        'No offline functionality for remote fields',
        'Complex navigation buried key features'
      ]
    }
  ],

  // Results Metadata
  resultsMeta: {
    measurementPeriod: '4 weeks post-launch',
    testParticipants: '10 small farm owners',
    baseline: 'Original OCM app metrics',
    methodology: 'SUS surveys, task analysis, time-on-task'
  },

  // User Research for Sticky Scroll Section
  userResearch: {
    visualCards: [
      {
        step: 1,
        src: '/images/Case Studies/JD/me at farmers market.jpg',
        alt: 'Initial bento grid design with six topic tiles'
      },
      {
        step: 2,
        src: '/images/Case Studies/JD/Jake interview screenshot.jpg',
        alt: 'Survey collection at farmers market'
      },
      {
        step: 3,
        src: '/images/Case Studies/JD/first interview w sam.jpg',
        alt: 'First remote interview with Sam'
      }
    ],
    contentBlocks: [
      {
        trigger: 1,
        title: 'Surveys at Farmers Markets',
        paragraphs: [
          'We surveyed 11 small farm owners at local farmers markets to understand their current tools and pain points.'
        ],
        findings: [
          { stat: '82%', description: 'used paper notebooks for crop tracking' },
          { stat: '64%', description: 'also used spreadsheets (Excel/Google Sheets)' },
          { stat: '0%', description: 'outsourced farm management to third parties' }
        ]
      },
      {
        trigger:2,
        title: 'Remote Interviews',
        paragraphs: [
          '14 interview sessions across homesteading, volunteer, and for-profit small farms revealed a fundamental insight.'
        ],
        highlight: 'Small farms = diverse crops in limited space. Large farms = same crop for acres.',
        quote: {
          text: 'I think of my farm by location—the tomatoes by the fence, the herbs near the house. Not by some category list.',
          cite: '— Greenhouse farmer, interview participant'
        }
      },
      {
        trigger: 3,
        title: 'Key Insights',
        paragraphs: [
          'Three core insights emerged that shaped every design decision:'
        ],
        kept: [
          { title: 'Spatial Thinking', description: 'Farmers reference crops by physical location, not categories' },
          { title: 'Diverse Crops', description: 'Small farms manage 10-30+ different crops in limited space' },
          { title: 'Glanceability', description: '30-second bursts between physical tasks—no time for deep reading' }
        ],
        lesson: 'The existing app\'s list-based navigation fundamentally mismatched how farmers think about their land.'
      }
    ]
  },

  // Map View Section
  mapView: {
    title: 'Spatial Map View',
    intro: 'The centerpiece of the redesign: a top-down map that mirrors the physical layout of the farm.',
    features: [
      {
        title: 'Drag-and-Drop Beds',
        description: 'Farmers create plant beds by drawing shapes that match their actual field layout—rectangles for rows, circles for containers.'
      },
      {
        title: 'Color-Coded Status',
        description: 'Green, yellow, and red indicators provide instant health status. Testing showed 3-second glance comprehension.'
      },
      {
        title: 'Tap to Drill Down',
        description: 'Tap any bed to see detailed info, tasks, and history without losing spatial context.'
      }
    ],
    image: {
      src: '/images/Case Studies/JD/Redesigns/Map.png',
      alt: 'Map view showing color-coded plant beds',
      caption: 'The map view lets farmers navigate by location, matching their mental model'
    }
  },

  // Design Iterations (for BeforeAfterSlider)
  iterations: [
    {
      title: 'Touch Target Size',
      beforeImage: {
        src: '/images/Case Studies/JD/Redesigns/Map1.png',
        alt: 'Original small touch targets'
      },
      afterImage: {
        src: '/images/Case Studies/JD/Original Design/Map.svg',
        alt: 'Enlarged 64px touch targets'
      },
      caption: 'Touch targets increased from 32px to 64px for gloved hands',
      technicalNote: 'Minimum 48px per WCAG, but field testing showed 64px needed for dirty/gloved hands in outdoor conditions.',
      fix: 'Enlarged all interactive elements to 64px minimum, with high-contrast borders visible in direct sunlight.'
    },
    {
      title: 'Status Visibility',
      beforeImage: {
        src: '/images/Case Studies/JD/Redesigns/Home1.png',
        alt: 'Text-based status indicators'
      },
      afterImage: {
        src: '/images/Case Studies/JD/Original Design/Home.svg',
        alt: 'Color-coded visual status'
      },
      caption: 'From text labels to color-coded visual indicators',
      technicalNote: 'Triple-coded status: color + icon + pattern for accessibility. Works for colorblind users and in bright sunlight.',
      fix: 'Replaced "Healthy/Needs Attention/Critical" text with large colored dots plus icons, visible from arm\'s length.'
    },
    {
      title: 'Task Creation Flow',
      beforeImage: {
        src: '/images/Case Studies/JD/Redesigns/Plan1.png',
        alt: 'Multi-step task creation'
      },
      afterImage: {
        src: '/images/Case Studies/JD/Original Design/Plan.svg',
        alt: 'Simplified single-screen task creation'
      },
      caption: 'Task creation reduced from 7 steps to 3',
      technicalNote: 'Original flow required navigating 4 screens. Consolidated to single screen with smart defaults.',
      fix: 'Pre-filled fields based on selected plant bed, collapsible advanced options, and prominent "Quick Add" button.'
    }
  ],

  // Iteration Statistics
  iterationStats: {
    totalIterations: '12 design rounds',
    userTests: '3 rounds with 10 farmers',
    featuresCut: '8 features removed',
    accessibilityScore: 'WCAG AA compliant'
  },

  // Micro-interactions
  microInteractions: [
    {
      title: 'Bed Selection',
      description: 'Subtle scale and glow effect confirms tap registration—critical feedback when hands are dirty or gloved.',
      lottieSrc: '/lottie/mf-bed-selection.json',
      technicalNote: 'transform: scale(1.05) with 150ms ease-out. Glow uses box-shadow animation for GPU acceleration.'
    },
    {
      title: 'Status Change',
      description: 'Smooth color transition when updating plant health status, with haptic feedback on iOS.',
      lottieSrc: '/lottie/mf-status-change.json',
      technicalNote: 'CSS transition on background-color, 200ms. UIImpactFeedbackGenerator.impactOccurred() on state change.'
    },
    {
      title: 'Task Completion',
      description: 'Satisfying checkmark animation provides clear feedback that the action registered.',
      lottieSrc: '/lottie/mf-task-complete.json',
      technicalNote: 'Lottie animation, 800ms duration. Plays once on task completion, with spring physics on checkmark draw.'
    },
    {
      title: 'Pull to Refresh',
      description: 'Custom refresh animation shows sync progress when returning from offline mode.',
      lottieSrc: '/lottie/mf-pull-refresh.json',
      technicalNote: 'UIRefreshControl with custom Lottie view. Progress mapped to pull distance for responsive feel.'
    }
  ],

  // Design Concepts
  concepts: {
    title: 'Two Design Directions',
    options: [
      {
        name: 'Operations Center Redesign',
        status: 'Selected',
        description: 'Spatial-first redesign of OCM with customizable plant bed visualization',
        rationale: 'Matches farmers\' mental model while keeping familiar OCM foundation',
        keyFeatures: [
          'Top-down farm map as primary navigation',
          'Customizable plant bed shapes/sizes',
          'Color-coded status at-a-glance',
          'Simplified task management'
        ]
      },
      {
        name: 'Seed2Product',
        status: 'Rejected',
        description: 'Voice-first conversational interface with AR visualization',
        rationale: 'Too radical departure, higher technical risk, longer dev timeline',
        keyFeatures: [
          'Conversational AI for task creation',
          'AR overlay for field visualization',
          'Predictive crop planning'
        ]
      }
    ]
  },

  // Design Decisions (CV style with inline annotations)
  designDecisions: {
    title: 'Design Decisions',
    subtitle: 'Key decisions that shaped the spatial visualization approach',
    
    decisions: [
      {
        title: 'Spatial Map View',
        problem: 'List-based navigation didn\'t match how farmers think about their land',
        decision: 'Top-down map as primary interface—farmers tap directly on plant beds',
        sketchImage: '/images/Case Studies/JD/Wireframe/Map gestures.jpg',
        annotations: [
          {
            x: '20%',
            y: '30%',
            label: 'Drag-and-drop to add/edit beds',
            feedback: 'User feedback: "I need to match my actual greenhouse layout"'
          },
          {
            x: '70%',
            y: '45%',
            label: 'Color-coded status (green/yellow/red)',
            feedback: 'Testing showed 3-second glance comprehension'
          },
          {
            x: '50%',
            y: '80%',
            label: 'Swipe to toggle between rows',
            feedback: 'Added after users wanted faster row navigation'
          }
        ],
        prototypeVideo: '/videos/Case Studies/JD/Prototypes/Map video.mp4',
        outcome: 'Farmer quote: "It\'s like you\'ve actually been to my farm and seen how I lay out my crops"'
      },
      
      {
        title: 'Customizable Plant Beds',
        problem: 'Small farms have irregular layouts—rectangles, circles, raised beds, greenhouse rows',
        decision: 'Let farmers define bed shape, size, and color to mirror reality',
        sketchImage: '/images/Case Studies/JD/Wireframe/Map gestures.jpg',
        annotations: [
          {
            x: '30%',
            y: '40%',
            label: 'Custom shapes for bed types',
            feedback: 'Users requested circles for containers, long rectangles for rows'
          },
          {
            x: '60%',
            y: '60%',
            label: 'Resize to scale',
            feedback: '"My tomato section is way bigger than my herbs"'
          }
        ],
        prototypeVideo: '/videos/Case Studies/JD/Prototypes/Map video.mp4',
        outcome: 'Usability testing: "Now I can see my farm exactly as it is"'
      },

      {
        title: 'Simplified Task Management',
        problem: 'Original task flow: 7 min avg, 30% success rate for creating harvest plans',
        decision: 'Visual hierarchy with collapsible sections, priority flags, and quick actions',
        sketchImage: '/images/Case Studies/JD/Wireframe/Plan gestures.jpg',
        annotations: [
          {
            x: '25%',
            y: '35%',
            label: 'Collapsible sections by field',
            feedback: 'Users wanted to focus on one area at a time'
          },
          {
            x: '80%',
            y: '50%',
            label: 'Visual priority flags',
            feedback: 'Testing: urgent tasks now visible without scrolling'
          }
        ],
        prototypeVideo: '/videos/Case Studies/JD/Prototypes/Plan video.mp4',
        outcome: 'Task completion time reduced by 40%'
      },

      {
        title: 'Status Feed Integration',
        problem: 'Farmers struggled to find task progress and updates (70% navigation failure)',
        decision: 'Centralized status feed with quick action buttons (edit, comment, mark complete)',
        sketchImage: '/images/Case Studies/JD/Wireframe/Status Feed gestures.jpg',
        annotations: [
          {
            x: '40%',
            y: '30%',
            label: 'Progress slider with percentage',
            feedback: 'Refined after users found it confusing—added visual tick marks'
          },
          {
            x: '70%',
            y: '70%',
            label: 'Quick Add button',
            feedback: '"Don\'t make me navigate away to add a task"'
          }
        ],
        prototypeVideo: '/videos/Case Studies/JD/Prototypes/Home video.mp4',
        outcome: '64% task success rate (up from 50%)'
      },

      {
        title: 'Analytics Simplification',
        problem: 'Reports buried in sub-menus, hard to interpret for financial planning',
        decision: 'Tabbed navigation (Field Info / Revenue) with interactive charts',
        sketchImage: '/images/Case Studies/JD/Wireframe/Analyze gestures.jpg',
        annotations: [
          {
            x: '30%',
            y: '25%',
            label: 'Tab separation',
            feedback: 'Users wanted field data separate from financial data'
          },
          {
            x: '60%',
            y: '55%',
            label: 'Tooltips on charts',
            feedback: 'Added after confusion over graph details'
          }
        ],
        prototypeVideo: '/videos/Case Studies/JD/Prototypes/Analysis video.mp4',
        outcome: 'Farmers could interpret reports without help'
      }
    ]
  },

  // Design Principles
  designPrinciples: [
    {
      title: 'Think Spatially',
      description: 'Mirror the physical layout of the farm—users navigate by location, not categories',
      icon: '/images/Case Studies/JD/logo/spatial.svg',
      example: 'Map view replaces list navigation'
    },
    {
      title: 'Show, Don\'t Tell',
      description: 'Color-coded status, icons, and visual hierarchy over text labels',
      icon: '/images/Case Studies/JD/logo/show-no-tell.svg',
      example: 'Green/yellow/red dots instead of "Healthy/Needs attention/Critical"'
    },
    {
      title: 'Go Big',
      description: 'Minimum 48px touch targets, high contrast for outdoor use',
      icon: '/images/Case Studies/JD/logo/go-big.svg',
      example: 'Action buttons are 64px tall with 4.5:1 contrast'
    },
    {
      title: 'Forgive Mistakes',
      description: 'Easy undo, confirmations for destructive actions',
      icon: '/images/Case Studies/JD/logo/forgive.svg',
      example: '5-second undo toast before committing deletes'
    }
  ],

  // Usability Testing
  usabilityTesting: {
    title: 'Validation',
    metrics: {
      participants: 3,
      tasksTested: 14,
      successRate: '64% (up from 50%)',
      susScore: '70 (up from 52)',
      completionTimeReduction: '40%'
    },
    keyFindings: [
      'Map layout intuitive—users immediately understood spatial navigation',
      'Requested more bed shapes (circles, irregular polygons) for containers and raised beds',
      'Priority flagging eliminated "where do I start?" confusion',
      'Heuristic review: 2 high-priority issues fixed in flag customization'
    ]
  },

  // Final Design
  finalDesign: {
    title: 'Final Design',
    intro: 'High-fidelity mockups showing the spatial-first approach in action',
    screens: [
      
      {
        src: '/images/Case Studies/JD/Redesigns/Alerts.png',
        alt: 'Status feed with quick actions',
        caption: 'Status Feed: Centralized updates with quick actions'
      },
      {
        src: '/images/Case Studies/JD/Redesigns/Map.png',
        alt: 'Map view with customizable plant beds',
        caption: 'Map View: Spatial navigation with customizable beds'
      },
      {
        src: '/images/Case Studies/JD/Redesigns/Plan.png',
        alt: 'Weekly work plan with visual hierarchy',
        caption: 'Plan: Visual task hierarchy with priority flags'
      },
      {
        src: '/images/Case Studies/JD/Redesigns/Analyze.png',
        alt: 'Analytics screen with interactive charts',
        caption: 'Analytics: Interactive charts and reports'
      }
    ]
  },

  // Results
  results: [
    {
      number: '70',
      label: 'SUS Score',
      icon: '/images/Case Studies/JD/logo/sus-score.svg',
      description: 'Up from 52 (industry avg: 68)'
    },
    {
      number: '40%',
      label: 'Faster Tasks',
      icon: '/images/Case Studies/JD/logo/task-completion.svg',
      description: 'Average task completion time reduction'
    },
    {
      number: '64%',
      label: 'Success Rate',
      icon: '/images/Case Studies/JD/logo/success-rate.svg',
      description: 'Up from 50% baseline'
    },
    {
      number: '3 sec',
      label: 'Glance Time',
      icon: '/images/Case Studies/JD/logo/glance-time.svg',
      description: 'To understand farm status from map'
    }
  ],

  // Accessibility Features (only real ones)
  accessibilityFeatures: [
    {
      title: 'High Contrast Mode',
      description: 'For bright outdoor sunlight—all text meets WCAG AAA (7:1 ratio)',
      icon: '/images/Case Studies/JD/logo/contrast.svg'
    },
    {
      title: 'Large Touch Targets',
      description: 'Minimum 48px, primary actions 64px to prevent mistaps',
      icon: '/images/Case Studies/JD/logo/touch-target.svg'
    },
    {
      title: 'Offline-First',
      description: 'Core features work without internet, sync when connection returns',
      icon: '/images/Case Studies/JD/logo/offline.svg'
    }
  ],

  // User Quotes
  userQuotes: [
    {
      text: 'It\'s like you\'ve actually been to my farm and seen how I lay out my crops.',
      cite: '— Greenhouse farmer, remote interview participant'
    },
    {
      text: 'I can actually see my farm the way it is. The old app felt like I was filling out tax forms.',
      cite: '— Small farm owner, usability testing'
    }
  ],

  // Learnings
  learnings: [
    {
      title: 'Match the Mental Model',
      description: 'Farmers think spatially—"by the fence", not "Category: Vegetables". Spatial visualization wasn\'t a nice-to-have, it was fundamental.'
    },
    {
      title: 'Constraints Drive Focus',
      description: 'Small farms\' diversity requirement forced granular customization. This actually made the app more flexible for all users.'
    },
    {
      title: 'Test with Real Tasks',
      description: 'Task analysis revealed 50% failure rate with OCM. Without baseline metrics, we wouldn\'t have known how big the problem was.'
    },
    {
      title: 'Iterate on Feedback',
      description: 'Users requested more bed shapes, faster row navigation, and separate financial tabs. Small tweaks, big usability gains.'
    }
  ],

  // Retrospective
  retrospective: [
    'Should have surveyed more farmers (11 is decent, but 20+ would be stronger)',
    'Wish we could have visited actual farms to observe workflows in person',
    'Would test with Spanish-speaking farmers earlier—language wasn\'t just UI, it was mental model differences',
    'Should have built offline-first from day one instead of retrofitting'
  ],

  // Next Project
  nextProject: {
    title: 'Influencer Marketing Campaign',
    description: 'Tracking influencer marketing campaigns for small businesses',
    href: '/case-study/influencer-marketing'
  }
};

export default manageFarmsData;