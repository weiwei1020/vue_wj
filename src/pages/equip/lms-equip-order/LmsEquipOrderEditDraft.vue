<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                 highlight-row stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
          </Col>
          <!--分页-->
          <Col span="24">
          <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange(1)"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_save">保存</Button>
        <Button @click="_ok" type="primary">提交审批</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'

  export default {
    components: {
      BtnList,
      PageTable
    },
    data() {
      return {
        tableHeight: '300',
        btn: [
          {type: 'error', id: '', name: '移除'},
        ],
        btnObj: { //按钮权限
          edit: '',
          del: ''
        },
        formObj: [],
        applyFormObj: {
          remark: '', //申请原因
        },
        applyTitle: '',
        id: '',
        modalTitle: '',
        showEditModal: false,
        selectIds: [],
        DATA: {},
        loading:false,
        pageColumns: [
          {title: '仪器名称', key: 'name', width: 220, ellipsis: true},
          {
            title: '开始使用时间', key: 'orderStartTime', width: 200, ellipsis: true,
            render: (h, data) => {
              return h("Date-picker", {
                props: {
                  type: "datetime",
                  value:this.$dateformat(data.row.orderStartTime, "yyyy-mm-dd HH:MM:ss"),
                  editable:false,
                },
                on: {
                  'on-change': (event,) => {
                    data.row.orderStartTime = event;
                    this._cellChange(data.row._index, event, 'orderStartTime');
                  },
                }
              })
            }
          },
          {
            title: '结束使用时间', key: 'orderEndTime', width: 200, ellipsis: true,
            render: (h, data) => {
              return h("Date-picker", {
                props: {
                  type: "datetime",
                  value:this.$dateformat(data.row.orderEndTime, "yyyy-mm-dd HH:MM:ss"),
                  editable:false,
                },
                on: {
                  'on-change': (event,) => {

                    data.row.orderEndTime = event;
                    this._cellChange(data.row._index, event, 'orderEndTime');
                  },
                }
              })
            }
          },
          {
            title: '申请原因', key: 'applyReason', width: 340, ellipsis: true,
            render: (h, data) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: data.row.applyReason,
                },
                on: {
                  'on-blur': (event,) => {
                    data.row.applyReason = event.target.value;
                    this._cellChange(data.row._index, event.target.value, 'applyReason');
                  },
                }
              })
            }
          },
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              let btnDel =
                h('Button', {
                  props: {type: 'error', size: 'small',},
                  attrs: {id: this.btnObj.del}, //添加自定义属性
                  on: {
                    click: () => {
                      this._remove(data.row.id);
                    }
                  }
                }, '移除');
              if (this.$showBtn(this.btnObj.del)) {
                operate.push(btnDel);
              }
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
        showModal: false,
        applyValue: '',
        ruleValidate: {
          remark: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
        },
        getPage: {},
        groupId:'',
        isHistory: false
      }
    },
    methods: {
      _cellChange(index, value, name) {
        for (let i = 0; i < this.getPage.records.length; i++) {
          if (i === index) {
            if ('orderStartTime'===name||'orderEndTime'===name){
              value= this.$dateformat(value, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            }
            this.getPage.records[i][name] = value;
            break;
          }
        }
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        this.treeStyleObj.height = document.documentElement.clientHeight - 110 + 'px';
        switch (this.contLength) {
          case 0 :
            this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
            break;
          default:
            this.tableHeight = this.$tableHeight(val, this.btnVal, this.dVal);
        }
      },
      _page1() {
        this.$store.dispatch('LmsEquipOrder/editById', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipOrder.page;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page1();
       // this.$emit("on-result-change");
      },
      _pageSizeChange(rows) {
        if (rows !== this.pageParams.rows) {
          this.pageParams['rows'] = rows;
          this._page1();
        }
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
        this.selectObj = data;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _forSearch() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        if ( this.groupId !== '') {
          this.$extend(data, {groupId: this.groupId});
        }
        return this.$extend(data, this.pageParams);
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _ok() {
        if (this.getPage.records.length == 0) {  //申请单不能为空
          this.$Message.warning("请先添加仪器！");
        } else if(this.isHistory === true) {
          var data={};
          data.list=this.getPage.records;
          for (let i = 0; i < data.list.length; i++) {
            data.list[i].groupId = undefined;
            data.list[i].id = undefined;
          }
          this.$store.dispatch('LmsEquipOrder/submitDraft', data).then(() => {
            if (this.$store.state.LmsEquipOrder.success) {
              this.$Message.success('申请单提交成功！');
              this.showEditModal = false;
              this.$emit("on-result-change");
            }
          });
        } else {
          var data={};
          data.list=this.getPage.records;
          this.$store.dispatch('LmsEquipOrder/submitDraft', data).then(() => {
            if (this.$store.state.LmsEquipOrder.success) {
              this.$Message.success('申请单提交成功！');
              this.showEditModal = false;
              this.$emit("on-result-change");
            }
          });
        }
      },
      _save() {
        if (this.getPage.records.length == 0) {  //申请单不能为空
          this.$Message.warning("请先添加仪器！");
        } else if(this.isHistory === true) {
          var data={};
          data.list=this.getPage.records;
          for (let i = 0; i < data.list.length; i++) {
            data.list[i].groupId = undefined;
            data.list[i].id = undefined;
          }
          this.$store.dispatch('LmsEquipOrder/submitOrder', data).then(() => {
            if (this.$store.state.LmsEquipOrder.success) {
              this.$Message.success('申请单保存成功！');
              this.showEditModal = false;
            }
          });
        } else {
          var data={};
          data.list=this.getPage.records;
          this.$store.dispatch('LmsEquipOrder/submitOrder', data).then(() => {
            if (this.$store.state.LmsEquipOrder.success) {
              this.$Message.success('申请单保存成功！');
              this.showEditModal = false;
            }
          });
        }
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(groupId, isHistory) {
        this.showEditModal = true;
        this.id = '';
        this.groupId=groupId;
        this.isHistory = isHistory;
        this.modalTitle = '编辑申请单';
        this._forSearch();
      },
      _remove(ids) {//移除一条数据
        this._deletePurIds(ids);
      },
      _deletePurIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/deleteById', ids).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._page1();
                this.$Message.success('删除成功！');
                this.selectIds = [];
              }
            });
          }
        });
      },
      _deleteSelected() {  // 批量移除
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deletePurIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _forSearch() {
        this._page1();
      },
      _applyCancel() { //申请原因取消
        this.showModal = false;
      },
      _applyOk() {  //申请原因提交
        this.$refs['applyFormObj'].validate((valid) => {
          if (valid) {
            this.showModal = false;
            this._purOrder(this.applyValue);
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _btnClick(msg) {
        switch (msg) {
          case '移除' :
            this._deleteSelected(data.row.id);
            break;
        }
      },
    }
  }
</script>
