import '../style/content.css'
import { Typography, Button, Layout, Row, Col } from 'antd'
import { motion } from 'framer-motion'
const { Title } = Typography

export default function Content() {
    return (
        <motion.div 
            className="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <Title className="title" style={{color: 'white'}} level={1}>
                Let <span className='highlight'>curiosity</span> be your guide
            </Title>
            
            <Layout className="grid-container">
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <motion.div 
                            className="grid-item"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img 
                                className="project-cover" 
                                src="../images/Project Cover Photos/Note and calendar.png" 
                                alt="Spatial Notes - Interactive 3D Note-taking Application"
                                loading="lazy"
                            />
                            <div className="project-info">
                                <h3>Spatial Notes</h3>
                                <p>Interactive 3D Note-taking Application</p>
                            </div>
                        </motion.div>
                    </Col>
                </Row>
            </Layout>

            <motion.div 
                className="cta-section"
                whileHover={{ scale: 1.02 }}
            >
                <Button 
                    type="primary" 
                    size="large"
                    aria-label="Contact me"
                >
                    Let's Connect
                </Button>
            </motion.div>
        </motion.div>
    )           
}
