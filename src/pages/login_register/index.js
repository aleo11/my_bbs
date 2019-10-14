import React from 'react'
import {InputItem,Button} from 'antd-mobile'
import './style.less'
import { createForm } from 'rc-form';
import Axios from '../../axios'
import Api from '../../axios/api'

import cookieUtils from '../../utils/cookies'
// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
class LoginRegister extends React.Component{
    state={
        data:""
    }
    componentDidMount(){
        document.title="用户绑定"
       let data = cookieUtils("data")
       this.setState({
        data:data.nickname
       })
    }
    
    handleClickSubmit(){
        this.props.form.validateFields((error, value) => {
            Axios.ajax({
                method:"get",
                url:Api.binding,
                params:{
                    ...value
                }
            }).then((res)=>{
                this.props.history.replace("/main")
            })
          });
    }
    render(){
        const { getFieldProps } = this.props.form;
        return(
            <div className="login-register-wrap">
                <div className="title">{this.state.data}</div>
                <div className="input-wrap">
                <InputItem
                {...getFieldProps('userName')}
                    type="text"
                    placeholder="请输入工号"
                >
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-zhanghaodenglu-copy"></use>
                    </svg>
                </InputItem>
                <InputItem
                {...getFieldProps('password')}
                    type="password"
                    placeholder="请输入密码"
                >
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-Group--copy"></use>
                    </svg>
                </InputItem>
                <Button id="submit-login" onClick={()=>this.handleClickSubmit()}>登录</Button>
                </div>
            </div>
        )
    }
}

export default createForm()(LoginRegister)