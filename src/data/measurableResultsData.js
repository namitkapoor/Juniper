import { 
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoHappyOutline,
  IoTimeOutline,
  IoRocketOutline,
  IoPeopleOutline,
  IoOptionsOutline,
  IoVolumeHighOutline,
  IoColorPaletteOutline,
  IoSpeedometerOutline,
  IoTrophyOutline
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
        // image: "../images/Case Studies/JD/Average SUS Scores.png"
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
        ]
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
        // image: "../images/Case Studies/JD/Evals/Heuristic evals.webp"
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
        title: "Navigation Efficiency",
        icon: IoSpeedometerOutline,
        stats: {
          value: "28%",
          unit: "Click Reduction",         
          change: "107s time saved"
        },
        details: [
          "Consolidated view reduced navigation complexity",
          "Single-tab design eliminated context switching",
          "Streamlined status tracking improved visibility"
        ],
        // image: "/images/Case Studies/Influencer/Results/discovery-time.jpg"
      },
      {
        title: "Task analysis",
        icon: IoRocketOutline,
        stats: {
          value: "95%",
          unit: "Task Success",
          change: "Key tasks tested"
        },
        details: [
          "Campaign creation workflow",
          "Influencer status tracking",
          "Progress monitoring"
        ],
        // image: "/images/Case Studies/Influencer/Results/campaign-success.jpg"
      },
      {
        title: "System Usability",
        icon: IoTrophyOutline,
        stats: {
          value: "68",
          unit: "SUS Score",
          change: "Based on user testing"
        },
        details: [
          "Interface learnability",
          "Task completion confidence",
          "Overall system satisfaction"
        ],
        // image: "/images/Case Studies/Influencer/Results/user-adoption.jpg"
      }
    ],
    testimonials: [
      {
        quote: "Being able to see all my influencer campaigns in one place has made tracking so much easier. The timeline view gives me instant visibility into where each collaboration stands.",
        author: "Michael Rodriguez",
        role: "Marketing Director, StyleCraft",
        image: "/images/Case Studies/Influencer/Testimonials/michael.jpg"
      },
      {
        quote: "The streamlined interface has cut down the time I spend managing campaigns significantly. I especially love how I can quickly see which influencers need follow-up without switching between different tabs.",
        author: "Lisa Chen",
        role: "Owner, Sustainable Beauty Co"
        // image: "/images/Case Studies/Influencer/Testimonials/lisa.jpg"
      }
    ]
  },
  "taskReminders": {
    metrics: [
      {
        title: "Attribute Evaluation",
        icon: IoOptionsOutline,
        stats: {
          value: "6",
          unit: "Participants",
          change: "3 Attributes Tested"
        },
        details: [
          "Sound variations (pitch and loudness)",
          "Color changes (saturation and hue)",
          "Animation speed adjustments"
        ],
        // image: "/images/Case Studies/TaskReminders/Results/attributes.jpg"
      },
      {
        title: "Sound Effectiveness",
        icon: IoVolumeHighOutline,
        stats: {
          value: "Increasing",
          unit: "Volume",
          change: "Preferred by users"
        },
        details: [
          "Sound intensification with proximity matched spatial expectations",
          "Progressive volume increase improved urgency perception",
          "Natural mapping to real-world sound behavior"
        ],
        // image: "/images/Case Studies/TaskReminders/Results/satisfaction.jpg"
      },
      {
        title: "Visual Indicators",
        icon: IoColorPaletteOutline,
        stats: {
          value: "Desaturation",
          unit: "Effect",
          change: "Clear priority signaling"
        },
        details: [
          "Color desaturation effectively communicated distance-based priority",
          "Hue shifts provided additional priority context",
          "Animation speed reinforced urgency levels"
        ],
        // image: "/images/Case Studies/TaskReminders/Results/performance.jpg"
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
        quote: "Finally, a reminder system that grabs my attention without taking me out of my space. Although wearing a headset is a bother for now, can't wait for smart glasses to adopt this!",
        author: "Emily Chen",
        role: "UX Designer",
        image: "/images/Case Studies/TaskReminders/Testimonials/emily.jpg"
      }
    ]
  },
  "sustainablePackaging": {
    metrics: [
      {
        title: "Technical Detection",
        icon: IoRocketOutline,
        stats: {
          value: "6",
          unit: "Material Types",
          change: "detected via AR"
        },
        details: [
          "AR detection for Glass, Aluminum, Paperboard, and 3 types of Plastic",
          "Average scan time under 1 second",
          "Works in standard store lighting"
        ]
      },
      {
        title: "Eco Score Impact",
        icon: IoTrendingUpOutline,
        stats: {
          value: "500-1000",
          unit: "Points Range",
          change: "$1-4 savings potential per purchase"
        },
        details: [
          "80 points for most sustainable (Glass)",
          "10 points for least sustainable (Styrofoam)",
          "Tiered rewards starting at 500 points"
        ]
      },
      {
        title: "User Study",
        icon: IoPeopleOutline,
        stats: {
          value: "87%",
          unit: "Understanding Rate",
          change: "of scoring system"
        },
        details: [
          "Study with university participants",
          "Clear understanding of point-to-dollar conversion",
          "Positive response to incremental rewards"
        ]
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
