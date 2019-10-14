import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './router'
import {Provider} from 'react-redux';
import store from './redux/store'
import './styles/common.less'
ReactDOM.render(
    <Provider store={store}>
        <AppRouter/>
    </Provider>
    ,document.getElementById("root"))