<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
      <p slot="header">{{modalTitle}}</p>
      <!--内容-->
      <div class="layout-content-padding">
        <div class="layout-content-main">
          <Row>
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                   highlight-row stripe
                   @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                  @on-page-size-change='_pageSizeChange'
                  placement="top" show-elevator show-total show-sizer></Page>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>

  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import PageTable from '../../../components/table/PageTable'

  export default {
    components: {
      BreadCrumbs,
      IconList,
      PageTable
    },
    data() {
      return {
        tableHeight: '300',
        modalTitle: '',
        showEditModal: false,
        pageParams: {
          rows: 20
        },
        getPage: {},
        pageColumns: [
          {title: '耗材名称及数量', key: 'chemicalNameNumber', ellipsis: true},
          {title: '申请人', key: 'name', width: 160, ellipsis: true},
          {title: '审批状态', key: 'status', width: 160, ellipsis: true,
           /* render: (h, data) => {
            if(data.row.status==undefined){
              data.row.status=0;
            }
            let val = {0: "审批中", 1: "审批通过", 2: "审批驳回"};
            let status=[];
              status.push(
                h('div', {
                  style: {
                    color: val == 'WAIT_APPROVAL' || val == 'WAIT_PURCHASE' ? '#00a0e9' : val == '0' ? '#F8BB2C' : val == '2' ? 'red' : '#6FBA2C'
                  }
                }, val[data.row.status])
              );
              return h('div', status);
            }*/
          },
          {title: '申请时间', key: 'ctime', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '审核批注', key: 'total', width: 160, ellipsis: true},
        ],
        contLength: null
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsChemicalPurchase.page;
      }
    },
    mounted() {
    },
    methods: {
      _open() {
        this.showEditModal = true;
        this.modalTitle = '历史申请单';
        this._page();
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._search();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _page() {
        this.$store.dispatch('LmsChemicalPurchase/history', this._searchParams()).then(() => {
          this.getPage = this.$store.state.LmsChemicalPurchase.page;
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
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        let data='';
      },
      _iconClick(res, data) {
        switch (res) {
          case '复制' :
            this.$emit("on-result-change", data.row.groupId);
            this.showEditModal = false;
            break;
        }
      },
    },
  }
</script>

