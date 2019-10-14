import {combineReducers} from 'redux'
import user from './user.redux'
import domain from './domain.redux'
import article from './article.redux'
export default combineReducers(
    {
        user,
        domain,
        article
    }
)