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
    title: "Hire Influencer Marketing",
    subtitle: "Redesigning a web app to simplify influencer hiring and campaign tracking",
    description: "A B2B platform that streamlines influencer marketing for small business owners, focusing on workflow efficiency and engagement metrics.",
    bentoItems: [
      // Add bento items for influencer marketing project
    ]
  }
  // Add other projects as needed
}; 