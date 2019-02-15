<!--
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    &lt;!&ndash;header&ndash;&gt;
    <Headers :isShowTags="isShowTags" :shrink="shrink" :isleftMenu="isleftMenu"
             :menuList="menuList" :ishow="ishow" :navTags="navTags" :classTheme="classTheme"
             :menuTheme="menuTheme" :activeName="activeName" :openedSubmenuArr="openedSubmenuArr"
             :leftMenu="leftMenu" :imgUri="imgUri"
             :pageTagsList="pageTagsList"
             @on-result-change="_headerChange" ref="header">

    </Headers>
    &lt;!&ndash;header/&ndash;&gt;

    &lt;!&ndash;main&ndash;&gt;
    <div class="single-page-con" :style="{left: shrink?'60px':isleftMenu?'200px':'0px'}" style="background: #ffffff">
      <div class="single-page">
        &lt;!&ndash;<keep-alive >&ndash;&gt;
        <router-view></router-view>
        &lt;!&ndash;</keep-alive>&ndash;&gt;
      </div>
    </div>
    &lt;!&ndash;main /&ndash;&gt;

  </div>
</template>
<script>
 /* import Global from '../api/config'
  import store from 'store2';
  import Headers from '../components/header/Headers'*/

  export default {
    components: {
      Headers
    },
    data() {
      return {
        shrink: false,
        menuList: [],
        leftMenu: [
            {"name":"LabServe","icon":"coffee",
                "leftMenus":[
                    {"name":"首页","icon":"coffee","id":"1044415251981918209","code":"10010","subMenus":[],"uri":"/"},
                    {"name":"实验管理","icon":"person-stalker","id":"1041581013100212226","code":"400100",
                        "subMenus":[
                            {"name":"实验计划","icon":"navicon-round","id":"1041582168349945857","code":"400110","uri":"/lims/staff_level"},
                            {"name":"实验管理","icon":"help-buoy","id":"1068687276089765889","code":"400120","uri":"/lims/staff_manage"},
                            {"name":"实验安排","icon":"navicon","id":"1041582631736651778","code":"400130","uri":"/lims/staff_schedule"}],"uri":"/"},
                    {"name":"仪器管理","icon":"ios-barcode","id":"1042315330810097665","code":"500000",
                        "subMenus":[
                            {"name":"仪器类别管理","icon":"navigate","id":"1042315762068434946","code":"500002","uri":"/lims/equip_class"},
                            {"name":"仪器资产管理","icon":"ios-rose-outline","id":"1042316721012158466","code":"500001","uri":"/lims/equip_info"},
                            {"name":"仪器预约申请","icon":"clock","id":"1042317056090910722","code":"500007","uri":"/lims/equip_order"},
                            {"name":"仪器预约查询","icon":"skip-forward","id":"1042317518210936834","code":"5000015","uri":"/lims/equip_order_query"},
                            {"name":"仪器预约审批","icon":"help-buoy","id":"1042318800082513922","code":"500020","uri":"/lims/equip_location"},
                            {"name":"仪器排程查询","icon":"image","id":"1043033588379017218","code":"500251","uri":"/lims/equip_schedule"}],"uri":"/"},
                    {"name":"耗材管理","icon":"erlenmeyer-flask","id":"1041584377355644930","code":"300100",
                        "subMenus":[
                            {"name":"耗材类别管理","icon":"android-options","id":"1041585085433851905","code":"1000120210","uri":"/lims/chemical_category"},
                            {"name":"耗材台账管理","icon":"calculator","id":"1041585690759999489","code":"100001","uri":"/lims/chemical_manage"},
                            {"name":"耗材采购申请","icon":"ios-folder","id":"1041586612198256642","code":"10","uri":"/lims/chemical_purchase"},
                            {"name":"耗材采购单审批","icon":"social-buffer-outline","id":"1041586903006130178","code":"10001","uri":"/lims/chemical_purchase_order"},
                            {"name":"耗材领用申请","icon":"edit","id":"1068689990832058369","code":"12221","uri":"/lims/chemical_apply"},
                            {"name":"耗材领用审批","icon":"wand","id":"1068690410455396353","code":"12221","uri":"/lims/chemical_use"},
                            {"name":"耗材使用记录","icon":"clipboard","id":"1068690956180484098","code":"122221","uri":"/lims/chemical_ues_history"},
                            {"name":"耗材使用查询","icon":"search","id":"1068691258879209473","code":"122221","uri":"/lims/chemical_use_query"},
                            {"name":"耗材归还管理","icon":"archive","id":"1068691642871934977","code":"12221","uri":"/lims/chemical_return"},
                            {"name":"耗材采购统计","icon":"calendar","id":"1055729175792476161","code":"21333","uri":"/lims/statistic"},
                            {"name":"耗材金额统计","icon":"locked","id":"1041585397456515074","code":"12221","uri":"/lims/role_chemical_category"}],"uri":"/"},
                    {"name":"订单管理","icon":"ios-list","id":"1062905214221107201","code":"500001",
                        "subMenus":[
                            {"name":"订单管理","icon":"ios-list","id":"1062905646972616706","code":"50001","uri":"/lims/order_manage"},
                            {"name":"备货单管理","icon":"clipboard","id":"1062905981803905025","code":"50001","uri":"/lims/picking_list_manage"},
                            {"name":"历史记录","icon":"speedometer","id":"1062906451452706817","code":"50001","uri":"/lims/history_record"}],"uri":"/"},
                    {"name":"文件管理","icon":"folder","id":"1042940628203286529","code":"100000",
                        "subMenus":[
                            {"name":"文件管理","icon":"ios-bookmarks-outline","id":"1042940985121779713","code":"10000","uri":"/sysmanage/file_manage"},
                            {"name":"文件权限管理","icon":"coffee","id":"1042941115858235393","code":"100001","uri":"/sysmanage/file_permission"}],"uri":"/"},
                    {"name":"系统设置","icon":"gear-b","id":"1045959587361992705","code":"60001",
                        "subMenus":[
                            {"name":"编码规则","icon":"at","id":"1045960199566798849","code":"60102","uri":"/lims/codeRule"}],"uri":"/"}],
                "id":"1041579916683980802","code":"gxxt","uri":"localhost:8022"}
        ],
        openedSubmenuArr: [],
        activeName: '',
        ishow: Global.getCode(),
        classTheme: 'light_b',
        menuTheme: 'dark',
        isleftMenu: false, //判断是否是首页
        themeWhiteColor: false,
        navTags: false, //控制多任务标签
        isShowTags: true, //home页不显示tags
        imgUri: ''//公司Logo
      }
    },
    computed: {
      pageTagsList() {
        return this.$store.state.Storage.pageTagsList;
      }
    },
    methods: {
      /*******************header返回的数据**********************/
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
      /*******************header返回的数据/**********************/

      _indexOfMenu(item) { //判断是否有相同的menu uri
        this.$store.commit('createTag', item);
      },
      _goto(next) {
        this.$router.push(next);
      },
      _showActiveMenu(data) {
        this.openedSubmenuArr = data.openedSubmenuArr;
        this.activeName = data.activeName;
        this._indexOfMenu(data.currentData);
        store.session('crumbsArray', data.crumbsArray);
        this._goto(data.uri);
      },
      _topBarChange(msg) {
        if (msg == '' || msg == null) {
          //默认主题
          this.classTheme = 'light_b';
        } else {
          if (msg == 'my_notice') {
            //消息管理
            window.open(Global.sysURL + '/#/sysmanage/message', '_blank');

          } else if (msg == 'my_task') {
            //我的任务
            window.open(Global.sysURL + '/#/workflow/task', '_blank');

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
      //左侧菜单
      _getNavMenu(name) {
        this.$store.dispatch('SysResource/getNavMenu').then(() => {
         // this.menuList = this.$store.state.SysResource.navMenu;
          this._showBg(name);
        });
      },
      //清空选中的菜单
      _clearMenu() {
        this.openedSubmenuArr = [];
        this.activeName = '';
        store.session('crumbsArray', ['LabServe', '首页']);
        this.$store.commit('clearTag', []);
        this.$store.commit('createTag', {name: 'LabServe', uri: '/'});
      },
      //初始加载
      _initLoad() {
        this._getNavMenu(Global.getCode());
        if (!Global.getLn()) {
          window.location.href = Global.ssoURL;
        } else {
          let windowHref = window.location.href;
          let str = windowHref.replace(Global.webURL, '');
          if (str === '/#/') {
            this._clearMenu();
          }
          this.$store.dispatch('SysUser/getUserInfo').then(() => {
            let user = this.$store.state.SysUser.userInfo;
            if (user) {
              Global.setUserInfo(user);
              this._getLogo(user);
            }
          });
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
      _toggleClick() { //菜单收缩
        this.shrink = !this.shrink;
      },
      //点击菜单
      _handleSubmenuChange(val) {
        this._indexOfMenu(val)
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
      //耗材审核
      _chemicalApplyRouter(){
        let chemicalData = {
          openedSubmenuArr: ['耗材管理'],
          activeName: '耗材采购单管理',
          currentData: {name: '耗材采购单管理', uri: '/lims/chemical_purchase_order'},
          uri: '/lims/chemical_purchase_order',
          crumbsArray: ['LabServe', '耗材管理', '耗材采购单管理']
        };
        this._showActiveMenu(chemicalData);
      },
      //仪器审核
      _equipApplyRouter(){
        let equipData = {
          openedSubmenuArr: ['仪器管理'],
          activeName: '仪器预约审批',
          currentData: {name: '仪器预约审批', uri: '/lims/equip_location'},
          uri: '/lims/equip_location',
          crumbsArray: ['LabServe', '仪器管理', '仪器预约审批']
        };
        this._showActiveMenu(equipData);
      },
    },
    mounted() {
      this._initLoad();
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
      this.$bus.on('chemical-apply', this._chemicalApplyRouter);
      this.$bus.on('equip-apply', this._equipApplyRouter);
    },
    //销毁监听事件
    beforeDestroy() {
      this.$bus.off('chemical-apply', this._chemicalApplyRouter);
      this.$bus.off('equip-apply', this._equipApplyRouter);
    },
  }
</script>
-->
<template>
  <div class="main">
    <Header>
      <Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-logo"></div>
        <div class="layout-nav">
          <MenuItem name="1">
            <Icon type="ios-navigate"></Icon>
            Item 1
          </MenuItem>
          <MenuItem name="2">
            <Icon type="ios-keypad"></Icon>
            Item 2
          </MenuItem>
          <MenuItem name="3">
            <Icon type="ios-analytics"></Icon>
            Item 3
          </MenuItem>
          <MenuItem name="4">
            <Icon type="ios-paper"></Icon>
            Item 4
          </MenuItem>
        </div>
      </Menu>
    </Header>
    <!--main-->
    <div class="single-page-con">
      <div class="single-page">
        <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
        <!--<keep-alive >-->
        <router-view></router-view>
        <!--</keep-alive>-->
      </div>
    </div>
    <!--main /-->

  </div>

  <!--<div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>
              Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              Item 4
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                Item 1
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                Item 2
              </template>
              <MenuItem name="2-1">Option 1</MenuItem>
              <MenuItem name="2-2">Option 2</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                Item 3
              </template>
              <MenuItem name="3-1">Option 1</MenuItem>
              <MenuItem name="3-2">Option 2</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}" style="background: #ccc;">
          <router-view></router-view>
        </Layout>
     &lt;!&ndash;   <div class="single-page-con" :style="{left: shrink?'60px':isleftMenu?'200px':'0px'}" style="background: #ffffff">
          <div class="single-page">
            &lt;!&ndash; 面包屑 &ndash;&gt;
            <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
            &lt;!&ndash;<keep-alive >&ndash;&gt;
            <router-view></router-view>
            &lt;!&ndash;</keep-alive>&ndash;&gt;
          </div>
        </div>&ndash;&gt;

      </Layout>
    </Layout>
  </div>-->
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
        msg: 'Welcome to Your Vue.js App',
        activeName: 'second',
        labelTwo: (h) => {
          return h('div', [
            h('span', '已解决反馈'),
            h('Badge', {
              props: {
               // dot:true,
              },
              class:this.noRead  ? '':'ivu-badge-do'
            })
          ])
        },
        noRead:false,
        searchContent:'',
      }
    },
    methods:{

    },
  }
</script>
<style scoped>
</style>
