import { 
  IoAlertCircleOutline,
  IoStatsChart, 
  IoTimeOutline, 
  IoBarChartOutline, 
  IoPeopleOutline, 
  IoSearchOutline, 
  IoAccessibilityOutline, 
  IoCheckmarkDoneOutline, 
  IoSparklesOutline
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
          src: '../../images/Case Studies/JD/cover straight.svg',
          alt: 'John Deere Operations Center Mobile App Interface',
          objectFit: 'cover'
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
      {
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Case Studies/MI/Summary image.jpg',
          alt: 'John Deere Operations Center Mobile App Interface',
          objectFit: 'cover'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Project Timeline',
          milestones: [
            "Research & Discovery",
            "Marketplace Design",
            "User Testing",
            "Deployment"
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
            "SUS Score: 68",
            "28% Reduction in Clicks",
            "1m 47s Faster Task Completion"
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'User Feedback',
          description: '"The platform has made it so easy to find the right influencers for my business."',
          footer: '- Emily Davis, Small Business Ownerr'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Key Insight',
          description: 'Small businesses struggle with finding and managing influencers due to lack of resources.',
          footer: 'Opportunity for adoption'
        }
      },
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoCheckmarkDoneOutline,
          title: 'Task Success Rate',
          description: '7/10 tasks completed successfully in usability testing.',
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
            { "value": "8", "label": "A/B Tests Conducted" },
            { "value": "5", "label": "Task Analyses" },
            { "value": "3", "label": "Design Iterations" }
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
  "taskReminders": {
    title: "Overview",
    subtitle: "A context-aware task reminder system that helps users prioritize and complete tasks more effectively.",
    bentoItems: [
      {
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Case Studies/TR/Final Design.jpg',
          alt: 'Task Reminder App Interface',
          objectFit: 'cover'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Research Timeline',
          milestones: [
            "Exploring location-based reminders.",
            "Understanding cognitive structures and physical spaces.",
            "Synergizing AR and organizational methods.",
            "Prototype & Test"
          ],
          activeIndex: 3
        }
      },
      {
        size: 'wide',
        content: {
          type: 'stats',
          icon: IoSparklesOutline,
          title: 'Benefits of Spatial Interfaces',
          items: [
            "Priority Indicators", 
            "Notifications", 
            "Contextual Adaptability", 
            "Anywhere Access"
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'Research Focus',
          description: "Exploring spatial interfaces for task management and their benefits for young adults.",
          footer: 'Thesis Exploration'
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Research Insight',
          description: '"How we remember is different from how we like to be reminded. Physical spaces provide context that aids in recalling information."',
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
            { "value": "30+", "label": "Literature Sources" },
            { "value": "16", "label": "Interview Participants" },
            { "value": "13", "label": "Concept Testings" },
            { "value": "6", "label": "Evaluation Participants" }
          ]
        }
      }
    ]
  },
  "sustainablePackaging": {
    title: "Overview",
    subtitle: "A gamified AR solution to promote adoption of sustainable packaging by rewarding eco-conscious choices.",
    bentoItems: [
      {
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Case Studies/SP/Cover image.jpg',
          alt: 'Sustainable Packaging Platform Interface',
          objectFit: 'cover'
        }
      },
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Project Timeline',
          milestones: [
            "Market Research",
            "Concept Development",
            "Prototype Design",
            "Insights Report"
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
            "Plastic Waste: 268M Tonnes Annually",
            "Economic Value Lost: $165B",
            "Landfill Waste: 45% from Packaging"
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'Product Need',
          description: 'Packaging sustainability is critical to reducing environmental impact.',
          footer: 'Opportunity for Change'
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Research Insight',
          description: '82% of retailers cite cost as the primary barrier to sustainable packaging adoption.',
          footer: 'Market Opportunity'
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