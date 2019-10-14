import React from 'react'
import Wxsdk from '../utils/wxsdk'
export default class SignatureSdk extends React.Component{
    componentWillMount(){
        Wxsdk.signature()
    }
    render(){
        return null
    }
}