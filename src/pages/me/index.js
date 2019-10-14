import React from 'react'
import {Icon,Grid } from 'antd-mobile'
import './style.less'
import cookieUtils from '../../utils/cookies'
const data = Array.from(new Array(9)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
  }));
  const cookieData = cookieUtils("data")
// const cookieData = {}
class Me extends React.Component{
    render(){
        return (
            <div className="me-wrap">
                <div className="personal-message">
                    <div className="headimg" style={{backgroundImage:`url(${cookieData.headimgurl})`}}/>
                    <div className="message-middle">
                         <div className="nickname">
                         {cookieData.nickname}
                        </div>
                        <div className="signature">
                            <span>{cookieData.country}</span>
                            <span>{cookieData.province}</span>
                            <span>{cookieData.city}</span>
                        </div>
                    </div>
                    <div className="message-right">
                        <Icon type="right" />
                    </div>
                </div>
                <div>
                <Grid data={data} hasLine={false} />
                </div>
            </div>
        )
    }
}

export default Me