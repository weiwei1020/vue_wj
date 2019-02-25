<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="1100">
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
            <Page :total="getPage.total" :page-size="getPage.size"  @on-change="_pageChange"
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

  import BreadCrumbs from '../../../../components/base/BreadCrumbs'
  import IconList from '../../../../components/base/IconList1.vue'
  import PageTable from '../../../../components/table/PageTable'

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
        loading: true,
        pageParams: {
          rows: 20,
        },
        getPage: {},
        pageColumns: [
          {title: '修改人', key: 'name', width: 100, ellipsis: true},
          {title: '实验名称', key: 'testName', ellipsis: true,width: 160,},
          {title: '年度计划名称', key: 'projectName', ellipsis: true,width: 160,},
          {title: '操作', key: 'operation', ellipsis: true,width: 160,},
          {title: '操作时间', key: 'ctime', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '实验开始时间', key: 'beginDate', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.beginDate, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '实验结束时间', key: 'endDate', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.endDate, "yyyy-mm-dd HH:MM:ss"));
            }
          },
        ],
      }
    },
    mounted() {
    },
    methods: {
      _open() {
        this.showEditModal = true;
        this.modalTitle = '修改历史';
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
        this.$store.dispatch('LmsStaffLevel/testChange', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsStaffLevel.page;
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
      //  let data='';
        var data = this.$serialize('search-form-order');
        Object.assign(data, {pid: this.pid});
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>



