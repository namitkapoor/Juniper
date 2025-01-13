import { IoCheckmarkCircleOutline } from 'react-icons/io5';

const baseDecisionsPhase = {
  id: 'decisions',
  title: 'Decision Criteria',
  icon: IoCheckmarkCircleOutline,
  type: 'decisions'
};

export const decisionsPhase = {
  ...baseDecisionsPhase,
  content: {
    "manageFarms": {
      title: "Decision Criteria",
      summary: "Design decisions focused on user preferences, such as a cell-based map for easier crop management and accessibility enhancements, addressing specific pain points highlighted during feedback",
      sections: [
        {
          type: 'decisions',
          content: {
            conceptFeedback: [
              {
                title: "Operations Center Redesign",
                description: "Selected as our primary solution due to its focus on core user needs and immediate business value.",
                status: "Selected",
                supportingPoints: [
                  "User interviews showed 80% preference for familiar interface patterns",
                  "Aligned with existing technical infrastructure",
                  "Lower implementation risk with higher potential adoption rate"
                ],
                image: {
                  url: "/images/Case Studies/JD/Sketches/Sketch-2.1.svg",
                  caption: "Operations Center Redesign concept visualization"
                }
              },
              {
                title: "Seed2Product Innovation",
                description: "While innovative, this concept presented higher implementation risks and learning curves.",
                status: "Not Selected",
                supportingPoints: [
                  "Voice and AR features required significant technical investment",
                  "User testing revealed concerns about reliability in field conditions",
                  "Higher training requirements could slow adoption"
                ],
                image: {
                  url: "/images/Case Studies/JD/Sketches/Sketch-1.1.jpg",
                  caption: "Seed2Product concept visualization"
                }
              }
            ],
            wireframeFeedback: [
              {
                title: "Map View Interface",
                description: "Evolution of the map interface based on user feedback and testing",
                images: [
                  {
                    id: 1,
                    url: "/images/Case Studies/JD/Wireframe/Map (Add new field).jpg",
                    caption: "Initial Map Layout",
                    hotspots: [
                      {
                        id: "1-1",
                        position: { x: 20, y: 30 },
                        challenge: "Navigation Complexity",
                        feedback: "Users found the hierarchical menu structure confusing",
                        changes: "Simplified to a flat navigation with clear visual hierarchy"
                      }
                    ]
                  },
                  {
                    id: 2,
                    url: "/images/Case Studies/JD/Wireframe/Map (Add new field)-1.jpg",
                    caption: "Adding a new field",
                    hotspots: [
                      {
                        id: "2-2",
                        position: { x: 20, y: 30 },
                        challenge: "Navigation Complexity",
                        feedback: "Users found the hierarchical menu structure confusing",
                        changes: "Simplified to a flat navigation with clear visual hierarchy"
                      }
                    ]
                  },
                  {
                    id: 3,
                    url: "/images/Case Studies/JD/Wireframe/Map (Row Highlight).jpg",
                    caption: "Row Highlight",
                    hotspots: [
                      {
                        id: "3-3",
                        position: { x: 20, y: 30 },
                        challenge: "Navigation Complexity",
                        feedback: "Users found the hierarchical menu structure confusing",
                        changes: "Simplified to a flat navigation with clear visual hierarchy"
                      }
                    ]
                  },
                  {
                    id: 4,
                    url: "/images/Case Studies/JD/Wireframe/Map (Cell properties) rectangle.jpg",
                    caption: "Add new field",
                    hotspots: [
                      {
                        id: "4-4",
                        position: { x: 20, y: 30 },
                        challenge: "Navigation Complexity",
                        feedback: "Users found the hierarchical menu structure confusing",
                        changes: "Simplified to a flat navigation with clear visual hierarchy"
                      }
                    ]
                  }
                ]
              }
            ],
            accessibility: [
              {
                title: "Screen Reader Compatibility",
                description: "Enhanced navigation and content structure for screen readers",
                recommendations: [
                  "Added ARIA labels to all interactive elements",
                  "Implemented keyboard navigation for all features",
                  "Created logical tab order for field navigation"
                ],
                visual: {
                  url: "/images/accessibility/screen-reader-flow.jpg",
                  caption: "Screen reader navigation flow"
                }
              },
              {
                title: "Color Contrast",
                description: "Ensured WCAG 2.1 AA compliance across all interfaces",
                recommendations: [
                  "Maintained 4.5:1 contrast ratio for normal text",
                  "Used 3:1 minimum for large text and visual elements",
                  "Implemented high-contrast mode option"
                ],
                visual: {
                  url: "/images/accessibility/contrast-examples.jpg",
                  caption: "Color contrast implementation examples"
                }
              },
              {
                title: "Color-Blind Accessibility",
                description: "Redesigned color coding system to work for all users",
                recommendations: [
                  "Added patterns and icons to supplement color coding",
                  "Tested with various color vision deficiency simulations",
                  "Implemented customizable color schemes"
                ],
                visual: {
                  url: "/images/accessibility/colorblind-modes.jpg",
                  caption: "Color-blind friendly visualizations"
                }
              },
              {
                title: "Icon Usability",
                description: "Improved icon recognition and meaning",
                recommendations: [
                  "Added text labels to all critical icons",
                  "Standardized icon usage across the application",
                  "Created consistent touch target sizes"
                ],
                visual: {
                  url: "/images/accessibility/icon-guidelines.jpg",
                  caption: "Icon usability guidelines"
                }
              }
            ]
          }
        }
      ]
    },
    "influencerMarketing": {
      title: "Decision Criteria",
      summary: "Key design decisions focused on automating discovery and streamlining campaign management, based on user research and technical feasibility analysis",
      sections: [
        {
          type: 'decisions',
          content: {
            conceptFeedback: [
              {
                title: "AI-First Platform",
                description: "Selected as primary direction due to its potential for automation and scalability.",
                status: "Selected",
                supportingPoints: [
                  "85% of users expressed strong interest in AI-powered matching",
                  "Reduces manual discovery time by estimated 70%",
                  "Scalable architecture supports future feature expansion"
                ],
                image: {
                  url: "/images/Case Studies/Influencer/Concepts/ai-platform.jpg",
                  caption: "AI-First Platform concept visualization"
                }
              },
              {
                title: "Community-Driven Marketplace",
                description: "While fostering community engagement, this approach didn't address core efficiency needs.",
                status: "Not Selected",
                supportingPoints: [
                  "Required significant user participation to build value",
                  "Longer time to market and value realization",
                  "Less differentiation from existing solutions"
                ],
                image: {
                  url: "/images/Case Studies/Influencer/Concepts/community-marketplace.jpg",
                  caption: "Community Marketplace concept visualization"
                }
              }
            ],
            wireframeFeedback: [
              {
                title: "Discovery Interface",
                description: "Evolution of the AI-powered discovery interface",
                images: [
                  {
                    id: 1,
                    url: "/images/Case Studies/Influencer/Wireframes/discovery-v1.jpg",
                    caption: "Initial Discovery Interface",
                    hotspots: [
                      {
                        id: "1-1",
                        position: { x: 25, y: 35 },
                        challenge: "Filter Complexity",
                        feedback: "Too many filter options created decision paralysis",
                        changes: "Simplified to core filters with AI handling advanced matching"
                      }
                    ]
                  },
                  {
                    id: 2,
                    url: "/images/Case Studies/Influencer/Wireframes/discovery-v2.jpg",
                    caption: "Refined Discovery Interface",
                    hotspots: [
                      {
                        id: "2-1",
                        position: { x: 30, y: 40 },
                        challenge: "Results Presentation",
                        feedback: "Match quality indicators needed more context",
                        changes: "Added detailed match reasoning and success metrics"
                      }
                    ]
                  }
                ]
              }
            ],
            accessibility: [
              {
                title: "Keyboard Navigation",
                description: "Enhanced keyboard navigation for power users",
                recommendations: [
                  "Implemented keyboard shortcuts for common actions",
                  "Added focus indicators for all interactive elements",
                  "Created skip links for main content areas"
                ],
                visual: {
                  url: "/images/Case Studies/Influencer/Accessibility/keyboard-nav.jpg",
                  caption: "Keyboard navigation implementation"
                }
              },
              {
                title: "Data Visualization",
                description: "Made campaign analytics accessible to all users",
                recommendations: [
                  "Added text alternatives for all charts",
                  "Implemented high-contrast mode for graphs",
                  "Created screen reader friendly data tables"
                ],
                visual: {
                  url: "/images/Case Studies/Influencer/Accessibility/data-viz.jpg",
                  caption: "Accessible data visualization examples"
                }
              }
            ]
          }
        }
      ]
    },
    "taskReminders": {
      title: "Decision Criteria",
      summary: "Design decisions focused on balancing automation with user control, ensuring the system remains helpful without becoming intrusive.",
      sections: [
        {
          type: 'decisions',
          content: {
            conceptFeedback: [
              {
                title: "Smart Context Engine",
                description: "Selected as primary approach due to its balance of automation and user control.",
                status: "Selected",
                supportingPoints: [
                  "85% of users preferred contextual awareness over fixed schedules",
                  "Machine learning approach allows for continuous improvement",
                  "Privacy-first design maintains user trust"
                ],
                image: {
                  url: "/images/Case Studies/TaskReminders/Concepts/smart-context-final.jpg",
                  caption: "Smart Context Engine architecture"
                }
              },
              {
                title: "Pure AI Assistant",
                description: "Rejected due to concerns about user autonomy and privacy.",
                status: "Not Selected",
                supportingPoints: [
                  "Users expressed concerns about full automation",
                  "Higher privacy risks with continuous monitoring",
                  "Potential for notification fatigue"
                ],
                image: {
                  url: "/images/Case Studies/TaskReminders/Concepts/ai-assistant.jpg",
                  caption: "AI Assistant concept"
                }
              }
            ],
            wireframeFeedback: [
              {
                title: "Task Creation Flow",
                description: "Evolution of the task creation interface based on user testing",
                images: [
                  {
                    id: 1,
                    url: "/images/Case Studies/TaskReminders/Wireframes/task-creation-v1.jpg",
                    caption: "Initial Task Creation Interface",
                    hotspots: [
                      {
                        id: "1-1",
                        position: { x: 30, y: 40 },
                        challenge: "Context Selection",
                        feedback: "Too many options overwhelmed users",
                        changes: "Simplified to most common contexts with AI suggestions"
                      }
                    ]
                  },
                  {
                    id: 2,
                    url: "/images/Case Studies/TaskReminders/Wireframes/task-creation-v2.jpg",
                    caption: "Refined Task Creation Interface",
                    hotspots: [
                      {
                        id: "2-1",
                        position: { x: 35, y: 45 },
                        challenge: "Priority Settings",
                        feedback: "Users wanted more intuitive priority controls",
                        changes: "Added visual priority indicators and smart defaults"
                      }
                    ]
                  }
                ]
              }
            ],
            accessibility: [
              {
                title: "Notification Controls",
                description: "Enhanced accessibility for notification management",
                recommendations: [
                  "Added voice control for managing notifications",
                  "Implemented high-contrast mode for notifications",
                  "Created haptic feedback patterns for different priority levels"
                ],
                visual: {
                  url: "/images/Case Studies/TaskReminders/Accessibility/notification-controls.jpg",
                  caption: "Accessible notification controls"
                }
              },
              {
                title: "Context Settings",
                description: "Made context configuration accessible to all users",
                recommendations: [
                  "Added screen reader support for context selection",
                  "Implemented keyboard shortcuts for quick context switching",
                  "Created clear visual indicators for active contexts"
                ],
                visual: {
                  url: "/images/Case Studies/TaskReminders/Accessibility/context-settings.jpg",
                  caption: "Accessible context configuration"
                }
              }
            ]
          }
        }
      ]
    },
    "sustainablePackaging": {
      title: "Decision Criteria",
      summary: "Design decisions focused on creating an effective incentive and support structure that addresses key adoption barriers identified in research.",
      sections: [
        {
          type: 'decisions',
          content: {
            conceptFeedback: [
              {
                title: "Tiered Incentive Program",
                description: "Selected as primary approach due to scalability and proven effectiveness in pilot testing.",
                status: "Selected",
                supportingPoints: [
                  "82% of pilot retailers achieved Tier 2 status within 6 months",
                  "Flexible progression path matches varying retailer capabilities",
                  "Clear ROI demonstration at each tier"
                ],
                image: {
                  url: "/images/Case Studies/SustainablePackaging/Sketches/tiered-system.svg",
                  caption: "Tiered incentive system visualization"
                }
              },
              {
                title: "Fixed Rebate System",
                description: "While simpler to implement, this approach lacked the motivational aspects needed for long-term adoption.",
                status: "Not Selected",
                supportingPoints: [
                  "One-size-fits-all approach didn't address varying retailer needs",
                  "Limited motivation for continued improvement",
                  "Harder to justify ROI for larger investments"
                ],
                image: {
                  url: "/images/Case Studies/SustainablePackaging/Sketches/fixed-rebate.jpg",
                  caption: "Fixed rebate system concept"
                }
              }
            ],
            accessibility: [
              {
                title: "Analytics Dashboard",
                description: "Enhanced accessibility for performance tracking",
                recommendations: [
                  "Screen reader optimization for data visualization",
                  "Keyboard navigation for all dashboard functions",
                  "High-contrast mode for better readability"
                ],
                visual: {
                  url: "/images/Case Studies/SustainablePackaging/Accessibility/dashboard-access.jpg",
                  caption: "Accessible dashboard design"
                }
              },
              {
                title: "Implementation Guide",
                description: "Made support resources accessible to all users",
                recommendations: [
                  "Multi-format training materials (text, video, audio)",
                  "Clear navigation structure for documentation",
                  "Mobile-responsive design for on-site access"
                ],
                visual: {
                  url: "/images/Case Studies/SustainablePackaging/Accessibility/guide-access.jpg",
                  caption: "Accessible implementation guide"
                }
              }
            ]
          }
        }
      ]
    }
  }
};