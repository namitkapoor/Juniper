export const projects = [
  {
    title: "Central Ciborium",
    description: "3D model of the Central Ciborium in the Basilica of St. Paul Outside the Walls in Rome, Italy optimized for VR.",
    categories: ['flat', 'spatial'],
    image: "./images/Experiments/Ciborium/Textured persp.png",
  },
  {
    title: "Disney Hats",
    description: "Interactive 3D configurator for customizing Disney character-inspired hats.",
    categories: ['interactive', 'spatial'],
    image: "./images/Experiments/Disney Hats/Black Hat 1.png",
  },
  {
    title: "Tiptoe",
    description: "Exploring typography in 3D space using Three.js and custom shaders.",
    categories: ['motion', 'spatial'],
    image: "./images/Experiments/Tiptoe/Tiptoe persp view.png",
  }
  // Add other projects as needed
];

export const categories = {
  motion: { name: 'Motion', color: 'rgba(255, 100, 100, 0.2)' },
  flat: { name: 'Flat', color: 'rgba(100, 255, 100, 0.2)' },
  spatial: { name: 'Spatial', color: 'rgba(100, 100, 255, 0.2)' },
  interactive: { name: 'Interactive', color: 'rgba(255, 255, 100, 0.2)' }
}; 