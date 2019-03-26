<template>
  <div>
    <Modal v-model="showEditModal" width="800">
      <p slot="header">{{modalTitle}}</p>
      <Form id="people-form" inline onsubmit="return false" :label-width="70">
        <Form-item label="姓名:">
          <Input name="name" placeholder="请输入姓名" @on-enter="_pageChange(1)" style="width:200px"></Input>
          <input name="testId" type="hidden">
        </Form-item>
        <Form-item class="marleft-90">
          <Button type="primary" @click="_search">搜索</Button>
        </Form-item>
      </Form>
      <Row>
        <Col span="24" style="margin-bottom: 10px">
        <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
        </Col>
        <Col span="24" style="margin-bottom: 10px">
        <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
               stripe
               @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
        </Col>
        <!--分页-->
        <Col span="24">
        <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current"
              @on-change="_pageChange" @on-page-size-change='_pageSizeChange'
              placement="top" show-elevator show-total show-sizer></Page>
        </Col>
      </Row>
    </Modal>
    <!--增加人员-->
    <AssignPerson ref="assignPersonModal" @on-result-change="_peopleSelcetResult"></AssignPerson>
  </div>
</template>
<script>
  import AssignPerson from '../../../components/UserInfoMulti/AssignPerson'
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'
  export default {
    components: {
      AssignPerson,
      BtnList,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
          {type: 'error', id: '', name: '删除'},
        ],
        btnObj: { //按钮权限
          leader: 'marshal-manage-user-leader',
        },
        id: '',
        modalTitle: '人员列表',
        loading: true,
        tableHeight: '300',
        selectIds: [],
        getPage: {},
        heightSearch: '',
        pageParams: {
          rows: 20,
        },
        showEditModal: false,
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '姓名', key: 'name',},
          // {title: '性别', key: '', width: 100},
          // {title: '组织', key: '', width: 100},
          // {title: '手机号', key: '', width: 120},
        ],
      }
    },
    methods: {
      _open(id) {
        this.showEditModal = true;
        $("input[name=testId]").val(id);
        this.id = id;
        this._page();
      },
      _page() {
        this.$store.dispatch('LmsMarshalManage/userPage', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsMarshalManage.userPage;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _pageSizeChange(rows) {
        this.pageParams['rows'] = rows;
        this._page();
      },
      _search() {
        this._page();
        this.$emit('on-result-change');
      },
      _searchParams() {
        var data = this.$serialize('people-form');
        return this.$extend(data, this.pageParams);
      },
      _deletePeopleByIds() {
        if (this.selectIds.length === 0) {
          this.$Message.warning('请选择至少一条数据！');
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: '确定删除这 ' + this.selectIds.length + ' 条数据？',
            onOk: () => {
              this.$store.dispatch('LmsMarshalManage/deletePeopleByIds', this.selectIds).then(() => {
                if (this.$store.state.LmsMarshalManage.success) {
                  this._page();
                  this.$Message.success('删除成功！');
                  this.selectIds = [];
                  this.$emit('on-result-change');
                }
              });
            }
          });
        }
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _assignPerson() {
        this.$refs.assignPersonModal._open(this.id);
      },
      _setChargeman(id, leader) {
        if (null == leader || undefined == leader || '' == leader) {
          leader = '0';
        }
        var content = '';
        if ('1' == leader) {
          content = '确定进行取消设置组长吗？'
        } else {
          content = '确定设置为组长？'
        }
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            var obj = {id: '', leader: ''}
            obj.id = id;
            obj.leader = leader;
            this.$store.dispatch('LmsMarshalManage/setChargeman', obj).then(() => {
              if (this.$store.state.LmsMarshalManage.success) {
                this._page();
                this.$Message.success('设置成功！');
              }
            });
          }
        });
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._assignPerson();
            break;
          case '删除' :
            this._deletePeopleByIds();
            break;
        }
      },
      _peopleSelcetResult(res){
        let idList = [];
        let nameList = [];
        for(let i=0;i<res.length;i++){
          idList.push(res[i].id)
          nameList.push(res[i].realname)
        }
        this.$store.dispatch('LmsMarshalManage/relUser',
                {id:this.id,ids:idList,names:nameList}).then(() => {
                if(this.$store.state.LmsMarshalManage.success){
                  this.$Message.success("人员分配成功！");
                  this.$emit("on-result-change");
                  this._page();
                }else{
                  this.$Message.error("人员分配失败！");
                }
              });
      },
    }
  }
</script>
