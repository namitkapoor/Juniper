import '../style/content.css'
import { Typography, Button, Layout, Row, Col } from 'antd'
const { Title } = Typography

export default function Content() {
    return (
        <div className="content">
            <Title className="title" style={{color: 'white'}} level={1}>
                All great things are created between method and madness
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
