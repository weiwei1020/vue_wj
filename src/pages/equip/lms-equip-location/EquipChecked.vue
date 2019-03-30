<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <Col span="24" style="margin-top: -10px;">

            <Form id="search-form" inline onsubmit="return false" :label-width="70" >
              <label class="label-sign"></label>
              <Form-item class="search-item" label="申请时间:">
                <DatePicker type="datetimerange" placement="bottom-start" placeholder="请选择申请时间"
                            style="width:100%;" @on-change="_getDate"></DatePicker>
                <input type="hidden" name="queryStartDate" v-model="queryStartDate">
                <input type="hidden" name="queryEndDate" v-model="queryEndDate">
              </Form-item>
              <Form-item class="search-btn" style="margin-left: 80px;">
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
    <!-- 详情 -->
    <LmsEquipOrderDetail ref="LmsEquipOrderDetail"></LmsEquipOrderDetail>
    <!--电子文档-->
    <LmsEquipInfoRecord ref="docModal"></LmsEquipInfoRecord>
    <!--上级类别弹出树-->
   <!-- <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>-->

  </div>
</template>
<script>
 // import LmsEquipClassTree from './LmsEquipClassTree.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'
  import LmsEquipOrderDetail from './LmsEquipOrderDetail.vue'

  export default {
    components: {
      IconList,
      BtnList,
     // LmsEquipClassTree,
      LmsEquipOrderDetail,
    },
    data() {
      return {
        iconMsg: [
          /*{type: 'reply', id: '', name: '撤回'},*/
         // {type: 'close', id: 'equip-order-delete', name: '删除'},
          {type: 'android-document', id: '', name: '详细信息'},
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
          {title: '意见', key: 'advice', width: 250, align: 'center', ellipsis: true,sortable:'true',},
          {title: '仪器名称', key: 'names',  align: 'center', ellipsis: true,sortable:'true',},
          {title: '申请时间', key: 'applyTime', width: 200, align: 'center', ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '审批人', key: 'auditName', width: 100, align: 'center', ellipsis: true,sortable:'true',},
          {title: '审批时间', key: 'auditTime', width: 200, align: 'center', ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.auditTime ? this.$dateformat(params.row.auditTime, "yyyy-mm-dd HH:MM:ss") : '');
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
          //'margin-left': '215px',
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
          case '撤回' :
            this._recall(data.row.groupId);
            break;
          case '详细信息' :
            this._detail(data.row.groupId);
            break;

        }
      },
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
      _recall(id){
        this.$Modal.confirm({
          title: '提示',
          content : '确定撤回该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipLocation/recallByGroupId', id).then(() => {
              if (this.$store.state.LmsEquipLocation.success) {
                this._page();
                this.$Message.success('撤回成功！');
                this.selectIds = [];
              }
            });
          }
        });
      },
     /* _editModal(id) {
        this.$refs.LmsEquipOrderDetail._open(id);
      },*/
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
      _refresh() { //刷新
        this.classId = '';
        this.name = '';
        this.status = '';
        this.applyTime='';
        this._search();
       // this._classTree();
      },
      _open() {
        this._initCont();
      //  this._classTree();
      },
      _page() {
        this.$store.dispatch('LmsEquipLocation/auditPage', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipLocation.page;
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
      _detail(id) {
        // 查看
       /* this.$store.dispatch('LmsEquipLocation/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipInfo.model);
        });*/
        this.$refs.LmsEquipOrderDetail._open(id);
      },
     /* _editModal(id) {
        this.$refs.LmsEquipOrderDetail._open(id);
      },*/
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        data.status='TECHNOLOGY_CHECK_PASS';
        data.queryStartDate=this.queryStartDate;
        data.queryEndDate=this.queryEndDate;
        return this.$extend(data, this.pageParams);
      },
     /* _classTree() {
        this.$refs.classTree._Ztree();
      },
      _classData(result, msg) {
        this.classId = result.id;
        this._pageChange(1);
      },*/
     /* _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '20px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '215px'
      },*/
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
      /*_selectZtree() {
        if (this.$string(this.id).isEmpty()){
          this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        }else{
          this.$refs.ztreeModal._openZtree(this.formObj.pid);  //打开上ztreeModel
        }
      },
      _ztree(result) {
        this.pname = '';
        if (result === undefined) {
          this.formObj.pid = '0';
          this.pname = '';
        } else {
          this.formObj.pid = result.id;
          this.pname = result.name;
        }

      },*/
    },
  }
</script>
<style scoped>
  .ivu-select-dropdown{
    left:80px !important;
  }
</style>
