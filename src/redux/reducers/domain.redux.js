import {fromJS} from 'immutable'
import Axios from '../../axios'
import Api from '../../axios/api'
import {createAction,handleActions} from 'redux-actions'

const GET_DOMAIN_INFO = "GET_DOMAIN_INFO"
const initState = fromJS({
    domainTreeData:[]
})

export default handleActions({
    GET_DOMAIN_INFO:(state,action)=>(
        state.set("domainTreeData",action.payload)
     ),
},initState)

export const getDomainInfo = createAction(GET_DOMAIN_INFO,async function(userId){
       let res = await Axios.ajax({
            method:"post",
            url:Api.get_domain_info,
            data:{
                userId
            }
        })
        if(res.code===0){
        const array = [
            {
                domain_father: 0,
                domain_layer: "010000",
                domain_name: "数据库",
                id: 1,
                operate_time: "2019-10-02T03:19:15.000Z",
                operator: null,
            },
            {
                domain_father: 1,
                domain_layer: "010100",
                domain_name: "mysql",
                id: 2,
                operate_time: null,
                operator: null,
            },
            {
                domain_father: 1,
                domain_layer: "010200",
                domain_name: "mongodb",
                id: 3,
                operate_time: null,
                operator: null
            }
        ]
            const getJsonTree = (data)=>{
                let temp = {}
                let tree = []
                for(let i in data){
                  temp[data[i].id] = data[i]
                }  
                for(let i in temp){
                  if(temp[i].domain_father!==0){
                    if(!temp[temp[i].domain_father].children) {
                      temp[temp[i].domain_father].children = new Array()
                    }
                    temp[temp[i].domain_father].children.push(temp[i])
                  }else{
                    tree.push(temp[i])
                  }
                }
                return tree
              }
              return getJsonTree(array)
        }else{
            throw new Error(res.code)
        }
})
//获取用户微信基本信息