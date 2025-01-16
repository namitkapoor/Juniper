import { IoCodeWorkingOutline, IoColorPaletteOutline } from 'react-icons/io5';
import MediaRenderer from '../../components/MediaRenderer';

const baseImplementationPhase = {
  id: 'implementation',
  title: 'Implementation Plan',
  icon: IoCodeWorkingOutline,
  type: 'implementation'
};

export const implementationPhase = {
  ...baseImplementationPhase,
  content: {
    "manageFarms": {
      title: "Implementation Plan",
      summary: "A comprehensive roadmap that focused on iterative development, usability testing, and key refinements.",
      sections: [
        {
          type: 'prototypes',
          title: "Prototypes",
          icon: IoColorPaletteOutline,
          description: "Minor design and functionality tweaks were made across all wireframe flows to address usability feedback.",
          items: [
            {
              change: "Map view field layout",
              reason: "Simplified navigation and better handling of custom field shapes and sizes based on user feedback.",
              result: "Added drag-and-drop functionality for editing rows and sections, along with a color-coding system.",
              media: {
                type: 'video',
                url: "/videos/Case Studies/JD/Prototypes/Map video.mp4",
                poster: "",
                autoplay: false,
                loop: true,
                muted: true,
                containMode: true,
                phoneFrame: true
              }
            },
            {
              change: "Status feed improvements",
              reason: "Addressed user requests for quicker task access.",
              result: "Integrated quick action buttons like 'edit', 'comment', and 'mark complete'.",
              media: {
                type: 'video',
                url: "/videos/Case Studies/JD/Prototypes/Home video.mp4",
                poster: "",
                autoplay: false,
                loop: true,
                muted: true,
                containMode: true,
                phoneFrame: true
              }
            },
            {
              change: "Weekly work plan visualization",
              reason: "Enhanced clarity for task grouping and prioritization.",
              result: "Collapsible sections and priority task indicators were added to streamline workflow management.",
              media: {
                type: 'video',
                url: "/videos/Case Studies/JD/Prototypes/Plan video.mp4",
                poster: "/images/Case Studies/JD/Wireframe/Plan gestures.jpg",
                autoplay: false,
                loop: true,
                muted: true,
                phoneFrame: true
              }
            },
            {
              change: "Reporting and analytics",
              reason: "Made field and revenue data accessible through distinct, visually appealing tabs.",
              result: "Added interactive charts and simplified navigation for financial and crop performance data.",
              media: {
                type: 'video',
                url: "/videos/Case Studies/JD/Prototypes/Analysis video.mp4",
                poster: "/images/Case Studies/JD/Wireframe/Analyze gestures.jpg",
                autoplay: false,
                loop: true,
                muted: true,
                phoneFrame: true
              }
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
    },
    "influencerMarketing": {
      title: "Implementation Plan",
      summary: "A streamlined implementation approach focusing on core campaign management functionality and intuitive user flows.",
      sections: [
        {
          type: 'prototypes',
          title: "Prototypes",
          icon: IoColorPaletteOutline,
          description: "Interactive prototypes were developed to validate key user flows and gather feedback.",
          items: [
            {
              change: "Campaign Creation Flow",
              reason: "Streamline the process of setting up new influencer campaigns",
              result: "Implemented step-by-step campaign creation with clear fields for campaign details, product information, and usage guidelines",
              media: {
                type: 'video',
                url: "/videos/Case Studies/MI/New campaign high res.mp4",
                poster: "/videos/Case Studies/MI/New campaign high res.mp4",
                caption: "Campaign creation interface showing basic details form",
                isLaptop: true
              }
            },
            {
              change: "Contracts Management",
              reason: "Enable efficient browsing and filtering of potential influencers",
              result: "Created a grid view with key influencer metrics, filtering options, and clear pricing information",
              media: {
                type: 'video',
                url: "/videos/Case Studies/MI/Contracts high res.mp4",
                poster: "/videos/Case Studies/MI/Contracts high res.mp4",
                caption: "Influencer exploration interface with filtering capabilities",
                isLaptop: true
              }
            },
            {
              change: "Influencer Discovery Interface",
              reason: "Enable efficient browsing and filtering of potential influencers",
              result: "Created a grid view with key influencer metrics, filtering options, and clear pricing information",
              media: {
                type: 'video',
                url: "/videos/Case Studies/MI/Explore high res.mp4",
                poster: "/videos/Case Studies/MI/Explore high res.mp4",
                caption: "Influencer exploration interface with filtering capabilities",
                isLaptop: true
              }
            },
            {
              change: "Campaign Tracking Dashboard",
              reason: "Provide clear visibility into campaign progress",
              result: "Developed a timeline-based tracking system showing key milestones from proposal to post completion",
              media: {
                type: 'video',
                url: "/videos/Case Studies/MI/Campaign Tracking high res.mp4",
                poster: "/videos/Case Studies/MI/Campaign Tracking high res.mp4",
                caption: "Campaign tracking interface with timeline visualization",
                isLaptop: true
              }
            }
          ]
        },
        {
          type: 'usabilityTesting',
          title: "Usability Testing",
          description: "Conducted comprehensive testing with small business owners and influencers.",
          metrics: {
            tasksTested: 8,
            participants: 12,
            averageSuccessRate: "95%",
            keyFindings: [
              "Campaign creation wizard reduced setup confusion",
              "Timeline visualization improved campaign status understanding",
              "Consolidated view increased efficiency in managing multiple influencers",
              "Some users requested additional filtering options in discovery",
              "Mobile responsiveness needs improvement for on-the-go management"
            ]
          }
        }
      ]
    },
    "taskReminders": {
      title: "Implementation Plan",
      summary: "A phased rollout approach focusing on core AI features first, followed by interface refinements based on user feedback.",
      sections: [
        {
          type: 'prototypes',
          title: "Prototypes",
          icon: IoColorPaletteOutline,
          description: "Iterative development of key features based on user testing and feedback.",
          items: [
            {
              change: "Context Detection System",
              reason: "Initial implementation showed accuracy issues in certain environments",
              result: "Refined ML model with improved sensor fusion and activity recognition",
              media: {
                type: 'video',
                url: "/videos/Case Studies/TaskReminders/Prototypes/context-detection.mp4",
                poster: "/images/Case Studies/TaskReminders/Prototypes/context-detection-poster.jpg",
                autoplay: false,
                loop: true,
                muted: true,
                containMode: true
              }
            },
            {
              change: "Priority Interface",
              reason: "Users needed clearer visual hierarchy for task importance",
              result: "Implemented color coding and size-based priority indicators",
              media: {
                type: 'video',
                url: "/videos/Case Studies/TaskReminders/Prototypes/priority-interface.mp4",
                poster: "/images/Case Studies/TaskReminders/Prototypes/priority-interface-poster.jpg",
                autoplay: false,
                loop: true,
                muted: true,
                containMode: true
              }
            }
          ]
        },
        {
          type: 'usabilityTesting',
          title: "Usability Testing",
          description: "Comprehensive testing across different user contexts and environments",
          findings: [
            {
              metric: "Task Completion Rate",
              before: "45%",
              after: "92%",
              insight: "Context-aware notifications significantly improved task completion"
            },
            {
              metric: "Time to Response",
              before: "15 minutes",
              after: "3 minutes",
              insight: "Better timing reduced notification dismissal rate"
            },
            {
              metric: "User Satisfaction",
              before: "3.2/5",
              after: "4.7/5",
              insight: "Adaptive interface received positive feedback"
            }
          ]
        },
        {
          type: 'reflection',
          title: "Reflection",
          description: "Key learnings and insights from the development process.",
          items: [
            "Context detection requires careful balance of accuracy vs battery life",
            "Privacy concerns need clear user communication and controls",
            "Machine learning models improve significantly with user feedback"
          ]
        }
      ],
      roadmap: {
        phases: [
          {
            title: "Phase 1: Core AI Features",
            duration: "3 months",
            items: [
              "Context detection engine",
              "Basic priority management",
              "Initial ML models"
            ]
          },
          {
            title: "Phase 2: Interface Refinement",
            duration: "2 months",
            items: [
              "Adaptive UI components",
              "Advanced priority visualization",
              "Accessibility improvements"
            ]
          }
        ]
      },
      metrics: {
        taskCompletion: "92% task completion rate",
        contextAccuracy: "95% context detection accuracy",
        userSatisfaction: "4.7/5 user satisfaction score"
      }
    },
    "sustainablePackaging": {
  title: "Implementation Plan",
  summary: "A user-centric approach focusing on seamless product identification and rewards redemption.",
  sections: [
    {
      type: 'prototypes',
      title: "Prototypes",
      icon: IoColorPaletteOutline,
      description: "Interactive prototypes demonstrating the product identification and rewards flow.",
      items: [
        {
          change: "Smart Product Recognition",
          reason: "Enable quick and intuitive packaging identification",
          result: "Created camera-based scanning interface with instant product recognition",
          media: {
            type: 'video',
            url: "/videos/Case Studies/SP/Product Identification.mp4",
            poster: "/videos/Case Studies/SP/Product Identification.mp4",
            alt: "Product recognition demo",
            containMode: true
          }
        },
        {
          change: "Interactive Product Visualization",
          reason: "Help users understand product packaging composition",
          result: "Developed AR animation showing packaging materials and sustainability details",
          media: {
            type: 'video',
            url: "/videos/Case Studies/SP/AR Product.mp4",
            poster: "/videos/Case Studies/SP/AR Product.mp4",
            autoplay: false,
            loop: true,
            muted: true,
            containMode: true
          }
        },
        {
          change: "Sustainability Score Display",
          reason: "Communicate product sustainability value clearly",
          result: "Implemented SUS points system with visual indicators and reward potential",
          media: {
            type: 'video',
            url: "/videos/Case Studies/SP/SUS Points.mp4",
            poster: "/videos/Case Studies/SP/SUS Points.mp4",
            autoplay: false,
            loop: true,
            muted: true,
            containMode: true
          }
        },
        {
          change: "Rewards Management Interface",
          reason: "Provide clear overview of accumulated rewards",
          result: "Created consolidated cart view showing total sustainability impact and available discounts",
          media: {
            type: 'video',
            url: "/videos/Case Studies/SP/Cart view.mp4",
            poster: "/videos/Case Studies/SP/Cart view.mp4",
            autoplay: false,
            loop: true,
            muted: true,
            containMode: true
          }
        }
      ]
    },
        {
          type: 'usabilityTesting',
          title: "Usability Testing",
          description: "Conducted comprehensive testing with retailers of varying sizes.",
          metrics: {
            tasksTested: 10,
            participants: 8,
            averageSuccessRate: "82%",
            keyFindings: [
              "Tiered system was easily understood by all participants",
              "ROI calculator helped justify program adoption to stakeholders",
              "Implementation guide reduced support requests by 45%",
              "Some users requested more detailed supplier information",
              "Mobile access needed improvement for on-site usage"
            ]
          }
        },
        {
          type: 'presentation',
          title: "Final Presentation",
          description: "Presented the solution to stakeholders, highlighting adoption metrics and business impact.",
          items: [
            "Demonstrated significant cost savings through volume-based incentives",
            "Showcased successful pilot program results",
            "Presented roadmap for program expansion"
          ]
        },
        {
          type: 'reflection',
          title: "Reflection",
          description: "Key learnings and insights from the development process.",
          items: [
            "Balancing incentives with implementation support is crucial",
            "Clear ROI demonstration drives adoption",
            "Regular feedback helps refine support resources effectively"
          ]
        }
      ],
      roadmap: {
        phases: [
          {
            title: "Phase 1: Pilot Program",
            duration: "3 months",
            items: [
              "Initial retailer onboarding",
              "Basic analytics dashboard",
              "Core support resources"
            ]
          },
          {
            title: "Phase 2: Regional Launch",
            duration: "6 months",
            items: [
              "Expanded retailer network",
              "Enhanced analytics",
              "Supplier integration"
            ]
          }
        ]
      },
      metrics: {
        adoptionRate: "82% pilot program success rate",
        costReduction: "25% average materials cost reduction",
        satisfaction: "4.2/5 retailer satisfaction score"
      }
    }
  }
};