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
    }
  ],
  otherProject: [
    // Similar structure for other projects
  ]
};

// Helper function to get all images for a project
export const getProjectImages = (projectId) => {
  return carouselImages[projectId] || [];
}; 