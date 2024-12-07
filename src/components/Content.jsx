import '../style/content.css'
import { Typography, Button, Layout, Row, Col } from 'antd'
const { Title } = Typography

export default function Content() {
    return (
        <div className="content">
            <Title className="title" style={{color: 'white'}} level={1}>
                Let <span className='eiko'>curiosity</span> be your guide
            </Title>
            
            <Button type="primary">Primary Button</Button>
    
            <Layout className = "grid-container">
                <Row>
                    <Col span={12}>
                        <div className="grid-item">
                          <p>Item 1</p>
                        </div>
                    </Col>
                    <Col span={12}>
                      <div className="grid-item">
                            <p>Item 1</p>
                          </div>
                    </Col>
                </Row>
            </Layout>
        </div>
    )           
}
