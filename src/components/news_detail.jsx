import React, {Component} from 'react'
import {
    Row,
    Col,
    BackTop
} from 'antd'
import axios from 'axios'
import NewsimageBlock from './news_image_block'
import NewsComments from './news_comments'
/*
新闻详情组件
 */
export default class NewsDetail extends Component {
  constructor(props){
    super(props)
      //
    this.state = {
        news:{}
    }
  }
  componentDidMount(){
      this.showNewsDetail(this.props)
  }

  componentWillReceiveProps(newsProps){
      this.showNewsDetail(newsProps)
  }

  showNewsDetail (props){
      const {uniquekey} = props.params
      const url =`http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=${uniquekey}`
      axios.get(url)
          .then(response => {
              const news = response.data
              this.setState({news})
          })
  }

  render () {
      const {pagecontent} = this.state.news
      const {uniquekey} = this.props.params
    return (
      <div>
        <Row>
          <Col span={1}></Col>
          <Col span={16} className="container">
            <div dangerouslySetInnerHTML={{__html:pagecontent}}></div>
            <hr/>
            <NewsComments uniquekey={uniquekey}></NewsComments>
          </Col>
          <Col span={6}>
              <NewsimageBlock type="top" count={30} cardTitle="相关新闻" cardWidth='100%' imageWidth='112px'></NewsimageBlock>
          </Col>
          <Col span={1}></Col>
        </Row>
          <BackTop></BackTop>
      </div>
    )
  }
}