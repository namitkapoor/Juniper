import { 
  IoLayersOutline,
  IoSearchOutline,
  IoTimerOutline,
  IoBulbOutline,
  IoConstructOutline
} from 'react-icons/io5';

export const solutionPhase = 
{
    id: 'solution',
    title: 'Solution Framework',
    icon: IoLayersOutline,
    type: 'solution',
    content: {
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
                    issue: "The app's navigation pathways were overly complex, requiring multiple steps to access frequently used features.",
                    impact: "This led to increased task completion times, causing frustration among users with time-sensitive workflows.",
                    additionalValidation: "Task analysis validated the need for streamlining navigation by identifying common workflows."
                  },
                  {
                    category: "Unnecessary Features",
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
    }
  };