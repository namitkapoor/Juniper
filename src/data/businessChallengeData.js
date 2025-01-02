import { 
  IoAppsOutline, 
  IoListOutline, 
  IoSchoolOutline,
  IoTimeOutline,
  IoWalletOutline,
  IoStatsChartOutline
} from 'react-icons/io5';

export const businessChallengeData = {
  "manageFarms": {
    marketContext: {
      title: "Market Context",
      content: "While John Deere's Operations Center Mobile (OCM) app catered effectively to large-scale farms, it fell short for small farm owners, who found it overly complex and misaligned with their unique needs."
    },
    revenueImpact: {
      title: "Revenue Impact",
      content: "With approximately 1.9 million small farms in the United States (USDA, 2022), low adoption of the app resulted in missed opportunities to strengthen brand loyalty and drive equipment sales in a significant market segment.",
      source: {
        text: "USDA, 2022",
        link: "https://www.nifa.usda.gov/grants/programs/family-farms?"
      }
    },
    painPoints: [
      {
        icon: IoAppsOutline,
        title: "Complex Interface",
        description: "Overwhelming interface with features irrelevant to small-scale operations.",
        image: "../images/Case Studies/JD/original design.svg"
      },
      {
        icon: IoListOutline,
        title: "Task Management",
        description: "Difficulty managing essential tasks like equipment tracking, crop planning, and operational logs.",
        image: "../images/Case Studies/JD/App store review 1.jpg"
      },
      {
        icon: IoSchoolOutline,
        title: "Learning Curve",
        description: "Lack of accessible tutorials and support for first-time users, creating a steep learning curve.",
        image: "../images/Case Studies/JD/long tutorial.jpg"
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Frustrated by the lack of user-friendly tools, small farm owners either abandoned the app or turned to alternative solutions, creating a retention gap for John Deere in a rapidly growing segment."
    }
  },
  
  "otherProject": {
    marketContext: {
      title: "Market Context",
      content: "Different market context for another project..."
    },
    revenueImpact: {
      title: "Revenue Impact",
      content: "Revenue impact details for another project...",
      source: {
        text: "Source, 2023",
        link: "https://example.com"
      }
    },
    painPoints: [
      {
        icon: IoTimeOutline,
        title: "Time Management",
        description: "Description of time management issues...",
        image: "../images/path/to/image1.jpg"
      },
      {
        icon: IoWalletOutline,
        title: "Cost Efficiency",
        description: "Description of cost efficiency problems...",
        image: "../images/path/to/image2.jpg"
      },
      {
        icon: IoStatsChartOutline,
        title: "Performance Tracking",
        description: "Description of performance tracking issues...",
        image: "../images/path/to/image3.jpg"
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Description of cost problems for another project..."
    }
  }
}; 