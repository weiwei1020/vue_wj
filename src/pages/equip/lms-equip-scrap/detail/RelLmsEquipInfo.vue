<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="1000">
      <p slot="header">选择仪器</p>
      <!--内容-->
        <div>
          <Row>
            <Col span="24">
            <Collapse style="margin-bottom: 10px;"  class="coll-search">
              <Panel >查询条件
                <p slot="content">
                <Form id="equipInfo-search-form" inline onsubmit="return false" :label-width="90" >
                  <Form-item  class="width-23" label="仪器名称:" style="margin-bottom: 0">
                    <Input name="name" placeholder="请输入仪器名称"  @on-enter="_search"></Input>
                  </Form-item>
                  <Form-item class="marleft-90">
                    <Button type="primary" @click="_search">搜索</Button>
                  </Form-item>
                </Form>
                </p>
              </Panel>
            </Collapse>
             </Col>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px">
            <Table  :columns="pageColumns" :data="getPage.records" size="small" disabled-hover
                    border highlight-row :height="300" @on-current-change="_rowChange"  ref="currentRowTable"
                    class="tableClassName" @on-row-dblclick="_dbRowChange"></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current"  @on-change="_pageChange" @on-page-size-change='_pageSizeChange'
                  placement="top" show-elevator show-total show-sizer></Page>
            </Col>
          </Row>
        </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  var dateFormat = require('dateformat');

  export default {
    data() {
      return {
        keyword:'',
        showEditModal:false,
        currentRowObj:{},
        pageParams: {
          rows: 20,

        },
        pageColumns: [
          {type: 'index', title:'序号',width: 60, align: 'center',fixed:'left'},
          {
           /* title: '仪器状态', key: 'status',  "width": 160, "ellipsis": true,*/
            render: (h, params) => {
              var status = {"0": "闲置", "1": "在用", "2": "保养中", "3": "维修中", "4": "已报废"};
              return status[params.row.status] ? status[params.row.status] : ''
            }
          },
          {title: '供应商名称', key: 'supplierName', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '仪器类别', key: 'className', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '仪器名称', key: 'name', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '规格型号', key: 'spec', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '仪器品牌', key: 'brand', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '仪器编号', key: 'equipNum', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '证书编号', key: 'ceNum', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '实验室编号', key: 'labNum', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '使用科别', key: 'departmentName', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '使用地点', key: 'locationName', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {title: '检定周期（月）', key: 'period', "sortable": true,ellipsis: true,width: 160, align: 'center'},
          {
            title: '购买日期', key: 'buyDate', "width": 160,
            render: (h, params) => {
              return h('div', dateFormat(params.row.buyDate, "yyyy-mm-dd"));
            }
          },
          {
            title: '有效日期', key: 'effectDate', "width": 160,
            render: (h, params) => {
              return h('div', dateFormat(params.row.effectDate, "yyyy-mm-dd"));
            }
          },
        ],
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipInfo.page
      }
    },
    methods: {
      _open(){
        this.showEditModal = true;
        this._page();
        this._clearCurrentRow();     //清除选中的仪器
      },
      _page() {
        this.$store.dispatch('LmsEquipInfo/page', this._searchParams());
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
      _rowChange(currentRow){ //选中当前行数据
        this.currentRowObj = currentRow;
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('equipInfo-search-form');
        return this.$extend(data, this.pageParams);
      },
      _cancel(){
        this.showEditModal = false;
      },
      _ok(){
        this.$emit("on-result-change", this.currentRowObj);
        this.showEditModal = false;
      },
      _clearCurrentRow(){
        this.$refs.currentRowTable.clearCurrentRow();
      },
      _dbRowChange(data,index){ //双击
        this.currentRowObj = data;
        this._ok();
      },
    },
  }
</script>
