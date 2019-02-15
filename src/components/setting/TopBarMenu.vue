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
    <!--多标签 start-->
    <div class="fr menu-hover-class" style="width: 60px; text-align: center; line-height: 60px" @click="_changeTags"
         v-show="closeTags">
      <Tooltip :content="navTags ==='true' ? '关闭多标签' : '打开多标签'" placement="bottom-end">
        <Badge count="0">
          <Icon :type="navTags ==='true' ? 'toggle-filled' : 'toggle'" :size="28" style="cursor: pointer;"
                color="#fff"></Icon>
        </Badge>
      </Tooltip>
    </div>
    <!--多标签 end-->
    <!--全屏显示 start-->
    <div class="fr menu-hover-class" style="width: 60px; text-align: center; line-height: 60px" @click="_toggleScreen">
      <Tooltip :content="!isExpand ? '全屏' : '退出全屏'" placement="bottom-end">
        <Badge count="0">
          <Icon :type="!isExpand ? 'arrow-expand' : 'arrow-shrink'" :size="28" style="cursor: pointer;"
                color="#fff"></Icon>
        </Badge>
      </Tooltip>
    </div>
    <!--全屏显示 end-->
    <!--皮肤 start-->
    <div class="fr menu-hover-class" style="width: 60px; text-align: center; line-height: 60px">
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
    <div class="fr menu-hover-class" style="width: 60px; text-align: center; line-height: 60px;cursor: pointer">
      <Poptip placement="bottom-end" class="info-pop">
        <Badge :count="messageCount" :overflow-count="overCount">
          <img :src="noImgUri" v-if="messageCount == 0">
          <img :src="imgUri" id="notice-flash" v-else>
        </Badge>
        <!--有消息提醒-->
        <div slot="content" style="width:350px;">
          <Tabs value="inform" class="tabsHidden">
            <!--通知-->
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
                        {{ item.ctime | changeDate(new Date(),item.ctime)}}
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="notice-more" @click="_more">查看更多</div>
              </div>
            </TabPane>
            <!--消息-->
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
                        {{item.ctime | formatDate}}
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="notice-more" @click="_more">查看更多</div>
              </div>
            </TabPane>
            <!--待办-->
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
                      <p class="inform-item-time">
                        {{item.ctime | formatDate}}
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="notice-more" @click="_myTask">查看更多</div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Poptip>
    </div>
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
  var dateFormat = require('dateformat');
  export default {
    filters: {  //过滤器--时间转换
      formatDate(time) {
        var date = new Date(time);
        return dateFormat(date, 'yyyy-mm-dd HH:MM');
      },
      changeDate(value, newTime, cTime) { //将ms转换成 时-分-秒
        var newTime = new Date(newTime).getTime();
        var cTime = new Date(cTime).getTime();
        var mss = newTime - cTime;
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        //var seconds = (mss % (1000 * 60)) / 1000;
        if (days == 0 && hours == 0 && minutes == 0) {
          return "刚刚";
        } else if (days == 0 && hours == 0) {
          return minutes + " 分钟 之前";
        } else if (days == 0) {
          return hours + " 小时 " + minutes + " 分钟 之前";
        } else {
          return days + " 天 " + hours + " 小时 " + minutes + " 分钟 之前";
        }
      },
    },
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
        ],
        informUri: 'http://static.patzn.com/img/notice/email.png',
        informList: [],
        noticeUri: 'http://static.patzn.com/img/notice/news.png',
        noticeList: [],
        todoSum: '', //待办数量
        todoList: [],
        setMenuList: [
          {icon: 'home', name: '我的首页', url: '', element: 'myHome'},
          {icon: 'ios-list', name: '基本资料', url: '', element: 'personal'},
          {icon: 'compose', name: '修改密码', url: '', element: 'editPassword'},
          // {icon: 'thumbsup', name: '会员权益', url: '', element: ''},
          // {icon: 'social-usd', name: '会员积分', url: '', element: ''},
          // {icon: 'qr-scanner', name: '微信授权', url: '', element: 'wechat'},
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
      this._getPermissionBtn(); //按钮权限
      this._localStorageSkin();
      // this.admin = Global.getLogin().username;
      this._getNotice();
      // 连接实时推送
      this._connectWs();
      this._workflow(this.$store);
    },
    methods: {
      //获取头像
      _getMyAvatar() {
        this.$store.dispatch('SysUser/getUserInfo').then(() => {
          let data = this.$store.state.SysUser.userInfo;
          this.admin = data.username;
          if (data.avatar === undefined) {
            this.loginUser = 'http://static.patzn.com/img/loginUser.jpg';
          } else {
            this.loginUser = Global.baseURL + '/base/v1/company/logo_' + data.avatar;
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
          } else {
            this.$Message.error({content: '请升级浏览器！', duration: 3})
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
          } else {
            this.$Message.error({content: '请升级浏览器！', duration: 3})
          }
          this.isExpand = false
        }
      },
      _getPermissionBtn() {
        this.$store.dispatch('SysResource/getBtn').then(() => {
          this.btnlist = this.$store.state.SysResource.btnList;
          Store.session('showBtnList', this.btnlist.join(','));
        });
      },
      _myTask() {
        this.$emit("on-result-change", 'my_task');
      },
      _more() {  //查看更多
        this.$emit("on-result-change", 'my_notice');
      },
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
      _getSkin(themeFile) {
        this.dotCount = '0';
        this.themeFile = themeFile;
        let mainTheme = themeFile.substr(-1, 1);
        if (mainTheme !== 'b') {
          this.path = './static/theme/' + mainTheme + '.css';
        } else {
          this.path = '';
        }
        this.themeLink.setAttribute('href', this.path);
        this.$emit("on-result-change", themeFile); //向父级传递数据，改变皮肤颜色
        localStorage.setItem("themeFile", this.themeFile);
        localStorage.setItem("path", this.path);
      },
      _getNotice() { //获取消息数据
        this.$store.dispatch('SysMessage/list').then(() => {
          var noticeAll = this.$store.state.SysMessage.list;
          //总数
          if (noticeAll.sum == undefined) {
            this.allSum = '';
            this.messageCount = '0';
          } else {
            this.allSum = noticeAll.sum;
            this.messageCount = noticeAll.sum;
          }
          //通知
          if (noticeAll.informList !== undefined) {
            this.informList = noticeAll.informList.list;
            this.tabs.inform = '通知 ' + '(' + noticeAll.informList.sum + ')';
          } else {
            this.informList = [];
            this.tabs.inform = '通知';
          }
          //消息
          if (noticeAll.noticeList !== undefined) {
            this.noticeList = noticeAll.noticeList.list;
            this.tabs.news = '消息 ' + '(' + noticeAll.noticeList.sum + ')';
          } else {
            this.noticeList = [];
            this.tabs.news = '消息';
          }
          //待办
          if (noticeAll.todoList !== undefined) {
            this.todoList = noticeAll.todoList.list;
            this.todoSum = noticeAll.todoList.sum;
            this.tabs.todo = '待办 ' + '(' + noticeAll.todoList.sum + ')';
          } else {
            this.todoList = [];
            this.tabs.todo = '待办';
          }
        });

      },
      _getName() {
        this.$Notice.warning({
          title: '请到系统管理中进行相关信息修改！',
        });
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
      _connectWs() {
        let socket = new SockJS(Global.pushURL + '/ws');
        let stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => {
          stompClient.subscribe('/user/topic/message', (message) => {
            if (message.body !== undefined) {
              var data = JSON.parse(message.body);
              this._getNotice();
              this.$Notice.success({
                title: '您有新的消息，请注意查收！',
                duration: 20,
                desc: data.content + ',【 发件人：' + data.sender + ' 】'
              });
            }
          })
        }, (error) => {
          console.log(error);
        });
      },
      _workflow(store) {
        let that = this;
        // 工作流消息定时任务
        // https://www.npmjs.com/package/node-schedule
        that._totalTask(store);
        schedule.scheduleJob({minute: 5}, function () {
          that._totalTask(store);
        });
      },
      _totalTask(store) {
        store.dispatch('FlowProcess/totalTask').then(() => {
          var number = store.state.FlowProcess.total;
          if (number !== undefined) {
            if (this.taskObj.count !== number) {
              this._task(number); //执行第一次
            }
          }
        });
      },
      _task(count) {
        this.$Notice.success({
          title: '您有 ' + count + ' 条任务消息，请注意查收！',
          duration: 20,
        });
        this.taskObj.title = '我的任务数量：' + count;
        this.taskObj.count = count;
        this.taskObj.ctime = dateFormat(Date(), 'yyyy-mm-dd HH:MM');
        let todoSum = this.todoSum + count;
        this.tabs.todo = '待办 ' + '(' + todoSum + ')';
        this.messageCount = this.allSum + count;
        if (this.todoList.length == 0) {
          this.todoList.splice(0, 0, this.taskObj);//添加到数组最头上
        } else {
          if (this.todoList[0].count == undefined) { //没有数据
            this.todoList.splice(0, 0, this.taskObj);//添加到数组最头上
          } else { //已有数据
            this.todoList.splice(0, 1);//删除第一项
            this.todoList.splice(0, 0, this.taskObj);//添加到数组最头上
          }
        }

      },
    }
  }
</script>
<style scoped>
  .set-menu li:hover{
    cursor: not-allowed;
  }
</style>
