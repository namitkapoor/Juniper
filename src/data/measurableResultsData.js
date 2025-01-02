import { 
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoHappyOutline,
  IoTimeOutline
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
          change: "+40%",
          previousValue: "50"
        },
        details: [
          "Improved user satisfaction across all farm sizes",
          "Reduced learning curve for new users",
          "Higher engagement with core features"
        ],
        image: "../images/Case Studies/JD/Average SUS Scores.png"
      },
      {
        title: "Task Completion",
        icon: IoTimeOutline,
        stats: {
          value: "85%",
          change: "+35%",
          previousValue: "50%"
        },
        details: [
          "Faster task completion rates",
          "Reduced error rates in data entry",
          "More efficient workflow management"
        ]
      },
      // Add more metrics
    ],
    testimonials: [
      {
        quote: "Finally, an app that understands small farm operations!",
        author: "Sarah Chen",
        role: "Homestead Farmer",
        image: "../images/Case Studies/JD/farmer-testimonial.jpg"
      }
      // Add more testimonials
    ]
  }
}; 