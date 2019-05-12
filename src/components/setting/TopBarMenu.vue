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
        themeLink: '',
        path: '',
        themeFile: '',
        themeList: [
          {name: 'light_b', element: '#1c2438', menu: '#495060',},
        ],
        languageList: [
          {name: '中文', value: 'China'},
          {name: '英文', value: 'English'},
        ],
        setMenuList: [],
        btnlist: [],
        navTags: Store.get('navTags'), //多标签
        closeTags: false, //首页关闭多标签
      }
    },
    mounted() {
      if (Global.getLn()) {
        this._localStorageSkin();
      }
    },
    methods: {
      //获取头像
      _getMyAvatar() {
        this.loginUser = 'http://static.patzn.com/img/loginUser.jpg';
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
      _goto(next) {//路由跳转
        this.$router.push(next)
      },
      _logout() {
        //todo
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要退出系统？</p>',
          onOk: () => {
            // 退出登录
            localStorage.removeItem('personName');
            localStorage.removeItem('personId');
            localStorage.removeItem('personPassword');
            localStorage.removeItem('personRole');
            this.$router.push('/login');
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
