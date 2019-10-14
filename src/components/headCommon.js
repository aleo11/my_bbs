import React from 'react'
import './headCommon.less'
import {withRouter} from 'react-router-dom'

@withRouter
class HeadCommon extends React.Component{
    render(){
        return(
            <div className="header-wrap">
                <svg
                    onClick={()=>this.props.history.replace(this.props.url)} 
                    className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-back2"></use>
                </svg>
                <div></div>
            </div>
        )
    }
}

export default HeadCommon