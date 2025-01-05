const BASE_PATH = '/images/Case Studies';

export const carouselImages = {
  manageFarms: [
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
  
  businessChallengeImages: [
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
  
  otherProject: [
    // Similar structure for other projects
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
      src: `${BASE_PATH}/JD/Task Analysis/Finding Troubleshoot.jpg`,
      caption: 'Task Analysis: Find Troubleshoot',
      alt: 'Task flow diagram for troubleshooting process',
      taskCategory: "Find Troubleshoot"
    },
    {
      src: `${BASE_PATH}/JD/Task Analysis/Harvest plan task analysis.jpg`,
      caption: 'Task Analysis: Create Harvest Plans',
      alt: 'Task flow diagram for harvest planning',
      taskCategory: "Create Harvest Plans"
    },
    {
      src: `${BASE_PATH}/JD/Task Analysis/Remove flags task analysis.jpg`,
      caption: 'Task Analysis: Remove Flags',
      alt: 'Task flow diagram for flag removal process',
      taskCategory: "Remove Flags"
    }
  ]
};

// Helper function to get business challenge images
export const getBusinessChallengeImages = (projectId, painPointId) => {
  // Check if the project exists and has business challenge images
  const projectBusinessChallenges = carouselImages.businessChallengeImages;
  
  if (!projectBusinessChallenges || !painPointId) {
    return [];
  }

  // Return the images for the specific pain point
  return projectBusinessChallenges[painPointId] || [];
};

// Helper function to get all images for a project
export const getProjectImages = (projectId) => {
  return carouselImages[projectId] || [];
};

// Add a new helper function
export const getTaskAnalysisImages = (taskCategory) => {
  const taskImages = carouselImages.taskAnalysis || [];
  return taskCategory 
    ? taskImages.filter(img => img.taskCategory === taskCategory)
    : taskImages;
}; 