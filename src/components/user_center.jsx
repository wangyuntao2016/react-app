import React, {Component} from 'react'
import axios from 'axios'
import {Row, Col, Tabs, Card, Upload, Icon, Modal} from 'antd'
const TabPane = Tabs.TabPane
/*
用户中心组件
 */
export default class UserCenter extends Component {
  constructor(props){
    super(props)

    this.state={
      collections:[],
      comments:[],
      previewViisible:'',
      fileList:[{
        uid:-1,
        name:'xxx.png',
        status:'done',
        url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }]

    }
  }

  componentDidMount(){
    const userId = localStorage.getItem('userId')
    //收藏列表数据
    let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid=${userId}`
    axios.get(url)
        .then(response => {
          const collections = response.data
          this.setState({collections})
      })
      //评论列表数据
      url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid=${userId}`
      axios.get(url)
          .then(response => {
              const comments = response.data
              this.setState({comments})
          })
  }


    handlePreview = (file) => {
        this.setState({
            previewImage:file.url || file.thumbUrl,
            previewVisible:true
        })
    }

    handleChange = ({fileList}) => {
      this.setState({fileList})
    }

    handleCancel = () => {
        this.setState({previewVisible:false})
    }
  render () {
    const {collections,comments} = this.state
      console.log(collections.length)
      console.log(comments.length)
    const collectionList = collections.length===0
      ?"没有任何收藏"
      :collections.map((collection,index)=>{
        const {uniquekey,Title} = collection
          return(
              <Card key={index} title={uniquekey} extra={<a href={`#/detail/${uniquekey}`}>查看</a>}>
                <p>{Title}</p>
              </Card>
          )
        })

      const commentList = comments.length===0
          ? '没有任何评论'
          : comments.map((comment, index) => {
              const {datetime, uniquekey, Comments} = comment
              return (
                  <Card key={index} title={`于${datetime}评论新闻${uniquekey}`} extra={<a href={`#/detail/${uniquekey}`}>查看</a>}>
                    <p>{Comments}</p>
                  </Card>
              )
          })

      const {fileList,previewVisible,previewImage} = this.state
      const uploadButton =(
          <div>
            <Icon type="plus"></Icon>
            <div className="ant-upload-text">Upload</div>
          </div>
      )

    return (
      <div>
        <Row>
          <Col span={1}></Col>
          <Col span={22}>
            <Tabs>
              <TabPane key="1" tab="我的收藏列表">
                  {collectionList}
              </TabPane>
              <TabPane key="2" tab="我的评论列表">
                  {commentList}
              </TabPane>
              <TabPane key="3" tab="头像设置">
                <Upload
                    action="http://jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}>
                    {uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{width:'100%'}} src={previewImage}/>
                </Modal>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={1}></Col>
        </Row>
      </div>
    )
  }
}