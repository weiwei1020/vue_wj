
<template>
  <div>
    <!--面包屑-->
    <div>
      <div class="ivu-breadcrumb breadcrumb_bg">
        <Breadcrumb>
          <Breadcrumb-item>LabServer</Breadcrumb-item>
          <Breadcrumb-item>首页</Breadcrumb-item>
        </Breadcrumb>
      </div>
    </div>
    <!--内容-->
    <div class="layout-content-padding" v-show="showHome">
      <div class="layout-content-main" style="margin-top: 10px">
        我是首页
       <!-- <div class="config_home" :style="{height}">
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
        </div>-->
      </div>
    </div>
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

