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
          summary: "Conducted comprehensive research to understand small farm operations and user needs.",
          keyFindings: [
            "36% of small farm owners rely on paper-based systems",
            "82% found existing digital solutions too complex",
            "Key pain point: lack of simple task management"
          ],
          methodology: {
            title: "Research Methodology",
            items: [
              "12 in-depth user interviews",
              "4 field observations",
              "200+ survey responses",
              "Competitive analysis of 5 farming apps"
            ]
          },
          images: [
            {
              src: "../images/Case Studies/JD/Research/interview1.jpg",
              caption: "User interview session"
            },
            {
              src: "../images/Case Studies/JD/Research/analysis.jpg",
              caption: "Affinity mapping session"
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
          summary: "Developed a simplified yet powerful interface focused on essential farming tasks.",
          keyFeatures: [
            "Streamlined task management",
            "Intuitive crop planning tools",
            "Simplified equipment tracking",
            "Basic financial overview"
          ],
          designPrinciples: [
            "Simplicity first",
            "Essential features only",
            "Clear visual hierarchy",
            "Consistent patterns"
          ],
          images: [
            {
              src: "../images/Case Studies/JD/Solution/wireframes.jpg",
              caption: "Early wireframes"
            }
          ]
        }
      },
      {
        id: 'decisions',
        title: 'Decision Criteria',
        icon: IoGitBranchOutline,
        content: {
          title: "Feature Prioritization",
          summary: "Used data-driven approach to prioritize features based on user needs and technical feasibility.",
          criteria: [
            {
              title: "User Impact",
              weight: "40%",
              description: "Direct benefit to small farm operations"
            },
            {
              title: "Technical Feasibility",
              weight: "30%",
              description: "Implementation complexity and resource requirements"
            },
            {
              title: "Business Value",
              weight: "30%",
              description: "Potential for user acquisition and retention"
            }
          ],
          decisions: [
            {
              feature: "Task Management",
              rationale: "Highest user need, relatively simple implementation"
            },
            {
              feature: "Equipment Tracking",
              rationale: "Essential for operations, builds brand loyalty"
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
          summary: "Phased approach to ensure smooth deployment and user adoption.",
          phases: [
            {
              title: "Phase 1: Core Features",
              duration: "3 months",
              items: [
                "Basic task management",
                "Simple equipment tracking",
                "User onboarding flow"
              ]
            },
            {
              title: "Phase 2: Enhanced Features",
              duration: "2 months",
              items: [
                "Crop planning tools",
                "Basic reporting",
                "Weather integration"
              ]
            }
          ],
          metrics: [
            "User adoption rate",
            "Task completion time",
            "Feature usage statistics",
            "User satisfaction scores"
          ]
        }
      }
    ]
  },
  // Add other projects here
  "otherProject": {
    phases: [
      // Similar structure for other projects
    ]
  }
}; 