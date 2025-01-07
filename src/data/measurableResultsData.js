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
  }
};
