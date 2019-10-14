import React from 'react'
import {InputItem} from 'antd-mobile'
import './style.less'
import Axios from '../../axios';
import axios from 'axios'
import Api from '../../axios/api'
import {connect} from 'react-redux'
const wx = window.wx
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
@connect(
    state=>({
      domain:state.domain
    }),
    {
     
    }
  )
class EditArticle extends React.Component{
    state={
        chooseDomain:[],
        title:"",
        chooseQuan:null,
    }
    componentDidMount(){
     this.editor = window.Eleditor({
            el: '#article-body',
            /*注意：upload和uploader参数两个不能共存*/
            uploader: function(){
                /*必须返回一个Promise对象，成功返回url，失败返回错误信息*/
                return new Promise(function(_resolve, _reject){
                    /*调用微信接口选取图片*/
                   wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (_selected) {
                            if(_selected.localIds.length===0){
                                return
                            }
                         // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            /*中转到【微信服务器】*/
                            console.log(_selected.localIds[0])
                            wx.uploadImage({
                                localId: _selected.localIds[0],
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (_resp) {
                                    /*取得图片serverId后传给后端保存处理并返回url*/
                                    axios({
                                        url: Api.uploadImage,
                                        method: 'POST',
                                        data: {
                                            /*把serverId传给服务器，服务器用微信多媒体接口取微信换取图片并保存返回url*/
                                            media_id: _resp.serverId
                                        }, 
                                    }).then((_resu)=>{
                                        if(_resu.data.code==0){
                                            /*执行resolve并传递url*/
                                            _resolve(_resu.data.data.url);/*这里也可以传递数组*/
                                        }else{
                                            _reject (_resu.data.msg)
                                        }
                                    }).catch(()=>{
                                        _reject('上传失败!');
                                    })
                                }
                            });	
                        }
                      });
        
                });
            }
    })
}

handleClickRelease(){
  let result = this.editor.getContent()
  Axios.ajax({
        method:"post",
        url:Api.submitArticleContent,
        data:{
            title:this.state.title,
            content:result,
            domainId:this.state.chooseQuan,
        }
  }).then((res)=>{
    
  })
}

handleChangeTitle(value){
    this.setState({
        title:value
    })
}

handleClickDomain(target,data){
    target.classList.toggle("domain-area-clicked")
    this.setState({
        chooseDomain:target.classList.contains("domain-area-clicked")?data.children:[]
    })
}
handleClickQuan(target,data){
    this.setState({
        chooseQuan:target.classList.contains("quan-area-clicked")?null:data
    })
}
    render(){
        return(
            <div className="edit-wrap">
                    <div className="top">
                        <div
                            onClick={()=>this.props.childHandleBack()}
                            className="back">
                                返回
                        </div>
                        <div 
                            onClick={()=>this.handleClickRelease()}
                            className="release">
                                发布
                        </div>  
                    </div>
                <div className="article-body-wrap">
                    <InputItem onChange={(v)=>this.handleChangeTitle(v)} placeholder="标题"></InputItem>
                    <div id="article-body"></div>
                </div>
                
                <div
                    onClick={()=>{
                        this.refs.myDomain.classList.toggle("display")
                    }}
                    className="bottom">
                    <div className="choose">选择圈子:</div>
                    <div className="right-icon">
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-xiaoyuanquanzi"></use>
                    </svg>
                    </div>
                </div>
                    <div ref="myDomain" id="my-domain">
                        <div className="my-domain-top">
                            <div
                                onClick={()=>this.refs.myDomain.classList.toggle("display")}
                                className="back">
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-back2"></use>
                                    </svg>
                            </div>
                            <div
                                onClick={()=>this.refs.myDomain.classList.toggle("display")}
                                className="compelete">
                                    完成
                            </div>
                        </div>
                        <div className="my-domain-middle">
                            <div className="title">
                                我关注的领域
                            </div>
                            <div className="content">
                                {this.props.domain.get("domainTreeData").map((item,index)=>{
                                    return <div className="domain-area-wrap" onClick={(e)=>this.handleClickDomain(e.target,item)}>{item.domain_name}</div>
                                })}
                            </div>
                            <div className="title">
                                圈子
                            </div>
                            <div className="content">
                                {this.state.chooseDomain.map((item,index)=>{
                                    return (
                                        <div 
                                            className={this.state.chooseQuan===item.id?"quan-area-clicked":"domain-area-wrap"}
                                            onClick={(e)=>this.handleClickQuan(e.target,item.id)}>
                                            {item.domain_name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        
                    </div>
            </div>
        )
    }
}

export default EditArticle