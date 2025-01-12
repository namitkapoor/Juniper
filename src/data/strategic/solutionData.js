import { 
  IoLayersOutline,
  IoSearchOutline,
  IoTimerOutline,
  IoBulbOutline,
  IoConstructOutline,
  IoSettingsOutline,
  IoNavigateOutline,
  IoAppsOutline,
  IoPersonOutline,
  IoDocumentTextOutline,
  IoStatsChartOutline,
  IoLeafOutline,
  IoFlagOutline,
  IoCalendarOutline,
  IoTrashOutline,
  IoGameControllerOutline,
  IoPhonePortraitOutline,
  IoCodeSlashOutline,
  IoNotificationsOutline,
  IoLocationOutline,
  IoCreateOutline,
  
} from 'react-icons/io5';

const baseSolutionPhase = {
  id: 'solution',
  title: 'Solution Framework',
  icon: IoLayersOutline,
  type: 'solution'
};

export const solutionPhase = {
  ...baseSolutionPhase,
  content: {
    "manageFarms": {
      title: "Solution Framework",
      summary: "Using insights from research and task analysis, we developed wireframes and proposed two design concepts, prioritizing a redesign of OCM that integrated task efficiency and intuitive navigation.",
      sections: [
        {
          type: 'process',
          steps: [
            {
              id: 'product-analysis',
              type: 'analysis',
              title: "Product Analysis",
              icon: IoSearchOutline,
              description: "Key issues with existing product",
              content: {
                coverImage: {
                  url: "/images/Case Studies/JD/OCM Critique.avif",
                  caption: "Product Analysis Overview",
                  alt: "Overview of product analysis"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "Navigation",
                    icon: IoNavigateOutline,
                    issue: "The app's navigation pathways were overly complex, requiring multiple steps to access frequently used features.",
                    impact: "This led to increased task completion times, causing frustration among users with time-sensitive workflows.",
                    additionalValidation: "Task analysis validated the need for streamlining navigation by identifying common workflows."
                  },
                  {
                    category: "Unnecessary Features",
                    icon: IoAppsOutline,
                    issue: "Several features, such as equipment tracking and advanced analytics, were irrelevant to small farm owners and cluttered the interface.",
                    impact: "This created cognitive overload, reducing adoption rates and user satisfaction.",
                    additionalValidation: "Farmers explicitly commented on irrelevant features during interviews."
                  }
                ]
              }
            },
            {
              id: 'task-analysis',
              type: 'analysis',
              title: "Task Analysis",
              icon: IoTimerOutline,
              description: "What Tasks Tell Us About Time Management",
              content: {
                useCarousel: true,
                carouselType: "taskAnalysis",
                summary: "Detailed analysis of 5 key tasks revealed significant usability challenges, with an overall success rate of 50% across all tasks.",
                metrics: {
                  overallCompletionTime: "5.1 minutes average",
                  overallSuccessRate: "50%",
                  participantCount: "10 small farm owners"
                },
                findings: [
                  {
                    category: "Choose a Crop to Plant",
                    icon: IoLeafOutline,
                    description: "Users needed to navigate through multiple menus to identify suitable crops for planting.",
                    metrics: {
                      completionTime: "5 minutes average",
                      successRate: "70%",
                      failureNote: "3 out of 10 users struggled to locate recommendations"
                    },
                    issue: "The feature was buried under unrelated menus, causing delays.",
                    impact: "Users expressed a need for crop suggestions based on soil conditions.",
                    additionalValidation: "Integrated crop recommendations into the daily planner for easier access."
                  },
                  {
                    category: "Identify and Customize Flags",
                    icon: IoFlagOutline,
                    description: "Users were tasked with marking areas on the field using customizable flags.",
                    metrics: {
                      completionTime: "4.5 minutes average",
                      successRate: "50%",
                      failureNote: "5 out of 10 users found it unclear how to customize flags"
                    },
                    issue: "The flag customization process lacked clear instructions and required users to backtrack frequently.",
                    impact: "Terminology inconsistencies confused users about flag types.",
                    additionalValidation: "Simplified the process with clear, step-by-step instructions and consistent labeling."
                  },
                  {
                    category: "Find Troubleshoot",
                    icon: IoConstructOutline,
                    description: "Users were asked to locate troubleshooting tools for equipment issues.",
                    metrics: {
                      completionTime: "6 minutes average",
                      successRate: "40%",
                      failureNote: "only 4 out of 10 users completed the task without help"
                    },
                    issue: "The feature was hard to locate due to poor navigation pathways.",
                    impact: "Users suggested adding an equipment-specific section in the navigation menu.",
                    additionalValidation: "Introduced a dedicated 'Equipment' tab with clear labels and direct access to troubleshooting tools."
                  },
                  {
                    category: "Create Harvest Plans",
                    icon: IoCalendarOutline,
                    description: "Users needed to create a plan for harvesting specific fields.",
                    metrics: {
                      completionTime: "7 minutes average",
                      successRate: "30%",
                      failureNote: "most users abandoned the task midway"
                    },
                    issue: "Overwhelming steps and a lack of visual guidance made it difficult for users to proceed.",
                    impact: "Users struggled to understand the flow between fields, tasks, and scheduling.",
                    additionalValidation: "Simplified the harvest planning process with pre-filled templates and a visual scheduling tool."
                  },
                  {
                    category: "Remove Flags",
                    icon: IoTrashOutline,
                    description: "Users needed to delete flags after completing a task in the field.",
                    metrics: {
                      completionTime: "3 minutes average",
                      successRate: "60%",
                      failureNote: "4 out of 10 users found the process counterintuitive"
                    },
                    issue: "The delete action was buried in secondary menus, requiring unnecessary steps.",
                    impact: "Users expected a quick option to delete flags directly from the main map view.",
                    additionalValidation: "Added a right-click/long-press delete option directly within the field map interface."
                  }
                ]
              }
            },
            {
              id: 'solution-concepts',
              type: 'concepts',
              title: "Solution Concepts",
              icon: IoBulbOutline,
              description: "Two Compelling Design Ideas",
              content: {
                concepts: [
                  {
                    name: "Operations Center Redesign",
                    description: "A streamlined redesign focusing on core workflows and enhanced data visualization.",
                    status: "Selected",
                    keyFeatures: [
                      "Unified dashboard",
                      "Smart task management",
                      "Real-time equipment tracking"
                    ],
                    useCarousel: true,
                    carouselType: "operationsCenterConcept"
                  },
                  {
                    name: "Seed2Product",
                    description: "An innovative approach reimagining farm management through natural interactions.",
                    status: "Rejected",
                    keyFeatures: [
                      "Voice-first interface",
                      "AR field visualization",
                      "Predictive analytics"
                    ],
                    useCarousel: true,
                    carouselType: "seed2productConcept"
                  }
                ]
              }
            },
            {
              id: 'wireframes',
              type: 'wireframes',
              title: "Wireframes",
              icon: IoConstructOutline,
              description: "Early Wireframes: Validating Our Ideas",
              content: {
                screens: [
                  {
                    name: "Status Feed (Overview)",
                    image: {
                      url: "/images/Case Studies/JD/Wireframe/Status Feed gestures.jpg",
                      caption: "Status feed interface with task overview"
                    },
                    purpose: "Provide a centralized view of daily tasks, status updates, and relevant alerts. Enable users to quickly access and edit tasks with minimal navigation.",
                    challengesAddressed: [
                      "Farmers struggled with finding task progress and updates quickly in the original app.",
                      "Task analysis revealed that quick access to comments and updates was critical for efficiency."
                    ],
                    keyFeatures: [
                      "Status feed highlights daily updates, task progress percentages, and comments for field tasks.",
                      "\"Quick Add\" functionality simplifies task creation without navigating away."
                    ],
                    feedbackAndRefinements: [
                      "Early feedback revealed users wanted easier access to task-specific actions, resulting in the inclusion of quick action buttons (e.g., edit, comment, mark complete).",
                      "The slider for task progress was refined for better usability after users expressed confusion about its function during testing."
                    ]
                  },
                  {
                    name: "Map (Customizable Field Layout)",
                    image: {
                      url: "/images/Case Studies/JD/Wireframe/Map gestures.jpg",
                      caption: "Field layout and customization interface"
                    },
                    purpose: "Enable users to manage field rows and sections visually, making it easier to assign tasks and track progress. Provide customization options for each row and section (e.g., shape, size, color coding).",
                    challengesAddressed: [
                      "The original app lacked a visual interface for field management, forcing users to rely on text-heavy workflows.",
                      "Task analysis revealed a need for simplified field segmentation and visual customization."
                    ],
                    keyFeatures: [
                      "Drag-and-drop functionality for adding and editing rows and sections.",
                      "Customization tools for defining cell shapes, sizes, and colors to reflect real field layouts."
                    ],
                    feedbackAndRefinements: [
                      "Users wanted a quicker way to toggle between rows, leading to the introduction of horizontal swipe gestures.",
                      "Added a contextual menu for quick access to section-specific details and actions."
                    ]
                  },
                  {
                    name: "Plan (Weekly Work Plan and Prioritization)",
                    image: {
                      url: "/images/Case Studies/JD/Wireframe/Plan gestures.jpg",
                      caption: "Weekly planning and task prioritization interface"
                    },
                    purpose: "Organize weekly work plans into a clear and editable hierarchy, with prioritization options for urgent tasks. Provide detailed task-level information, such as assigned team members and progress metrics.",
                    challengesAddressed: [
                      "The original app's planning tools were rigid and difficult to customize for real-time changes.",
                      "Farmers requested better task grouping and prioritization capabilities."
                    ],
                    keyFeatures: [
                      "Expandable and collapsible task sections make it easy to focus on specific rows or priorities.",
                      "Priority tasks are visually flagged, ensuring urgent actions are not missed."
                    ],
                    feedbackAndRefinements: [
                      "Collapsible sections were refined after early wireframes showed users struggling to locate subtasks.",
                      "The ability to sort tasks by priority was added based on user requests."
                    ]
                  },
                  {
                    name: "Analyze (Field and Revenue Reports)",
                    image: {
                      url: "/images/Case Studies/JD/Wireframe/Analyze gestures.jpg",
                      caption: "Analytics and reporting interface"
                    },
                    purpose: "Consolidate crop, seeding, and revenue insights into a single tab for data-driven decision-making. Provide actionable insights with clear visualizations (e.g., bar graphs, pie charts).",
                    challengesAddressed: [
                      "The original app buried essential reports in multiple sub-menus, increasing cognitive load.",
                      "Farmers wanted easily digestible insights for field and revenue performance."
                    ],
                    keyFeatures: [
                      "Tabbed navigation for \"Field Info\" and \"Revenue\" reports allows users to switch views seamlessly.",
                      "Interactive visualizations (e.g., monthly income and profit breakdowns) improve usability."
                    ],
                    feedbackAndRefinements: [
                      "Users preferred having financial and field data in separate tabs, leading to the clear separation of \"Field Info\" and \"Revenue\" views.",
                      "Added tooltips to chart elements for better interpretability after early feedback highlighted confusion over graph details."
                    ]
                  },
                  
                ]
              }
            }
          ]
        }
      ]
    },
    "influencerMarketing": {
      title: "Solution Framework",
      summary: "Through product analysis and task observation, we identified key issues in campaign management and developed solutions focused on streamlining workflows and improving visibility.",
      sections: [
        {
          type: 'process',
          steps: [
            {
              id: 'product-analysis',
              type: 'analysis',
              title: "Product Analysis",
              icon: IoSearchOutline,
              description: "Key issues with existing product",
              content: {
                coverImage: {
                  url: "/images/Case Studies/MI/Original Design/old design campaign.svg",
                  caption: "Product Analysis Overview",
                  alt: "Overview of product analysis"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "Influencer Status in Campaigns",
                    icon: IoPersonOutline,
                    issue: "Lack of visibility into the status of influencers within a campaign (e.g., pending, active, completed).",
                    impact: "Delayed follow-ups and unclear campaign tracking, leading to reduced efficiency.",
                    additionalValidation: "User interviews revealed frustration over unclear statuses, with 50% of participants expressing the need for real-time updates."
                  },
                  {
                    category: "Contract Management",
                    icon: IoDocumentTextOutline,
                    issue: "Managing contracts across platforms was disjointed, with no unified view of contract stages or deadlines.",
                    impact: "Increased risk of missing critical deadlines and inefficient workflow for small businesses.",
                    additionalValidation: "Task analysis highlighted 30% of time wasted in reconciling contract details manually."
                  },
                  {
                    category: "Campaign Tracking",
                    icon: IoStatsChartOutline,
                    issue: "Fragmented tools made it difficult to get a holistic view of campaign performance (e.g., influencer contributions, campaign ROI).",
                    impact: "Reduced confidence in decision-making and slower iteration cycles for campaigns.",
                    additionalValidation: "Usability testing revealed low engagement with campaign tracking features, with 40% of users abandoning mid-task."
                  }
                ]
              }
            },
            {
              id: 'user-workflows',
              type: 'analysis',
              title: "User Workflows",
              icon: IoTimerOutline,
              description: "Analysis of current user processes",
              content: {
                useCarousel: true,
                carouselType: "taskAnalysis",
                summary: "Analysis of key tasks revealed significant inefficiencies in current workflows",
                metrics: {
                  overallCompletionTime: "4.5 hours average per campaign",
                  overallSuccessRate: "45%",
                  participantCount: "15 small business owners"
                },
                findings: [
                  {
                    category: "Influencer Discovery",
                    icon: IoSearchOutline,
                    description: "Manual search and vetting process across multiple platforms",
                    metrics: {
                      completionTime: "2.5 hours average",
                      successRate: "40%",
                      failureNote: "60% of matches were irrelevant to brand needs"
                    },
                    issue: "Manual discovery process lacks efficiency and accuracy",
                    impact: "Significant time waste on unsuitable matches",
                    additionalValidation: "User interviews confirmed high frustration with search process"
                  },
                  {
                    category: "Campaign Creation",
                    icon: IoCreateOutline,
                    description: "Process of setting up new campaign parameters and requirements",
                    metrics: {
                      completionTime: "1.2 hours average",
                      successRate: "60%",
                      failureNote: "40% needed to revise campaign parameters multiple times"
                    },
                    issue: "Complex setup process with redundant data entry",
                    impact: "Extended campaign launch timelines",
                    additionalValidation: "Task analysis revealed duplicate data entry across platforms"
                  },                  
                  {
                    category: "Contract Processing",
                    icon: IoDocumentTextOutline,
                    description: "Managing influencer agreements and terms",
                    metrics: {
                      completionTime: "45 minutes per contract",
                      successRate: "50%",
                      failureNote: "50% of contracts required multiple revision cycles"
                    },
                    issue: "Manual contract creation and tracking process",
                    impact: "Delayed campaign starts due to contract bottlenecks",
                    additionalValidation: "Interview feedback highlighted contract management as major pain point"
                  },
                  {
                    category: "Campaign Setup",
                    icon: IoAppsOutline,
                    description: "Complex process of creating and managing campaign details",
                    metrics: {
                      completionTime: "1.5 hours average",
                      successRate: "55%",
                      failureNote: "45% experienced data entry errors"
                    },
                    issue: "Fragmented campaign setup workflow",
                    impact: "High error rates in campaign configurations",
                    additionalValidation: "Task analysis showed redundant steps in setup process"
                  }
                ]
              }
            },
            {
              id: 'design-iterations',
              type: 'concepts',
              title: "Solution Focus Areas",
              icon: IoBulbOutline,
              description: "Exploring different design approaches",
              content: {
                concepts: [
                  {
                    name: "Unified Campaign Management",
                    description: "A centralized dashboard system that consolidates campaign tracking, influencer management, and contract handling.",
                    status: "Selected",
                    keyFeatures: [
                      "Real-time campaign metrics visualization",
                      "Unified status tracking interface",
                      "Automated contract workflow system"
                    ],
                    useCarousel: true,
                    carouselType: "campaignDashboardConcept"
                  },
                  {
                    name: "Status Tracking System",
                    description: "Real-time tracking and notification system for campaign and influencer status updates.",
                    status: "Selected",
                    keyFeatures: [
                      "Automated status notifications",
                      "Progress tracking visualization",
                      "Milestone alert system"
                    ],
                    useCarousel: true,
                    carouselType: "statusTrackingConcept"
                  },
                  {
                    name: "Contract Template System",
                    description: "Streamlined contract creation and management system with automated workflows.",
                    status: "Selected",
                    keyFeatures: [
                      "Template-based contract generation",
                      "Automated approval workflows",
                      "Integrated tracking and reminders"
                    ],
                    useCarousel: true,
                    carouselType: "contractTemplateConcept"
                  }
                ]
              }
            },
            {
              id: 'wireframe-concepts',
              type: 'wireframes',
              title: "Design Development",
              icon: IoConstructOutline,
              description: "Interface components implementing our core solutions",
              content: {
                screens: [
                  {
                    name: "Campaign Overview Dashboard",
                    image: {
                      url: "/images/Case Studies/MI/Wireframes/campaign overview.jpg",
                      caption: "Unified campaign management interface"
                    },
                    purpose: "Create a centralized command center that unifies campaign management, influencer tracking, and performance metrics.",
                    challengesAddressed: [
                      "Fragmented campaign management across multiple platforms",
                      "Lack of unified performance tracking"
                    ],
                    keyFeatures: [
                      "Real-time campaign status visualization",
                      "Integrated influencer performance metrics",
                      "At-a-glance campaign progress indicators"
                    ],
                    feedbackAndRefinements: [
                      "Added visual status indicators based on user feedback about tracking clarity",
                      "Implemented one-click access to common actions for efficiency"
                    ]
                  },
                  {
                    name: "Status Tracking System",
                    image: {
                      url: "/images/Case Studies/MI/Wireframes/system icons.svg",
                      caption: "Real-time status tracking interface"
                    },
                    purpose: "Provide immediate visibility into campaign and influencer statuses with automated updates.",
                    challengesAddressed: [
                      "Manual status tracking leading to delays",
                      "Inconsistent status updates across team members"
                    ],
                    keyFeatures: [
                      "Automated status change notifications",
                      "Visual progress tracking",
                      "Integrated timeline view"
                    ],
                    feedbackAndRefinements: [
                      "Enhanced status categorization based on user workflow patterns",
                      "Added bulk status update capabilities for efficiency"
                    ]
                  },
                  {
                    name: "Contract Management Interface",
                    image: {
                      url: "/images/Case Studies/MI/Wireframes/contracts full page.jpg",
                      caption: "Streamlined contract management system"
                    },
                    purpose: "Streamline the entire contract lifecycle from creation to signing and tracking.",
                    challengesAddressed: [
                      "Time-consuming manual contract creation",
                      "Difficulty tracking contract statuses across campaigns"
                    ],
                    keyFeatures: [
                      "Template-based contract generation",
                      "Automated approval workflows",
                      "Contract status tracking integration"
                    ],
                    feedbackAndRefinements: [
                      "Simplified template customization based on user testing",
                      "Added batch contract processing for multiple influencers"
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    "taskReminders": {
      title: "Solution Framework",
      summary: "Based on research insights, we developed a context-aware reminder system that adapts to user behavior and environmental factors.",
      sections: [
        {
          type: 'process',
          steps: [
            {
              id: 'system-analysis',
              type: 'analysis',
              title: "System Analysis",
              icon: IoSearchOutline,
              description: "Simple comparison with traditional reminders",
              content: {
                coverImage: {
                  url: "/images/Case Studies/TaskReminders/system-analysis.jpg",
                  caption: "System Analysis Overview",
                  alt: "Overview of system analysis"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "Notification Timing",
                    issue: "Current systems use fixed schedules without context",
                    impact: "73% of reminders are dismissed or postponed",
                    additionalValidation: "Time-motion studies showed poor timing correlation"
                  },
                  {
                    category: "Context Awareness",
                    issue: "No consideration of user's current state or environment",
                    impact: "40% of notifications arrive at inappropriate moments",
                    additionalValidation: "User activity logs confirmed timing mismatches"
                  }
                ]
              }
            },
            {
              id: 'user-behavior',
              type: 'analysis',
              title: "User Behavior Analysis",
              icon: IoTimerOutline,
              description: "Spatial vs. traditional reminder patterns",
              content: {
                useCarousel: true,
                carouselType: "taskAnalysis",
                summary: "Analysis of user behavior revealed key patterns in task completion and notification response",
                metrics: {
                  overallCompletionTime: "2.5 minutes average response time",
                  overallSuccessRate: "45%",
                  participantCount: "250 users tracked"
                },
                findings: [
                  {
                    category: "Response Patterns",
                    icon: IoNotificationsOutline,
                    description: "Analysis of notification response times and contexts",
                    metrics: {
                      completionTime: "45 seconds optimal window",
                      successRate: "35%",
                      failureNote: "65% of notifications missed optimal timing"
                    },
                    issue: "Fixed notification timing ignores user context",
                    impact: "High dismissal rate due to poor timing",
                    additionalValidation: "Time-motion studies confirmed contextual mismatch"
                  },
                  {
                    category: "Context Impact",
                    icon: IoLocationOutline,
                    description: "Effect of different contexts on task completion",
                    metrics: {
                      completionTime: "1.8 minutes with context",
                      successRate: "82%",
                      failureNote: "18% needed additional prompts"
                    },
                    issue: "Lack of environmental awareness in notifications",
                    impact: "Reduced task completion rates in certain contexts",
                    additionalValidation: "Location tracking showed strong correlation with completion rates"
                  }
                ]
              }
            },
            {
              id: 'concept-development',
              type: 'concepts',
              title: "Concept Development",
              icon: IoBulbOutline,
              description: "Spatial note system and AR interface designs",
              content: {
                concepts: [
                  {
                    title: "Smart Context Engine",
                    description: "AI system that learns from user behavior and environmental factors",
                    features: [
                      "Location awareness",
                      "Activity recognition",
                      "Time pattern analysis",
                      "Priority learning"
                    ],
                    image: "/images/Case Studies/TaskReminders/Concepts/smart-context.jpg"
                  },
                  {
                    title: "Adaptive Interface",
                    description: "UI that adjusts based on user context and task priority",
                    features: [
                      "Context-based layouts",
                      "Priority visualization",
                      "Gesture shortcuts",
                      "Voice interactions"
                    ],
                    image: "/images/Case Studies/TaskReminders/Concepts/adaptive-ui.jpg"
                  }
                ]
              }
            },
            {
              id: 'design-iterations',
              type: 'wireframes',
              title: "Design Iterations",
              icon: IoConstructOutline,
              description: "Key interaction mockups and iterations",
              content: {
                screens: [
                  {
                    name: "Discovery (AI-Powered Search and Matching)",
                    image: {
                      url: "/images/Case Studies/MI/Wireframe/Discovery interface.jpg",
                      caption: "AI-powered influencer discovery interface"
                    },
                    purpose: "Streamline influencer discovery with AI-powered matching and smart filters. Provide detailed insights into match quality and potential campaign fit.",
                    challengesAddressed: [
                      "Manual search process was time-consuming and inefficient",
                      "Match quality was difficult to assess without detailed metrics"
                    ],
                    keyFeatures: [
                      "Smart filters that adapt based on campaign goals",
                      "AI-powered match scoring with detailed explanations",
                      "Quick-view profiles with key metrics and past performance"
                    ],
                    feedbackAndRefinements: [
                      "Added detailed match explanations after users requested more transparency in AI decisions",
                      "Simplified filter interface based on user testing feedback"
                    ]
                  },
                  {
                    name: "Campaign Dashboard (Performance Tracking)",
                    image: {
                      url: "/images/Case Studies/MI/Wireframe/Campaign dashboard.jpg",
                      caption: "Centralized campaign management dashboard"
                    },
                    purpose: "Provide a unified view of campaign status, influencer performance, and key metrics. Enable quick actions for common campaign management tasks.",
                    challengesAddressed: [
                      "Scattered campaign data made tracking difficult",
                      "Lack of real-time performance insights"
                    ],
                    keyFeatures: [
                      "Real-time performance metrics and ROI tracking",
                      "Status updates for all campaign participants",
                      "Automated alerts for key milestones and issues"
                    ],
                    feedbackAndRefinements: [
                      "Added customizable dashboard layouts based on user preferences",
                      "Integrated quick-action buttons for common tasks after usability testing"
                    ]
                  },
                  {
                    name: "Contract Management",
                    image: {
                      url: "/images/Case Studies/MI/Wireframe/Contract management.jpg",
                      caption: "Streamlined contract management interface"
                    },
                    purpose: "Simplify contract creation, tracking, and management. Automate routine contract tasks and provide clear status visibility.",
                    challengesAddressed: [
                      "Contract management was manual and error-prone",
                      "Status tracking was inconsistent across platforms"
                    ],
                    keyFeatures: [
                      "Template-based contract generation",
                      "Digital signature integration",
                      "Automated reminders and status tracking"
                    ],
                    feedbackAndRefinements: [
                      "Simplified contract templates based on user feedback",
                      "Added bulk contract management features for larger campaigns"
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    "sustainablePackaging": {
      title: "Solution Framework",
      summary: "Our solution leverages AR and gamification to make sustainable packaging choices more engaging and accessible.",
      sections: [
        {
          type: 'process',
          steps: [
            {
              id: 'concept-research',
              type: 'analysis',
              title: "Concept Research",
              icon: IoSearchOutline,
              description: "AR packaging inspiration and concept sketches",
              content: {
                coverImage: {
                  url: "/images/Case Studies/SustainablePackaging/cost-breakdown.jpg",
                  caption: "Cost Analysis Framework",
                  alt: "Detailed cost breakdown visualization"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "Material Costs",
                    issue: "30-45% premium on sustainable materials",
                    impact: "Major barrier for mid-sized retailers",
                    solution: "Volume-based discounts and subsidies"
                  },
                  {
                    category: "Implementation Costs",
                    issue: "High transition and training expenses",
                    impact: "Extended ROI timeline",
                    solution: "Phased implementation with support funding"
                  }
                ]
              }
            },
            {
              id: 'gamification-framework',
              type: 'analysis',
              title: "Gamification Framework",
              icon: IoTimerOutline,
              description: "Analysis of engagement patterns",
              content: {
                useCarousel: true,
                carouselType: "taskAnalysis",
                summary: "Analysis of user engagement revealed opportunities for gamification",
                metrics: {
                  overallCompletionTime: "3.2 minutes per decision",
                  overallSuccessRate: "52%",
                  participantCount: "180 retail buyers"
                },
                findings: [
                  {
                    category: "Reward Mechanics",
                    icon: IoGameControllerOutline,
                    description: "Analysis of user motivation through rewards",
                    metrics: {
                      completionTime: "2.5 minutes average",
                      successRate: "48%",
                      failureNote: "52% found current incentives unclear"
                    },
                    issue: "Lack of clear incentive structure",
                    impact: "Low engagement with sustainable options",
                    additionalValidation: "User feedback indicated desire for tangible rewards"
                  },
                  {
                    category: "Progress Tracking",
                    icon: IoStatsChartOutline,
                    description: "Evaluation of achievement system effectiveness",
                    metrics: {
                      completionTime: "1.8 minutes average",
                      successRate: "65%",
                      failureNote: "35% couldn't track their progress"
                    },
                    issue: "Poor visibility of sustainability progress",
                    impact: "Reduced long-term engagement",
                    additionalValidation: "Analytics showed drop in repeated sustainable choices"
                  }
                ]
              }
            },
            {
              id: 'ar-interaction',
              type: 'wireframes',
              title: "AR Interaction Design",
              icon: IoPhonePortraitOutline,
              description: "Interface components and wireframes",
              content: {
                screens: [
                  {
                    name: "Discovery (AI-Powered Search and Matching)",
                    image: {
                      url: "/images/Case Studies/MI/Wireframe/Discovery interface.jpg",
                      caption: "AI-powered influencer discovery interface"
                    },
                    purpose: "Streamline influencer discovery with AI-powered matching and smart filters. Provide detailed insights into match quality and potential campaign fit.",
                    challengesAddressed: [
                      "Manual search process was time-consuming and inefficient",
                      "Match quality was difficult to assess without detailed metrics"
                    ],
                    keyFeatures: [
                      "Smart filters that adapt based on campaign goals",
                      "AI-powered match scoring with detailed explanations",
                      "Quick-view profiles with key metrics and past performance"
                    ],
                    feedbackAndRefinements: [
                      "Added detailed match explanations after users requested more transparency in AI decisions",
                      "Simplified filter interface based on user testing feedback"
                    ]
                  },
                  {
                    name: "Campaign Dashboard (Performance Tracking)",
                    image: {
                      url: "/images/Case Studies/MI/Wireframe/Campaign dashboard.jpg",
                      caption: "Centralized campaign management dashboard"
                    },
                    purpose: "Provide a unified view of campaign status, influencer performance, and key metrics. Enable quick actions for common campaign management tasks.",
                    challengesAddressed: [
                      "Scattered campaign data made tracking difficult",
                      "Lack of real-time performance insights"
                    ],
                    keyFeatures: [
                      "Real-time performance metrics and ROI tracking",
                      "Status updates for all campaign participants",
                      "Automated alerts for key milestones and issues"
                    ],
                    feedbackAndRefinements: [
                      "Added customizable dashboard layouts based on user preferences",
                      "Integrated quick-action buttons for common tasks after usability testing"
                    ]
                  },
                  {
                    name: "Contract Management",
                    image: {
                      url: "/images/Case Studies/MI/Wireframe/Contract management.jpg",
                      caption: "Streamlined contract management interface"
                    },
                    purpose: "Simplify contract creation, tracking, and management. Automate routine contract tasks and provide clear status visibility.",
                    challengesAddressed: [
                      "Contract management was manual and error-prone",
                      "Status tracking was inconsistent across platforms"
                    ],
                    keyFeatures: [
                      "Template-based contract generation",
                      "Digital signature integration",
                      "Automated reminders and status tracking"
                    ],
                    feedbackAndRefinements: [
                      "Simplified contract templates based on user feedback",
                      "Added bulk contract management features for larger campaigns"
                    ]
                  }
                ]
              }
            },
            {
              id: 'technical-implementation',
              type: 'implementation',
              title: "Technical Implementation",
              icon: IoCodeSlashOutline,
              description: "AR demonstration and implementation flow",
              content: {
                coverImage: {
                  url: "/images/Case Studies/SustainablePackaging/cost-breakdown.jpg",
                  caption: "Cost Analysis Framework",
                  alt: "Detailed cost breakdown visualization"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "Material Costs",
                    issue: "30-45% premium on sustainable materials",
                    impact: "Major barrier for mid-sized retailers",
                    solution: "Volume-based discounts and subsidies"
                  },
                  {
                    category: "Implementation Costs",
                    issue: "High transition and training expenses",
                    impact: "Extended ROI timeline",
                    solution: "Phased implementation with support funding"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
};