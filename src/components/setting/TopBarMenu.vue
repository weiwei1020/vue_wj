<template>
  <div>
    <!--个人配置 start-->
    <div class="fr fr-admin menu-hover-class">
      <Poptip placement="bottom-end">
        <div>
          <Avatar :src="loginUser"/>
          <div class="admin">{{admin}}</div>
        </div>
        <div slot="content" style="width: 300px;">
          <div style="margin:10px;">
            <ul class="set-menu">
              <li v-for="item in setMenuList" :key="item.name" @click="_getName(item.element)">
                <Icon :type="item.icon" :size="30" color="#788d9b"></Icon>
                <p>{{item.name}}</p>
              </li>
            </ul>
          </div>
          <div @click="_logout" style="text-align: center;border-top: 1px solid #eee; padding:10px 0">
            <p style="color: #ed3f14;font-size: 14px;cursor: pointer">退出系统&nbsp;
              <Icon type="power" color="#ed3f14"></Icon>
            </p>
          </div>
        </div>
      </Poptip>
    </div>
    <!--个人配置 end-->
    <!--全屏显示 start-->
    <div class="fr menu-hover-class header-setting-width" @click="_toggleScreen">
      <Tooltip :content="!isExpand ? '全屏' : '退出全屏'" placement="bottom-end">
        <Badge count="0">
          <Icon :type="!isExpand ? 'arrow-expand' : 'arrow-shrink'" :size="28" style="cursor: pointer;"
                color="#fff"></Icon>
        </Badge>
      </Tooltip>
    </div>
    <!--全屏显示 end-->
    <!--国际化 start-->
    <!--<div class="fr menu-hover-class header-setting-width">-->
    <!--<Poptip placement="bottom-end" class="info-pop">-->
    <!--<Badge count="0">-->
    <!--<Icon type="ios-world-outline" size="27" color="#fff" style="cursor: pointer;"></Icon>-->
    <!--</Badge>-->
    <!--<div slot="content">-->
    <!--<ul class="skin-item" v-for="(item, index) in languageList" :key="index" :name="item.name">-->
    <!--<li @click="_setLanguage(item.value)">-->
    <!--<Row type="flex" justify="center" align="middle">-->
    <!--<span style="font-size: 14px;font-weight: 500">{{item.name}}</span>-->
    <!--</Row>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--</Poptip>-->
    <!--</div>-->
    <!--国际化 end-->
    <!--皮肤 start-->
    <div class="fr menu-hover-class header-setting-width">
      <Poptip placement="bottom-end" class="info-pop">
        <Badge dot :count="dotCount">
          <Icon type="tshirt-outline" size="23" color="#fff" style="cursor: pointer;"></Icon>
        </Badge>
        <div slot="content">
          <ul class="skin-item" v-for="(item, index) in themeList" :key="index" :name="item.name">
            <li @click="_getSkin(item.name)">
              <Row type="flex" justify="center" align="middle">
                <span>
                  <Icon :size="22" type="android-checkbox-blank" :color="item.element"/>
                </span>
              </Row>
            </li>
          </ul>
        </div>
      </Poptip>
    </div>
    <!--皮肤 end-->
    <!--通知 start-->
   <!-- <div class="fr menu-hover-class header-setting-width" style="cursor: pointer">
      <Poptip placement="bottom-end" class="info-pop">
        <Badge :count="messageCount" :overflow-count="overCount">
          <img :src="noImgUri" v-if="messageCount == 0">
          <img :src="imgUri" id="notice-flash" v-else>
        </Badge>
        &lt;!&ndash;有消息提醒&ndash;&gt;
        <div slot="content" style="width:350px;">
          <Tabs value="inform" class="tabsHidden">
            &lt;!&ndash;通知&ndash;&gt;
            <TabPane :label="tabs.inform" name="inform">
              <div v-if="informList.length == 0" style="position: relative;height: 350px;">
                <img :src="noNewsUri" class="no-news-class">
              </div>
              <div v-else>
                <ul class="inform-item">
                  <li v-for="item in informList" @click="_more">
                    <div class="inform-item-avatar">
                      <span><img :src="informUri"></span>
                    </div>
                    <div class="inform-item-cont">
                      <p class="inform-item-descript" style="font-weight: bold">{{item.title}}</p>
                      <p class="inform-item-descript">{{item.content}}</p>
                      <p class="inform-item-time">
                        {{$formatDateSecond(item.ctime)}}
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="notice-more" @click="_more">查看更多</div>
              </div>
            </TabPane>
            &lt;!&ndash;消息&ndash;&gt;
            <TabPane :label="tabs.news" name="news">
              <div v-if="noticeList.length == 0" style="position: relative;height: 350px;">
                <img :src="noNewsUri" class="no-news-class">
              </div>
              <div v-else>
                <ul class="inform-item">
                  <li v-for="item in noticeList" @click="_more">
                    <div class="inform-item-avatar">
                      <span><img :src="noticeUri"></span>
                    </div>
                    <div class="inform-item-cont">
                      <p class="inform-item-descript" style="font-weight: bold">{{item.title}}</p>
                      <p class="inform-item-descript">{{item.content}}</p>
                      <p class="inform-item-time">
                        {{$formatDateSecond(item.ctime)}}
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="notice-more" @click="_more">查看更多</div>
              </div>
            </TabPane>
            &lt;!&ndash;待办&ndash;&gt;
            <TabPane :label="tabs.todo" name="todo">
              <div v-if="todoList.length == 0" style="position: relative;height: 350px;">
                <img :src="noNewsUri" class="no-news-class">
              </div>
              <div v-else>
                <ul class="inform-item">
                  <li v-for="item in todoList" style="padding:12px 15px" @click="_myTask">
                    <div class="inform-item-cont" style="width:100%">
                      <p class="inform-item-descript">
                        <Tag type="border" color="yellow" style="float:right"
                             v-if="new Date(item.ctime).getTime() < new Date(item.beginTime).getTime()">
                          还未开始
                        </Tag>
                        <Tag type="border" color="red" style="float:right"
                             v-else-if=" new Date(item.ctime).getTime() > new Date(item.endTime).getTime()">
                          过期
                        </Tag>
                        <Tag type="border" color="green" style="float:right" v-else>
                          进行中
                        </Tag>
                        {{item.title}}
                      </p>
                      &lt;!&ndash;<p class="inform-item-time">{{$dateformat(item.ctime,'yyyy-mm-dd HH:MM')}}</p>&ndash;&gt;
                    </div>
                  </li>
                </ul>
                <div class="notice-more" @click="_myTask">查看更多</div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Poptip>
    </div>-->
    <!--通知 end-->
  </div>
