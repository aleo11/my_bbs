import {fromJS} from 'immutable'
import Axios from '../../axios'
import Api from '../../axios/api'
import {createAction,handleActions} from 'redux-actions'

const GET_USER_INFO = "GET_USER_INFO"
const initState = fromJS({

})


export default handleActions({
    GET_USER_INFO:(state,action)=>(
        state.merge(action.payload)
     ),
},initState)

export const getWxInfo = createAction(GET_USER_INFO, async function(){
       let res = await Axios.ajax({
            method:"post",
            url:Api.get_wx_info
        })
        if(res.code===0){
            return res.data
        }else{
            throw new Error(res.code)
        }
})
//获取用户微信基本信息