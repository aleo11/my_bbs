import { TabBar } from 'antd-mobile';
import React from 'react'
import EditArticle from '../edit_article'
import {getDomainInfo} from '../../redux/reducers/domain.redux'
import {connect} from 'react-redux'
import cookieUtils from '../../utils/cookies'
import ArticleListView from '../article_list_view'
import Me from '../me'
import DomainArea from '../domainarea'

@connect(
  state=>({
    domain:state.domain
  }),
  {
    getDomainInfo
  }
)

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: '首页',
      hidden: false,
    };
  }

  componentWillMount(){
    let userInfo = cookieUtils("userInfo")
    this.props.getDomainInfo(userInfo.id)
  }

  componentDidMount(){
    document.title="首页"
  }

  componentDidUpdate(nextProps,nextState){
   const {selectedTab} = this.state
   if(selectedTab!==nextState.selectedTab){
       document.title=selectedTab
   }
  }

  handleClickEdit(){
      this.setState({
          hidden:true
      })
  }

  childHandleBack(){
    this.setState({
        hidden:false,
        selectedTab:"首页"
    })
  }

  render() {
    return (
      <div className="main-wrap" style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
          hidden={this.state.hidden}
          prerenderingSiblingsNumber={0}
        >
          <TabBar.Item
            title="首页"
            key="首页"
            icon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-xiaolianchenggong"></use>
                </svg>
            }
            selectedIcon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-xiaolianchenggong-copy"></use>
                </svg>
            }
            selected={this.state.selectedTab === '首页'}
            badge={1}
            onPress={() => {
              this.setState({
                selectedTab: '首页',
              });
            }}
            data-seed="logId"
          >
            <ArticleListView />
          </TabBar.Item>
          <TabBar.Item
            icon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-quanzi"></use>
                </svg>
            }
            selectedIcon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-quanzi-copy"></use>
                </svg>
            }
            title="圈子"
            key="圈子"
            selected={this.state.selectedTab === '圈子'}
            onPress={() => {
              this.setState({
                selectedTab: '圈子',
               
              });
            }}
            data-seed="logId1"
          >
            <DomainArea />
          </TabBar.Item>
          <TabBar.Item
            icon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-bianji"></use>
                </svg>
            }
            selectedIcon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-bianji-copy"></use>
                </svg>
            }
            title="写文章"
            key="写文章"
            selected={this.state.selectedTab === '写文章'}
            onPress={() => {
                this.handleClickEdit()
              this.setState({
                selectedTab: '写文章',
              });
            }}
          >
           <EditArticle childHandleBack={()=>this.childHandleBack()}/>
          </TabBar.Item>
          <TabBar.Item
            icon={
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-wo"></use>
                </svg>
            }
            selectedIcon={ 
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-wo-copy"></use>
                </svg>}
            title="我"
            key="我"
            selected={this.state.selectedTab === '我'}
            onPress={() => {
              this.setState({
                selectedTab: '我',
              });
            }}
          >
           <Me />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default Main