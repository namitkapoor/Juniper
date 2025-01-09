import { 
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoHappyOutline,
  IoTimeOutline,
  IoRocketOutline,
  IoPeopleOutline
} from 'react-icons/io5';

export const measurableResultsData = {
  "manageFarms": {
    metrics: [
      {
        title: "User Satisfaction",
        icon: IoHappyOutline,
        stats: {
          value: "70",
          unit: "SUS Score",
        },
        details: [
          "Achieved an SUS score of 70, indicating a strong potential for user satisfaction.",
          "Improved user satisfaction across all farm sizes.",
          "Addressed pain points, reducing the learning curve for new users."
        ],
        image: "../images/Case Studies/JD/Average SUS Scores.png"
      },
      {
        title: "Task Completion",
        icon: IoTimeOutline,
        stats: {
          value: "9/14",
          unit: "Tasks Successfully Completed",
        },
        details: [
          "Simulated a sample of end users' experience with task-based user evaluation.",
          "Improved task completion rates across key functionalities.",
          "Streamlined workflows resulted in faster task execution and reduced error rates."
        ],
        image: "../images/Case Studies/JD/Evals/Map tab task.webp"
      },
      {
        title: "Heuristic Evaluation",
        icon: IoStatsChartOutline,
        stats: {
          value: "3 experts",
          unit: "Evaluations Conducted",
          change: "N/A"
        },
        details: [
          "Two high-priority issues (Visibility of System Status, Error Prevention) identified and resolved.",
          "Two mid-priority issues addressed, improving consistency and navigation flows.",
          "Expert insights guided the redesign to align with heuristic best practices."
        ],
        image: "../images/Case Studies/JD/Evals/Heuristic evals.webp"
      }
    ],
    testimonials: [
      {
        quote: "Finally, an app that understands small farm operations!",
        author: "Sarah Chen",
        role: "Homestead Farmer",
        image: "../images/Case Studies/JD/farmer-testimonial.jpg"
      }
    ]
  },
  "influencerMarketing": {
    metrics: [
      {
        title: "Discovery Time",
        icon: IoTimeOutline,
        stats: {
          value: "65%",
          unit: "Reduction",
          previousValue: "2.5 hours",
          change: "Down to 52 minutes"
        },
        details: [
          "AI-powered matching reduced manual search time significantly",
          "Automated vetting process improved match quality",
          "Smart filters eliminated irrelevant results"
        ],
        image: "/images/Case Studies/Influencer/Results/discovery-time.jpg"
      },
      {
        title: "Campaign Success",
        icon: IoRocketOutline,
        stats: {
          value: "85%",
          unit: "Match Quality",
          previousValue: "40%",
          change: "+45%"
        },
        details: [
          "Higher relevance in influencer-brand matches",
          "Reduced campaign setup errors by 80%",
          "Improved ROI tracking accuracy"
        ],
        image: "/images/Case Studies/Influencer/Results/campaign-success.jpg"
      },
      {
        title: "User Adoption",
        icon: IoPeopleOutline,
        stats: {
          value: "4.6",
          unit: "User Satisfaction",
          change: "92% would recommend"
        },
        details: [
          "Positive feedback on AI-powered features",
          "High satisfaction with automated workflows",
          "Strong user retention after 3 months"
        ],
        image: "/images/Case Studies/Influencer/Results/user-adoption.jpg"
      }
    ],
    testimonials: [
      {
        quote: "The AI matching saved us countless hours of manual searching. It's like having a digital marketing assistant that actually understands our brand.",
        author: "Michael Rodriguez",
        role: "Marketing Director, StyleCraft",
        image: "/images/Case Studies/Influencer/Testimonials/michael.jpg"
      },
      {
        quote: "Finally, a platform that makes influencer marketing accessible for small businesses. The automated campaign tracking is a game-changer.",
        author: "Lisa Chen",
        role: "Owner, Sustainable Beauty Co",
        image: "/images/Case Studies/Influencer/Testimonials/lisa.jpg"
      }
    ]
  },
  "taskReminders": {
    metrics: [
      {
        title: "Task Completion",
        icon: IoTimeOutline,
        stats: {
          value: "92%",
          unit: "Completion Rate",
          previousValue: "45%",
          change: "+47%"
        },
        details: [
          "Context-aware notifications improved task completion significantly",
          "Reduced notification dismissal rate by 65%",
          "Average response time decreased from 15 to 3 minutes"
        ],
        image: "/images/Case Studies/TaskReminders/Results/completion-rate.jpg"
      },
      {
        title: "User Satisfaction",
        icon: IoHappyOutline,
        stats: {
          value: "4.7",
          unit: "out of 5",
          previousValue: "3.2",
          change: "+1.5"
        },
        details: [
          "95% of users reported better timing of notifications",
          "Adaptive interface received positive feedback",
          "Context detection accuracy rated at 95%"
        ],
        image: "/images/Case Studies/TaskReminders/Results/satisfaction.jpg"
      },
      {
        title: "System Performance",
        icon: IoStatsChartOutline,
        stats: {
          value: "95%",
          unit: "Context Accuracy",
          change: "Battery impact <5%"
        },
        details: [
          "High accuracy in context detection",
          "Minimal battery consumption",
          "Fast adaptation to user patterns"
        ],
        image: "/images/Case Studies/TaskReminders/Results/performance.jpg"
      }
    ],
    testimonials: [
      {
        quote: "The context-aware notifications have completely changed how I manage my tasks. It's like having a smart assistant that knows exactly when to remind me.",
        author: "David Kim",
        role: "Product Manager",
        image: "/images/Case Studies/TaskReminders/Testimonials/david.jpg"
      },
      {
        quote: "Finally, a reminder system that doesn't interrupt me at the wrong times. The AI really understands my work patterns.",
        author: "Emily Chen",
        role: "UX Designer",
        image: "/images/Case Studies/TaskReminders/Testimonials/emily.jpg"
      }
    ]
  },
  "sustainablePackaging": {
    metrics: [
      {
        title: "Adoption Rate",
        icon: IoRocketOutline,
        stats: {
          value: "82%",
          unit: "Pilot Success",
          previousValue: "30%",
          change: "+52%"
        },
        details: [
          "82% of pilot retailers achieved program goals",
          "50% reduction in implementation timeline",
          "25% average cost savings through volume discounts"
        ],
        image: "/images/Case Studies/SustainablePackaging/Results/adoption-rate.jpg"
      },
      {
        title: "Cost Reduction",
        icon: IoTrendingUpOutline,
        stats: {
          value: "25%",
          unit: "Average Savings",
          previousValue: "0%",
          change: "+25%"
        },
        details: [
          "Volume-based discounts effectively reduced material costs",
          "Streamlined supplier network improved pricing",
          "Bulk ordering opportunities maximized savings"
        ],
        image: "/images/Case Studies/SustainablePackaging/Results/cost-savings.jpg"
      },
      {
        title: "Retailer Satisfaction",
        icon: IoHappyOutline,
        stats: {
          value: "4.2",
          unit: "out of 5",
          change: "85% would recommend"
        },
        details: [
          "Strong satisfaction with support resources",
          "Positive feedback on implementation process",
          "High likelihood of program continuation"
        ],
        image: "/images/Case Studies/SustainablePackaging/Results/satisfaction.jpg"
      }
    ],
    testimonials: [
      {
        quote: "The tiered incentive system made it easy to start small and scale up. The ROI was clear at every step.",
        author: "James Wilson",
        role: "Operations Director, Metro Retail",
        image: "/images/Case Studies/SustainablePackaging/Testimonials/james.jpg"
      },
      {
        quote: "The implementation support was crucial. It turned what could have been an overwhelming transition into a manageable process.",
        author: "Maria Garcia",
        role: "Sustainability Manager, Fresh Foods Market",
        image: "/images/Case Studies/SustainablePackaging/Testimonials/maria.jpg"
      }
    ]
  }
};
