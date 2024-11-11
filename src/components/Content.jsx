import '../style/content.css'
import {Typography,Button} from 'antd'

export default function Content() {
    return (
        <div className = "content">
        <Typography.Title className = "title" style={{color: 'white'}} level={1}>All great things are created between method and madness</Typography.Title>
        {/* <p>All great things are created between method and madness</p> */}
        <Button type="primary">Primary Button</Button>
      </div>)           
}
