import {Toast} from 'antd-mobile'
import axios from 'axios'

export default class Axios{
    static ajax = (options)=>{
        return new Promise((resolve,reject)=>{
            Toast.loading('加载中',5,null,true)
            axios({
                method:options.method,
                url:options.url,
                timeout: 6000,
                params:options.params,
                data:options.data
            }).then((res)=>{
                Toast.hide()
                if(res.status===200&&res.data.code===0){
                    // Toast.success(res.data.msg,2)
                     resolve(res.data)
                }else if(res.status!==200){
                    Toast.fail('oh,服务器出错了~',2)
                    resolve({code:-2})
                 }else if(res.status===200&&res.data.code===-1){
                    Toast.fail(res.data.msg,2)
                    resolve(res.data)
                }
            }).catch(()=>{
                Toast.hide()
                Toast.offline("请求超时！",3)
            })
        })
    }
}