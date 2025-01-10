const BASE_PATH = '/images/Case Studies';

export const carouselImages = {
  manageFarms: {
    researchInsights: [
      {
        src: `${BASE_PATH}/JD/Team at JD Dealership 2.jpg`,
        caption: 'Team at John Deere Dealership',
        alt: 'Farm managers participating in user research interviews',
        methodologies: ["Field Observations"]
      },
      {
        src: `${BASE_PATH}/JD/me at farmers market.jpg`,
        caption: 'Interacting with farmers at a farmers market',
        alt: 'Farm managers participating in user research interviews',
        methodologies: ["Field Observations"]
      },
      {
        src: `${BASE_PATH}/JD/first interview w sam.jpg`,
        caption: 'Semi-structured interview with a homesteading farmer',
        alt: 'Field observation session',
        methodologies: ["User Interviews"]
      },
      {
        src: `${BASE_PATH}/JD/Jake interview screenshot.jpg`,
        caption: 'Semi-structured interview with an organic farmer',
        alt: 'Field observation session',
        methodologies: ["User Interviews"]
      },
      {
        src: `${BASE_PATH}/JD/Journey Map 1.jpg`,
        caption: 'Journey map of Sandy',
        alt: 'Journey mapping workshop results',
        methodologies: ["Journey Maps"]
      },
      {
        src: `${BASE_PATH}/JD/Journey Map 2.jpg`,
        caption: 'Journey map of Michael',
        alt: 'Journey mapping workshop results',
        methodologies: ["Journey Maps"]
      },
      {
        src: `${BASE_PATH}/JD/Wifi not working at farm.jpg`,
        caption: 'Technical issues with digital tools',
        alt: 'Journey mapping workshop results',
        methodologies: ["Storyboards"]
      },
      {
        src: `${BASE_PATH}/JD/Processing Harvest - Cucumbers.jpg`,
        caption: 'Inventory issues',
        alt: 'Journey mapping workshop results',
        methodologies: ["Storyboards"]
      },
      {
        src: `${BASE_PATH}/JD/type of product grown by farmers data.jpg`,
        caption: 'Journey mapping session with farmers',
        alt: 'Journey mapping workshop results',
        methodologies: ["Survey Data"]
      },
      {
        src: `${BASE_PATH}/JD/organizational tools used by farmers data.jpg`,
        caption: 'Competitive analysis of existing farm tools',
        alt: 'Competitive analysis results',
        methodologies: ["Survey Data"]
      },
      {
        src: `${BASE_PATH}/JD/Farming experience affinity map.jpg`,
        caption: 'Affinity diagram',
        alt: 'Affinity diagram results',
        methodologies: ["Affinity Diagrams"]
      }
    ],
    businessChallenge: [
      {
        src: `${BASE_PATH}/JD/Original Design/Home.svg`,
        caption: 'Original complex interface design',
        alt: 'Original complex interface design',
        methodologies: ["Interface Analysis"],
        painPoints: ["complexInterface"]
      },
      {
        src: `${BASE_PATH}/JD/Original Design/Map.svg`,
        caption: 'Navigation complexity example',
        alt: 'Navigation complexity example',
        methodologies: ["Interface Analysis"],
        painPoints: ["complexInterface"]
      },
      {
        src: `${BASE_PATH}/JD/Original Design/Map-2.svg`,
        caption: 'User feedback on task management',
        alt: 'User feedback on task management',
        methodologies: ["User Feedback"],
        painPoints: ["taskManagement"]
      },
      {
        src: `${BASE_PATH}/JD/Original Design/Plan.svg`,
        caption: 'Task management interface issues',
        alt: 'Task management interface issues',
        methodologies: ["Interface Analysis"],
        painPoints: ["taskManagement"]
      },
      {
        src: `${BASE_PATH}/JD/long tutorial.jpg`,
        caption: 'Complex onboarding process',
        alt: 'Complex onboarding process',
        methodologies: ["User Onboarding"],
        painPoints: ["learningCurve"]
      },
      {
        src: `${BASE_PATH}/JD/App store review 1.jpg`,
        caption: 'Overwhelming tutorial steps',
        alt: 'Overwhelming tutorial steps',
        methodologies: ["User Onboarding"],
        painPoints: ["learningCurve"]
      }
    ],
    taskAnalysis: [
      {
        src: `${BASE_PATH}/JD/Task Analysis/Choose crop task analysis.jpg`,
        caption: 'Task Analysis: Choose a Crop to Plant',
        alt: 'Task flow diagram for crop selection process',
        taskCategory: "Choose a Crop to Plant"
      },
      {
        src: `${BASE_PATH}/JD/Task Analysis/Categorize and customize flags task Analysis.jpg`,
        caption: 'Task Analysis: Identify and Customize Flags',
        alt: 'Task flow diagram for flag customization',
        taskCategory: "Identify and Customize Flags"
      },
      {
        src: `${BASE_PATH}/JD/Task Analysis/Finding troubleshoot.jpg`,
        caption: 'Task Analysis: Find Troubleshoot',
        alt: 'Task flow diagram for troubleshooting process',
        taskCategory: "Find Troubleshoot"
      },
      {
        src: `${BASE_PATH}/JD/Task Analysis/Harvest plans task analysis.jpg`,
        caption: 'Task Analysis: Create Harvest Plans',
        alt: 'Task flow diagram for harvest planning',
        taskCategory: "Create Harvest Plans"
      },
      {
        src: `${BASE_PATH}/JD/Task Analysis/Removing flag task analysis.jpg`,
        caption: 'Task Analysis: Remove Flags',
        alt: 'Task flow diagram for flag removal process',
        taskCategory: "Remove Flags"
      }
    ],
    conceptFeedback: [
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.1.svg',
        caption: 'Dashboard View',
        alt: 'Dashboard interface of Operations Center'
      },
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.2.svg',
        caption: 'Map View',
        alt: 'Dashboard interface of Operations Center'
      },
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.3.svg',
        caption: 'Map View',
        alt: 'Dashboard interface of Operations Center'
      },
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.4.svg',
        caption: 'Plan View',
        alt: 'Dashboard interface of Operations Center'
      },
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.5.svg',
        caption: 'Analytics View',
        alt: 'Dashboard interface of Operations Center'
      },
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.6.svg',
        caption: 'Analytics View',
        alt: 'Dashboard interface of Operations Center'
      },
      {
        src: '/images/Case Studies/JD/Sketches/Sketch-2.7.svg',
        caption: 'Analytics View',
        alt: 'Dashboard interface of Operations Center'
      }
    ]
  },
  
  influencerMarketing: {
    researchInsights: [],
    businessChallenge: [],
    taskAnalysis: [],
    conceptFeedback: []
  },
  
  taskReminders: {
    researchInsights: [],
    businessChallenge: [],
    taskAnalysis: [],
    conceptFeedback: []
  },
  
  sustainablePackaging: {
    researchInsights: [],
    businessChallenge: [],
    taskAnalysis: [],
    conceptFeedback: []
  }
};

