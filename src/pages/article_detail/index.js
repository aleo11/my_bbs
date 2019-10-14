import React from 'react'
import HeadCommon from '../../components/headCommon'
import {connect} from 'react-redux'
import {InputItem,TextareaItem} from 'antd-mobile'
import moment from 'moment'
import Axios from '../../axios/index'
import './style.less'
import Api from '../../axios/api'
const baseStaticUrl = "http://www.wrazd.com/statics/wxarticle/headimg/"
@connect(
    state=>({
        rowData:state.article.get("rowData")
    }),
    {

    }
)
class ArticleDetail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            commentList:[],
            focused:false,
            inputReplyValue:"",
            inputCommentValue:"",
            readyReply:false,
            targetComment:{}
        }
    }

    getComment(){
        const {articleId} = this.props.match.params
        Axios.ajax({
            method:"post",
            url:Api.getComment,
            data:{
                id:articleId
            }
        }).then((res)=>{
            this.setState({
                commentList:res.data
            })
        })
    }

    componentDidMount(){
        this.getComment()
       
    }

    handleClickSendComment(id){
        Axios.ajax({
            method:"post",
            url:Api.sendComment,
            data:{
                id,
                comment:this.state.inputCommentValue
            }
        }).then((res)=>{
            if(res.code===0){
                this.getComment()
                this.setState({
                    inputCommentValue:"",
                })
            }    
        })  
    }
    inputAreaBlur(){
        document.getElementById("send-reply").addEventListener("click",()=>{
            if(this.state.inputReplyValue===""){
                return
            }
            this.handleClickSendReply()
        },{once:true})
        this.setState({
            readyReply:false
        })
    }

    handleClickSendReply(){
        let {targetComment,inputReplyValue}=this.state
        Axios.ajax({
            method:"post",
            url:Api.sendReply,
            data:{
                commentId:targetComment.cId,
                toUid:targetComment.cFromUid,
                content:inputReplyValue,
            }
        }).then((res)=>{
            if(res.code===0){
                this.getComment()
                this.setState({
                    inputReplyValue:"",
                })
            }    
        })  
    }
    handleChangeValue(v,which){
        this.setState({
            [which]:v
        })
    }
    formatTime=(time)=>{
        if(moment(time).format("YYYYMMDD")===moment().format("YYYYMMDD")){
          return moment(time).fromNow()
        }
        return moment().year()===moment(time).year()?moment(time).format('MM-DD HH:mm:ss'):moment(time).format('YYYY-MM-DD HH:mm:ss')
      }
    handleClickComment(item){
        console.log(item)
        const {cFromUid,cId,cFromNickname} = item
        this.setState({
            readyReply:true,
            inputCommentValue:"",
            targetComment:{
                cFromUid,
                cId,
                cFromNickname,
            }
        })
        this.autoFocusInst.focus()
      }
    render(){
        const {rowData} = this.props
        const {commentList,inputReplyValue,inputCommentValue} = this.state
        return(
            <div className="article-detail-wrap">
                <HeadCommon url="/main"/>
                <div className="middle">
                    <div className="title-wrap">
                        {rowData.get("title")}
                    </div>
                    <div className="author-wrap">
                        <div className="head-image" style={{backgroundImage:`url(${baseStaticUrl+rowData.get("uHeadimg")})`}} />
                        {rowData.get("uNickname")}
                        <div className="time"> {moment(rowData.get("edit_time")).format("YYYY-MM-DD")}</div>
                    </div>
                    <div className="content-wrap" dangerouslySetInnerHTML={{__html:rowData.get("content")}}>
                        
                    </div>
                    <div className="praise">
                        <div>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-icon"></use>
                            </svg>
                        </div>
                        <div>赞一个吧~</div>
                    </div>
                    <div className="comment-wrap">
                        <div className="title">评论</div>
                        {
                            commentList.length===0?"当前还没有评论~":commentList.map((item,index)=>{
                                return (
                                    <div className="comment">
                                        <div className="from-message">
                                            <div className="headimg" style={{backgroundImage:`url(${baseStaticUrl+item.cFromHeadImg})`}}/>
                                            <div className="message-middle">
                                                <div className="from-nickname">
                                                    {item.cFromNickname}
                                                </div>
                                                <div className="edit-time">
                                                    {this.formatTime(item.cEditTime)}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            id="content"
                                            onClick={()=>this.handleClickComment(item)}
                                            className="content">{item.cContent}</div>
                                        <div className="content-child" style={{background: "#dddbdb",marginLeft: 50}}>
                                            {item.children&&item.children.map((child,index1)=>{
                                                return (
                                                    <div>
                                                        {
                                                            child.rReplyId?`${child.rFromNickname}<span>回复</span>${child.rToNickname}:${child.rContent}`:
                                                            <div style={{display:"flex"}}><div className="headimg" style={{backgroundImage:`url(${baseStaticUrl+child.rFromHeadImg})`}}/>
                                                            {child.rFromNickname}:{child.rContent}</div>
                                                        }
                                                        
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    this.state.readyReply?
                    <div id="bottom" className="bottom">
                        <div className="input-comment">
                                <TextareaItem
                                    title="回复"
                                    id="reply-area"
                                    placeholder={`@${this.state.targetComment.cFromNickname}`}
                                    data-seed="logId"
                                    value={inputReplyValue}
                                    onBlur={()=>this.inputAreaBlur()}
                                    onChange={(value)=>this.handleChangeValue(value,"inputReplyValue")}
                                    ref={el => this.autoFocusInst = el}
                                    autoHeight
                                />
                        </div>
                        <div
                            id="send-reply"
                            style={inputReplyValue===""?{background:"grey"}:null}
                            // onClick={inputReplyValue===""?null:()=>this.handleClickSendReply()}
                            className="zan">
                                发送
                        </div>
                    </div>:
                    <div id="bottom" className="bottom">
                        <div className="input-comment">
                                <TextareaItem
                                    title="添加评论"
                                    placeholder="@我有话说"
                                    data-seed="logId"
                                    value={inputCommentValue}
                                    onChange={(value)=>this.handleChangeValue(value,"inputCommentValue")}
                                    ref={el => this.autoFocusInst = el}
                                    autoHeight
                                />
                        </div>
                        <div
                            style={inputCommentValue===""?{background:"grey"}:null}
                            onClick={inputCommentValue===""?null:()=>this.handleClickSendComment(rowData.get("id"))}
                            className="zan">
                                发送   
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default ArticleDetail