/**
 * Influencer Marketing Case Study Data
 * From fragmented status tabs to unified campaign tracking
 */

export const influencerMarketingData = {
  projectId: 'influencerMarketing',

  // Hero Section
  hero: {
    videoSrc: '/videos/Case Studies/MI/MI on laptop.mp4',
    posterSrc: '/images/Case Studies/MI/mi-hero-poster.jpg',
    subtitle: 'How consolidating 5 fragmented tabs reduced clicks by 28% and saved nearly 2 minutes per task'
  },

  // Project Metadata
  meta: {
    role: 'Product Designer',
    timeline: '6 weeks (May - August 2023)',
    team: '1 designer (me), 1 PM, 4 Developers',
    platform: 'Web Application (B2B SaaS)',
    impact: '28% fewer clicks, 95% task success rate',
    context: 'Early-stage startup, fast iteration cycles'
  },

  // Overview
  overview: {
    title: 'The Challenge',
    paragraphs: [
      'My Influency helps small businesses manage influencer marketing campaigns. The original design used 5 separate tabs—Overview, Current, Pending, Rejected, Completed—each showing lists of influencers in that state.',
      'Like Facebook\'s old friend request flow, this status-based fragmentation forced users to check multiple tabs just to find one influencer. Worse, there was no visibility into WHERE an influencer was in the campaign pipeline. Users resorted to texting influencers: "Hey, what\'s your status?"'
    ],
    image: {
      src: '/images/Case Studies/MI/Original Design/original design high res.jpg',
      alt: 'Original 5-tab interface with status-based navigation',
      caption: 'The original design: 5 tabs grouping influencers by status, no progress visibility'
    }
  },

  // Pain Points
  painPoints: [
    {
      title: 'Small Business Owners',
      icon: '/images/Case Studies/MI/logo/campaign-manager.svg',
      items: [
        'Managing 5-15 influencers per campaign',
        'Checking multiple tabs to track one influencer',
        'No visibility into campaign progress',
        'Texting influencers for status updates'
      ]
    },
    {
      title: 'Original Design Problems',
      icon: '/images/Case Studies/MI/logo/interface-problems.svg',
      items: [
        '5 status-based tabs at same navigation level',
        'Influencers grouped by state, not campaign flow',
        'No timeline showing progress milestones',
        'Fragmented view of campaign execution'
      ]
    }
  ],

  // Problem Discovery (consolidated)
  problemDiscovery: {
    title: 'Problem Discovery',
    intro: 'Task analysis with 15 small business owners revealed three recurring pain points—all stemming from the original 5-tab, status-based architecture.',
    video: {
      src: '/videos/Case Studies/MI/Redesign.mp4',
      caption: 'The original interface: users toggled between tabs 8+ times per session'
    },
    keyProblems: [
      {
        title: 'Tab-Hopping to Find Influencers',
        icon: '/images/Case Studies/MI/logo/find-influencer.svg',
        problem: 'Finding one influencer required checking multiple status tabs',
        evidence: 'Task analysis: "Find influencer within 5 miles" required navigating through 3-5 tabs'
      },
      {
        title: 'No Progress Visibility',
        icon: '/images/Case Studies/MI/logo/influencer-progress.svg',
        problem: 'Users couldn\'t see WHERE influencers were stuck—just their final status',
        evidence: 'Interview: "I have to text them to ask what\'s taking so long"'
      },
      {
        title: 'Acquisition Focus, Not Execution',
        icon: '/images/Case Studies/MI/logo/active-post.svg',
        problem: 'Design optimized for finding influencers, not managing active campaigns',
        evidence: 'Users maintained separate spreadsheets for progress tracking'
      }
    ],
    insight: 'Users needed execution transparency, not status grouping. The priority isn\'t "how many pending?" but "is this influencer on track?"',
    metrics: {
      participants: 15,
      userType: 'Small business owners',
      avgTabSwitches: '8+ per session'
    }
  },

  // Design Decisions
  designDecisions: {
    title: 'Information Architecture Redesign',
    subtitle: 'Two iterations: consolidation, then functional split',
    // summaryVideo: {
    //   src: '/videos/Case Studies/MI/Redesign.mp4',
    //   caption: 'Walkthrough of the redesigned interface: from fragmented tabs to unified tracking'
    // },
    
    // Iteration 1: Tab Consolidation
    iteration1: {
      title: 'Iteration 1: Consolidate Status Tabs',
      problem: '5 separate tabs forced users to hunt for influencers',
      decision: 'Merged 5 tabs into 1 "Influencers" tab with status filters',
      beforeImage: '/images/Case Studies/MI/Changes/Tab Restructure.jpg',
      annotations: [
        {
          x: '15%',
          y: '80%',
          label: 'Before: 5 separate tabs',
          detail: 'Overview, Current, Pending, Rejected, Completed—like Facebook friend requests'
        },
        {
          x: '70%',
          y: '80%',
          label: 'After: 1 tab with filters',
          detail: 'Current (4), Pending (2), Completed (1), Rejected (2) became filters within one view'
        }
      ],
      result: 'Users could filter by status WITHOUT navigating away—but still no progress timeline',
      metric: '28% reduction in clicks for "find influencer X" task'
    },

    // Iteration 2: Functional Split
    iteration2: {
      title: 'Iteration 2: Shift from Acquisition to Execution',
      problem: 'Consolidation helped, but users still lacked campaign PROGRESS visibility',
      decision: 'Split by function: Campaign analytics vs. Influencer tracking',
      changes: [
        {
          title: '"Influencers" Became "Tracking"',
          description: 'Timeline showing each influencer\'s progress through campaign milestones',
          milestones: [
            'Sent Request',
            'Product Pickup',
            'First Draft',
            'Second Draft',
            'Published Post'
          ],
          image: '/images/Case Studies/MI/Changes/Influencers to Tracking.jpg',
          reasoning: 'Like project management software—transparency for both business and influencer'
        },
        {
          title: '"Overview" Split into 3 Tabs',
          tabs: [
            'Info/Overview: Campaign summary stats',
            'Content: Published social posts from influencers',
            'Analytics: Performance metrics (engagement, impressions, cost per view)'
          ],
          image: '/images/Case Studies/MI/Changes/campaign overview.jpg',
          reasoning: 'Separated campaign-level insights from influencer-level tracking'
        },
        
      ],
      keyInsight: 'The priority shifted from influencer acquisition (finding/vetting) to campaign execution (contract management + progress transparency)',
      beforeAfterImages: {
        before: '/images/Case Studies/MI/Changes/Influencers to Tracking.jpg',
        after: '/images/Case Studies/MI/Changes/Influencers to Tracking.jpg',
        caption: 'From status grouping to timeline visualization'
      },
      quote: {
        text: 'Before, I had to text each influencer to ask where they were. Now I just check the timeline.',
        cite: '— Small business owner, usability testing'
      }
    },

    // Design Principles
    designPrinciples: [
      {
        title: 'Function Over Status',
        description: 'Organize by what users need to DO, not abstract data states',
        example: 'Analytics for decisions, Tracking for execution—not "Pending" and "Completed"'
      },
      {
        title: 'Timeline Transparency',
        description: 'Visualize progress, don\'t just label status',
        example: 'Seeing "stuck at First Draft for 5 days" beats reading "Status: In Progress"'
      },
      {
        title: 'Single Source of Truth',
        description: 'No more tab-hopping or external spreadsheets',
        example: 'Everything about one influencer visible in Tracking tab'
      }
    ]
  },

  // Prototypes (all shipped)
  prototypes: {
    title: 'Final Prototypes (All Shipped)',
    subtitle: 'Screen recordings from the live site',
    items: [
      {
        title: 'Campaign Creation',
        description: 'Streamlined setup flow for new campaigns',
        video: '/videos/Case Studies/MI/New campaign high res.mp4',
        keyFeature: 'Step-by-step campaign details, product info, and usage guidelines',
        isLaptop: true
      },
      {
        title: 'Contracts Management',
        description: 'Unified view of influencer agreements',
        video: '/videos/Case Studies/MI/Contracts high res.mp4',
        keyFeature: 'Contract status tracking with deadlines',
        isLaptop: true
      },
      {
        title: 'Influencer Discovery',
        description: 'Grid view with filtering and key metrics',
        video: '/videos/Case Studies/MI/Explore high res.mp4',
        keyFeature: 'Location-based search (within 5 miles), pricing, engagement rates',
        isLaptop: true
      },
      {
        title: 'Campaign Tracking',
        description: 'Timeline-based progress for each influencer',
        video: '/videos/Case Studies/MI/Campaign Tracking high res.mp4',
        keyFeature: 'Milestones from proposal to published post, transparent to both parties',
        isLaptop: true
      }
    ]
  },

  // Micro-interactions (minimal)
  microInteractions: {
    title: 'Micro-Animations',
    intro: 'Minimal, purposeful animations—not elaborate motion design',
    video: {
      src: '/videos/Case Studies/MI/Campaign-tracking_1.mp4',
      caption: 'The tracking timeline in action—status changes and hover interactions'
    },
    items: [
      {
        name: 'Status Change Indication',
        description: 'Subtle highlight when influencer moves to next milestone',
        type: 'CSS transition',
        purpose: 'Confirm update without jarring the view'
      },
      {
        name: 'Tracking Pill Hover',
        description: 'Pill expands to show milestone details on hover',
        type: 'CSS transition',
        purpose: 'Progressive disclosure—details on demand'
      }
    ],
    note: 'Early startup = fast iteration. Elaborate animations weren\'t the priority—clear information architecture was.'
  },

  // Usability Testing
  usabilityTesting: {
    title: 'Validation',
    participants: 12,
    tasksTested: 8,
    tasks: [
      'Find influencer within 5 miles',
      'Create a campaign',
      'Assign tasks to influencer',
      'Send request',
      'Approve influencer contract',
      'Reschedule delivery',
      'View active post',
      'Terminate a contract'
    ],
    metrics: {
      successRate: '95%',
      avgTimeOnTask: '2.5 min',
      clickReduction: '28%',
      timeSaved: '1 minute 47 seconds per task (avg)'
    },
    keyFindings: [
      'Timeline visualization eliminated "where is this influencer?" confusion',
      'Consolidated tabs reduced context switching',
      'Users no longer maintained external spreadsheets for tracking',
      'Some requested additional filtering (implemented post-launch)',
      'Mobile responsiveness flagged for future improvement'
    ]
  },

  // Results
  results: [
    {
      number: '28%',
      label: 'Fewer Clicks',
      icon: '/images/Case Studies/MI/logo/fewer-milestones.svg',
      description: 'Measured via task analysis (find influencer, check status)'
    },
    {
      number: '1m 47s',
      label: 'Time Saved',
      icon: '/images/Case Studies/MI/logo/hourglass.svg',
      description: 'Average per task (finding influencer status)'
    },
    {
      number: '95%',
      label: 'Task Success',
      icon: '/images/Case Studies/MI/logo/task-success.svg',
      description: '8 core tasks tested with 12 participants'
    },
    {
      number: '0',
      label: 'Spreadsheets',
      icon: '/images/Case Studies/MI/logo/spreadsheet.svg',
      description: 'Users stopped maintaining external tracking (qualitative)'
    }
  ],

  // User Quotes
  userQuotes: [
    {
      text: 'I don\'t have to text my influencers anymore to ask "hey, where are you at?" I just check the timeline.',
      cite: '— Small business owner, usability testing'
    },
    {
      text: 'Before, I had a spreadsheet to track everyone. Now it\'s all in one place.',
      cite: '— Marketing agency user, post-launch interview'
    }
  ],

  // Learnings
  learnings: [
    {
      title: 'Status ≠ Progress',
      description: 'Grouping by status (pending, completed) doesn\'t show progress. Timelines reveal WHERE things are stuck, status labels just say "it\'s stuck."'
    },
    {
      title: 'Consolidation First, Then Split by Function',
      description: 'Iteration 1 merged tabs to reduce fragmentation. Iteration 2 split by user intent (analytics vs. tracking). Both were necessary.'
    },
    {
      title: 'Transparency for Both Parties',
      description: 'The timeline worked because BOTH businesses and influencers could see progress. Mutual visibility reduced friction.'
    },
    {
      title: 'Fast Iteration > Perfect Design',
      description: 'Early startup = ship fast, learn, iterate. High-fidelity wireframes straight to dev. No time for elaborate motion design (and didn\'t need it).'
    }
  ],

  // Retrospective
  retrospective: [
    'Should have tested with marketing agencies earlier (not just small businesses)',
    'Mobile responsiveness should have been priority #1 (flagged late)',
    'Could have validated timeline concept with paper prototypes before building',
    'Would conduct follow-up research 3 months post-launch to measure sustained impact'
  ],

  // Next Project
  nextProject: {
    title: 'Enroll more students',
    description: 'Designing an AI-chat agent to simplify the enrollment process for beauty school students',
    href: '/case-study/christine-valmy'
  }
};

export default influencerMarketingData;