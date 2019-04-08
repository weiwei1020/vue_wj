<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
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
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 详情
   */
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'

  export default {
    components: {
      BtnList,
      PageTable,
    },
    data() {
      return {
        tableHeight: '300',
        btn: [
          {type: 'error', id: 'chemical-purchase-create-del-all', name: '移除'},
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
          {title: '使用量', key: 'usageQuantity', width: 160, ellipsis: true},
          {title: '剩余量', key: 'surplusQuantity', width: 160, ellipsis: true},
          {title: '使用原因', key: 'receiveRemark',  ellipsis: true},
          {title: '使用时间', key: 'ctime', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
        ],
        showModal: false,
        applyValue: '',
        getPage: {},
        receiveId  :'',
      }
    },
    methods: {
      _page() {
        this.$store.dispatch('LmsChemicalUseHistory/UseHistoryById', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsChemicalUseHistory.page;
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
        if ( this.receiveId !== '') {
          this.$extend(data, {receiveId: this.receiveId});
        }
        return this.$extend(data, this.pageParams);
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(data) {
        this.showEditModal = true;
        this.id = '';
        this.receiveId=data.id;
        this.modalTitle = data.chemicalName+'一 使用详情';
        this._search();
      },
      _search() {
        this._page();
      },
      _pass() {
          this.$refs.approveModal._open(this.receiveId  );
          this.showEditModal = false;
          this.$emit("on-result-change");
      },
      _back() {
          this.$refs.delModal._open(this.receiveId  );
          this.showEditModal = false;
          this.$emit("on-result-change");
      },
    }
  }
</script>
