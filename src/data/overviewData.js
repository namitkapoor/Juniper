import { 
  IoAlertCircleOutline,
  IoStatsChart, 
  IoTimeOutline, 
  IoBarChartOutline, 
  IoPeopleOutline, 
  IoSearchOutline, 
  IoAccessibilityOutline, 
  IoCheckmarkDoneOutline 
} from 'react-icons/io5';

export const overviewData = {
  "manageFarms": {
    title: "Overview",
    subtitle: "An operations management app designed to better serve small farm owners, focusing on usability and scalability for non-technical users.",
    bentoItems: [
      {
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Project Cover Photos/JD thumbnail photo 2.svg',
          alt: 'John Deere Operations Center Mobile App Interface',
          objectFit: 'contain'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Project Timeline',
          milestones: [
            'Research & Discovery',
            'UX/UI Design',
            'User Testing',
            'Iterate'
          ],
          activeIndex: 3
        }
      },
      {
        size: 'wide',
        content: {
          type: 'stats',
          icon: IoStatsChart,
          title: 'Impact',
          items: [
            'SUS Score: 70',
            'User Satisfaction: 85%',
            'Task Completion: 92%'
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'User Feedback',
          description: '"Finally, an app that understands small farm operations!"',
          footer: '- Sarah Chen, Homestead Farmer'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Key Insight',
          description: '36% of farmers rely on paper tools, highlighting the need for an intuitive digital solution.',
          footer: 'Opportunity for adoption'
        }
      },
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoCheckmarkDoneOutline,
          title: 'Task Success Rate',
          description: '9/14 tasks completed successfully in usability testing.',
          footer: 'User Evaluations'
        }
      },
      {
        size: 'small',
        content: {
          type: 'metrics',
          icon: IoBarChartOutline,
          title: 'Research Breakdown',
          items: [
            { value: '9', label: 'Surveys' },
            { value: '4', label: 'User Interviews' },
            { value: '127', label: 'Affinity Notes' },
            { value: '7', label: 'Task Analyses' }
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoAccessibilityOutline,
          title: 'Accessibility Focus',
          description: 'Achieved WCAG 2.0 AA compliance with contrast checks and color-blind-friendly visual tags.',
          footer: 'Inclusive by Design'
        }
      }
    ]
  },
  "influencerMarketing": {
    title: "Overview",
    subtitle: "Redesigning a web app to simplify influencer hiring and campaign tracking",
    description: "A B2B platform that streamlines influencer marketing for small business owners, focusing on workflow efficiency and engagement metrics.",
    bentoItems: [
      // Add bento items for influencer marketing project
    ]
  },
  "taskReminders": {
    title: "Overview",
    subtitle: "A context-aware task reminder system that helps users prioritize and complete tasks more effectively.",
    bentoItems: [
      {
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Project Cover Photos/TaskReminders/hero.svg',
          alt: 'Task Reminder App Interface',
          objectFit: 'contain'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Project Timeline',
          milestones: [
            'User Research',
            'Context Analysis',
            'Prototype & Test',
            'Implementation'
          ],
          activeIndex: 3
        }
      },
      {
        size: 'wide',
        content: {
          type: 'stats',
          icon: IoStatsChart,
          title: 'Key Metrics',
          items: [
            'Task Completion: +45%',
            'User Engagement: 78%',
            'Context Accuracy: 92%'
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'User Impact',
          description: '"The contextual reminders have transformed how I manage my daily tasks."',
          footer: '- Alex Kim, Product Manager'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Research Insight',
          description: '73% of users report task abandonment due to poor timing of reminders.',
          footer: 'Opportunity for Context'
        }
      },
      {
        size: 'small',
        content: {
          type: 'metrics',
          icon: IoBarChartOutline,
          title: 'Research Data',
          items: [
            { value: '12', label: 'Interviews' },
            { value: '250', label: 'Survey Responses' },
            { value: '5', label: 'Focus Groups' },
            { value: '3', label: 'Iterations' }
          ]
        }
      }
    ]
  },
  "sustainablePackaging": {
    title: "Overview",
    subtitle: "A data-driven incentive program to encourage retailers to adopt sustainable packaging practices.",
    bentoItems: [
      {
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Project Cover Photos/SustainablePackaging/hero.svg',
          alt: 'Sustainable Packaging Platform Interface',
          objectFit: 'contain'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Project Timeline',
          milestones: [
            'Market Research',
            'Program Design',
            'Pilot Testing',
            'Full Launch'
          ],
          activeIndex: 3
        }
      },
      {
        size: 'wide',
        content: {
          type: 'stats',
          icon: IoStatsChart,
          title: 'Key Metrics',
          items: [
            'Adoption Rate: 65%',
            'Waste Reduction: 40%',
            'Cost Savings: 25%'
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'Retailer Impact',
          description: '"The incentive program made sustainable packaging both feasible and profitable."',
          footer: '- Mark Johnson, Retail Chain Director'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Research Insight',
          description: '82% of retailers cite cost as the primary barrier to sustainable packaging adoption.',
          footer: 'Market Analysis'
        }
      },
      {
        size: 'small',
        content: {
          type: 'metrics',
          icon: IoBarChartOutline,
          title: 'Research Data',
          items: [
            { value: '15', label: 'Retailers' },
            { value: '300', label: 'Survey Responses' },
            { value: '4', label: 'Focus Groups' },
            { value: '3', label: 'Program Iterations' }
          ]
        }
      }
    ]
  }
}; 