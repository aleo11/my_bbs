import {fromJS} from 'immutable'
import Axios from '../../axios'
import axios from 'axios'
import Api from '../../axios/api'
import {createAction,handleActions} from 'redux-actions'

const JUMP_TO_ARTICLE_DETAIL = "JUMP_TO_ARTICLE_DETAIL"
const GET_ARTICLE_LIST = "GET_ARTICLE_LIST"
const initState = fromJS({
    articleList:[],
    rowData:{},
})
let nowLimitId = -1

export default handleActions({
    JUMP_TO_ARTICLE_DETAIL:(state,action)=>(
        state.set("rowData",action.payload)
    ),
    GET_ARTICLE_LIST:(state,action)=>(
        state.set("articleList",action.payload)
    )
},initState)

export const jumpToArticleDetail = createAction(JUMP_TO_ARTICLE_DETAIL,(rowData)=>{
    console.log(rowData)
    return fromJS(rowData)
})

export const getArticleList = createAction(GET_ARTICLE_LIST,async function(oldArticleList){
       let res = await axios({
            method:"post",
            url:Api.getArticleList,
            data:{
              nowLimitId
            }
          })
         try{
            let {data} = res.data
            if(data.length===0){
                return oldArticleList
            }
            nowLimitId = data[data.length-1].id
            let newArticleList = oldArticleList.concat(data)
            return newArticleList
         }
         catch(err){
             console.log(err)
         }
                
          
        
})
//获取用户微信基本信息