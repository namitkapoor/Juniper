import { 
  IoStatsChart, 
  IoTimeOutline, 
  IoBarChartOutline, 
  IoPeopleOutline, 
  IoSearchOutline, 
  IoAccessibilityOutline, 
  IoCheckmarkDoneOutline, 
  IoSparklesOutline,
  IoStopwatch,
  IoBriefcase,
  IoInformationCircleOutline,
  IoConstructOutline,
  IoRocketOutline,
  
} from 'react-icons/io5';

export const overviewData = {
  "manageFarms": {
    title: "Overview",
    subtitle: "An operations management app designed to better serve small farm owners, focusing on usability and scalability for non-technical users.",
    bentoItems: [
      {
        size: 'tall',
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Project Timeline',
          milestones: [
            'Farmer Insights',
            'Design Concepts',
            'Field Testing',
            'Iterative Refinement'
          ],
          activeIndex: 3
        }
      },
      
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
        size: 'small',
        content: {
          type: 'stats',
          icon: IoInformationCircleOutline,
          title: 'Project Info',
          items: [
            'Role: UX/UI Designer',
            'Team: 4 members',
            'Duration: 3 months'
          ]
        }
      },
      // {
      //   size: 'small',
      //   content: {
      //     type: 'text',
      //     icon: IoAccessibilityOutline,
      //     title: 'Accessibility Focus',
      //     description: 'Achieved WCAG 2.0 AA compliance with contrast checks and color-blind-friendly visual tags.',
      //     footer: 'Inclusive by Design'
      //   }
      // },
      // {
      //   size: 'small',
      //   content: {
      //     type: 'text',
      //     icon: IoPeopleOutline,
      //     title: 'User Feedback',
      //     description: '"It’s like you’ve been to my farm —  The layout is exactly how it looks!"',
      //     footer: '- Sarah Chen, Homestead Farmer'
      //   }
      // },
      
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoConstructOutline,
          title: 'Tools Used',
          description: 'Figma, Miro, Google Workspace',
          footer: 'User Evaluations'
        }
      },
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Product Summary',
          description: 'Small farmers often rely on paper tools, making farm management inefficient. Our grid-based map view creates a digital twin of their farm, helping sync fieldwork with indoor tools for better organization.',
          footer: 'Opportunity for adoption'
        }
      },
      {
        size:'medium',
        content: {
          type: 'image',
          src: '../../images/Case Studies/JD/Me at dealership.jpg',
          alt: 'John Deere Operations Center Mobile App Interface',
          objectFit: 'cover'
        }
      }, 
      {
        size: 'wide',
        content: {
          type: 'metrics',
          icon: IoStatsChart,
          title: 'Impact',
          items: [
            { value: '70', label: 'SUS Score' },
            { value: '85%', label: 'User Satisfaction' },
            { value: '64%', label: 'Task Completion' },
            { value: '12', label: 'User Interviews' }
          ]
        }
      },
      
      
      // {
      //   size: 'medium',
      //   content: {
      //     type: 'text',
      //     icon: IoCheckmarkDoneOutline,
      //     title: 'My Contribution',
      //     description: 'Led the design of a map-to-grid interface tailored for small farms, making it easier for farmers to visualize and manage their land.',
      //     footer: 'User Evaluations'
      //   }
      // },
     
      
      
    ]
  },
  "influencerMarketing": {
    title: "Overview",
    subtitle: "Redesigning a web app to simplify influencer hiring and campaign tracking",
    description: "A B2B platform that streamlines influencer marketing for small business owners, focusing on workflow efficiency and engagement metrics.",
    bentoItems: [
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
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Case Studies/MI/Summary image.jpg',
          alt: 'My Influencer Marketing Platform',
          objectFit: 'cover'
        }
      },
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoConstructOutline,
          title: 'Tools Used',
          description: 'Figma, React, Miro, Google Workspace',
          footer: 'User Evaluations'
        }
      }, 
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoAccessibilityOutline,
          title: 'Accessibility Focus',
          description: 'Achieved WCAG 2.0 AA compliance with contrast checks and color-blind-friendly visual tags.',
          footer: 'Inclusive by Design'
        }
      },
      {
        size: 'wide',
        content: {
          type: 'metrics',
          icon: IoStatsChart,
          title: 'Impact',
          items: [
            { value: '68', label: 'SUS Score' },
            { value: '3+', label: 'A/B Tests' },
            { value: '107s', label: 'Faster Task Completion' },
            { value: '4', label: 'User Interviews' }
          ]
        }
      },
      {
        size: 'medium',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Product Summary',
          description: 'Small farmers often rely on paper tools, making farm management inefficient. Our grid-based map view creates a digital twin of their farm, helping sync fieldwork with indoor tools for better organization.',
          footer: 'Opportunity for adoption'
        }
      },
      {
        size: 'small',
        content: {
          type: 'stats',
          icon: IoInformationCircleOutline,
          title: 'Project Info',
          items: [
            "Role: UX/UI Designer",
            "Team: 6 members",
            "Duration: 3 months"
          ]
        }
      },
      // {
      //   size: 'medium',
      //   content: {
      //     type: 'text',
      //     icon: IoPeopleOutline,
      //     title: 'User Feedback',
      //     description: '"The platform has made it so easy to find the right influencers for my business."',
      //     footer: '- Emily Davis, Small Business Ownerr'
      //   }
      // },     
      // {
      //   size: 'wide',
      //   content: {
      //     type: 'text',
      //     icon: IoCheckmarkDoneOutline,
      //     title: 'My Contribution',
      //     description: 'I redesigned the influencer marketing platform, transforming it from a placeholder UI into a polished, user-friendly product. By conducting competitive research and optimizing task flows, I delivered a realistic yet impactful facelift that adhered to branding constraints and tight timelines.',
      //     footer: 'User Evaluations'
      //   }
      // },
      
      // {
      //   size: 'wide',
      //   content: {
      //     type: 'text',
      //     icon: IoSearchOutline,
      //     title: 'Key Insight',
      //     description: 'Small businesses struggle with finding and managing influencers due to lack of resources.',
      //     footer: 'Opportunity for adoption'
      //   }
      // },
      
    ]
  },
  "taskReminders": {
    title: "Overview",
    subtitle: "A context-aware task reminder system that helps users prioritize and complete tasks more effectively.",
    bentoItems: [
      {
        size: 'tall', 
        content: {
          type: 'timeline',
          icon: IoTimeOutline,
          title: 'Research Timeline',
          milestones: [
            "Location Triggers",
            "Cognition & Space",
            "AR & Organization",
            "Prototype & Test"
          ],
          activeIndex: 3
        }
      },
      
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
        size: 'small',
        content: {
          type: 'stats',
          icon: IoConstructOutline,
          title: 'Project Info',
          items: [
            "Role: UX Developer", 
            "Team: Solo Project", 
            "Duration: 9 months"
          ]
        }
      },
      {
        size: 'tall',
        content: {
          type: 'text',
          icon: IoPeopleOutline,
          title: 'Product Need',
          description: 'Most young adults end up creating redundant reminders in their phone, notebook, sticky notes, etc. because they need both physical and digital reminders.',
          footer: 'Opportunity for Change'
        }
      },
      {
        size: 'wide',
        content: {
          type: 'metrics',
          icon: IoStatsChart,
          title: 'Research Data',
          items: [
            { "value": "30+", "label": "Literature Sources" },
            { "value": "16", "label": "Interview Participants" },
            { "value": "13", "label": "Concept Testings" },
            { "value": "6", "label": "Evaluation Participants" }
          ]
        }
      },
      {
        size: 'medium',
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
      // {
      //   size: 'medium',
      //   content: {
      //     type: 'text',
      //     icon: IoRocketOutline,
      //     title: 'Innovation Focus',
      //     description: '"Explored novel ways to integrate spatial interfaces, leveraging physical spaces to reduce cognitive load and enhance task management through context-aware AR solutions."',
      //     footer: 'Revolutionizing Interaction Design'
      //   }
      // },   
      
      // {
      //   size: 'wide',
      //   content: {
      //     type: 'text',
      //     icon: IoPeopleOutline,
      //     title: 'Research Focus',
      //     description: "Exploring spatial interfaces for task management and their benefits for young adults.",
      //     footer: 'Thesis Exploration'
      //   }
      // },
      // {
      //   size: 'small',
      //   content: {
      //     type: 'text',
      //     icon: IoSearchOutline,
      //     title: 'Research Insight',
      //     description: '"How we remember is different from how we like to be reminded. Physical spaces provide context that aids in recalling information."',
      //     footer: 'Opportunity for Context'
      //   }
      // },
      
    ]
  },
  "sustainablePackaging": {
    title: "Overview",
    subtitle: "A gamified AR solution to promote adoption of sustainable packaging by rewarding eco-conscious choices.",
    bentoItems: [
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
        size: 'large',
        content: {
          type: 'image',
          src: '../../images/Case Studies/SP/Cover image.jpg',
          alt: 'Sustainable Packaging Platform Interface',
          objectFit: 'cover'
        }
      },
      {
        size: 'small',
        content: {
          type: 'stats',
          icon: IoInformationCircleOutline,
          title: 'Project Info',
          items: [
            'Role: UX/UI Designer',
            'Team: 4 members',
            'Duration: 3 months'
          ]
        }
      },
      // {
      //   size: 'small',
      //   content: {
      //     type: 'text',
      //     icon: IoPeopleOutline,
      //     title: 'Product Need',
      //     description: 'Sustainable packaging is critical to reducing humanity\'s environmental impact.',
      //     footer: 'Opportunity for Change'
      //   }
      // },
      {
        size: 'small',
        content: {
          type: 'text',
          icon: IoSearchOutline,
          title: 'Research Insight',
          description: '82% of retailers cite cost as the primary barrier to sustainable packaging adoption.',
          footer: 'Market Opportunity'
        }
      },
      {
        size: 'wide',
        content: {
          type: 'metrics',
          icon: IoStatsChart,
          title: 'Potential Impact',
          items: [
            { value: '268M', label: 'Plastic Waste' },
            { value: '$165B', label: 'Economic Value Lost' },
            { value: '45%', label: 'Landfill Waste' }
          ]
        }
      },
      {
        size: 'wide',
        content: {
          type: 'text',
          icon: IoRocketOutline,
          title: 'Innovation Focus',
          description: '"Explored novel ways to integrate spatial interfaces, leveraging physical spaces to reduce cognitive load and enhance task management through context-aware AR solutions."',
          footer: 'Gamifying Sustainability'
        }
      },
      

      
      // {
      //   size: 'wide',
      //   content: {
      //     type: 'text',
      //     icon: IoCheckmarkDoneOutline,
      //     title: 'My Contribution',
      //     description: 'I designed a gamified AR solution that rewards users for choosing sustainable packaging, leveraging physical spaces to reduce cognitive load and enhance task management through context-aware AR solutions.',
      //     footer: 'Revolutionizing Interaction Design'
      //   }
      // }
    ]
  }
}; 