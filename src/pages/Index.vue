<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <Headers :isShowTags="isShowTags" :shrink="shrink" :isleftMenu="isleftMenu"
             :menuList="menuList" :ishow="ishow" :navTags="navTags" :classTheme="classTheme"
             :menuTheme="menuTheme" :activeName="activeName" :openedSubmenuArr="openedSubmenuArr"
             :leftMenu="leftMenu" :imgUri="imgUri"
             @on-result-change="_headerChange" ref="header">
    <!-- :pageTagsList="pageTagsList"-->
    </Headers>
    <!--main-->
    <div class="single-page-con" :style="{left: shrink?'60px':isleftMenu?'200px':'0px'}" style="background: #ffffff">
      <div class="single-page">
        <router-view></router-view>
      </div>
    </div>
    <!--main /-->
  </div>
</template>
<script>
  import HelloWorld from '../components/HelloWorld'
  import allAdvice from './allAdvice'
  import Global from '../api/config'
  import store from 'store2';
  import Headers from '../components/header/Headers'
  import BreadCrumbs from "../components/base/BreadCrumbs";
  export default {
    components: {
    //  ElementTable,
      HelloWorld,
      allAdvice,
      Headers,
      BreadCrumbs
    },
    data () {
      return {
        shrink: false,
        menuList: [
          {"name":"LabServer","icon":"coffee",
            "leftMenus":[
              {"name":"首页","icon":"coffee","subMenus":[],"uri":"/"},
              {"name":"实验管理","icon":"person-stalker",
                "subMenus":[
                  {"name":"实验计划","icon":"navicon-round","code":"400110","uri":"/lims/staff_level"},
                  {"name":"实验管理","icon":"help-buoy","id":"","code":"400120","uri":"/lims/staff_manage"},
                  {"name":"实验安排","icon":"navicon","id":"","code":"400130","uri":"/lims/staff_schedule"}],"uri":"/"},
              {"name":"仪器管理","icon":"ios-barcode","id":"","code":"500000",
                "subMenus":[
                  {"name":"仪器类别管理","icon":"navigate","id":"","code":"500002","uri":"/lims/equip_class"},
                  {"name":"仪器资产管理","icon":"ios-rose-outline","id":"","code":"500001","uri":"/lims/equip_info"},
                  {"name":"仪器预约申请","icon":"clock","id":"","code":"500007","uri":"/lims/equip_order"},
                  // {"name":"仪器预约查询","icon":"skip-forward","id":"","code":"5000015","uri":"/lims/equip_order_query"},
                  {"name":"仪器预约审批","icon":"help-buoy","id":"","code":"500020","uri":"/lims/equip_audit"},
                  {"name":"仪器排程查询","icon":"image","id":"","code":"500251","uri":"/lims/equip_schedule"}],"uri":"/"},
              {"name":"耗材管理","icon":"erlenmeyer-flask","id":"","code":"300100",
                "subMenus":[
                  {"name":"耗材类别管理","icon":"android-options","id":"","code":"1000120210","uri":"/lims/chemical_category"},
                  {"name":"耗材台账管理","icon":"calculator","id":"","code":"100001","uri":"/lims/chemical_manage"},
                  {"name":"耗材采购申请","icon":"ios-folder","id":"","code":"10","uri":"/lims/chemical_purchase"},
                  {"name":"耗材采购单审批","icon":"social-buffer-outline","id":"","code":"10001","uri":"/lims/chemical_purchase_order"},
                  {"name":"耗材领用申请","icon":"edit","id":"","code":"12221","uri":"/lims/chemical_apply"},
                  {"name":"耗材领用审批","icon":"wand","id":"","code":"12221","uri":"/lims/chemical_use"},
                  {"name":"耗材使用记录","icon":"clipboard","id":"","code":"122221","uri":"/lims/chemical_ues_history"},
                  {"name":"耗材使用查询","icon":"search","id":"","code":"122221","uri":"/lims/chemical_use_query"},
                  {"name":"耗材归还管理","icon":"archive","id":"","code":"12221","uri":"/lims/chemical_return"},
                  {"name":"耗材采购统计","icon":"calendar","id":"","code":"21333","uri":"/lims/statistic"},
                  {"name":"耗材金额统计","icon":"locked","id":"","code":"12221","uri":"/lims/role_chemical_category"}],"uri":"/"},
              {"name":"订单管理","icon":"ios-list","id":"","code":"500001",
                "subMenus":[
                  {"name":"订单管理","icon":"ios-list","id":"","code":"50001","uri":"/lims/order_manage"},
                  {"name":"备货单管理","icon":"clipboard","id":"","code":"50001","uri":"/lims/picking_list_manage"},
                  {"name":"历史记录","icon":"speedometer","id":"","code":"50001","uri":"/lims/history_record"}],"uri":"/"},
              {"name":"文件管理","icon":"folder","id":"","code":"100000",
                "subMenus":[
                  {"name":"文件管理","icon":"ios-bookmarks-outline","id":"","code":"10000","uri":"/sysmanage/file_manage"},
                  {"name":"文件权限管理","icon":"coffee","id":"","code":"100001","uri":"/sysmanage/file_permission"}],"uri":"/"},
              {"name":"系统设置","icon":"gear-b","id":"","code":"60001",
                "subMenus":[
                  {"name":"编码规则","icon":"at","id":"","code":"60102","uri":"/lims/codeRule"}],"uri":"/"}],
            "id":"","code":"gxxt","uri":"localhost:8022"}
        ],
        leftMenu: [],
        openedSubmenuArr: [],
        activeName: '',
        ishow:Global.getCode(),
        classTheme: 'light_b',
        menuTheme: 'dark',
        isleftMenu: false, //判断是否是首页
        themeWhiteColor: false,
        navTags: false, //控制多任务标签
        isShowTags: true, //home页不显示tags
        imgUri: 'http://static.patzn.com/img/logo1.png',//公司Logo
      }
    },
    mounted() {
      this._initLoad();
    },
    methods:{
      _headerChange(name, data) {
        switch (name) {
          case 'left-sub-menu':
            this._handleSubmenuChange(data);
            break;
          case 'top-bar-msg':
            this._topBarChange(data);
            break;
          case 'top-tags':
            this._pageListChange(data);
            break;
          case 'toggle-click':
            this._toggleClick();
            break;
          case 'back-current-home':
            this._clearMenu();
            break;
        }
      },
      //点击菜单
      _handleSubmenuChange(val) {
        this._indexOfMenu(val)
      },
      _indexOfMenu(item) { //判断是否有相同的menu uri
        this.$store.commit('createTag', item);
      },
      _topBarChange(msg) {
        if (msg == '' || msg == null) {
          //默认主题
          this.classTheme = 'light_b';
        } else {
          if (msg == 'my_notice') {
            //消息管理
           // window.open(Global.sysURL + '/#/sysmanage/message', '_blank');

          } else if (msg == 'my_task') {
            //我的任务
         //   window.open(Global.sysURL + '/#/workflow/task', '_blank');

          } else if (msg == 'navTags-true') {
            //打开多任务标签
            this.navTags = true;
            this.$store.commit('clearAllTags');
          }
          else if (msg == 'navTags-false') {
            //关闭多任务标签
            this.navTags = false;
            this.$store.commit('clearAllTags');
          }
          else {
            //其它主题
            this.classTheme = msg;
          }
        }
      },
      _pageListChange(msg) {
        if (msg.openName === '') {
          this.openedSubmenuArr = [''];
          this.activeName = '';
        } else {
          this.openedSubmenuArr = [msg.openName];
          this.activeName = msg.activeName;
        }
      },
      _toggleClick() { //菜单收缩
        this.shrink = !this.shrink;
      },
      //清空选中的菜单
      _clearMenu() {
        this.openedSubmenuArr = [];
        this.activeName = '';
        store.session('crumbsArray', ['LabServer', '首页']);
        this.$store.commit('clearTag', []);
        this.$store.commit('createTag', {name: 'LabServer', uri: '/'});
      },
      _initLoad() {
        this._getNavMenu(Global.getCode());
        //todo 有了登录页记得修改回来
        if (Global.getLn()) {
          window.location.href = Global.ssoURL;
        } else {
          let windowHref = window.location.href;
          let str = windowHref.replace(Global.webURL, '');
          if (str === '/#/') {
            this._clearMenu();
          }
          // this.$store.dispatch('SysUser/getUserInfo').then(() => {
          //   let user = this.$store.state.SysUser.userInfo;
          //   if (user) {
          //     Global.setUserInfo(user);
          //     this._getLogo(user);
          //   }
          // });
        }
      },
      //获取logo、头像
      _getLogo(u) {
        if (u) {
          if (u.logo) {
            this.imgUri = Global.baseURL + '/base/v1/company/logo_' + u.logo;
          } else {
            this.imgUri = 'http://static.patzn.com/img/logo1.png';
          }
          //获取头像
          this.$refs.header._getMyAvatar();
        }
      },
      //左侧菜单
      _getNavMenu(name) {
       /* this.$store.dispatch('SysResource/getNavMenu').then(() => {
           this.menuList =this.$store.state.SysResource.navMenu;
          // this._showBg(name);
        });*/
         this._showBg(name);
      },
      _showBg(name) {//nav li背景切换
        let menus = this.$getTabMenu(this.menuList, name);
        this.isleftMenu = true;
        this.isShowTags = false;
        this.$refs.header._openTags(true);
        if (store.get("navTags") === 'true') { //打开
          this.navTags = true;
        } else {
          this.navTags = false;
        }
        this.leftMenu = menus;//左侧菜单
      },
  },
    created() {
      // 显示打开的页面的列表
      let activeMenus = JSON.parse(localStorage.getItem("activeMenus"));//把字符串转换成JSON对象
      if (activeMenus !== null) {
        this.activeName = activeMenus.activeName;
        this.openedSubmenuArr.push(activeMenus.openName);
      }
      //显示添加的tag
      this.$store.commit('setOpenedList');
    },
  }
</script>
<style scoped>
</style>
