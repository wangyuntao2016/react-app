/**/
import React, {Component,PropTypes} from 'react'
import {Form, Card, Input, Button, notification} from 'antd'
import axios from 'axios'

const FormItem = Form.Item;

/*
 新闻评论列表组件
 */

 class NewsComments extends Component{
    static propTypes = {
        uniquekey:PropTypes.string.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            comments:[]
        }
    }

    componentDidMount(){
        this.getComments()
    }
    getComments = () =>{
        const {uniquekey} = this.props;
        const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey=${uniquekey}`;
        axios.get(url)
            .then(response => {
                const comments = response.data;
                this.setState ({comments})

            })
    };

     submitComment=()=>{
        //检查
         const userId = localStorage.getItem('userId');
         if(!userId){
             alert('请先登录');
             return
         }
         //
         const {uniquekey} = this.props;
         const {content} = this.props.form.getFieldsValue();
         const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=comment&userid=${userId}&uniquekey=${uniquekey}&commnet=${content}`;
         axios.get(url)
             .then(response => {
              notification.success({
                  message:'提交成功',
                  description:''
              });
              this.getComments()
         })
     };

     collectArticle= ()=>{
         const userId = localStorage.getItem('userId');
         if(!userId){
             alert('请先登录');
             return
         }
         //
         const {uniquekey} = this.props;
         const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=uc&userid=${userId}&uniquekey=${uniquekey}`;
         axios.get(url)
             .then(response => {
                 notification.success({
                     message:'收藏成功',
                     description:''
                 })
            })
     };

    render(){
        // 根据数据数组生成对应的标签数组
        const {comments} = this.state;
        const commentList = comments.length===0
            ?"没有任何评论"
            :comments.map((comment,index)=>{
            const {UserName,datetime,Comments} = comment;
                return(
                    <Card key={index} title={UserName} extra={`发布于${datetime}`}>
                        <p>{Comments}</p>
                    </Card>
                )
            });
        const {getFieldDecorator} = this.props.form;
        return(
            <div style={{padding:"10px"}}>
                {commentList}
                <Form onSubmit={this.submitComment}>
                    <FormItem label="您的评论">
                        {
                            getFieldDecorator('content')(
                            <Input type="textarea" placeholder="评论内容"/>
                            )
                        }
                    </FormItem>
                    <Button type="primary" htmlType='submit'>提交评论</Button>&nbsp;
                    <Button type="primary" onClick={this.collectArticle}>收藏文章</Button>
                </Form>
            </div>
        )
    }
}

export default Form.create()(NewsComments)