</template>
<style>
  @-webkit-keyframes twinkling {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  #notice-flash {
    -webkit-animation: twinkling 1s infinite ease-in-out;
  }

  .no-news-class {
    position: absolute;
    left: 50%;
    margin-left: -75px;
    top: 50%;
    margin-top: -75px;
  }
</style>
<script>
  import Global from '../../api/config'
  import SockJS from 'sockjs-client'
  import Stomp from 'webstomp-client'
  import Store from 'store2';

  var schedule = require('node-schedule');
  export default {
    data() {
      return {
        loginUser: 'http://static.patzn.com/img/loginUser.jpg',
        isExpand: false, //控制是否全屏
        admin: '',
        imgUri: 'http://static.patzn.com/img/notice/notice.png',
        noImgUri: 'http://static.patzn.com/img/notice/no-notice.png',
        noNewsUri: 'http://static.patzn.com/img/notice/no-news.png',
        tabs: {inform: '通知', news: '消息', todo: '待办'},
        allSum: '',
        messageCount: '0',
        overCount: '99',
        dotCount: '3',
        themeLink: '',
        path: '',
        themeFile: '',
        themeList: [
          {name: 'light_b', element: '#1c2438', menu: '#495060',},
          {name: 'light_g', element: '#009966', menu: '#495060',},
          {name: 'black_b', element: '#0099cc', menu: '#495060',},
          {name: 'theme-star', element: '#6600FF', menu: '#495060',},
        ],
        languageList: [
          {name: '中文', value: 'China'},
          {name: '英文', value: 'English'},
        ],
        informUri: 'http://static.patzn.com/img/notice/email.png',
        informList: [],
        noticeUri: 'http://static.patzn.com/img/notice/news.png',
        noticeList: [],
        todoSum: '', //待办数量
        todoList: [],
        setMenuList: [
          {icon: 'home', name: '我的首页', url: '', element: 'self_home'},
          {icon: 'ios-list', name: '基本资料', url: '', element: 'self_info'},
          {icon: 'compose', name: '修改密码', url: '', element: 'self_psd'},
          {icon: 'ios-locked', name: '锁屏', url: '', element: 'locked'},
          {icon: 'ios-toggle', name: '多标签', url: '', element: 'toggle'},
        ],
        taskObj: { //我的任务
          count: 0,
          title: '',
          ctime: '',
          uri: ''
        },
        btnlist: [],
        navTags: Store.get('navTags'), //多标签
        closeTags: false, //首页关闭多标签
      }
    },
    mounted() {
      if (Global.getLn()) {
     //   this._getPermissionBtn(); //按钮权限
        this._localStorageSkin();
      }
    },
    methods: {
      //设置语言
      // _setLanguage(value) {
      //
      // },
      //获取头像
      _getMyAvatar() {
        this.$store.dispatch('SysUser/getUserInfo').then(() => {
          let data = this.$store.state.SysUser.userInfo;
          this.admin = data.username;
          if (data.avatar === undefined) {
            this.loginUser = 'http://static.patzn.com/img/loginUser.jpg';
          } else {
            this.loginUser = Global.baseURL + '/base/v1/company/logo?key=' + data.avatar;
          }
        });
      },
      _toggleScreen() { //是否全屏
        if (!this.isExpand) {
          let docElm = document.documentElement;
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen()
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen()
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen()
          }
          this.isExpand = true
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          this.isExpand = false
        }
      },
     /* _getPermissionBtn() {
        this.$store.dispatch('SysResource/getBtn').then(() => {
          this.btnlist = this.$store.state.SysResource.btnList;
          Store.session('showBtnList', this.btnlist.join(','));
        });
      },*/
      _goto(next) {//路由跳转
        this.$router.push(next)
      },
      _logout() {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要退出系统？</p>',
          onOk: () => {
            // 退出登录
            this.$store.dispatch('SysSSO/logout', this.$serialize('login-form')).then(() => {
              if (this.$store.state.SysSSO.success) {
                Global.logout();
                window.location.href = Global.ssoURL;
              } else {
                this.$Message.error('退出失败，请重试!');
              }
            });
          },
        });
      },
      _localStorageSkin() {
        //localStorage 保存皮肤css路径
        this.themeLink = document.querySelector('link[name="theme"]');
        let themePath = localStorage.getItem("path");
        let file = localStorage.getItem("themeFile");
        if (themePath) {
          this.themeLink.setAttribute('href', themePath);
        }
        this.$emit("on-result-change", file);
      },
      _getSkin(themeFile) {debugger
        this.dotCount = '0';
        this.themeFile = themeFile;
        let mainTheme = themeFile.substr(-1, 1);
        if (mainTheme === 'g') {
          this.path = 'http://static.patzn.com/theme/' + mainTheme + '.css';
        } else {
          this.path = '';
        }
        this.themeLink.setAttribute('href', this.path);
        this.$emit("on-result-change", themeFile); //向父级传递数据，改变皮肤颜色
        localStorage.setItem("themeFile", this.themeFile);
        localStorage.setItem("path", this.path);
      },
      _getName(rel) {
        if (rel === 'toggle') {
          //多标签
          this._changeTags();
        } else {
          //其他
          this.$emit("on-result-change", rel);
        }
      },
      _closeTag(msg) {
        this.closeTags = msg;
      },
      _changeTags() {
        let navTags = Store.get('navTags');
        if (navTags === 'true') { //关闭标签
          this.$emit("on-result-change", "navTags-false");
          Store.set("navTags", 'false');
          this.navTags = 'false';
        } else {   //打开标签
          this.$emit("on-result-change", "navTags-true");
          Store.set('navTags', 'true');
          this.navTags = 'true';
        }
      },
    }
  }
</script>
