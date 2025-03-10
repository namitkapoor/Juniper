import { 
  IoAnalyticsOutline, 
  IoSpeedometerOutline,  // Simplified Workflow
  IoStatsChartOutline,   // Data-Driven Insights
  IoSearchOutline,       // Optimized Discovery
  IoPeopleOutline,       // Community-Centric
  IoExpandOutline,        // Scalability
  IoTimeOutline,        // Time Management
  IoArchiveOutline,     // Inventory Tracking
  IoWalletOutline,      // Financial Tools
  IoLeafOutline,         // Crop Planning
  IoLocationOutline,     // Context Awareness
  IoListOutline,         // Priority Management
  IoNotificationsOutline, // Notification Timing
  IoSettingsOutline,     // Customization & Accessibility
  IoLinkOutline,          // Physical-Digital Integration
  IoGiftOutline,          // User Engagement
  IoSchoolOutline,        // Educational Component
  IoStarOutline           // Incentive Design
} from 'react-icons/io5';

const baseResearchPhase = {
  id: 'research',
  title: 'Research Insights',
  icon: IoAnalyticsOutline,
  type: 'research',
};

export const researchPhase = {
  ...baseResearchPhase,
  content: {
    "manageFarms": {
      title: "Research Insights",
      summary: "Our research uncovered four key design requirements that guided the solution.",
      sections: [
        {
          type: 'requirements',
          items: [
            {
              category: "Time Management",
              icon: IoTimeOutline,
              insight: "Farmers need efficient task scheduling due to long work hours",
              methodologies: ["User Interviews", "Field Observations", "Affinity Diagrams", "Storyboards"],
              response: "Task-centric daily planner with priority scheduling"
            },
            {
              category: "Inventory Tracking",
              icon: IoArchiveOutline,
              insight: "Manual inventory tracking leads to stockouts and waste",
              methodologies: ["Journey Maps", "Survey Data", "Storyboards", "User Interviews"],
              response: "Automated inventory system with low-stock alerts"
            },
            {
              category: "Financial Tools",
              icon: IoWalletOutline,
              insight: "Basic accounting needs are not met by current solutions",
              methodologies: ["User Interviews", "Journey Maps", "Survey Data", "Affinity Diagrams"],
              response: "Simplified expense tracking and reporting"
            },
            {
              category: "Crop Planning",
              icon: IoLeafOutline,
              insight: "Soil-based planting decisions need better support",
              methodologies: ["Field Observations", "Survey Data", "Storyboards", "Affinity Diagrams"],
              response: "AI-powered crop recommendation engine"
            }
          ]
        },
        {
          type: 'methodology',
          items: {
            "User Interviews": { color: "#9C4221", textColor: "light" },
            "Field Observations": { color: "#276749", textColor: "light" },
            "Journey Maps": { color: "#6B3FA0", textColor: "light" },
            "Survey Data": { color: "#007BFF", textColor: "light" },
            "Storyboards": { color: "#FFA500", textColor: "light" },
            "Affinity Diagrams": { color: "#00FF00", textColor: "light" }
          }
        }
      ]
    },
    "influencerMarketing": {
      title: "Research Insights",
      summary: "Our research revealed key requirements for simplifying influencer marketing for small businesses while ensuring scalability.",
      sections: [
        {
          type: 'requirements',
          items: [
            {
              category: "Simplified Workflow",
              icon: IoSpeedometerOutline,
              insight: "Streamline campaign creation, influencer discovery, and contract management into an intuitive and unified experience",
              methodologies: ["Journey Maps", "Competitive Analysis"],
              response: "Unified dashboard with integrated campaign management"
            },
            {
              category: "Data-Driven Insights",
              icon: IoStatsChartOutline,
              insight: "Provide actionable analytics for campaign performance and influencer tracking",
              methodologies: ["Empathy Maps", "Competitive Analysis", "Personas"],
              response: "Simplified analytics with actionable recommendations"
            },
            {
              category: "Optimized Discovery",
              icon: IoSearchOutline,
              insight: "Build an efficient marketplace for finding and filtering influencers",
              methodologies: ["Journey Maps", "Empathy Maps", "Personas"],
              response: "AI-powered influencer matching system"
            },
            {
              category: "Community-Centric",
              icon: IoPeopleOutline,
              insight: "Highlight local influencers and campaigns to foster community connections",
              methodologies: ["Empathy Maps", "Personas", "Journey Maps"],
              response: "Location-based discovery and community features"
            },
            {
              category: "Scalability",
              icon: IoExpandOutline,
              insight: "Ensure tools scale with business growth while maintaining simplicity",
              methodologies: ["Personas", "Competitive Analysis"],
              response: "Modular design with expandable features"
            }
          ]
        },
        {
          type: 'methodology',
          items: {
            "Journey Maps": { color: "#6B3FA0", textColor: "light" },
            "Competitive Analysis": { color: "#276749", textColor: "light" },
            "Empathy Maps": { color: "#9C4221", textColor: "light" },
            "User Personas": { color: "#007BFF", textColor: "light" }
          }
        }
      ]
    },
    "taskReminders": {
      title: "Research Insights",
      summary: "Our research revealed key patterns in task management behavior and contextual triggers.",
      sections: [
        {
          type: 'requirements',
          items: [
            {
              category: "Context Awareness",
              icon: IoLocationOutline,
              insight: "Users need reminders that consider their location, activity, and availability",
              methodologies: ["User Interviews", "Affinity Diagrams", "User Personas"],
              response: "Spatial-aware reminder persistence system"
            },
            {
              category: "Priority Management",
              icon: IoListOutline,
              insight: "Task importance varies based on time, location, and user state",
              methodologies: ["Competitive Analysis", "User Interviews", "Affinity Diagrams"],
              response: "Integrated calendar and spatial note management"
            },
            {
              category: "Notification Timing",
              icon: IoNotificationsOutline,
              insight: "Poor timing leads to 73% of task abandonment",
              methodologies: ["Survey Data", "User Personas", "Literature Review"],
              response: "Smart notification scheduling system"
            },
            {
              category: "Customization & Accessibility",
              icon: IoSettingsOutline,
              insight: "Different users have varying notification and organization preferences",
              methodologies: ["Competitive Analysis", "User Interviews", "Survey Data"],
              response: "Personalized notification settings with learning capability"
            },
            {
              category: "Physical-Digital Integration",
              icon: IoLinkOutline,
              insight: "Physical context influences how users organize and access information",
              methodologies: ["Competitive Analysis", "User Interviews"],
              response: "Proximity-based reminder system"
            }
          ]
        },
        {
          type: 'methodology',
          items: {
            "User Interviews": { color: "#9C4221", textColor: "light" },
            "User Personas": { color: "#007BFF", textColor: "light" },
            "Survey Data": { color: "#007BFF", textColor: "light" },           
            "Affinity Diagrams": { color: "#00FF00", textColor: "light" },
            "Literature Review": { color: "#FF4500", textColor: "light" },
            "Competitive Analysis": { color: "#8B008B", textColor: "light" }
          }
        }
      ]
    },
    "sustainablePackaging": {
      title: "Research Insights",
      summary: "Our research uncovered key barriers and opportunities in sustainable packaging adoption across different retail segments.",
      sections: [
        {
          type: 'requirements',
          items: [
            {
              category: "Material Sustainability",
              icon: IoLeafOutline,
              insight: "Need for clear system to evaluate packaging sustainability",
              methodologies: ["Literature Review", "User Interviews"],
              response: "Points-based scoring system (10-80) based on material sustainability"
            },
            {
              category: "User Engagement",
              icon: IoGiftOutline,
              insight: "Users need motivation to choose sustainable packaging",
              methodologies: ["Storyboards", "User Interviews"],
              response: "Combined AR scanning and reward system for product information"
            },
            {
              category: "Educational Component",
              icon: IoSchoolOutline,
              insight: "Limited understanding of product materials and recycling methods",
              methodologies: ["Literature Review", "Storyboards"],
              response: "AR-based material composition visualization and recycling guides"
            },
            {
              category: "Incentive Design",
              icon: IoStarOutline,
              insight: "Need to balance immediate rewards with long-term sustainability",
              methodologies: ["User Interviews", "Literature Review"],
              response: "Tiered discount system linked to sustainability scores"
            }
          ]
        },
        {
          type: 'methodology',
          items: {
            "Literature Review": { color: "#9C4221", textColor: "light" },
            "User Interviews": { color: "#276749", textColor: "light" },
            "Storyboards": { color: "#6B3FA0", textColor: "light" },
          }
        }
      ]
    }
  }
}; 