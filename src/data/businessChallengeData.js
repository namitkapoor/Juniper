import { 
  IoAppsOutline, 
  IoListOutline, 
  IoSchoolOutline,
  IoTimeOutline,
  IoWalletOutline,
  IoStatsChartOutline,
  IoSearchOutline,
  IoAnalyticsOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoNavigateOutline
} from 'react-icons/io5';

export const businessChallengeData = {
  "manageFarms": {
    marketContext: {
      title: "Market Context",
      content: "While John Deere's Operations Center Mobile (OCM) app catered effectively to large-scale farms, it fell short for small farm owners, who found it overly complex and misaligned with their unique needs."
    },
    revenueImpact: {
      title: "Revenue Impact",
      content: "With approximately 1.9 million small farms in the United States (USDA, 2022), low adoption of the app resulted in missed opportunities to strengthen brand loyalty and drive equipment sales in a significant market segment.",
      source: {
        text: "USDA, 2022",
        link: "https://www.nifa.usda.gov/grants/programs/family-farms?"
      }
    },
    painPoints: [
      {
        icon: IoAppsOutline,
        title: "Complex Interface",
        description: "Overwhelming interface with features irrelevant to small-scale operations.",
        id: "complexInterface"
      },
      {
        icon: IoListOutline,
        title: "Task Management",
        description: "Difficulty managing essential tasks like equipment tracking, crop planning, and operational logs.",
        id: "taskManagement"
      },
      {
        icon: IoSchoolOutline,
        title: "Learning Curve",
        description: "Lack of accessible tutorials and support for first-time users, creating a steep learning curve.",
        id: "learningCurve"
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Frustrated by the lack of user-friendly tools, small farm owners either abandoned the app or turned to alternative solutions, creating a retention gap for John Deere in a rapidly growing segment."
    }
  },
  
  "otherProject": {
    marketContext: {
      title: "Market Context",
      content: "Different market context for another project..."
    },
    revenueImpact: {
      title: "Revenue Impact",
      content: "Revenue impact details for another project...",
      source: {
        text: "Source, 2023",
        link: "https://example.com"
      }
    },
    painPoints: [
      {
        icon: IoTimeOutline,
        title: "Time Management",
        description: "Description of time management issues...",
        images: [
          {
            src: "../images/path/to/image1.jpg",
            alt: "Time management issue visualization",
            caption: "Time management issue visualization"
          }
        ]
      },
      {
        icon: IoWalletOutline,
        title: "Cost Efficiency",
        description: "Description of cost efficiency problems...",
        images: [
          {
            src: "../images/path/to/image2.jpg",
            alt: "Cost efficiency analysis",
            caption: "Cost efficiency analysis"
          }
        ]
      },
      {
        icon: IoStatsChartOutline,
        title: "Performance Tracking",
        description: "Description of performance tracking issues...",
        images: [
          {
            src: "../images/path/to/image3.jpg",
            alt: "Performance tracking dashboard",
            caption: "Performance tracking dashboard"
          }
        ]
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Description of cost problems for another project..."
    }
  },
  
  "influencerMarketing": {
    marketContext: {
      title: "Market Context",
      content: "Small businesses struggle to effectively leverage influencer marketing due to complex discovery processes and limited campaign management tools."
    },
    revenueImpact: {
      title: "Revenue Impact",
      content: "Influencer marketing has experienced significant growth, with the industry's value increasing from $9.7 billion in 2020 to $13.8 billion in 2021, marking a 42% year-over-year rise. ",
      source: {
        text: "Collabstr, 2022 Influencer Marketing Report",
        link: "https://collabstr.com/2022-influencer-marketing-report?"
      }
    },
    painPoints: [
      {
        id: "campaignWorkflow",
        icon: IoNavigateOutline,
        title: "Campaign Workflow",
        description: "Managing campaign creation and tracking across stages was overly complex and fragmented."
      },
      {
        id: "contractManagement",
        icon: IoStatsChartOutline,
        title: "Contract Management",
        description: "Contracts were challenging to create, modify, and track, leading to inefficiencies in the agreement process with influencers."
      },
      {
        id: "influencerStatus",
        icon: IoSearchOutline,
        title: "Influencer Status Management",
        description: "Brands struggle with a complicated campaign creation and management process."
      }
    ],
    costProblems: {
      title: "Cost of Current Problems",
      content: "Small businesses lose an average of 15-20 hours per month on manual influencer discovery and campaign management, resulting in reduced marketing efficiency and missed opportunities."
    }
  },
  
  "taskReminders": {
    marketContext: {
      title: "Market Context",
      content: "Traditional task reminder systems operate on simple time-based triggers, failing to account for user context, priority, and optimal timing for task completion."
    },
    revenueImpact: {
      title: "Market Opportunity",
      content: "With 67% of professionals using digital task management tools, there's a significant opportunity to improve task completion rates through contextual awareness.",
      source: {
        text: "Productivity Report, 2023",
        link: "https://example.com/productivity-report-2023"
      }
    },
    painPoints: [
      {
        icon: IoTimeOutline,
        title: "Poor Timing",
        description: "Reminders often arrive at inconvenient moments, leading to task dismissal or postponement.",
        images: [
          {
            src: "../images/TaskReminders/timing-analysis.jpg",
            alt: "Reminder timing analysis",
            caption: "Current reminder patterns"
          }
        ]
      },
      {
        icon: IoAnalyticsOutline,
        title: "Lack of Context",
        description: "Systems don't consider location, activity, or user availability when sending notifications.",
        images: [
          {
            src: "../images/TaskReminders/context-study.jpg",
            alt: "Context analysis",
            caption: "Context impact study"
          }
        ]
      },
      {
        icon: IoSettingsOutline,
        title: "Priority Confusion",
        description: "Users struggle to identify truly important tasks among numerous notifications.",
        images: [
          {
            src: "../images/TaskReminders/priority-matrix.jpg",
            alt: "Task priority matrix",
            caption: "Priority distribution"
          }
        ]
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Users miss or postpone 40% of important tasks due to poorly timed reminders, leading to decreased productivity and increased stress levels."
    }
  },
  
  "sustainablePackaging": {
    marketContext: {
      title: "Market Context",
      content: "Despite growing consumer demand for sustainable packaging, retailers face significant barriers in adoption, primarily due to cost concerns and implementation complexity."
    },
    revenueImpact: {
      title: "Market Opportunity",
      content: "The sustainable packaging market is projected to reach $305.31 billion by 2027, with retailers playing a crucial role in driving adoption.",
      source: {
        text: "Environmental Impact Report, 2023",
        link: "https://example.com/sustainability-report-2023"
      }
    },
    painPoints: [
      {
        icon: IoWalletOutline,
        title: "Cost Barriers",
        description: "Higher costs of sustainable materials making adoption financially challenging.",
        images: [
          {
            src: "../images/SustainablePackaging/cost-analysis.jpg",
            alt: "Cost comparison analysis",
            caption: "Traditional vs Sustainable costs"
          }
        ]
      },
      {
        icon: IoAnalyticsOutline,
        title: "Implementation Complexity",
        description: "Lack of clear guidelines and processes for transitioning to sustainable options.",
        images: [
          {
            src: "../images/SustainablePackaging/implementation-flow.jpg",
            alt: "Implementation process",
            caption: "Current transition challenges"
          }
        ]
      },
      {
        icon: IoStatsChartOutline,
        title: "ROI Uncertainty",
        description: "Difficulty in measuring and demonstrating return on sustainable packaging investments.",
        images: [
          {
            src: "../images/SustainablePackaging/roi-metrics.jpg",
            alt: "ROI measurement",
            caption: "Current metrics tracking"
          }
        ]
      }
    ],
    costProblems: {
      title: "Cost of Inaction",
      content: "Retailers risk losing market share as 73% of consumers express preference for brands using sustainable packaging, while also facing potential regulatory penalties in markets with packaging waste regulations."
    }
  }
}; 