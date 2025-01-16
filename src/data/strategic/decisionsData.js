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
      summary: "Key design decisions focused on optimizing campaign efficiency and scalability, supported by user research and technical feasibility analysis",
      sections: [
        {
          type: 'decisions',
          content: {
            wireframeFeedback: [
              {
                title: "Interface Testing Results",
                description: "Quantitative and qualitative feedback from user testing",
                images: [
                  {
                    id: 1,
                    url: "/images/Case Studies/MI/Changes/Tab Restructure.jpg",
                    caption: "Navigation Efficiency Improvements",
                    hotspots: [
                      {
                        id: "1-1",
                        position: { x: 25, y: 35 },
                        challenge: "Time and Click Efficiency",
                        feedback: "Users spent excessive time switching between tabs",
                        changes: "Consolidated view reduced average clicks by 28%"
                      }
                    ]
                  },
                  {
                    id: 2,
                    url: "/images/Case Studies/MI/Changes/Influencers to Tracking.jpg",
                    caption: "Navigation Efficiency Improvements",
                    hotspots: [
                      {
                        id: "2-2",
                        position: { x: 25, y: 35 },
                        challenge: "Time and Click Efficiency",
                        feedback: "Users spent excessive time switching between tabs",
                        changes: "Consolidated view reduced average clicks by 28%"
                      }
                    ]
                  }
                ]
              }
            ],
            accessibility: [
              {
                title: "Screen Reader Compatibility",
                description: "Enhanced navigation and status tracking for screen readers",
                recommendations: [
                  "Added clear ARIA labels for status changes",
                  "Implemented keyboard shortcuts for quick navigation",
                  "Created logical tab order for timeline navigation",
                  "Added status announcement for timeline changes"
                ],
                visual: {
                  url: "/images/Case Studies/Influencer/Accessibility/keyboard-nav.jpg",
                  caption: "Screen reader navigation implementation"
                }
              },
              {
                title: "Status Visualization",
                description: "Made tracking system accessible to all users",
                recommendations: [
                  "Used both color and icons to indicate status",
                  "Implemented high-contrast status indicators",
                  "Added text descriptions for all status changes",
                  "Created keyboard-navigable timeline interface"
                ],
                visual: {
                  url: "/images/Case Studies/Influencer/Accessibility/data-viz.jpg",
                  caption: "Accessible status visualization"
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
                title: "AR Spatial Note System",
                description: "Selected as primary approach, combining spatial note interface with calendar integration for comprehensive task management.",
                status: "Selected",
                supportingPoints: [
                  "Spatial notes provide intuitive task visualization",
                  "Calendar integration adds temporal context to spatial placement",
                  "Multi-sensory feedback (visual, audio) enhances reminder effectiveness",
                  "Technical feasibility validated through Unity prototypes"
                ],
                image: {
                  url: "/images/Case Studies/TR/Design Concepts/Note and calendar.png",
                  caption: "AR Spatial Note System with calendar integration"
                }
              },
              {
                title: "Physical Space as a Reminder",
                description: "Rejected due to implementation challenges.",
                status: "Not Selected",
                supportingPoints: [
                  "Limited effectiveness as standalone reminder mechanism",
                  "Users needed more explicit notification methods",
                  "Lack of temporal context made task management difficult",
                  "Technical constraints in reliable space recognition"
                ],
                image: {
                  url: "/images/Case Studies/TR/Design Concepts/Room lightup 1.png",
                  caption: "Physical Space as a Reminder concept"
                }
              }
            ],
            wireframeFeedback: [
              {
                title: "Spatial Interface Evolution",
                description: "Five rounds of iterative testing in AR environment",
                images: [
                  {
                    id: 1,
                    url: "/images/Case Studies/TaskReminders/Wireframes/spatial-note-v1.jpg",
                    caption: "Basic AR Note Interface",
                    hotspots: [
                      {
                        id: "1-1",
                        position: { x: 30, y: 40 },
                        challenge: "Spatial Interaction",
                        feedback: "Users needed intuitive color interaction methods",
                        changes: "Implemented direct manipulation for note properties"
                      }
                    ]
                  },
                  {
                    id: 2,
                    url: "/images/Case Studies/TaskReminders/Wireframes/spatial-note-v2.jpg",
                    caption: "Enhanced Visual Feedback",
                    hotspots: [
                      {
                        id: "2-1",
                        position: { x: 35, y: 45 },
                        challenge: "Visual Communication",
                        feedback: "Need for clearer category and state indicators",
                        changes: "Added micro-animations and visual categorization"
                      }
                    ]
                  }
                ]
              }
            ],
            accessibility: [
              {
                title: "Multi-sensory Feedback",
                description: "Enhanced reminder effectiveness through multiple feedback channels",
                recommendations: [
                  "Implemented spatial sound with distance-based volume",
                  "Created color desaturation for distance indication",
                  "Added animation speed variations for urgency levels",
                  "Designed consistent visual language for note states"
                ],
                visual: {
                  url: "/images/Case Studies/TaskReminders/Accessibility/multi-sensory.jpg",
                  caption: "Multi-sensory feedback implementation"
                }
              },
              {
                title: "Spatial Interaction",
                description: "Designed for intuitive spatial interaction patterns",
                recommendations: [
                  "Maintained consistent interaction distances",
                  "Created clear visual boundaries for interactive elements",
                  "Implemented natural mapping for spatial controls",
                  "Used familiar gesture patterns from mobile interfaces"
                ],
                visual: {
                  url: "/images/Case Studies/TaskReminders/Accessibility/spatial-interaction.jpg",
                  caption: "Spatial interaction patterns"
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
                title: "Camera-First Scanning Approach",
                description: "Selected as primary approach for its simplicity and immediate engagement.",
                status: "Selected",
                supportingPoints: [
                  "Immediate camera access reduces friction to start scanning",
                  "Visual feedback provides clear scanning guidance",
                  "Single-step process encourages frequent use",
                  "Direct integration with existing shopping behavior"
                ],
                image: {
                  url: "/images/Case Studies/SustainablePackaging/Sketches/camera-first.svg",
                  caption: "Camera-first interface design"
                }
              },
              {
                title: "Manual Input System",
                description: "Rejected due to increased user friction and potential for errors.",
                status: "Not Selected",
                supportingPoints: [
                  "Required multiple steps to input package information",
                  "Higher cognitive load for users during shopping",
                  "Increased chance of incorrect data entry",
                  "Broke the natural shopping flow"
                ],
                image: {
                  url: "/images/Case Studies/SustainablePackaging/Sketches/manual-input.jpg",
                  caption: "Manual input system concept"
                }
              }
            ],
            wireframeFeedback: [
              {
                title: "Points Display Evolution",
                description: "Development of the sustainability score visualization",
                images: [
                  {
                    id: 1,
                    url: "/images/Case Studies/SustainablePackaging/Wireframes/points-v1.jpg",
                    caption: "Initial Points Display",
                    hotspots: [
                      {
                        id: "1-1",
                        position: { x: 25, y: 35 },
                        challenge: "Score Clarity",
                        feedback: "Users needed clearer connection between sustainability and rewards",
                        changes: "Added direct point-to-discount conversion display"
                      }
                    ]
                  }
                ]
              }
            ],
            accessibility: [
              {
                title: "Scanning Accessibility",
                description: "Enhanced package scanning for all users",
                recommendations: [
                  "Clear audio feedback during scanning process",
                  "High-contrast visual indicators",
                  "Haptic feedback for successful scans",
                  "Voice-guided scanning instructions"
                ],
                visual: {
                  url: "/images/Case Studies/SustainablePackaging/Accessibility/scanner-access.jpg",
                  caption: "Accessible scanning interface"
                }
              },
              {
                title: "Points Understanding",
                description: "Made sustainability scoring clear and comprehensible",
                recommendations: [
                  "Multiple formats for score explanation",
                  "Clear visual hierarchy for information",
                  "Simple language for sustainability metrics",
                  "Alternative text for all score visualizations"
                ],
                visual: {
                  url: "/images/Case Studies/SustainablePackaging/Accessibility/points-access.jpg",
                  caption: "Accessible points display"
                }
              }
            ]
          }
        }
      ]
    }
  }
};