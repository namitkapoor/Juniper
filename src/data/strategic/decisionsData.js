import { IoGitBranchOutline } from 'react-icons/io5';

export const decisionsPhase = {
  id: 'decisions',
  title: 'Decision Criteria',
  icon: IoGitBranchOutline,
  content: {
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
  }
};