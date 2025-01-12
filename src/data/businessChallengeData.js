import { 
  IoAppsOutline, 
  IoListOutline, 
  IoSchoolOutline,
  IoTimeOutline,
  IoWalletOutline,
  IoStatsChartOutline,
  IoSearchOutline,
  IoAnalyticsOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoNavigateOutline
} from 'react-icons/io5';

export const businessChallengeData = {
  "manageFarms": {
    marketContext: {
      title: "Market Context",
      content: "While John Deere's Operations Center Mobile (OCM) app catered effectively to large-scale farms, it fell short for small farm owners, who found it overly complex and misaligned with their unique needs."
    },
    revenueImpact: {
      title: "Market Opportunity",
      content: "With approximately 1.9 million small farms in the United States accounting for 89% of all farms, this represents a significant untapped digital transformation opportunity.",
      source: {
        text: "USDA Small Farms Report, 2022",
        link: "https://www.ers.usda.gov/publications/pub-details/?pubid=100011"
      }
    },
    painPoints: [
      {
        icon: IoAppsOutline,
        title: "Market Penetration",
        description: "Limited adoption among small-scale farmers due to misaligned product features.",
        id: "marketPenetration"
      },
      {
        icon: IoListOutline,
        title: "Product-Market Fit",
        description: "Current solutions designed for industrial farming create barriers for small operation adoption.",
        id: "productFit"
      },
      {
        icon: IoSchoolOutline,
        title: "Customer Retention",
        description: "High churn rate due to complex onboarding and usage barriers.",
        id: "retention"
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Frustrated by the lack of user-friendly tools, small farm owners either abandoned the app or turned to alternative solutions, creating a retention gap in a rapidly growing segment."
    }
  },
  
  "influencerMarketing": {
    marketContext: {
      title: "Market Context",
      content: "Small businesses struggle to effectively leverage influencer marketing due to complex discovery processes and limited campaign management tools."
    },
    revenueImpact: {
      title: "Market Opportunity",
      content: "The influencer marketing industry reached $16.4 billion in 2022, with significant growth potential in the small business segment.",
      source: {
        text: "Influencer Marketing Benchmark Report, 2023",
        link: "https://influencermarketinghub.com/influencer-marketing-benchmark-report-2023/"
      }
    },
    painPoints: [
      {
        id: "operationalEfficiency",
        icon: IoNavigateOutline,
        title: "Operational Efficiency",
        description: "Small businesses report excessive time spent on manual campaign management."
      },
      {
        id: "riskManagement",
        icon: IoStatsChartOutline,
        title: "Risk Management",
        description: "Inadequate contract handling increasing legal and compliance risks."
      },
      {
        id: "revenueOptimization",
        icon: IoSearchOutline,
        title: "Revenue Optimization",
        description: "Limited ability to track and measure campaign ROI effectively."
      }
    ],
    costProblems: {
      title: "Cost of Current Problems",
      content: "Small businesses lose significant hours on manual influencer discovery and campaign management, resulting in reduced marketing efficiency and missed opportunities."
    }
  },
  
  "taskReminders": {
    marketContext: {
      title: "Market Context",
      content: "Young adults (18-34) struggle with traditional task management systems that don't account for spatial context and natural workflow patterns. Traditional digital reminders lack spatial context, while physical reminders offer strong spatial memory but poor notification capabilities."
    },
    revenueImpact: {
      title: "Market Opportunity",
      content: "The AR productivity tools market shows significant growth potential, particularly in task management applications.",
      source: {
        text: "Augmented Reality Market Analysis, 2023",
        link: "https://www.grandviewresearch.com/industry-analysis/augmented-reality-market"
      }
    },
    painPoints: [
      {
        icon: IoTimeOutline,
        title: "User Engagement",
        description: "Young adults juggle multiple tools for task management, leading to fragmented attention and reduced productivity.",
        id: "userEngagement"
      },
      {
        icon: IoAnalyticsOutline,
        title: "Technology Integration",
        description: "Emerging AR solutions show promising spatial recognition, yet contextual understanding is still evolving.",
        id: "techIntegration"
      },
      {
        icon: IoSettingsOutline,
        title: "Adoption Barriers",
        description: "Current task management systems force users to choose between physical and digital methods, each offering unique benefits but creating a disconnected experience.",
        id: "adoptionBarriers"
      }
    ],
    costProblems: {
      title: "Cost of Problems",
      content: "Users miss or postpone critical tasks due to poorly contextualized reminders, leading to decreased productivity and increased stress levels."
    }
  },
  
  "sustainablePackaging": {
    marketContext: {
      title: "Market Context",
      content: "Despite growing consumer demand for sustainable packaging, retailers face significant barriers in adoption, primarily due to cost concerns and implementation complexity."
    },
    revenueImpact: {
      title: "Market Opportunity",
      content: "The sustainable packaging market shows strong growth potential, particularly in food-grade recycled materials.",
      source: {
        text: "Food Grade Plastics Report, 2023",
        link: "https://mikacycle.medium.com/food-grade-plastics-a-means-to-curbing-virgin-plastic-production-44d6574730e0"
      }
    },
    painPoints: [
      {
        icon: IoWalletOutline,
        title: "Cost Management",
        description: "Higher costs of sustainable materials making adoption financially challenging.",
        id: "costManagement"
      },
      {
        icon: IoAnalyticsOutline,
        title: "Implementation Strategy",
        description: "Lack of clear frameworks for transitioning to sustainable options.",
        id: "implementation"
      },
      {
        icon: IoStatsChartOutline,
        title: "Performance Metrics",
        description: "Difficulty in measuring and demonstrating sustainability ROI.",
        id: "metrics"
      }
    ],
    costProblems: {
      title: "Cost of Inaction",
      content: "Retailers risk losing market share as consumers increasingly prefer sustainable packaging, while also facing potential regulatory penalties in markets with packaging waste regulations."
    }
  }
};