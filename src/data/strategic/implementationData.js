import { IoCodeWorkingOutline } from 'react-icons/io5';

export const implementationPhase = {
    id: 'implementation',
    title: 'Implementation Plan',
    icon: IoCodeWorkingOutline,
    type: 'implementation',
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
      title: "Implementation Plan",
      summary: "A comprehensive roadmap that focused on iterative development, usability testing, and key refinements.",
      sections: [
        {
          type: 'iterations',
          title: "Iterations",
          description: "Minor design and functionality tweaks were made across all wireframe flows to address usability feedback.",
          items: [
            {
              change: "Map view field layout",
              reason: "Simplified navigation and better handling of custom field shapes and sizes based on user feedback.",
              result: "Added drag-and-drop functionality for editing rows and sections, along with a color-coding system.",
              image: "/images/Case Studies/JD/Wireframe/Map (Add new field).jpg"
            },
            {
              change: "Status feed improvements",
              reason: "Addressed user requests for quicker task access.",
              result: "Integrated quick action buttons like 'edit', 'comment', and 'mark complete'.",
              image: "/images/Case Studies/JD/Wireframe/Status Feed gestures.jpg"
            },
            {
              change: "Weekly work plan visualization",
              reason: "Enhanced clarity for task grouping and prioritization.",
              result: "Collapsible sections and priority task indicators were added to streamline workflow management.",
              image: "/images/Case Studies/JD/Wireframe/Plan gestures.jpg"
            },
            {
              change: "Reporting and analytics",
              reason: "Made field and revenue data accessible through distinct, visually appealing tabs.",
              result: "Added interactive charts and simplified navigation for financial and crop performance data.",
              image: "/images/Case Studies/JD/Wireframe/Analyze gestures.jpg"
            }
          ]
        },
        {
          type: 'usabilityTesting',
          title: "Usability Testing",
          description: "Conducted task-based user evaluations and heuristic reviews to refine design features and overall usability.",
          metrics: {
            tasksTested: 14,
            participants: 3,
            averageSuccessRate: "64%",
            keyFindings: [
              "9 out of 14 tasks were successfully completed across all participants.",
              "Task completion rates improved by 35% compared to the original design.",
              "Participants found the new map layout intuitive, but suggested adding more shapes for plant beds to match real-world layouts.",
              "Heuristic evaluations identified two high-priority and two mid-priority issues, leading to changes in flag customization and error prevention.",
              "System Usability Scale (SUS) score averaged 70, indicating significant improvement in user satisfaction."
            ]
          }
        },
        
        {
          type: 'presentation',
          title: "Final Presentation",
          description: "Showcased the finalized prototype to John Deere's team, highlighting its alignment with user needs and business goals.",
          items: [
            "Presented key findings and wireframe iterations with supporting metrics.",
            "Highlighted adoption potential with a focus on task efficiency and usability enhancements.",
            "Received approval and positive feedback from stakeholders, validating the design direction."
          ]
        },
        {
          type: 'reflection',
          title: "Reflection",
          description: "Critical takeaways from the project and lessons for future iterations.",
          items: [
            "Balancing user feedback with technical feasibility was key to delivering a viable product.",
            "Iterative usability testing provided actionable insights, significantly improving user experience.",
            "The collaborative approach across design, research, and development teams ensured a user-centered solution."
          ]
        }
      ],
      roadmap: {
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
        ]
      },
      metrics: {
        taskCompletion: "Task completion time reduced by 40%",
        adoptionRate: "Adoption rate among small farms increased by 50%",
        satisfaction: "User satisfaction score: 4.8/5 post-launch"
      }
    }
  };