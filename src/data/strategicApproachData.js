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
              methodologies: ["User Interviews", "Field Observations", "Journey Maps", "Storyboards"],
              designResponse: "Task-centric daily planner with priority scheduling"
            },
            {
              category: "Inventory Tracking",
              insight: "Manual inventory tracking leads to stockouts and waste",
              methodologies: ["Journey Maps", "Survey Data", "Storyboards"],
              designResponse: "Automated inventory system with low-stock alerts"
            },
            {
              category: "Financial Tools",
              insight: "Basic accounting needs are not met by current solutions",
              methodologies: ["User Interviews", "Journey Maps", "Survey Data"],
              designResponse: "Simplified expense tracking and reporting"
            },
            {
              category: "Crop Planning",
              insight: "Soil-based planting decisions need better support",
              methodologies: ["Field Observations", "Survey Data", "Storyboards"],
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
          summary: "Two concepts emerged from our research, leading us to prioritize a user-centered redesign.",
          concepts: [
            {
              name: "John Deere Operations Center Redesign",
              details: [
                "Retained core features while addressing usability issues",
                "Enhanced analytics, task planner, inventory tracking"
              ],
              status: "Selected",
              images: [
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.1.jpg",
                  caption: "Dashboard Overview",
                  description: "Simplified analytics dashboard with key metrics"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.2.jpg",
                  caption: "Task Planning Interface",
                  description: "Intuitive task management system"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.3.jpg",
                  caption: "Inventory Management",
                  description: "Real-time inventory tracking system"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.4.jpg",
                  caption: "Field Analytics",
                  description: "Advanced field performance metrics"
                }
              ]
            },
            {
              name: "Seed2Product",
              details: [
                "Introduced new layouts for note-taking, field tracking, and market connections",
                "Scrapped due to impracticality (e.g., typing preferred over writing, low adoption of stylus tools)"
              ],
              status: "Rejected",
              images: [
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.1.jpg",
                  caption: "Field Notes Interface",
                  description: "Digital note-taking system for field observations"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.2.jpg",
                  caption: "Market Connection Hub",
                  description: "Direct farmer-to-market connection platform"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.3.jpg",
                  caption: "Crop Planning Tool",
                  description: "Season planning and rotation management"
                },
                {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.4.jpg",
                  caption: "Weather Integration",
                  description: "Local weather data and forecasting"
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
              url: "/images/decisions/user-feedback.jpg",
              caption: "User Feedback Session Results"
            },
            {
              url: "/images/decisions/technical-assessment.jpg",
              caption: "Technical Feasibility Assessment"
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