<template>
  <div>
    <Modal v-model="showUserModal" width="1250" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row :gutter="16">
          <!--组织列表-->
          <Col span="6">
          <Card class="user_card_tree">
            <p slot="title">{{titleChange}}</p>
            <div>
              <OrginZtree ref="orginZtree" @on-result-change="_orgData" v-show="changeBool"></OrginZtree>
            </div>
          </Card>
          </Col>
          <!--待选列表-->
          <Col span="8">
          <Card class="user_card_tree">
            <p slot="title">待选人员列表</p>
            <div>
              <UserCheck ref="userCheck" @on-result-change="_userCheckResultData"></UserCheck>
            </div>
          </Card>
          </Col>
          <!--操作按钮-->
          <Col span="1">
          <div style="text-align: center;margin-top:200px">
            <div style="margin-bottom: 20px">
              <Tooltip content="添加" placement="right">
                <Button type="primary" @click="_submit">
                  <Icon type="chevron-right"></Icon>
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="移除" placement="right">
                <Button type="primary" @click="_back">
                  <Icon type="chevron-left"></Icon>
                </Button>
              </Tooltip>
            </div>
          </div>
          </Col>
          <!--已选列表-->
          <Col span="9">
          <Card class="user_card_tree">
            <p slot="title">已添加人员列表</p>
            <div>
              <UserChecked ref="userChecked" @on-result-change="_userCheckedData"></UserChecked>
            </div>
          </Card>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <ModalFooter @on-result-change="_footerResult" :footer="footerList" ref="footerModal"></ModalFooter>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 选择人员信息
   */

  import OrginZtree from '../userInfo/OrginZtree.vue'
  import UserCheck from './UserCheck'
  import UserChecked from './UserChecked'
  import ModalFooter from '../base/ModalFooter'

  export default {
    components: {
      OrginZtree,
      UserCheck,
      UserChecked,
      ModalFooter
    },
    data() {
      return {
        id: '',
        modalTitle: '选择人员',
        showUserModal: false,
        titleChange: '组织列表',
        changeBool: true,
        userCheckData: [],
        checkedBackData: [],
        //已选列表需要移除的数据
        selectIdsLength: 0,
        type: 0,

        //用于区分tree
        treeName: '',
        footerList: [
          {name: '取消', type: ''},
          {name: '确定', type: 'primary'},
        ],
      }
    },
    methods: {
      //modal-footer
      _footerResult(name) {
        switch (name) {
          case '取消':
            this._cancel();
            break;
          case '确定':
            this._ok();
            break;
        }
      },
      _hideLoading() {
        this.$refs.footerModal._hideLoading();
      },
      _open(treeName, modalTitle) {
        //ztree-name
        if (treeName === undefined) {
          this.treeName = 'userMan';
        } else {
          this.treeName = treeName;
        }
        //标题
        if (modalTitle === undefined) {
          this.modalTitle = '选择人员';
        } else {
          this.modalTitle = modalTitle;
        }
        this.showUserModal = true;
        this.changeBool = true;
        this.titleChange = '组织列表';
        this._getCurrentOrg();
        this._hideLoading();
        this.$refs.userChecked._empty();
      },
      //当前登录用户所处的组织
      _getCurrentOrg() {
        this.$store.dispatch('SysOrg/getOrg').then(() => {
          let result = this.$store.state.SysOrg.list;
          if (result !== undefined) {
            this.$refs.orginZtree._getZtree(this.treeName, result.id);
            this._orgData(result);
          } else {
            this.$refs.orginZtree._getZtree(this.treeName);
          }
        });
      },
      _orgData(data) {
        this.$refs.userCheck._open(data.id, this.treeName);
      },
      _userCheckResultData(data, type, msg) {
        this.userCheckData = data;
        this.type = type;
        if (msg === 'add') {
          //双击即可添加
          this._submit();
        }
      },
      _userCheckedData(data, selectIds) {
        this.checkedBackData = data;
        this.selectIdsLength = selectIds.length;
      },
      _changeLimit() {
        this.changeBool = !this.changeBool;
        if (this.changeBool) { //组织
          this.titleChange = '组织列表';
          this.$refs.orginZtree._getZtree(this.treeName);
          this.$refs.userCheck._refresh();
        }
      },
      _cancel() {
        this.showUserModal = false;
      },
      _ok() {
        this.showUserModal = false;
        this.$emit('on-result-change', this.checkedBackData, this.treeName);
        this._hideLoading();
      },
      //添加
      _submit() {
        if (this.userCheckData.length === 0) {
          this.$Message.warning('请选择至少一项数据');
        } else {
          this.$refs.userChecked._open(this.userCheckData);
        }
      },
      //移除
      _back() {
        if (this.selectIdsLength === 0) {
          this.$Message.warning('请选择至少一项数据');
        } else {
          this.$refs.userChecked._delData();
        }
      },
    }
  }
</script>
