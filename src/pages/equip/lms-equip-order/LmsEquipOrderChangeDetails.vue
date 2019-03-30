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
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑试验仪器申请表
   */
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
          edit: 'chemical-purchase-create-edit',
          del: 'chemical-purchase-create-del'
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
          {title: '仪器名称', key: 'equipName', width: 160, ellipsis: true},
          {
            title: '开始使用时间', key: 'orderStartTime', "width": 220, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.orderStartTime ? this.$dateformat(params.row.orderStartTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '结束使用时间', key: 'orderEndTime', "width": 220, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.orderEndTime ? this.$dateformat(params.row.orderEndTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '修改人', key: 'updateName', width: 160, ellipsis: true},
          {
            title: '修改时间', key: 'updateDate', "width": 180, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.updateDate ? this.$dateformat(params.row.updateDate, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '申请原因', key: 'applyReason', width: 100, ellipsis: true,},
        ],
        showModal: false,
        applyValue: '',
        getPage: {},
        groupId:'',
        version:'',
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
            this._blurSave(name, value, this.getPage.records[i]);
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
      _page() {
        this.$store.dispatch('LmsEquipOrder/changeOrderDetail', this._searchParams()).then(() => {
          this.getPage = this.$store.state.LmsEquipOrder.page;
          this.loading = false;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _pageSizeChange(rows) {
        if (rows !== this.pageParams.rows) {
          this.pageParams['rows'] = rows;
          this._page();
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
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = {};
        if ( this.groupId !== '') {
          this.$extend(data, {groupId: this.groupId});
        }
        if ( this.version !== '') {
          this.$extend(data, {version: this.version});
        }
        return this.$extend(data, this.pageParams);
      },
      /*  _page() {
          this.$refs.pageTable._page('edit-form-detail', 'LmsEquipOrder/editById');
        },*/
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(version,groupId) {
        this.showEditModal = true;
        this.id = '';
        this.version=version;
        this.groupId=groupId;
        this.modalTitle = '申请单修改详细记录';
        this._search();
      },
      _search() {
        this._page();
      },


    }
  }
</script>
