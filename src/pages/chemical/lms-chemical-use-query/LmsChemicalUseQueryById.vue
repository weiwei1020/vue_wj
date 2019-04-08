<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="700">
      <p slot="header">{{modalTitle}}</p>
      <!--内容-->
      <div class="layout-content-padding">
        <div class="layout-content-main">
          <Row>
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                   highlight-row stripe :height="tableHeight" ></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size"  :current="getPage.current" @on-change="_pageChange"
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
        tableHeight: '430',
        modalTitle: '',
        showEditModal: false,
      //  loading: true,
        pageParams: {
          rows: 20,
        },
        getPage: {},
        pageColumns: [
        /*  {title: '领用人', key: 'applyName', ellipsis: true,width: 160,},*/
          {title: '使用时间', key: 'ctime', width: 180, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '使用量', key: 'usageQuantity', width: 100, ellipsis: true},
          {title: '使用原因', key: 'usageQuantity',  ellipsis: true},

          {title: '剩余量', key: 'surplusQuantity', width: 100, ellipsis: true},
        ],
        contLength: 0,
        id:'',
        testId:'',
      }
    },
    mounted() {
    },
    methods: {
      _open(id) {
        this.showEditModal = true;
        this.modalTitle = '使用历史记录';
        this.id=id;
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
        this.$store.dispatch('LmsChemicalUseQuery/QueryById', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsChemicalUseQuery.page;
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
        let data = this.$serialize('search-form-order');
        Object.assign(data, {receiveId:this.id,});
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>



