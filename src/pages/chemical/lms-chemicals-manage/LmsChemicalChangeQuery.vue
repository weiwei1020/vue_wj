<template>
  <div>
    <!--内容-->
    <Modal v-model="showModal" title="修改记录" :width="1200">
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                 stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
          </Col>
          <!--分页-->
          <Col span="24">
          <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

  import global from '../../../api/config'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      global,
      BtnList,
      BreadCrumbs
    },
    data() {
      return {
        showModal: false,
        loading: true,
        tableHeight: '430',
        selectIds: [],
        pageParams: {
          rows: 10,
        },
        chemicalId:'',
        getPage:{},
        pageColumns: [
         /* {type: 'selection', width: 60, align: 'center', fixed: 'left'},*/
          {title: '修改人', key: 'applyer', width: 200, align: 'center', ellipsis: true,},
          {title: '修改时间', key: 'ctime', width: 180, align: 'center', ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.ctime ? this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '修改前耗材名称', key: 'cname', width: 160, align: 'center', ellipsis: true,
          },
          {
            title: '修改后耗材名称', key: 'lname', width: 160, align: 'center', ellipsis: true,
          },
          {title: '修改前仓库位置', key: 'cstorehouse', width: 160, align: 'center', ellipsis: true},
          {title: '修改后仓库位置', key: 'lstorehouse', width: 160, align: 'center', ellipsis: true},
          {title: '修改前库存', key: 'cstock', width: 160, align: 'center', ellipsis: true},
          {title: '修改后库存', key: 'lstock', width: 160, align: 'center', ellipsis: true},
          {title: '修改前计量单位', key: 'cunit', width: 160, align: 'center', ellipsis: true},
          {title: '修改后计量单位', key: 'lunit', width: 160, align: 'center', ellipsis: true},
          {title: '修改前供应厂商', key: 'csupplier', width: 160, align: 'center', ellipsis: true},
          {title: '修改后供应厂商', key: 'lsupplier', width: 160, align: 'center', ellipsis: true},
          {title: '修改前供应商电话', key: 'csuppliertel', width: 160, align: 'center', ellipsis: true},
          {title: '修改后供应商电话', key: 'lsuppliertel', width: 160, align: 'center', ellipsis: true},
          {title: '修改前供应商email', key: 'csupplieremil', width: 160, align: 'center', ellipsis: true},
          {title: '修改后供应商email', key: 'lsupplieremil', width: 160, align: 'center', ellipsis: true},
          {title: '修改前制造厂商', key: 'cmanufacturer', width: 160, align: 'center', ellipsis: true},
          {title: '修改后制造厂商', key: 'lmanufacturer', width: 160, align: 'center', ellipsis: true},
        ],
      }
    },
    methods: {
      _open(id) {
        this.showModal = true;
        this.chemicalId = id;
        this._search();
      },
      _page() {
        this.$store.dispatch('LmsChemical/getRecordChangeById', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsChemical.page;
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
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form-order');
        Object.assign(data, {chemicalId: this.chemicalId});
        return this.$extend(data, this.pageParams);
      },
      _btnClick(msg) {
        switch (msg) {
          case '导出' :
            this._export();
            break;
        }
      },
      _cancel() {
        this.showModal = false;
      },
    },
  }
</script>
