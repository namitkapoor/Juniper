import { 
  IoAnalyticsOutline, 
  IoLayersOutline, 
  IoGitBranchOutline, 
  IoCodeWorkingOutline,
  IoPersonOutline,
  IoDocumentOutline,
  IoBarChartOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

export const strategicApproachData = {
  "manageFarms": {
    phases: [
      {
        id: 'research',
        title: 'Research Insights',
        icon: IoAnalyticsOutline,
        loopBackTo: undefined,
        iterationHint: null,
        iterations: [],
        connections: ['solution', 'decisions'],
        content: {
          title: "User Research & Analysis",
          summary: "Our research uncovered four key design requirements that guided the solution.",
          designRequirements: [
            {
              category: "Time Management",
              insight: "Farmers need efficient task scheduling due to long work hours",
              methodologyTitle: "Research Methodologies",
              methodologies: ["User Interviews", "Field Observations", "Affinity Diagrams", "Storyboards"],
              designResponse: "Task-centric daily planner with priority scheduling"
            },
            {
              category: "Inventory Tracking",
              insight: "Manual inventory tracking leads to stockouts and waste",
              methodologies: ["Journey Maps", "Survey Data", "Storyboards", "User Interviews"],
              designResponse: "Automated inventory system with low-stock alerts"
            },
            {
              category: "Financial Tools",
              insight: "Basic accounting needs are not met by current solutions",
              methodologies: ["User Interviews", "Journey Maps", "Survey Data", "Affinity Diagrams"],
              designResponse: "Simplified expense tracking and reporting"
            },
            {
              category: "Crop Planning",
              insight: "Soil-based planting decisions need better support",
              methodologies: ["Field Observations", "Survey Data", "Storyboards", "Affinity Diagrams"],
              designResponse: "AI-powered crop recommendation engine"
            }
          ]
        }
      },
      {
        id: 'solution',
        title: 'Solution Framework',
        icon: IoLayersOutline,
        connections: ['research', 'implementation'],
        content: {
          title: "Design Strategy",
          summary: "Two concepts emerged from our research, exploring different approaches to farm management.",
          
          analyses: {
            product: {
              title: "Product Analysis",
              description: "Evaluation of existing Operations Center revealed key areas for improvement",
              image: {
                url: "/images/Case Studies/JD/OCM Critique.avif",
                caption: "Current Operations Center Interface Analysis"
              },
              findings: [
                {
                  category: "Navigation",
                  issues: "Complex menu hierarchy with buried features",
                  impact: "Users spend excessive time finding tools"
                },
                {
                  category: "Data Visualization",
                  issues: "Dense tables and basic charts",
                  impact: "Difficulty interpreting field performance"
                },
                {
                  category: "Task Management",
                  issues: "Manual input with limited automation",
                  impact: "Inefficient resource allocation"
                }
              ]
            },
            task: {
              title: "Task Analysis",
              description: "Five key workflows were mapped to identify friction points",
              workflows: [
                {
                  name: "Choose a Crop to Plant",
                  image: {
                    url: "/images/Case Studies/JD/Task Analysis/Harvest plans task analysis.jpg",
                    caption: "Crop Selection Workflow"
                  },
                  steps: [
                    "Review soil analysis data",
                    "Check historical crop performance",
                    "Consider market demand",
                    "Evaluate seasonal timing",
                    "Calculate resource requirements"
                  ],
                  painPoints: "Difficulty correlating soil data with crop requirements"
                },
                {
                  name: "Identify and Customize Flags",
                  image: {
                    url: "/images/Case Studies/JD/Task Analysis/Choose crop task analysis.jpg",
                    caption: "Field Flagging System"
                  },
                  steps: [
                    "Set flag parameters",
                    "Define alert thresholds",
                    "Assign flag categories",
                    "Configure notification rules",
                    "Map flag locations"
                  ],
                  painPoints: "Complex flag setup process with limited customization options"
                },
                {
                  name: "Find Troubleshoot",
                  image: {
                    url: "/images/Case Studies/JD/Task Analysis/Finding troubleshoot.jpg",
                    caption: "Issue Resolution Flow"
                  },
                  steps: [
                    "Identify problem area",
                    "Access diagnostic tools",
                    "Review system logs",
                    "Apply suggested fixes",
                    "Document resolution"
                  ],
                  painPoints: "Scattered troubleshooting resources and unclear resolution paths"
                },
                {
                  name: "Create Harvest Plans",
                  image: {
                    url: "/images/Case Studies/JD/Task Analysis/Harvest plans task analysis.jpg",
                    caption: "Harvest Planning Interface"
                  },
                  steps: [
                    "Assess crop maturity",
                    "Schedule equipment",
                    "Plan storage logistics",
                    "Coordinate labor",
                    "Monitor weather forecasts"
                  ],
                  painPoints: "Limited integration between scheduling and resource management"
                },
                {
                  name: "Remove Flags",
                  image: {
                    url: "/images/Case Studies/JD/Task Analysis/Removing flag task analysis.jpg",
                    caption: "Equipment Management Dashboard"
                  },
                  steps: [
                    "Remove flag",
                    "Confirm removal",
                    "Update inventory",
                    "Optimize deployment"
                  ],
                  painPoints: "Difficulty tracking multiple pieces of equipment across different locations"
                }
              ]
            }
          },
          
          concepts: [
            {
              name: "John Deere Operations Center Redesign",
              description: "A streamlined redesign focusing on core workflows and enhanced data visualization, making farm management more intuitive and efficient.",
              status: "Selected",
              images: [
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.1.jpg",
                  caption: "Dashboard Overview",
                  description: "Centralized farm metrics and alerts"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.2.jpg",
                  caption: "Task Planning Interface",
                  description: "Smart scheduling with weather integration"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.3.jpg",
                  caption: "Inventory Management",
                  description: "Predictive inventory tracking"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.4.jpg",
                  caption: "Field Analytics",
                  description: "Performance tracking dashboard"
                }
              ]
            },
            {
              name: "Seed2Product",
              description: "An innovative approach reimagining farm management through natural interactions and direct market connectivity.",
              status: "Rejected",
              images: [
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.1.jpg",
                  caption: "Field Notes Interface",
                  description: "Voice and photo note-taking"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.2.jpg",
                  caption: "Market Connection Hub",
                  description: "Direct buyer marketplace"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.3.jpg",
                  caption: "Crop Planning Tool",
                  description: "AI-powered rotation planning"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.4.jpg",
                  caption: "Weather Integration",
                  description: "Smart task scheduling"
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
        iterationHint: "Technical constraints found",
        iterations: [
          {
            trigger: "Offline mode technical limitations",
            action: "Revisit solution framework for alternative approach",
            outcome: "Implemented progressive data sync",
            phase: 'solution'
          },
          {
            trigger: "Performance issues with real-time updates",
            action: "Reconsidered real-time feature scope",
            outcome: "Adopted batch update approach",
            phase: 'solution'
          }
        ],
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