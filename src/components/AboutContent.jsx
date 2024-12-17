import '../style/aboutcontent.css';
import { motion } from 'framer-motion';

export default function AboutContent() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="about-content">
            {/* Bio Section */}
            <motion.section 
                className="bio-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                variants={fadeInUp}
            >
                <h2>My Journey</h2>
                <p>As an Experience Designer, I blend creativity with technical expertise to craft meaningful digital experiences. My journey in design has been shaped by a passion for innovation and a deep understanding of user needs.</p>
            </motion.section>

            {/* Skills Section */}
            <motion.section 
                className="skills-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                variants={fadeInUp}
            >
                <h2>Skills & Expertise</h2>
                <div className="skills-grid">
                    <motion.div 
                        className="skill-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h3>Design</h3>
                        <ul>
                            <li>User Experience (UX)</li>
                            <li>User Interface (UI)</li>
                            <li>Interaction Design</li>
                            <li>Prototyping</li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        className="skill-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h3>Development</h3>
                        <ul>
                            <li>React.js</li>
                            <li>Three.js</li>
                            <li>JavaScript</li>
                            <li>HTML/CSS</li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        className="skill-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h3>Tools</h3>
                        <ul>
                            <li>Figma</li>
                            <li>Adobe Creative Suite</li>
                            <li>Blender</li>
                            <li>VS Code</li>
                        </ul>
                    </motion.div>
                </div>
            </motion.section>

            {/* Personal Section */}
            <motion.section 
                className="personal-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                variants={fadeInUp}
            >
                <h2>Beyond Work</h2>
                <p>When I'm not designing or coding, you'll find me exploring new technologies, experimenting with 3D modeling, or contributing to the design community. I believe in continuous learning and pushing the boundaries of what's possible in digital design.</p>
            </motion.section>
        </div>
    );
}
