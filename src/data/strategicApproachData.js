import { 
  IoAnalyticsOutline, 
  IoLayersOutline, 
  IoGitBranchOutline, 
  IoCodeWorkingOutline,
  IoPersonOutline,
  IoDocumentOutline,
  IoBarChartOutline,
  IoCheckmarkCircleOutline,
  IoAccessibility,
  IoContract,
  IoSearchOutline,
  IoTimerOutline,
  IoBulbOutline,
  IoConstructOutline
} from 'react-icons/io5';

export const strategicApproachData = {
  "manageFarms": {
    phases: [
      {
        id: 'research',
        title: 'Research Insights',
        icon: IoAnalyticsOutline,
        type: 'research',
        content: {
          title: "Research Insights",
          summary: "Our research uncovered four key design requirements that guided the solution.",
          sections: [
            {
              type: 'requirements',
              items: [
                {
                  category: "Time Management",
                  insight: "Farmers need efficient task scheduling due to long work hours",
                  methodologies: ["User Interviews", "Field Observations", "Affinity Diagrams", "Storyboards"],
                  response: "Task-centric daily planner with priority scheduling"
                },
                {
                  category: "Inventory Tracking",
                  insight: "Manual inventory tracking leads to stockouts and waste",
                  methodologies: ["Journey Maps", "Survey Data", "Storyboards", "User Interviews"],
                  response: "Automated inventory system with low-stock alerts"
                },
                {
                  category: "Financial Tools",
                  insight: "Basic accounting needs are not met by current solutions",
                  methodologies: ["User Interviews", "Journey Maps", "Survey Data", "Affinity Diagrams"],
                  response: "Simplified expense tracking and reporting"
                },
                {
                  category: "Crop Planning",
                  insight: "Soil-based planting decisions need better support",
                  methodologies: ["Field Observations", "Survey Data", "Storyboards", "Affinity Diagrams"],
                  response: "AI-powered crop recommendation engine"
                }
              ]
            },
            {
              type: 'methodology',
              items: {
                "User Interviews": { color: "#9C4221", textColor: "light" },
                "Field Observations": { color: "#276749", textColor: "light" },
                "Journey Maps": { color: "#6B3FA0", textColor: "light" },
                "Survey Data": { color: "#007BFF", textColor: "light" },
                "Storyboards": { color: "#FFA500", textColor: "light" },
                "Affinity Diagrams": { color: "#00FF00", textColor: "light" }
              }
            }
          ]
        }
      },
      {
        id: 'solution',
        title: 'Solution Framework',
        icon: IoLayersOutline,
        type: 'solution',
        content: {
          title: "Solution Framework",
          summary: "A streamlined redesign focusing on core workflows and enhanced data visualization.",
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
                    image: {
                      url: "/images/Case Studies/JD/OCM Critique.avif",
                      caption: "Product Analysis"
                    },
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
                    image: {
                      url: "/images/Case Studies/JD/Task Analysis/Choose crop task analysis.jpg",
                      caption: "Task Flow Analysis"
                    },
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
                        name: "Dashboard Overview",
                        image: {
                          url: "/images/Case Studies/JD/Wireframes/dashboard.svg",
                          caption: "Main dashboard with key metrics and alerts"
                        },
                        validations: [
                          "Clear hierarchy of information",
                          "Quick access to common tasks",
                          "Customizable views"
                        ]
                      },
                      {
                        name: "Equipment Management",
                        image: {
                          url: "/images/Case Studies/JD/Wireframes/equipment.svg",
                          caption: "Equipment tracking and management interface"
                        },
                        validations: [
                          "Real-time location tracking",
                          "Maintenance scheduling",
                          "Usage analytics"
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      },
      {
        id: 'decisions',
        title: 'Decision Criteria',
        icon: IoGitBranchOutline,
        loopBackTo: 1,
        iterationHint: null,
        connections: ['research', 'implementation'],
        content: {
          title: "Concept Feedback",
          summary: "Prioritized features based on user impact, technical feasibility, and business value.",
          images: [
            {
              url: "/images/Case Studies/JD/Sketch feedback - Alex.jpg",
              caption: "Feature Prioritization Matrix"
            },
            {
              url: "/images/Case Studies/JD/Sketch feedback - Watson.jpg",
              caption: "User Feedback Session Results"
            }

          ],
          criteria: [
            {
              title: "User Impact",
              weight: "40%",
              description: "High-priority tasks like inventory management and time tracking addressed the most common pain points",
              feedback: {
                text: "User testing showed 92% positive response to the proposed features",
                images: [
                  {
                    url: "/images/decisions/user-impact-metrics.jpg",
                    caption: "User Impact Metrics"
                  }
                ]
              }
            },
            {
              title: "Technical Feasibility",
              weight: "30%",
              description: "Selected features that balanced user needs with implementation complexity",
              feedback: {
                text: "Development team assessment confirmed viable implementation path",
                images: [
                  {
                    url: "/images/decisions/tech-feasibility.jpg",
                    caption: "Technical Feasibility Analysis"
                  }
                ]
              }
            },
            {
              title: "Business Value",
              weight: "30%",
              description: "Focused on features that could drive adoption and retention",
              feedback: {
                text: "ROI analysis projected 45% increase in user retention",
                images: [
                  {
                    url: "/images/decisions/business-impact.jpg",
                    caption: "Business Impact Analysis"
                  }
                ]
              }
            }
          ],
          decisions: [
            {
              feature: "Task Planner",
              rationale: "High user need, relatively simple implementation"
            },
            {
              feature: "Equipment Tracking",
              rationale: "Essential for brand loyalty, medium complexity"
            }
          ]
        }
      },
      {
        id: 'implementation',
        title: 'Implementation Plan',
        icon: IoCodeWorkingOutline,
        loopBackTo: 2,
        iterationHint: "Feature scope adjustment needed",
        iterations: [
          {
            trigger: "Development timeline constraints",
            action: "Return to decision phase for feature prioritization",
            outcome: "Phased release plan created",
            phase: 'decisions'
          },
          {
            trigger: "Integration complexity with legacy systems",
            action: "Revisited technical requirements",
            outcome: "Modified API approach",
            phase: 'decisions'
          }
        ],
        connections: ['solution', 'decisions'],
        content: {
          title: "Development Roadmap",
          summary: "Phased development ensured smooth delivery and iterative refinement.",
          phases: [
            {
              title: "Phase 1: Core Features",
              duration: "3 months",
              items: [
                "Basic task management",
                "Inventory tracking",
                "User onboarding flow"
              ]
            },
            {
              title: "Phase 2: Enhanced Features",
              duration: "2 months",
              items: [
                "Smart crop planning",
                "Reporting tools",
                "Weather integration"
              ]
            }
          ],
          metrics: {
            taskCompletion: "Task completion time reduced by 40%",
            adoptionRate: "Adoption rate among small farms increased by 50%",
            satisfaction: "User satisfaction score: 4.8/5 post-launch"
          }
        }
      }
    ]
  }
};