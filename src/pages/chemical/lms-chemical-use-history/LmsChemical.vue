<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <Col span="24" style="margin-top: -10px;">
            <Form id="search-form1" inline onsubmit="return false" :label-width="70" >
              <label class="label-sign"></label>
              <Form-item class="width-20" label="耗材名称:">
                <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_search"></Input>
              </Form-item>
              <Form-item class="search-btn" style="margin-left: 80px;">
                <Button type="primary" @click="_pageChange(1)">搜索</Button>
              </Form-item>
            </Form>
            </Col>
            <Col span="24" style="margin-bottom: 15px;">
            <div>
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
            </div>
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
    <!-- 详情 -->
    <LmsChemicalUseDetail ref="LmsEquipOrderDetail" @on-result-change="_search"></LmsChemicalUseDetail>
    <!--使用记录-->
    <LmsChemicalUseHistoryDetail ref="detailHistory"></LmsChemicalUseHistoryDetail>
    <!-- 生成归还单 -->
    <LmsChemicalEdit ref="editModal" @on-result-change="_search"></LmsChemicalEdit>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'
  import LmsChemicalUseDetail from './LmsChemicalUseDetail.vue'
  import LmsChemicalEdit from './LmsChemicalEdit.vue'
  import LmsChemicalUseHistoryDetail from './LmsChemicalUseHistoryDetail.vue'

  export default {
    components: {
      IconList,
      BtnList,
      LmsChemicalUseDetail,
      LmsChemicalEdit,
      LmsChemicalUseHistoryDetail
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加到归还单'},
          {id: '', name: '生成归还单'},
          {id: '', name: '移除用尽耗材'},
        ],
        iconMsg: [
          {type: 'compose', id: '', name: '使用记录'},
          {type: 'android-document', id: '', name: '使用历史'},
        ],
        loading: true,
        id:'',
        name: '',
        status: '',
        className:'',
        pname:'',
        tableHeight: '600',
        classId: '',
        selectIds: [],
        selectObj: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '耗材编号', key: 'chemicalNumber', width: 200, align: 'center', ellipsis: true,sortable:'true',},
          {title: '耗材名称', key: 'chemicalName',   align: 'center', ellipsis: true,sortable:'true',},
          {title: '规格', key: 'spec',  width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {title: '领用数量', key: 'stockNumber', width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {title: '剩余量', key: 'surplusQuantity',  align: 'center',width: 150, ellipsis: true,sortable:'true',},
          {
            title: '库存状态', key: 'giveStatus', width: 200, ellipse: true, align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('div', {
                style: {
                  color: row.outStatus === 0 ? 'red' : '#00a0e9'
                },
              }, row.outStatus === 0 ? '未出库' : '已出库');
            }
          },
          {
            title: '操作', key: 'action', width: 120, align: 'center',fixed: 'right',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this.iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res, data)
                      }
                    }
                  },),
                ]);
            }
          },
        ],
        getPage: {},
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
        },
        isTree: true,
        contLength: 0,
        queryStartDate: '',
        queryEndDate: '',
      }
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '使用记录' :
            this._detail(data.row);
            break;
          case '使用历史' :
            this._detailHistory(data.row);
            break;
        }
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加到归还单' :
            this._addSelected();
            break;
          case '生成归还单' :
            this._editModal();
            break;
          case '移除用尽耗材' :
            this._removeIds();
            break;
        }
      },
      _addPurIds(ids) {
        this.$store.dispatch('LmsChemicalUseHistory/addPros', ids).then(() => {
          if (this.$store.state.LmsChemicalUseHistory.success) {
            this.$Message.success('成功加入归还单！');
            this.$refs.selection.selectAll(false);
            this.selectIds = [];
          }
        });
      },
      _addSelected() {      // 批量添加
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._addPurIds(ids);
        }
      },
      _editModal() {
        this.$refs.editModal._open();
      },
      _removeIds(){
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._removeChemical(ids);
        }
      },
      _removeChemical(ids){
        this.$store.dispatch('LmsChemicalUseHistory/removePros', ids).then(() => {
          if (this.$store.state.LmsChemicalUseHistory.success) {
            this.$Message.success('已移除用尽耗材！');
            this.$refs.selection.selectAll(false);
            this.selectIds = [];
            this._page();
          }
        });
      },
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
      _initCont() {
        this.contLength = $(".contHide").find('button').length;
        if (this.contLength) {
          this.tableHeight = this.$newTableHeight('tabBtn');
        } else {
          this.tableHeight = this.$newTableHeight('tabNoBtn');
        }
        this.treeStyleObj.height = document.documentElement.clientHeight - 110 + 'px';
        this._search();
      },
      _refresh() {
        this.classId = '';
        this.name = '';
        this.status = '';
        this.applyTime='';
        this._search();
      },
      _open() {
        this._initCont();
      },
      _page() {
        this.$store.dispatch('LmsChemicalUseHistory/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage =this.$store.state.LmsChemicalUseHistory.page;
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
      _detail(data) {
        this.$refs.LmsEquipOrderDetail._open(data);
      },
      _detailHistory(data){
        this.$refs.detailHistory._open(data);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form1');
        return this.$extend(data, this.pageParams);
      },
      _orderModal() {
        if (this.selectObj.length > 1) {
          this.$Message.warning({
            content: '请选择一条项目',
            duration: 3
          });
        } else if (this.selectObj.length === 0) {
          this.$refs.orderModal._open();
        } else {
          this.$refs.orderModal._addEquip(this.selectObj[0]);
        }
      },
      _changeModal() {
        if (this.selectIds.length > 0) {
          this.$refs.chengeModal._addEquip(this.selectIds);
        } else {
          this.$refs.chengeModal._open();
        }
      },

    },
  }
</script>
<style scoped>
  .ivu-select-dropdown{
    left:80px !important;
  }
</style>
