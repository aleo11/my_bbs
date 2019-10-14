/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import ReactDOM from 'react-dom'
import { ListView } from 'antd-mobile';
import Api from '../../axios/api'
import axios from 'axios';
import moment from 'moment'
import {withRouter} from 'react-router-dom'
import {jumpToArticleDetail,getArticleList} from '../../redux/reducers/article.redux'
import './style.less'
import { connect } from 'react-redux';
moment.locale('zh-cn',{
  months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日Ah点mm分',
            LLLL : 'YYYY年M月D日ddddAh点mm分',
            l : 'YYYY/M/D',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日dddd HH:mm'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : '[今天]LT',
            nextDay : '[明天]LT',
            nextWeek : '[下]ddddLT',
            lastDay : '[昨天]LT',
            lastWeek : '[上]ddddLT',
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                case 'M':
                    return number + '月';
                case 'w':
                case 'W':
                    return number + '周';
                default:
                    return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            ss : '%d 秒',
            m : '1 分钟',
            mm : '%d 分钟',
            h : '1 小时',
            hh : '%d 小时',
            d : '1 天',
            dd : '%d 天',
            M : '1 个月',
            MM : '%d 个月',
            y : '1 年',
            yy : '%d 年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
})

const baseStaticUrl = "http://www.wrazd.com/statics/wxarticle/headimg/"
function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}
@withRouter
@connect(
  state=>({
      articleList:state.article.get("articleList")
  }),
  {
    jumpToArticleDetail,
    getArticleList
  }
)
class ArticleListView extends React.Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
    this.state = {
      dataSource:ds,
      isLoading: true,
      loadedMessage:"Loaded",
      height: document.documentElement.clientHeight * 3 / 4,
    };
  }

  componentDidMount() {
    let {getArticleList,articleList} = this.props
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    if(articleList.size!==0){
      this.setState({
        isLoading:false,
        dataSource:this.state.dataSource.cloneWithRows(articleList.toJS()),
        height:hei
      })
      return
    }
    getArticleList(articleList).then((data)=>{
    this.setState({
      isLoading:false,
      dataSource:this.state.dataSource.cloneWithRows(data.payload.toJS()),
      height:hei
    })
   })
  }

  onEndReached = (event) => {
    let {getArticleList,articleList} = this.props
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    getArticleList(articleList).then((data)=>{
      this.setState({
        isLoading:false,
        loadedMessage:data.length===0?"没有更多了~":"Loaded",
        dataSource:this.state.dataSource.cloneWithRows(data.payload.toJS()),
      })
    })
  }

  formatTime=(time)=>{
    if(moment(time).format("YYYYMMDD")===moment().format("YYYYMMDD")){
      return moment(time).fromNow()
    }
    return moment().year()===moment(time).year()?moment(time).format('MM月DD日'):moment(time).format('YYYY年MM月DD日')
  }

  handleClickContentDetail(rowData){
      this.props.jumpToArticleDetail(rowData)
      this.props.history.replace(`/articleDetail/${rowData.id}`)
  }
  render() {
    // const datas = this.state.datas
    const separator = (sectionID, rowID) => ( //间隔
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    // let index = datas.length - 1;
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div className="article-title-wrap"
>{rowData.title}</div>
            <div 
                onClick={()=>this.handleClickContentDetail(rowData)}
                className="article-content-wrap" 
                dangerouslySetInnerHTML={{__html:rowData.content}}
              ></div>
                <div style={{ lineHeight: "20px",color:'grey', height:"20px",display:"-webkit-box" }}>
                  <div style={{height:20,width:20, backgroundSize: "contain",backgroundImage:`url(${baseStaticUrl+rowData.uHeadimg})`}} />
                  <div style={{marginLeft:10,fontSize:11}}>{rowData.uNickname}</div>
                  <div style={{display:"inline-flex",fontSize:"11px", marginLeft:"10px"}}>
                      <div style={{marginLeft:"20px"}}>{this.formatTime(rowData.edit_time)}</div>
                      <div style={{marginLeft:"20px"}}>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-eye"></use>
                        </svg>
                      {rowData.views}
                      </div>
                      <div style={{marginLeft:"20px"}}>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-zan"></use>
                        </svg>
                      {rowData.praise}
                      </div>
                      <div style={{marginLeft:"20px"}}>评论{rowData.comment}</div>
                  </div>
                </div>
            </div>
        )
      }

    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderHeader={() => <span>header</span>}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : this.state.loadedMessage}
        </div>)}
        renderBodyComponent={() => <MyBody />}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        pageSize={4}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
}

export default ArticleListView