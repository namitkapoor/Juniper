import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Text } from '@react-three/drei';
import { projects, categories } from '../data/projectsData';
import { Vector3, MathUtils } from 'three';

// Category Filter UI Component (outside canvas)
function CategoryFilters({ activeCategories, onToggleCategory }) {
    return (
        <div className="category-filters">
            {Object.entries(categories).map(([id, category]) => (
                <button
                    key={id}
                    className={`filter-btn ${activeCategories.includes(id) ? 'active' : ''}`}
                    style={{
                        '--category-color': category.color,
                        border: `2px solid ${category.color}`,
                        color: activeCategories.includes(id) ? '#fff' : category.color,
                        background: activeCategories.includes(id) ? category.color : 'transparent'
                    }}
                    onClick={() => onToggleCategory(id)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}

function ProjectNode({ project, position, isActive }) {
    const nodeRef = useRef();
    const [hovered, setHovered] = useState(false);
    const initialPosition = useRef(position).current;
    
    // Calculate blended color for multiple categories
    const getBlendedColor = useCallback(() => {
        if (project.categories.length === 1) {
            return categories[project.categories[0]].color;
        }
        // For multiple categories, create a gradient or blend
        return project.categories.map(catId => categories[catId].color);
    }, [project.categories]);

    useFrame((state, delta) => {
        if (!nodeRef.current) return;
        
        // Gentle floating motion
        const floatY = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
        
        // Smooth transition between active and inactive states
        const targetScale = hovered ? 1.2 : (isActive ? 1 : 0.3);
        nodeRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
        
        // Smooth position transition
        nodeRef.current.position.y = initialPosition[1] + floatY;
        
        // Fade opacity based on active state
        const material = nodeRef.current.material;
        if (material) {
            material.opacity = MathUtils.lerp(material.opacity, isActive ? 1 : 0.3, 0.1);
        }
    });

    return (
        <group
            ref={nodeRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Main node sphere */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color={getBlendedColor()}
                    transparent
                    opacity={0.9}
                    emissive={getBlendedColor()}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Category indicators */}
            <group>
                {project.categories.map((catId, index) => (
                    <mesh
                        key={catId}
                        position={[
                            0.6 * Math.cos(index * (Math.PI * 2) / project.categories.length),
                            0.6 * Math.sin(index * (Math.PI * 2) / project.categories.length),
                            0
                        ]}
                    >
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshBasicMaterial color={categories[catId].color} />
                    </mesh>
                ))}
            </group>

            {/* Project title */}
            {(hovered || isActive) && (
                <Text
                    position={[0, 1, 0]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2}
                >
                    {project.title}
                </Text>
            )}
        </group>
    );
}

export default function VoidScene() {
    const [activeCategories, setActiveCategories] = useState(Object.keys(categories));

    const toggleCategory = (categoryId) => {
        setActiveCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    };

    // Calculate project positions in a spiral pattern
    const projectPositions = projects.map((project, index) => {
        const angle = index * (Math.PI * 2) / projects.length;
        const radius = 8 + (index * 0.5);
        return [
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        ];
    });

    return (
        <>
            <CategoryFilters
                activeCategories={activeCategories}
                onToggleCategory={toggleCategory}
            />
            <div style={{ width: '100%', height: '100vh' }}>
                <Canvas camera={{ position: [0, 20, 20], fov: 60 }}>
                    <color attach="background" args={['#000']} />
                    <fog attach="fog" args={['#000', 20, 40]} />
                    
                    <ambientLight intensity={0.1} />
                    <pointLight position={[10, 10, 10]} intensity={0.8} />
                    
                    <Stars
                        radius={100}
                        depth={50}
                        count={5000}
                        factor={4}
                        saturation={0}
                        fade
                    />
                    
                    {projects.map((project, index) => {
                        const isActive = project.categories.some(cat => activeCategories.includes(cat));
                        return (
                            <ProjectNode
                                key={project.title}
                                project={project}
                                position={projectPositions[index]}
                                isActive={isActive}
                            />
                        );
                    })}

                    <OrbitControls
                        enableZoom={true}
                        maxDistance={50}
                        minDistance={10}
                        enablePan={false}
                        autoRotate={false}
                    />
                </Canvas>
            </div>
        </>
    );
} 