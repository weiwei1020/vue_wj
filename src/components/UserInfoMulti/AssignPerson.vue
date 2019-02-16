<template>
  <div>
    <Modal v-model="showUserModal" width="1200" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row :gutter="16">
          <!--组织列表-->
          <Col span="6">
          <Card class="user_card_tree">
            <p slot="title">{{titleChange}}</p>
           <!-- <p slot="extra" @click="_changeLimit">
              <Tooltip content="切换" placement="top-end">
                <Badge dot>
                  <Icon type="arrow-swap" size="23"></Icon>
                </Badge>
              </Tooltip>
            </p>-->
            <div>
              <OrginZtree ref="orginZtree" @on-result-change="_orgData" v-show="changeBool"></OrginZtree>
              <UserMarshalling ref="marshalling" @on-result-change="_marshallingData"
                               v-show="changeBool === false"></UserMarshalling>
            </div>
          </Card>
          </Col>
          <!--待选列表-->
          <Col span="8">
          <Card  class="user_card_tree">
            <p slot="title">待选人员列表</p>
            <div>
              <UserCheck ref="userCheck" @on-result-change="_userCheckData" @on-type-change="_typeChange"></UserCheck>
            </div>
          </Card>
          </Col>
          <!--操作按钮-->
          <Col span="2">
          <div style="text-align: center;margin-top:200px">
            <div style="margin-bottom: 20px">
              <Button type="primary"  @click="_submit">
              <Icon type="chevron-right"></Icon>
              </Button>
            </div>
            <div>
              <Button type="primary"  @click="_back">
                <Icon type="chevron-left"></Icon>
              </Button>
            </div>
          </div>
          </Col>
          <!--已选列表-->
          <Col span="8">
          <Card  class="user_card_tree">
            <p slot="title">已添加人员列表</p>
            <div>
              <UserChecked ref="userChecked" @on-result-change="_userCheckedData" @on-length-change="_userCheckedBackData"></UserChecked>
            </div>
          </Card>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 分配人员信息
   */

  import OrginZtree from '../userInfo/OrginZtree.vue'
  import UserMarshalling from './UserMarshalling.vue'
  import UserCheck from './UserCheck'
  import UserChecked from './UserChecked'

  export default {
    components: {
      OrginZtree,
      UserMarshalling,
      UserCheck,
      UserChecked
    },
    data() {
      return {
        id:'',
        modalTitle: '分配人员',
        showUserModal: false,
        titleChange: '组织列表',
        changeBool: true,
        rightBtn:true,
        leftBtn:true,
        userCheckIds:[],
        userCheckedIds:[],
        userCheck:[],
        checkedBackData:[],
        backDataLength:0,
        type:''
      }
    },
    methods: {
      _open(data) {
        this.checkedBackData=[];
        this.showUserModal = true;
        this.changeBool = true;
        this.rightBtn = true;
        this.leftBtn = true;
        this.userCheckIds = [];
        this.userCheckedIds = [];
        this.titleChange = '组织列表';
        this.$refs.orginZtree._getZtree('assign');
        this.$refs.userChecked._opens();
        this.$refs.userCheck._openClear(data);
      },
      _orgData(data) {
        this.$refs.userCheck._open(data.id);
      },
      _marshallingData(data) {
        this.$refs.userCheck._marshallingOpen(data.id);
      },
      _userCheckData(data) {
        this.userCheck = data;
      },
      _typeChange(data){
        console.log(data)
        this.type =data;
      },
      _userCheckedData(data) {
        this.checkedBackData = data;
      },
      _changeLimit() {
        this.changeBool = !this.changeBool;
        if (this.changeBool) { //组织
          this.titleChange = '组织列表';
          this.$refs.orginZtree._getZtree('assign');
          this.$refs.userCheck._refresh();
        } else {  //用户编组
          this.titleChange = '用户编组';
          this.$refs.marshalling._open();
          this.$refs.userCheck._refresh();
        }
      },
      _cancel() {
        this.showUserModal = false;
      },
      _ok() {
        this.showUserModal = false;
        this.$emit('on-result-change',this.checkedBackData)
        this.$refs.userCheck._deleteAll()
      },
      _submit(){
        if(this.userCheck.length ==0){
          this.$Message.warning('请选择至少一项数据')
        }else{
          this.$refs.userChecked._open(this.userCheck)
          if(this.type == 1){
            this.$refs.userCheck._page();
          }else{
            this.$refs.userCheck._page1();
          }

        }
      },
      _back(){
        if(this.backDataLength==0){
          this.$Message.warning('请选择至少一项数据')
        }else{
          this.$refs.userChecked._delData()
        }
      },
      _userCheckedBackData(result){
        this.backDataLength = result.length;
      }
    }
  }
</script>
