import '../style/aboutcontent.css'
import { Layout, Row, Col } from 'antd'

const { Header, Content, Footer } = Layout

export default function AboutContent() {
    return (
        <div className = "about-content">
            {/* Example 1: Basic Layout */}
            <h3>Example 1: Layout Component</h3>
            <Layout>
                <Header style={{ background: '#007bff', color: 'white' }}>Header</Header>
                <Content style={{ padding: '20px', background: '#f0f2f5' }}>Main Content</Content>
                <Footer style={{ background: '#001529', color: 'white' }}>Footer</Footer>
            </Layout>

            {/* Example 2: Basic Grid */}
            <h3>Example 2: Grid System</h3>
            <Row gutter={16}>
                <Col span={8}>Column 1</Col>
                <Col span={8}>Column 2</Col>
                <Col span={8}>Column 3</Col>
            </Row>

            {/* Example 3: Combining Both */}
            <h3>Example 3: Layout with Grid</h3>
            <Layout>
                <Header style={{ background: '#007bff', color: 'white' }}>
                    <Row>
                        <Col span={12}>Logo</Col>
                        <Col span={12}>Menu</Col>
                    </Row>
                </Header>
                <Content style={{ padding: '20px' }}>
                    <Row gutter={16}>
                        <Col span={12}>Left Content</Col>
                        <Col span={12}>Right Content</Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    )
}
