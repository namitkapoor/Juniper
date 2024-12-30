import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/experiments.css';

export default function Experiments() {
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [expandedProject, setExpandedProject] = useState(null);

  const categories = {
    motion: { name: 'Motion', color: 'rgba(255, 100, 100, 0.2)' },
    flat: { name: 'Flat', color: 'rgba(100, 255, 100, 0.2)' },
    spatial: { name: 'Spatial', color: 'rgba(100, 100, 255, 0.2)' },
    interactive: { name: 'Interactive', color: 'rgba(255, 255, 100, 0.2)' }
  };

  const projects = [
    {
      title: "Central Ciborium",
      description: "3D model of the Central Ciborium in the Basilica of St. Paul Outside the Walls in Rome, Italy optimized for VR.",
      categories: ['flat', 'spatial'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Ciborium/Textured persp.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Ciborium/Textured persp.png",
            alt: "Front View",
            description: "Front elevation showing the intricate details of the columns"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Ciborium/Textured persp.png",
            alt: "Side View",
            description: "Side perspective highlighting the spatial depth"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Ciborium/Textured persp.png",
            alt: "Detail View",
            description: "Close-up of ornamental details"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Ciborium/Textured persp.png",
            alt: "Full Height View",
            description: "Complete vertical composition"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Disney Hats",
      description: "3D model of Disney hats optimized for Augmented Reality.",
      categories: ['flat', 'spatial'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Disney Hats/Black Hat 1.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Disney Hats/Black Hat 1.png",
            alt: "Disney Hat View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Disney Hats/Black Hat 1.png",
            alt: "Disney Hat View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Disney Hats/Black Hat 1.png",
            alt: "Disney Hat View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Disney Hats/Black Hat 1.png",
            alt: "Disney Hat View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Tiptoe Reindeer",
      description: "3D model of the official mascot of Macy's 2021 Holiday campaign optimized for Augmented Reality.",
      categories: ['motion', 'spatial'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Tiptoe/Tiptoe persp view.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Tiptoe/Tiptoe persp view.png",
            alt: "Tiptoe Reindeer View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Tiptoe/Tiptoe persp view.png",
            alt: "Tiptoe Reindeer View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Tiptoe/Tiptoe persp view.png",
            alt: "Tiptoe Reindeer View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Tiptoe/Tiptoe persp view.png",
            alt: "Tiptoe Reindeer View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Head Gesture Interface",
      description: "Head Gesture-Based Spatial Interfaces for Accessible VR Interactions",
      categories: ['motion', 'spatial', 'interactive'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Head Gestures/UI Design 1.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Head Gestures/UI Design 1.png",
            alt: "Head Gesture Interface View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Head Gestures/UI Design 1.png",
            alt: "Head Gesture Interface View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Head Gestures/UI Design 1.png",
            alt: "Head Gesture Interface View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Head Gestures/UI Design 1.png",
            alt: "Head Gesture Interface View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Go Portal",
      description: "Augmented Reality application for interactive tourism",
      categories: ['motion', 'spatial', 'interactive'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Go Portal/IMMERSE GT Logo.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Go Portal/IMMERSE GT Logo.png",
            alt: "Go Portal View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Go Portal/IMMERSE GT Logo.png",
            alt: "Go Portal View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Go Portal/IMMERSE GT Logo.png",
            alt: "Go Portal View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Go Portal/IMMERSE GT Logo.png",
            alt: "Go Portal View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Sense Easy",
      description: "Augmented Reality experience for curbing overstimulation in daily life",
      categories: ['motion', 'spatial', 'interactive'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/SenseEasy/Reality hack logo.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/SenseEasy/Reality hack logo.png",
            alt: "Sense Easy View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/SenseEasy/Reality hack logo.png",
            alt: "Sense Easy View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/SenseEasy/Reality hack logo.png",
            alt: "Sense Easy View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/SenseEasy/Reality hack logo.png",
            alt: "Sense Easy View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Wanda",
      description: "Introducing 'Wanda', an easy-to-use, intuitive, and accessible way to share your internet",
      categories: ['motion'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Wanda/wanda.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Wanda/wanda.png",
            alt: "Wanda View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Wanda/wanda.png",
            alt: "Wanda View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Wanda/wanda.png",
            alt: "Wanda View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Wanda/wanda.png",
            alt: "Wanda View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Owlette",
      description: "Journey of a psychopomp owl that is tasked with guiding souls to the afterlife",
      categories: ['motion'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Owlette/Owlette.png",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Owlette/Owlette.png",
            alt: "Owlette View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Owlette/Owlette.png",
            alt: "Owlette View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Owlette/Owlette.png",
            alt: "Owlette View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Owlette/Owlette.png",
            alt: "Owlette View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Dichtomoy Within",
      description: "Optical illusion painting using chalk on black paper",
      categories: ['flat'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Paintings/Dichotomy Within.jpg",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Dichotomy Within.jpg",
            alt: "Dichtomoy Within View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Dichotomy Within.jpg",
            alt: "Dichtomoy Within View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Dichotomy Within.jpg",
            alt: "Dichtomoy Within View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Dichotomy Within.jpg",
            alt: "Dichtomoy Within View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Energon",
      description: "A Dynamo-powered light sculpture",
      categories: ['flat'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Paintings/Energon.jpg",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Energon.jpg",
            alt: "Energon View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Energon.jpg",
            alt: "Energon View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Energon.jpg",
            alt: "Energon View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Energon.jpg",
            alt: "Energon View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Guiding Light",
      description: "Forest is a dark and gloomy place until the sun rises every morning.",
      categories: ['flat'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Paintings/Guiding Light.jpg",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Guiding Light.jpg",
            alt: "Guiding Light View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Guiding Light.jpg",
            alt: "Guiding Light View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Guiding Light.jpg",
            alt: "Guiding Light View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Guiding Light.jpg",
            alt: "Guiding Light View 4"
          },
          size: 'tall'
        }
      ]
    },
    {
      title: "Sanctuary",
      description: "Ponder whether you make your room or the room makes you?",
      categories: ['flat'],
      tags: ["3D", "UI"],
      image: "./images/Experiments/Paintings/Sanctuary.jpg",
      bentoItems: [
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Sanctuary.jpg",
            alt: "Sanctuary View 1"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Sanctuary.jpg",
            alt: "Sanctuary View 2"
          },
          size: 'wide'
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Sanctuary.jpg",
            alt: "Sanctuary View 3"
          }
        },
        {
          content: {
            type: 'image',
            src: "./images/Experiments/Paintings/Sanctuary.jpg",
            alt: "Sanctuary View 4"
          },
          size: 'tall'
        }
      ]
    },
    // Add more projects...
  ];

  const toggleCategory = (category) => {
    setActiveCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const sortProjects = (projects) => {
    if (activeCategories.size === 0) return projects;
    
    return [...projects].sort((a, b) => {
      const aMatches = a.categories.filter(cat => activeCategories.has(cat)).length;
      const bMatches = b.categories.filter(cat => activeCategories.has(cat)).length;
      
      if (aMatches !== bMatches) {
        return bMatches - aMatches;
      }
      
      return 0;
    });
  };

  return (
    <section className="experiments-section">
      <h2>Experiments</h2>
      
      <div className="categories-container">
        <div className="categories-buttons">
          {Object.entries(categories).map(([key, { name, color }]) => (
            <motion.button
              key={key}
              className={`category-button ${activeCategories.has(key) ? 'active' : ''}`}
              onClick={() => toggleCategory(key)}
              whileHover={{ scale: 1.05 }}
              style={{
                '--category-color': color,
                '--blend-opacity': activeCategories.has(key) ? '1' : '0.3'
              }}
            >
              {name}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        className="projects-grid"
        layout
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
      >
        <AnimatePresence>
          {sortProjects(projects).map((project, index) => (
            <motion.div
              key={project.title}
              className={`project-card ${expandedProject === project.title ? 'expanded' : ''}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: project.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.3,
                scale: project.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.95
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.8,
                layout: { 
                  duration: 0.6,
                  type: "spring",
                  bounce: 0.2
                }
              }}
            >
              <div className="project-categories">
                {project.categories.map(cat => (
                  <span 
                    key={cat} 
                    className="category-tag"
                    style={{ '--category-color': categories[cat].color }}
                  >
                    {categories[cat].name}
                  </span>
                ))}
              </div>
              <h3>{project.title}</h3>
              <div 
                className="project-content"
                onClick={() => setExpandedProject(expandedProject === project.title ? null : project.title)}
              >
                {project.image && (
                  <motion.div 
                    className="project-image-container"
                    whileHover={{ scale: 1.02 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="project-image"
                    />
                  </motion.div>
                )}
                <p>{project.description}</p>
                <motion.button
                  className="expand-button"
                  onClick={() => setExpandedProject(expandedProject === project.title ? null : project.title)}
                  animate={{ rotate: expandedProject === project.title ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="expand-icon">▼</span>
                </motion.button>
              </div>
              
              <AnimatePresence>
                {expandedProject === project.title && project.bentoItems && (
                  <motion.div
                    className="project-bento-container"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bento-grid">
                      {project.bentoItems.map((item, index) => (
                        <motion.div
                          key={index}
                          className={`bento-item ${item.size || ''}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="bento-item-content">
                            <img 
                              src={item.content.src} 
                              alt={item.content.alt}
                            />
                            <div className="bento-item-description">
                              <p>{item.content.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
