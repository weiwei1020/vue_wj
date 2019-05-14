<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <Headers :isShowTags="isShowTags" :shrink="shrink" :isleftMenu="isleftMenu"
             :menuList="menuList" :ishow="ishow" :classTheme="classTheme"
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
  import Global from '../api/config'
  import store from 'store2';
  import Headers from '../components/header/Headers'
  import BreadCrumbs from "../components/base/BreadCrumbs";
  export default {
    components: {
    //  ElementTable,
      HelloWorld,
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
                  {"name":"耗材领用申请","icon":"edit","id":"","code":"12221","uri":"/lims/chemical_use"},
                  {"name":"耗材领用审批","icon":"wand","id":"","code":"12221","uri":"/lims/chemical_use_audit"},
                  {"name":"耗材使用记录","icon":"clipboard","id":"","code":"122221","uri":"/lims/chemical_ues_history"},
                  // {"name":"耗材使用查询","icon":"search","id":"","code":"122221","uri":"/lims/chemical_use_query"},
                  {"name":"耗材归还管理","icon":"archive","id":"","code":"12221","uri":"/lims/chemical_return"},
                  {"name":"耗材采购统计","icon":"calendar","id":"","code":"21333","uri":"/lims/statistic"},
                  // {"name":"耗材金额统计","icon":"locked","id":"","code":"12221","uri":"/lims/chemical-amount-of-money"}
                  ],"uri":"/"},
              {"name":"人员管理","icon":"person-stalker","code":"400110",
                "subMenus":[
                  {"name":"人员管理","icon":"person-stalker","code":"400110","subMenus":[],"uri":"/lims/personnel_manage"},
                ],"uri":"/"},
              {"name":"个人中心","icon":"gear-b","id":"","code":"60001",
                "subMenus":[
                  {"name":"修改密码","icon":"ios-barcode","id":"","code":"500000", "subMenus":[],"uri":"/lims/change_password"},
                  {"name":"基本信息","icon":"gear-b","id":"","code":"60001", "subMenus":[],"uri":"/lims/user_info"},
                ],"uri":"/"},
              ],
            "id":"","code":"gxxt","uri":"localhost:8022"}
        ],
        menuList1: [
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
                  // {"name":"仪器预约审批","icon":"help-buoy","id":"","code":"500020","uri":"/lims/equip_audit"},
                  {"name":"仪器排程查询","icon":"image","id":"","code":"500251","uri":"/lims/equip_schedule"}],"uri":"/"},
              {"name":"耗材管理","icon":"erlenmeyer-flask","id":"","code":"300100",
                "subMenus":[
                  {"name":"耗材类别管理","icon":"android-options","id":"","code":"1000120210","uri":"/lims/chemical_category"},
                  {"name":"耗材台账管理","icon":"calculator","id":"","code":"100001","uri":"/lims/chemical_manage"},
                  {"name":"耗材采购申请","icon":"ios-folder","id":"","code":"10","uri":"/lims/chemical_purchase"},
                  // {"name":"耗材采购单审批","icon":"social-buffer-outline","id":"","code":"10001","uri":"/lims/chemical_purchase_order"},
                  {"name":"耗材领用申请","icon":"edit","id":"","code":"12221","uri":"/lims/chemical_use"},
                  // {"name":"耗材领用审批","icon":"wand","id":"","code":"12221","uri":"/lims/chemical_use_audit"},
                  {"name":"耗材使用记录","icon":"clipboard","id":"","code":"122221","uri":"/lims/chemical_ues_history"},
                  {"name":"耗材使用查询","icon":"search","id":"","code":"122221","uri":"/lims/chemical_use_query"},
                  // {"name":"耗材归还管理","icon":"archive","id":"","code":"12221","uri":"/lims/chemical_return"},
                  // {"name":"耗材采购统计","icon":"calendar","id":"","code":"21333","uri":"/lims/statistic"},
                  // {"name":"耗材金额统计","icon":"locked","id":"","code":"12221","uri":"/lims/chemical-amount-of-money"}
                  ],"uri":"/"},
              {"name":"个人中心","icon":"gear-b","id":"","code":"60001",
                "subMenus":[
                  {"name":"修改密码","icon":"ios-barcode","id":"","code":"500000", "subMenus":[],"uri":"/lims/change_password"},
                  {"name":"基本信息","icon":"gear-b","id":"","code":"60001", "subMenus":[],"uri":"/lims/user_info"},
                ],"uri":"/"},
             ],
            "id":"","code":"gxxt","uri":"localhost:8080"}
        ],
        menuList2: [
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
                  // {"name":"仪器预约审批","icon":"help-buoy","id":"","code":"500020","uri":"/lims/equip_audit"},
                  {"name":"仪器排程查询","icon":"image","id":"","code":"500251","uri":"/lims/equip_schedule"}],"uri":"/"},
              {"name":"耗材管理","icon":"erlenmeyer-flask","id":"","code":"300100",
                "subMenus":[
                  {"name":"耗材类别管理","icon":"android-options","id":"","code":"1000120210","uri":"/lims/chemical_category"},
                  {"name":"耗材台账管理","icon":"calculator","id":"","code":"100001","uri":"/lims/chemical_manage"},
                  {"name":"耗材采购申请","icon":"ios-folder","id":"","code":"10","uri":"/lims/chemical_purchase"},
                  // {"name":"耗材采购单审批","icon":"social-buffer-outline","id":"","code":"10001","uri":"/lims/chemical_purchase_order"},
                  {"name":"耗材领用申请","icon":"edit","id":"","code":"12221","uri":"/lims/chemical_use"},
                  // {"name":"耗材领用审批","icon":"wand","id":"","code":"12221","uri":"/lims/chemical_use_audit"},
                  {"name":"耗材使用记录","icon":"clipboard","id":"","code":"122221","uri":"/lims/chemical_ues_history"},
                  {"name":"耗材使用查询","icon":"search","id":"","code":"122221","uri":"/lims/chemical_use_query"},
                  // {"name":"耗材归还管理","icon":"archive","id":"","code":"12221","uri":"/lims/chemical_return"},
                  // {"name":"耗材采购统计","icon":"calendar","id":"","code":"21333","uri":"/lims/statistic"},
                  // {"name":"耗材金额统计","icon":"locked","id":"","code":"12221","uri":"/lims/chemical-amount-of-money"}
                  ],"uri":"/"},
              {"name":"个人中心","icon":"gear-b","id":"","code":"60001",
                "subMenus":[
                  {"name":"修改密码","icon":"ios-barcode","id":"","code":"500000", "subMenus":[],"uri":"/lims/change_password"},
                  {"name":"基本信息","icon":"gear-b","id":"","code":"60001", "subMenus":[],"uri":"/lims/user_info"},
                ],"uri":"/"},
            ],
            "id":"","code":"gxxt","uri":"localhost:8080"}
        ],
        leftMenu: [],
        openedSubmenuArr: [],
        activeName: '',
        ishow:Global.getCode(),
        classTheme: 'light_b',
        menuTheme: 'dark',
        isleftMenu: false, //判断是否是首页
        themeWhiteColor: false,
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
        if (!Global.getLn()) {
          window.location.href = 'http://localhost:8080/#/login'
        } else {
          let windowHref = window.location.href;
          let str = '';
          if (str === '/#/') {
            this._clearMenu();
          }
        }
      },
      //左侧菜单
      _getNavMenu(name) {
         this._showBg(name);
      },
      _showBg(name) {//nav li背景切换
        if(localStorage.getItem('personRole')==='0'){
          let menus = this.$getTabMenu(this.menuList, name);
          this.isleftMenu = true;
          this.isShowTags = false;
          this.$refs.header._openTags(true);
          this.leftMenu = menus;//左侧菜单
        }
        if(localStorage.getItem('personRole')==='1'){
          let menus = this.$getTabMenu(this.menuList1, name);
          this.isleftMenu = true;
          this.isShowTags = false;
          this.$refs.header._openTags(true);
          this.leftMenu = menus;//左侧菜单
        }
        if(localStorage.getItem('personRole')==='2'){
          let menus = this.$getTabMenu(this.menuList2, name);
          this.isleftMenu = true;
          this.isShowTags = false;
          this.$refs.header._openTags(true);
          this.leftMenu = menus;//左侧菜单
        }

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
