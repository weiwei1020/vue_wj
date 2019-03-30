<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="620">
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
    <!--申请单修改详情-->
    <LmsEquipOrderChangeDetails ref="detailModal"></LmsEquipOrderChangeDetails>
  </div>
</template>
<script>
  /**
   * 添加编辑试验仪器申请表
   */
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import LmsEquipOrderChangeDetails from './LmsEquipOrderChangeDetails.vue'


  export default {
    components: {
      BtnList,
      PageTable,
      LmsEquipOrderChangeDetails,
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
          {title: '修改次数', key: 'version', width: 100, ellipsis: true,},
          {title: '修改人', key: 'updateName', width: 185, ellipsis: true},
          {
            title: '修改日期', key: 'updateDate', "width": 200, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.updateDate ? this.$dateformat(params.row.updateDate, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 100, align: 'center',
            render: (h, data) => {
              let operate = [];
              let btnDel =
                h('Button', {
                  props: {type: '', size: 'small',},
                  attrs: {id: this.btnObj.del},
                  on: {
                    click: () => {
                      this._changeDetail(data.row.version,data.row.groupId);
                    }
                  }
                }, '详情');
              if (this.$showBtn(this.btnObj.del)) {
                operate.push(btnDel);
              }
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
        showModal: false,
        applyValue: '',
        getPage: {},
        groupId:'',
      }
    },
    methods: {
      _page() {
        this.$store.dispatch('LmsEquipOrder/changeOrderByGroupId', this._searchParams()).then(() => {
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
        var data = this.$serialize('search-form');
        if ( this.groupId !== '') {
          this.$extend(data, {groupId: this.groupId});
        }
        return this.$extend(data, this.pageParams);
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(groupId) {
        this.showEditModal = true;
        this.id = '';
        this.groupId=groupId;
        this.modalTitle = '申请单修改记录';
        this._search();
      },
      _search() {
        this._page();
      },
      _changeDetail(version,groupId){
        this.$refs.detailModal._open(version,groupId);
      },


    }
  }
</script>
