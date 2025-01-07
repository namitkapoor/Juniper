import { IoAnalyticsOutline } from 'react-icons/io5';

export const researchPhase = {
  id: 'research',
  title: 'Research Insights',
  icon: IoAnalyticsOutline,
  type: 'research',
  content: {
    title: "Research Insights",
    summary: "Our research uncovered four key design requirements that guided the solution.",
    sections: [
      {
        type: 'requirements',
        items: [
          {
            category: "Time Management",
            insight: "Farmers need efficient task scheduling due to long work hours",
            methodologies: ["User Interviews", "Field Observations", "Affinity Diagrams", "Storyboards"],
            response: "Task-centric daily planner with priority scheduling"
          },
          {
            category: "Inventory Tracking",
            insight: "Manual inventory tracking leads to stockouts and waste",
            methodologies: ["Journey Maps", "Survey Data", "Storyboards", "User Interviews"],
            response: "Automated inventory system with low-stock alerts"
          },
          {
            category: "Financial Tools",
            insight: "Basic accounting needs are not met by current solutions",
            methodologies: ["User Interviews", "Journey Maps", "Survey Data", "Affinity Diagrams"],
            response: "Simplified expense tracking and reporting"
          },
          {
            category: "Crop Planning",
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
  }
}; 