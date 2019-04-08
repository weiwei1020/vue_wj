<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <Col span="24" style="margin-top: 10px;">
          <Form id="search-form2" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-20" label="耗材名称:">
              <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_search"></Input>
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_pageChange(1)">搜索</Button>
            </Form-item>
          </Form>
          </Col>
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
  </div>
</template>
<script>
  import IconList from '../../../components/base/IconList.vue'

  export default {
    components: {
      IconList,
    },
    data() {
      return {
        loading: true,
        status: '',
        tableHeight: '600',
        classId: '',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {title:'耗材编号',key:'chemicalNumber',width: 180,align: 'center', ellipsis: true,sortable:'true',},
          {title: '耗材名称', key: 'chemicalName', align: 'center', ellipsis: true,sortable:'true',},
          {title: '申请人', key: 'uname', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '规格', key: 'spec',width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {title: '领用数量', key: 'stockNumber', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '剩余量', key: 'surplusQuantity', width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '申请时间', key: 'ctime', width: 200, align: 'center', ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.ctime ? this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
        ],
        getPage: {},
        contLength: 0,
        queryStartDate: '',
        queryEndDate: '',
      }
    },

    methods: {
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
      _initCont() {
        this._page();
      },
      _open() {
        this._initCont();
      },
      _page() {
        this.$store.dispatch('LmsChemicalUseHistory/UseUpPage', this._searchParams()).then(() => {
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
        let data = this.$serialize('search-form2');
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>