// Updated helper functions to work with new structure
export const getBusinessChallengeImages = (projectId) => {
  return carouselImages[projectId]?.businessChallenge || [];
};

export const getResearchInsightImages = (projectId) => {
  return carouselImages[projectId]?.researchInsights || [];
};

export const getTaskAnalysisImages = (projectId, taskCategory) => {
  const taskImages = carouselImages[projectId]?.taskAnalysis || [];
  return taskCategory 
    ? taskImages.filter(img => img.taskCategory === taskCategory)
    : taskImages;
};

export const getConceptImages = (projectId) => {
  return carouselImages[projectId]?.conceptFeedback || [];
};

export const getProjectImages = (projectId) => {
  const projectImages = {
    "manageFarms": [
      {
        url: "/images/Case Studies/JD/Research/research-1.jpg",
        caption: "Field observation session"
      },
      {
        url: "/images/Case Studies/JD/Research/research-2.jpg",
        caption: "User interview insights"
      }
    ],
    "sustainablePackaging": [
      {
        url: "/images/Case Studies/SustainablePackaging/Research/research-1.jpg",
        caption: "Retailer interview session"
      },
      {
        url: "/images/Case Studies/SustainablePackaging/Research/research-2.jpg",
        caption: "Market analysis findings"
      },
      {
        url: "/images/Case Studies/SustainablePackaging/Research/research-3.jpg",
        caption: "Cost impact study"
      }
    ]
    // Add other projects as needed
  };

  return projectImages[projectId] || [];
}; 