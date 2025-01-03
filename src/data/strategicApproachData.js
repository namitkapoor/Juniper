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
              status: "Selected"
            },
            {
              name: "Seed2Product",
              details: [
                "Introduced new layouts for note-taking, field tracking, and market connections",
                "Scrapped due to impracticality (e.g., typing preferred over writing, low adoption of stylus tools)"
              ],
              status: "Rejected"
            }
          ],
          chosenFramework: {
            name: "John Deere Operations Center Redesign",
            rationale: "Aligned with user familiarity and research-backed feature priorities",
            methods: [
              "Product analysis",
              "Journey mapping",
              "Storyboarding to refine the redesign"
            ]
          },
          designPrinciples: [
            "Simplicity first",
            "Essential features only",
            "Clear visual hierarchy",
            "Consistent patterns"
          ]
        }
      },
      {
        id: 'decisions',
        title: 'Decision Criteria',
        icon: IoGitBranchOutline,
        content: {
          title: "Concept Feedback",
          summary: "Prioritized features based on user impact, technical feasibility, and business value.",
          criteria: [
            {
              title: "User Impact",
              weight: "40%",
              description: "High-priority tasks like inventory management and time tracking addressed the most common pain points"
            },
            {
              title: "Technical Feasibility",
              weight: "30%",
              description: "Selected features that balanced user needs with implementation complexity"
            },
            {
              title: "Business Value",
              weight: "30%",
              description: "Focused on features that could drive adoption and retention"
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