import React from 'react';
import {
    Row,
    Col,
    Menu,
    Icon,
    Button,
    Modal,
    Tabs,
    Form,
    Input,
    message,
} from 'antd';
import {Link} from 'react-router'
import logo from '../image/logo.png';
import axios from 'axios';

const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


class NewsHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: null,
            selectKey:'top',
            modalShow:false
        }
    }
    //
    componentDidMount(){
        const username = localStorage.getItem('username');

        if(username){
            this.setState({username})
        }
    }
    handleClickItem = (event) => {
        this.setState({
            selectKey:event.key
        });
        if(event.key ==='regist'){
            this.setState({
                modalShow:true
            })
        }
    };

    handleClose=()=>{
        this.setState({
            modalShow:false
        })
    };

    //
    logout = () =>{
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        this.setState({username:null})
    };



    handleSubmit= (isRegist)=>{
        //注册请求
        //http://newsapi.gugujiankong.com/Handler.ashx?action=register&r_userName=abc&r_password=123123&r_confirmPassword=123123
        //登录请求
        //http://newsapi.gugujiankong.com/Handler.ashx?action=login&username=zxfjd3g&password=123123
        let url ='http://newsapi.gugujiankong.com/Handler.ashx?';
        let action = isRegist ? 'register' : 'login';
        url +=`action=${action}`;
        let formData = this.props.form.getFieldsValue();
        if(isRegist){
            let {r_username,r_password,r_confirm_password} = formData;
            url += `&r_userName=${r_username}&r_password=${r_password}&r_confirmPassword=${r_confirm_password}`
         }else {
            let {username, password} = formData;
            url += `&username=${username}&password=${password}`
        }

        //发送ajax请求
        axios.get(url)
            .then(response => {
                const result = response.data;
                console.log(result);
                console.log(response);
                //请求结束，做相应反应
                if(isRegist){
                    if(result===true){
                        message.success('注册成功');
                        console.log(result);
                    }else {
                        message.error('注册失败，重新注册')
                    }
                }else {
                    console.log(result);
                    if(result){
                        message.success('登录成功');
                        //
                        const username = result.NickUserName;
                        const userId = result.UserId;
                        this.setState({username});
                        //
                        localStorage.setItem('username',username);
                        localStorage.setItem('userId',userId)
                    }else {
                        message.error('登录失败，重新登录')
                    }
                }
            });

        //
        this.setState({
            modalShow:false
        });
        //
        this.props.form.resetFields()
    };


    render(){
        const {selectKey,username,modalShow} = this.state;

        const  userInfo = username
            ?(
                <MenuItem key="logout" className="regist">
                    <Button type="primary">{username}</Button>&nbsp;
                    <Link to="/usercenter"><Button type="dashed">个人中心</Button>&nbsp;</Link>
                    <Button onClick={this.logout}>退出</Button>
                </MenuItem>
            )
            :(
                <MenuItem key="regist" className="regist">
                    <Icon type="windows-o" />登录/注册
                </MenuItem>
            );
        const {getFieldDecorator } = this.props.form;

        return(
            <header>
                <Row>
                    <Col span={1}></Col>
                    <Col span={3}>
                        <a href="/" className="logo">
                            <img src={logo} alt="logo"/>
                            <span>ReactNews</span>
                        </a>
                    </Col>
                    <Col span={19}>
                        <div>
                             <Menu mode="horizontal" selectedKeys={[selectKey]} onClick={this.handleClickItem}>
                                <MenuItem key='top'>
                                    <Icon type="windows-o" />头条
                                </MenuItem>
                                <MenuItem key='shehui'>
                                    <Icon type="windows-o" />社会
                                </MenuItem>
                                <MenuItem key='guonei'>
                                    <Icon type="windows-o" />国内
                                </MenuItem>
                                <MenuItem key='guoji'>
                                    <Icon type="windows-o" />国际
                                </MenuItem>
                                <MenuItem key='yule'>
                                    <Icon type="windows-o" />娱乐
                                </MenuItem>
                                <MenuItem key='tiyu'>
                                    <Icon type="windows-o" />体育
                                </MenuItem>
                                <MenuItem key='keji'>
                                    <Icon type="windows-o" />科技
                                </MenuItem>
                                <MenuItem key='shishang'>
                                    <Icon type="windows-o" />时尚
                                </MenuItem>

                                 {userInfo}
                            </Menu>
                            <Modal title="用户中心"
                                visible={modalShow}
                                onOk={this.handleClose}
                                onCancel={this.handleClose}
                                okText="关闭">
                            <Tabs  type="card">
                                <TabPane tab="登录" key="1">
                                    <Form  onSubmit={this.handleSubmit.bind(this,false)}>
                                        <FormItem label="用户名">
                                            {
                                                getFieldDecorator('username')(
                                                <Input type="text" placeholder="请输入账号" />
                                            )}
                                        </FormItem>
                                        <FormItem label="密码">
                                            {
                                                getFieldDecorator('password')(
                                                <Input type="password" placeholder="请输入密码" />
                                            )}
                                        </FormItem>
                                        <Button type="primary" htmlType="submit">登录</Button>
                                    </Form>
                                </TabPane>
                                <TabPane tab="注册" key="2">
                                    <Form  onSubmit={this.handleSubmit.bind(this,true)}>
                                        <FormItem label="用户名">
                                            {getFieldDecorator('r_username')(
                                                <Input type="text" placeholder="请输入账号" />
                                            )}
                                        </FormItem>
                                        <FormItem label="密码">
                                            {getFieldDecorator('r_password')(
                                                <Input type="password" placeholder="请输入密码" />
                                            )}
                                        </FormItem>
                                        <FormItem label="确认密码">
                                            {getFieldDecorator('r_confirm_password')(
                                                <Input type="password" placeholder="请再次输入您的密码" />
                                            )}
                                        </FormItem>
                                        <Button type="primary" htmlType="submit">注册</Button>
                                    </Form>
                                </TabPane>
                            </Tabs>
                            </Modal>
                        </div>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </header>
        )
    }
}

const FormNewsHeader = Form.create()(NewsHeader);

export default FormNewsHeader;
