<!--<template>
  &lt;!&ndash;<div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          我是菜单
        </el-aside>
        <el-main>
            <div style="background: #fff;">
              <Tabs value="name1">
                <TabPane label="标签一" name="name1">标签一的内容</TabPane>
                <TabPane :label="labelTwo" name="name2">标签二的内容</TabPane>
                <TabPane label="标签三" name="name3">标签三的内容</TabPane>
                <Input slot="extra"   v-model="searchContent" placeholder="问题搜索" icon="ios-search"></Input>
              </Tabs>
            </div>
        </el-main>
      </el-container>
    </el-container>
  </div>&ndash;&gt;
  <div class="layout">
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
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Layout</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <div style="background: #fff;">
              <Tabs value="name1" style="background: #eee;margin: 5px;padding: 5px;">
                <TabPane label="全部反馈" name="name1">
                  <allAdvice></allAdvice>
                </TabPane>
                <TabPane label="未解决反馈" name="name2">

                </TabPane>
                <TabPane :label="labelTwo" name="name3">

                </TabPane>
                <Input style="margin: 5px 5px 5px 0px;" slot="extra"   v-model="searchContent" placeholder="问题搜索" icon="ios-search"></Input>
              </Tabs>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import HelloWorld from '../components/HelloWorld'
  import allAdvice from './allAdvice'
  export default {
    components: {
    //  ElementTable,
      HelloWorld,
      allAdvice,
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
</style>-->
<template>
  <div>
    <!--面包屑-->
    <div>
      <div class="ivu-breadcrumb breadcrumb_bg">
        <Breadcrumb>
          <Breadcrumb-item>高校系统</Breadcrumb-item>
          <Breadcrumb-item>首页</Breadcrumb-item>
        </Breadcrumb>
      </div>
    </div>
    <!--内容-->
  <!--  <div class="layout-content-padding" v-show="showHome">
      <div class="layout-content-main" style="margin-top: 10px">
        <div class="config_home" :style="{height}">
          <Row :gutter="10">
            &lt;!&ndash;仪器申请审核任务&ndash;&gt;
            <Col span="10" style="margin-bottom: 10px">
            <EquipApply  @on-result-change="_equipResult"></EquipApply>
            </Col>
            &lt;!&ndash;采购申请审核任务&ndash;&gt;
            <Col span="14" style="margin-bottom: 10px">
            <ChemicalApply @on-result-change="_chemicalResult"></ChemicalApply>
            </Col>
          </Row>
          <Row :gutter="10">
            &lt;!&ndash;用户在线情况&ndash;&gt;
            <Col span="10">
            <UserOnline @on-result-change="_userOnline"></UserOnline>
            </Col>
            &lt;!&ndash;消息通知&ndash;&gt;
            <Col span="14">
            <Message  @on-result-change="_messageResult"></Message>

            &lt;!&ndash; <ChemicalStatistic></ChemicalStatistic>&ndash;&gt;
            </Col>
          </Row>
          &lt;!&ndash; <Row :gutter="10">
             &lt;!&ndash;消息通知&ndash;&gt;
             <Col span="24">
             <Message  @on-result-change="_messageResult"></Message>
             </Col>
           </Row>&ndash;&gt;
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
 /* import  EquipApply from './config-home/EquipApply'
  import  UserOnline from './config-home/UserOnline'
  import  ChemicalApply from './config-home/ChemicalApply'
  import  ChemicalStatistic from './config-home/ChemicalStatistic'
  import  Message from './config-home/Message'*/


  export default {
    components: {
    /*  Message,
      EquipApply,
      UserOnline,
      ChemicalApply,
      ChemicalStatistic*/
    },
    data() {
      return {
        height: '',
        isFinished: false,
        isChemicalType: false,
        isChemical: false,
        isContract: false,
        taskSpan: 12,
        span: 12,
        bottomSpan: 24,
        userInfo:[],
        showHome:true,
      }
    },
    mounted() {
      this._open();
    },
    methods: {
      _open() {
        this.height = document.documentElement.clientHeight - 115 + 'px';
      },
      _chemicalResult() {
        this.$bus.emit('chemical-apply');
      },
      _equipResult() {
        this.$bus.emit('equip-apply');
      },
      _userOnline() {
        this.$bus.emit('user-online');
      },
      _messageResult(){
        this.$bus.emit('message');
      },
      /*_getRole(){
        this.$store.dispatch('SysUser/getUserInfo').then(() => {
          this.userInfo = this.$store.state.SysUser.userInfo;
        });
        if(this.userInfo.realname=='学生测试'){
          this.showHome=false;
        }else{
          this.showHome=true;
        }
      },*/
    },
  }
</script>

