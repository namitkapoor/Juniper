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
                coverImage: {
                  url: "/images/Case Studies/JD/Task Analysis/Combined.jpg",
                  caption: "Task Analysis Overview",
                  alt: "Overview of product analysis"
                },
                useCarousel: false,
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
                  url: "/images/Case Studies/MI/Original Design/original design high res.jpg",
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
                    name: "Campaign Hub",
                    description: "All-in-one dashboard for managing influencer campaigns.",
                    status: "Selected",
                    keyFeatures: [
                      "Live campaign tracking",
                      "Status monitoring",
                      "Contract management"
                    ],
                    useCarousel: true,
                    carouselType: "campaignDashboardConcept"
                  },
                  {
                    name: "Progress Tracker",
                    description: "Real-time system for monitoring campaign progress.",
                    status: "Selected",
                    keyFeatures: [
                      "Auto notifications",
                      "Visual progress bars",
                      "Key milestone alerts"
                    ],
                    useCarousel: true,
                    carouselType: "statusTrackingConcept"
                  },
                  {
                    name: "Contract System",
                    description: "Simplified contract creation and handling process.",
                    status: "Selected",
                    keyFeatures: [
                      "Quick contract creation",
                      "Automated workflows",
                      "Built-in reminders"
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
              description: "Spatial interaction patterns with traditional and AR reminders",
              content: {
                coverImage: {
                  url: "/images/Case Studies/TR/Solution Framework/Combined icons.svg",
                  caption: "Task Analysis Overview",
                  alt: "Overview of task analysis"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "Current Reminder Systems",
                    icon: IoNotificationsOutline,
                    issue: "Traditional reminders lack spatial context and physical environment awareness",
                    impact: "Users struggle to connect digital reminders with physical tasks",
                    additionalValidation: "Research showed strong correlation between physical context and task completion"
                  },
                  {
                    category: "Spatial Memory Formation",
                    icon: IoLocationOutline,
                    issue: "Digital reminders don't leverage natural spatial memory patterns",
                    impact: "Missed opportunity to use location-based memory cues",
                    additionalValidation: "Studies confirm better recall with spatial associations"
                  },
                  {
                    category: "AR Interface Patterns",
                    icon: IoPhonePortraitOutline,
                    issue: "Current AR solutions show limited contextual understanding",
                    impact: "Poor integration between digital and physical spaces",
                    additionalValidation: "User testing revealed preference for spatially-anchored information"
                  }
                ]
              }
            },
            {
              id: 'user-behavior',
              type: 'analysis',
              title: "User Behavior Analysis",
              icon: IoTimerOutline,
              description: "Understanding how young adults manage tasks and information",
              content: {
                useCarousel: true,
                carouselType: "taskAnalysis",
                summary: "Research revealed strong preferences for physical-digital hybrid approaches to task management",
                metrics: {
                  overallCompletionTime: "2.5 minutes average task creation time",
                  overallSuccessRate: "45% using single system",
                  participantCount: "250 young adults"
                },
                findings: [
                  {
                    category: "Ideation Patterns",
                    icon: IoCreateOutline,
                    description: "How young adults brainstorm and create reminders",
                    metrics: {
                      completionTime: "45 seconds for physical notes",
                      successRate: "75% prefer physical first",
                      failureNote: "25% struggle with digital transfer"
                    },
                    issue: "Physical ideation preferred but causes digital redundancy",
                    impact: "Time wasted in transferring physical notes to digital",
                    additionalValidation: "User interviews showed strong preference for quick physical noting"
                  },
                  {
                    category: "Information Organization",
                    icon: IoLayersOutline,
                    description: "Preferred methods of organizing task information",
                    metrics: {
                      completionTime: "1.8 minutes organizing digitally",
                      successRate: "65% use multiple tools",
                      failureNote: "35% report lost information between systems"
                    },
                    issue: "Fragmented organization across physical and digital tools",
                    impact: "Cognitive load from managing multiple systems",
                    additionalValidation: "Task analysis revealed tool-switching patterns"
                  },
                  {
                    category: "Physical Context",
                    icon: IoLocationOutline,
                    description: "Role of environment in information organization",
                    metrics: {
                      completionTime: "30 seconds to locate physical reminders",
                      successRate: "85% recall with spatial placement",
                      failureNote: "15% struggle with digital-only reminders"
                    },
                    issue: "Digital systems ignore physical context benefits",
                    impact: "Missed opportunity for spatial memory enhancement",
                    additionalValidation: "Environmental placement strongly correlates with recall"
                  }
                ]
              }
            },
            {
              id: 'concept-development',
              type: 'concepts',
              title: "Concept Development",
              icon: IoBulbOutline,
              description: "Bridging physical and digital task management",
              content: {
                concepts: [
                  {
                    name: "Spatial Note System",
                    description: "A system allowing notes to persist in both physical spaces and digital calendars",
                    status: "Selected",
                    keyFeatures: [
                      "Physical space anchoring",
                      "Digital calendar integration",
                      "Cross-platform persistence",
                      "Environmental context preservation"
                    ],
                    useCarousel: true,
                    carouselType: "spatialNoteConcept"
                  },
                  {
                    name: "Priority Visualization",
                    description: "Visual system for managing reminder importance and urgency",
                    status: "Selected",
                    keyFeatures: [
                      "Proximity-based priority",
                      "Visual urgency indicators",
                      "Context-aware visibility",
                      "Intuitive organization"
                    ],
                    useCarousel: true,
                    carouselType: "priorityVisConcept"
                  },
                  {
                    name: "Context-Aware Notifications",
                    description: "Notification system that adapts to user's environment and activity",
                    status: "Selected",
                    keyFeatures: [
                      "Environment-based triggers",
                      "Location awareness",
                      "Activity recognition",
                      "Adaptive reminder timing"
                    ],
                    useCarousel: true,
                    carouselType: "contextNotificationConcept"
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
              description: "Exploring AR and gamification in retail environments",
              content: {
                coverImage: {
                  url: "/images/Case Studies/SP/Research/Genuine researrch inspo.png",
                  caption: "Task Analysis Overview",
                  alt: "Overview of task analysis"
                },
                useCarousel: false,
                findings: [
                  {
                    category: "AR Retail Experiences",
                    icon: IoPhonePortraitOutline,
                    issue: "Limited engagement with sustainability information in traditional retail",
                    impact: "Consumers struggle to make informed sustainable choices",
                    additionalValidation: "Market research showed increased engagement with interactive AR displays"
                  },
                  {
                    category: "Gamification Mechanics",
                    icon: IoGameControllerOutline,
                    issue: "Lack of immediate feedback for sustainable choices",
                    impact: "Missing motivation for sustainable purchasing decisions",
                    additionalValidation: "Studies show improved behavior change with gamified systems"
                  },
                  {
                    category: "Reward Systems",
                    icon: IoStatsChartOutline,
                    issue: "No clear incentive structure for sustainable choices",
                    impact: "Difficulty in maintaining long-term engagement",
                    additionalValidation: "User research indicated strong interest in achievement-based rewards"
                  }
                ]
              }
            },
            {
              id: 'gamification-framework',
              type: 'analysis',
              title: "Gamification Framework",
              icon: IoGameControllerOutline,
              description: "Analyzing engagement patterns through game mechanics",
              content: {
                useCarousel: true,
                carouselType: "taskAnalysis",
                summary: "User engagement analysis revealed opportunities for gamified sustainability features",
                metrics: {
                  overallCompletionTime: "3.2 minutes per decision",
                  overallSuccessRate: "52%",
                  participantCount: "180 retail buyers"
                },
                findings: [
                  {
                    category: "Sustainability Scoring",
                    icon: IoStatsChartOutline,
                    description: "Point system and reward calculation mechanics",
                    metrics: {
                      completionTime: "2.5 minutes average",
                      successRate: "48%",
                      failureNote: "52% found current sustainability metrics unclear"
                    },
                    issue: "Complex sustainability metrics difficult to understand",
                    impact: "Users struggle to evaluate product sustainability",
                    additionalValidation: "Simplified scoring system increased engagement by 45%"
                  },
                  {
                    category: "Achievement System",
                    icon: IoGameControllerOutline,
                    description: "Progress tracking and reward tiers",
                    metrics: {
                      completionTime: "1.8 minutes average",
                      successRate: "65%",
                      failureNote: "35% didn't understand achievement progression"
                    },
                    issue: "Lack of clear progression in sustainability choices",
                    impact: "Limited motivation for continued sustainable choices",
                    additionalValidation: "Tiered rewards increased repeat sustainable purchases"
                  }
                ]
              }
            },
            {
              id: 'ar-interaction',
              type: 'concepts',
              title: "AR Interaction Design",
              icon: IoPhonePortraitOutline,
              description: "AR interface concepts and gamification elements",
              content: {
                concepts: [
                  {
                    name: "AR Scanner Interface",
                    description: "Real-time package recognition and sustainability information display",
                    status: "Selected",
                    keyFeatures: [
                      "One-touch scan activation",
                      "Visual scanning guidance",
                      "Immediate feedback system",
                      "AR information overlay"
                    ],
                    useCarousel: true,
                    carouselType: "scannerConcept"
                  },
                  {
                    name: "Scoring Visualization",
                    description: "Interactive display of sustainability metrics and impact",
                    status: "Selected",
                    keyFeatures: [
                      "Dynamic score calculation",
                      "Impact visualization",
                      "Comparative metrics",
                      "Educational tooltips"
                    ],
                    useCarousel: true,
                    carouselType: "scoringConcept"
                  },
                  {
                    name: "Reward System",
                    description: "Gamified achievement tracking and reward mechanics",
                    status: "Selected",
                    keyFeatures: [
                      "Achievement unlocks",
                      "Progress tracking",
                      "Social sharing",
                      "Reward collection"
                    ],
                    useCarousel: true,
                    carouselType: "rewardsConcept"
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