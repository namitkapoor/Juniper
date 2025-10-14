// NOTE: Update image paths to match your actual file structure in public/images/Case Studies/JD/
// Current paths are placeholders and need to be replaced with your actual images

export const designChangesData = {
  "manageFarms": {
    changes: [
      {
        title: "Task-Centric Dashboard",
        what: "Redesigned the home screen from a feature-list navigation with 7 tabs into a daily task planner with priority scheduling that puts the farmer's day at the center.",
        visual: {
          type: 'comparison',
          before: '../../images/Case Studies/JD/Original Design/Home.svg',
          after: '../../images/Case Studies/JD/Redesigns/Alerts.png',
          caption: 'From complex 7-tab navigation to streamlined task-focused interface'
        },
        why: "Farmers work 14+ hour days and need to efficiently manage their time. The old design required navigating through 5+ minutes across 7 tabs just to check daily priorities. Our task analysis showed that 80% of daily actions clustered around 3 core workflows.",
        researchInsights: [
          "Farmers mentally plan their day around weather, equipment availability, and seasonal urgency",
          "Time management was cited as the #1 pain point in user interviews",
          "Users wanted to see 'what needs to be done today' not 'here are all the features'"
        ],
        rejected: [
          {
            name: "Calendar-based view",
            reason: "Didn't match field usage patterns—farmers think in tasks, not appointments"
          },
          {
            name: "Feature-list approach",
            reason: "Required too much cognitive load to mentally assemble a daily plan"
          }
        ],
        validation: {
          description: "Usability testing showed dramatic improvements in task planning efficiency.",
          metrics: [
            { value: "90 sec", label: "Task Completion Time" },
            { value: "5 min saved", label: "Daily Planning" },
            { value: "100%", label: "Task Success Rate" }
          ],
          quote: {
            text: "Finally! I can see my whole day at a glance. This is exactly how I think about my farm work.",
            source: "Pilot Participant, 45-acre farm"
          }
        }
      },
      {
        title: "Cell-Based Map for Crop Management",
        what: "Switched from free-form field polygons to a grid-based cell system for crop planning, enabling granular soil-to-crop matching for AI-powered recommendations.",
        visual: {
          type: 'comparison',
          before: '../../images/Case Studies/JD/Original Design/Map.svg',
          after: '../../images/Case Studies/JD/Redesigns/Map.png',
          caption: 'Grid-based cells match how small farm owners mentally chunk their land'
        },
        why: "Small farmers think in 'sections' or 'zones' rather than precise GPS coordinates. They needed a way to match soil conditions to crop types without the complexity of traditional GIS tools.",
        researchInsights: [
          "Farmers described their land in zones: 'the wet corner,' 'the hill section,' 'near the barn'",
          "Existing polygon tools were too technical and time-consuming",
          "Soil variability within small farms requires more granular planning than large commercial operations"
        ],
        rejected: [
          {
            name: "Traditional polygon drawing",
            reason: "Too complex for non-technical users; steep learning curve"
          },
          {
            name: "Auto-generated boundaries",
            reason: "Didn't match farmers' mental models of how they divide their land"
          },
          {
            name: "Single-field approach",
            reason: "Not granular enough for soil-based planting decisions"
          }
        ],
        validation: {
          description: "Field testing proved the cell-based approach aligned with how farmers actually think about their land.",
          metrics: [
            { value: "85%", label: "User Confidence" },
            { value: "0 errors", label: "Crop Planning Tasks" },
            { value: "3 min", label: "Setup Time" }
          ],
          quote: {
            text: "It's like you've been to my farm — The layout is exactly how it looks! I can finally plan my planting the way I see my land.",
            source: "Sarah Chen, Homestead Farmer"
          }
        }
      },
      {
        title: "Simplified Financial Tracking",
        what: "Created a basic expense tracking system with smart category auto-suggestions, removing the accounting complexity that overwhelmed small farmers.",
        visual: {
          type: 'image',
          src: '../../images/Case Studies/JD/Redesigns/Plan combined.png',
          alt: 'Simplified financial tracking interface',
          caption: 'One-tap expense logging with intelligent categorization'
        },
        why: "Small farmers were using notebooks and struggling during tax season due to lack of digital records. Existing farm management tools assumed accounting literacy they didn't have.",
        researchInsights: [
          "Most farmers tracked expenses in physical notebooks or not at all",
          "Tax season created panic due to missing documentation",
          "They needed 'good enough' tracking, not professional accounting",
          "Quick entry was more important than detailed categorization"
        ],
        rejected: [
          {
            name: "Full double-entry bookkeeping",
            reason: "Overkill for this user segment; too complex and intimidating"
          },
          {
            name: "Receipt photo scanning",
            reason: "Technical limitations with device cameras and rural connectivity"
          },
          {
            name: "QuickBooks integration",
            reason: "Most users didn't have QuickBooks and didn't want it"
          }
        ],
        validation: {
          description: "What started as a 'nice to have' became a critical feature based on user enthusiasm during testing.",
          metrics: [
            { value: "92%", label: "Categorization Accuracy" },
            { value: "15 sec", label: "Avg. Entry Time" },
            { value: "Daily", label: "Usage Frequency" }
          ],
          quote: {
            text: "I can finally track my spending without feeling like I need an accounting degree. Takes me seconds, not minutes.",
            source: "Usability Test Participant"
          }
        }
      }
    ],
    didntChange: [
      {
        name: "Equipment Management Module",
        reason: "High adoption rate among existing users who had developed muscle memory with the interface.",
        whatWeDid: "Improved discoverability through better navigation hierarchy and contextual entry points, but kept the core interaction model intact."
      },
      {
        name: "Core Map View",
        reason: "Spatial mental model was deeply ingrained; farmers relied on the satellite imagery for orientation.",
        whatWeDid: "Enhanced the map with the cell-based overlay rather than replacing it, maintaining familiarity while adding new functionality."
      }
    ]
  },
  
  // Placeholder for other projects
  "influencerMarketing": {
    introduction: "Key design decisions that transformed the influencer marketing platform.",
    changes: [],
    didntChange: []
  },
  
  "taskReminders": {
    introduction: "Key design decisions in developing the spatial task reminder system.",
    changes: [],
    didntChange: []
  },
  
  "sustainablePackaging": {
    introduction: "Key design decisions in the sustainable packaging gamification system.",
    changes: [],
    didntChange: []
  }
};

