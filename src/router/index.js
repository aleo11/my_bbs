import React from 'react'
import {HashRouter as Router,Route} from 'react-router-dom'
import LoginRegister from '../pages/login_register'
import Main from '../pages/main'
import SignatureSdk from '../components/signatureSdk'
import ArticleDetail from '../pages/article_detail'
function AppRouter(){
    return (
        <Router>
            <SignatureSdk />
            <Route path="/articleDetail/:articleId" component={ArticleDetail} />
            <Route path="/login" component={LoginRegister}/>
            <Route path="/main" component={Main}/>
        </Router>
    )
}

export default AppRouter