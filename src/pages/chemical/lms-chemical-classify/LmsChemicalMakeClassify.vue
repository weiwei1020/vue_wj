<template>
  <div>
    <!--内容-->
        <div>
          <Row>
            <!--查询-->
            <Col span="24">
            <Form id="search-form-no-classify" inline onsubmit="return false">
              <label class="label-sign"></label>
              <Form-item>
                归类名称：<Input name="name" placeholder="请输入归类名称" style="width: 160px;" @on-enter="_pageChange(1)"></Input>
              </Form-item>
              <input name="classifyed" type="hidden" value="0"></input>
              <Form-item>
                <Button type="primary" @click="_pageChange(1)">搜索</Button>
              </Form-item>
            </Form>
            </Col>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px">
            <Table :columns="pageColumns" :data="getPage.records" size="small" border highlight-row  disabled-hover
                   @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="400"
                   :row-class-name="_rowClassName" :loading="loading"></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" @on-change="_pageChange" @on-page-size-change='_pageSizeChange'
                  placement="top" show-total></Page>
            </Col>
          </Row>
        </div>
    <!--查看耗材详情-->
    <LmsChemicalClassifyDetail ref="detailModal"></LmsChemicalClassifyDetail>
  </div>
</template>
<script>
  import LmsChemicalClassifyDetail from './LmsChemicalClassifyDetail.vue'
  export default {
    components: {
      LmsChemicalClassifyDetail
    },
    data() {
      return {
        loading:true,
        selectIds: [],
        showMakeClassifyModal: false,
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center',fixed:'left'},
        //  {title: '编号', key: 'num',ellipsis:true,width:150},
          {
            title: '归类名称', key: 'name', width: 120,
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row.id);
                    }
                  }
                }, data.row.name),
              ]);
            }
          },
          {title: '归类库存量', width: 120, key: 'stock', ellipsis: true},
          {title: '计量单位', width: 100, key: 'unit', ellipsis: true},
          {title: '预警库存量', key: 'warning', ellipsis: true,width:100},
          {title: '备注', key: 'remark', ellipsis: true,width:150},
        ],
        DATA:{        //要提交至归类的数据
          chemicalId:'',
          classifyIds:[]
        },
        getPage:{}
      }
    },
    methods: {
      _rowClassName (row, index) {
        if(row.stock < row.warning){ //归类库存量小于预警库存量
          return 'table-error-row';
        }else{
          return '';
        }
      },
      _page() {
        this.$store.dispatch('LmsChemicalClassify/getExcludePage', this._searchParams()).then(()=>{
          this.loading = false;
          this.getPage = this.$store.state.LmsChemicalClassify.excludePage;
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
        this.$emit('on-result-change',this.selectIds)
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _search() {
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('search-form-no-classify');
        return this.$extend(data, this.pageParams);
      },
      _open(id) {
        this.showMakeClassifyModal = true;
        this.pageParams.chemicalId = id;
        this.DATA.chemicalId = id;
        this._page();
        this.selectIds = [];
      },
      _detailModal(id) {
        this.$store.dispatch('LmsChemicalClassify/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsChemicalClassify.model);
        });
      },
    },
  }
</script>
