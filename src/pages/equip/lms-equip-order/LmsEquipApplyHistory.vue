<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="950">
      <p slot="header">{{modalTitle}}</p>

      <!--内容-->
      <div class="layout-content-padding">
        <div class="layout-content-main">
          <Row>
            <!-- 表格 -->
            <!--<Col span="24" style="margin-bottom: 10px">
              <PageTable :loading='loading' :pageColumns="pageColumns" ref="PageTable"
                         :getPage="getPage" :height="tableHeight"></PageTable>
            </Col>-->
            <!-- 表格 -->
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
          {
            title: '操作', key: 'options', width: 60, align: 'center',
            render: (h, data) => {
              let iconMsg = [];
              iconMsg.push({type: 'checkmark', id: '', name: '复制'});
              return h('div', [
                h(IconList, {
                  props: {msg: iconMsg},
                  on: {
                    'on-result-change': (res) => {
                      this._iconClick(res, data)
                    }
                  }
                },),
              ]);
            }
          },
          {title: '仪器名称', key: 'names', width: 314, align: 'center', ellipsis: true},
          {
            title: '申请时间', key: 'applyTime', width: 240, align: 'center',
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '审核批注', key: 'advice', width: 300, align: 'center', ellipsis: true},
        ],
        contLength: null
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipOrder.page;
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
        this.$store.dispatch('LmsEquipOrder/applyPage', this._searchParams()).then(() => {
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
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        this.$extend(data, {status: 'TECHNOLOGY_CHECK_PASS'});
        return this.$extend(data, this.pageParams);
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
