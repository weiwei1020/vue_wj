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
          {title: '修改人', key: 'testuser', width: 100, ellipsis: true},
          {title: '修改内容', key: 'changeContent', width: 160, ellipsis: true},//todo 修改内容
          {title: '修改前实验名称', key: 'testName', ellipsis: true,width: 160,},
          {title: '修改后实验名称', key: 'ltestName', ellipsis: true,width: 160,},
          {title: '修改前开始时间', key: 'beginDate', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.beginDate, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '修改后开始时间', key: 'lbeginDate', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.lbeginDate, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '修改前结束时间', key: 'endDate', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.endDate, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '修改后结束时间', key: 'lendDate', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.lendDate, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '修改前备注', key: 'remark', width: 160, ellipsis: true},
          {title: '修改后备注', key: 'lremark', width: 160, ellipsis: true},

        ],
        contLength: 0,
        id:'',
        testId:'',
      }
    },
   /* computed: {
      getPage() {
        return this.$store.state.LmsStaffLevel.page;
      }
    },*/
    mounted() {
    },
    methods: {
      _open(id) {
        this.showEditModal = true;
        this.modalTitle = '修改历史';
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
        this.$store.dispatch('LmsStaffLevel/testChangeById', this._searchParams()).then(() => {
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
      /*  let data= {
          testId:this.id,
        };*/
       // this.$extend(data, {testId: this.id});
       // return data;
        var data = this.$serialize('search-form-order');
        Object.assign(data, {testId:this.id,});
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>



