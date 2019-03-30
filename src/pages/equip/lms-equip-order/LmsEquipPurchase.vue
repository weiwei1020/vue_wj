<template>
  <div>
    <!--&lt;!&ndash; 面包屑 &ndash;&gt;
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>-->
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-left" :style="treeStyleObj" v-show="isTree">
          <Card dis-hover class="card_tree">
            <p slot="title" style="width: 60%">仪器类别列表</p>
            <p slot="title" style="width: 40%;text-align: right">
              <a @click="_refresh">
                <Icon type="refresh" size="20"></Icon>
              </a>
            </p>
            <div>
              <LmsEquipClassTree ref="classTree" @on-result-change="_classData"></LmsEquipClassTree>
            </div>
          </Card>
        </div>
        <div style="position: absolute;left: 196px;top: 50%;cursor:pointer" @click="_treeHide" v-if="isTree">
          <div class="navbarImgShow"></div>
        </div>
        <div style="position: absolute;left:0;top: 50%;cursor:pointer" @click="_treeShow" v-else="isTree">
          <div class="navbarImgHide"></div>
        </div>
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <!--查询-->
            <Col span="24" style="margin-top: 10px">
              <Form id="search-form" inline onsubmit="return false" :label-width="70">
                <label class="label-sign"></label>
                <Form-item class="width-21" label="仪器名称:">
                  <Input v-model="name" placeholder="请输入仪器名称" @on-enter="_pageChange(1)"/>
                </Form-item>
                <!--<Form-item class="width-21" label="仪器类别:">
                  <Input name="pname" v-model="pname" placeholder="请选择仪器类别" @click.native="_selectZtree" icon="plus-circled"
                         readonly></Input>
                </Form-item>-->
              <!--  <Form-item class="width-21" prop="status" label="状态:">
                  <Select v-model="status" clearable placeholder="请选择状态">
                    <Option value="0">闲置</Option>
                    <Option value="1">在用</Option>
                  </Select>
                </Form-item>-->
                <Form-item class="search-btn">
                  <Button type="primary" @click="_pageChange(1)">搜索</Button>
                </Form-item>
              </Form>
            </Col>
            <!--操作-->
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
    <!-- 生成申请单 -->
    <LmsEquipPurchaseEdit ref="editModal" @on-result-change="_search"></LmsEquipPurchaseEdit>
    <!-- 编辑申请单 -->
    <LmsEquipOrderEditDraft ref="editHistoryModal"></LmsEquipOrderEditDraft>
    <!--仪器详情-->
    <LmsEquipInfoDetail ref="detailModal"></LmsEquipInfoDetail>
    <!--仪器申请历史记录-->
    <LmsEquipApplyHistory ref="applyHistory" @on-result-change="_copyByGroupId"></LmsEquipApplyHistory>
    <!--上级类别弹出树-->
    <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>
    <!--排程图-->
    <LmsEquipSchedule ref="scheduleModal"></LmsEquipSchedule>
  </div>
</template>
<script>
  import LmsEquipPurchaseEdit from './LmsEquipPurchaseEdit.vue'
  import LmsEquipOrderEditDraft from './LmsEquipOrderEditDraft.vue'
  import LmsEquipClassTree from './LmsEquipClassTree.vue'
  import LmsEquipClassZTree from './LmsEquipClassZTree.vue'
  import LmsEquipInfoDetail from './LmsEquipInfoDetail.vue'
  import LmsEquipApplyHistory from './LmsEquipApplyHistory.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import LmsEquipSchedule from './LmsEquipSchedule'


  export default {
    components: {
      LmsEquipPurchaseEdit,
      LmsEquipOrderEditDraft,
      LmsEquipClassTree,
      LmsEquipClassZTree,
      LmsEquipInfoDetail,
      LmsEquipApplyHistory,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
      LmsEquipSchedule
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加到预约单'},
          {id: '', name: '生成预约单'},
          {id: '', name: '历史申请信息'},
        ],
        btnObj: { //按钮权限
          add: 'chemical-purchase-add',
          view: 'chemical-purchase-view'
        },
        heightSearch: '',
        tableHeight: '300',
        showInputNumber: false,
        inputNum: 1,
        numObj: {
          id: '',
          quantity: '',
          name: ''
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          /*{
            title: '状态', key: 'status', width: 80, ellipsis: true,sortable:'true',
            render: (h, data) => {
              var status = {"0": "闲置", "1": "在用", "2": "保养中", "3": "维修中", "4": "已报废"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 2 || data.row.status === 3 ? '#6FBA2C' : data.row.status === 0 ? '#00a0e9' : data.row.status === 1 ? '#F8BB2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },*/
          {title: '仪器编号', key: 'equipNum', width: 300, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '仪器名称', key: 'name', width: 300, align: 'center', ellipsis: true,sortable:'true',
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row);
                    }
                  }
                }, data.row.name),
              ]);
            }
          },
          {title: '仪器类别', key: 'className', width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {title: '供应商名称', key: 'supplierId', width: 200, align: 'center', ellipsis: true,sortable:'true',},
          {title: '仪器品牌', key: 'brand', width: 200, align: 'center', ellipsis: true,sortable:'true',},
          {title: '仪器价格', key: 'price', width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '购买日期', key: 'buyDate', "width": 200, ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.buyDate ? this.$dateformat(params.row.buyDate, "yyyy-mm-dd") : '');
            }
          },
          {title: '备注', key: 'remark', width: 200, align: 'center', ellipsis: true,},
        ],
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
         'margin-left': '230px'
        },
        isTree: true,
        categoryId: '',
        getPage: {},
        contLength: 0,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 90,
        loading :true,
        name: '',
        status: '',
        className:'',
        classId: '',
        selectIds: [],
        selectObj: [],
        pname:'',
        pid:'',
        id:'',
        pageParams: {
          rows: 20,
        },
      }
    },
    methods: {
      _iconClick(res,data){
        switch (res){
          case '添加' :
            this._addModal(data.row.id, data.row.name);
            break;
        }
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
      _refresh() { //刷新
        this.classId = '';
        this.name = '';
        this.status = '';
        this._search();
        this._classTree();
      },
      _open() {
        this._initCont();
        this._classTree();
      },
      _page() {
        this.$store.dispatch('LmsEquipInfo/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipInfo.page;
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
        var data = this.$serialize('search-form');
        if (this.name !== '') {
          this.$extend(data, {name: this.name.trim()});
        }
        if (this.status !== '') {
          this.$extend(data, {status: this.status});
        }
        if (this.classId != null && this.classId !== '') {
          this.$extend(data, {classId: this.classId});
        }
        return this.$extend(data, this.pageParams);
      },
      _classTree() {
        this.$refs.classTree._Ztree();
      },
      _classData(result, msg) {
        this.classId = result;
        this._pageChange(1);
      },
      _addPurIds(ids) {
        this.$store.dispatch('LmsEquipOrder/addPros', ids).then(() => {
          if (this.$store.state.LmsEquipOrder.success) {
            this.$Message.success('成功加入申请单！');
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
      // 编辑历史记录
      _editHistoryModal(groupId) {
        this.$refs.editHistoryModal._open(groupId, true);
      },
      // 申请历史记录窗口
      _applyHistory() {
        this.$refs.applyHistory._open();
      },
      _copyByGroupId(data) {
        this._editHistoryModal(data);
      },
      _detailModal(data) {
       /* // 查看
        this.$store.dispatch('LmsEquipInfo/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipInfo.model);
        });*/
       //查看排程
        this.$refs.scheduleModal._initForm(data);
      },
      _addModal(id, name) {
        this.$refs.addModel._open(id, name);
      },
      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '15px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '230px'
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加到预约单' :
            this._addSelected();
            break;
          case '生成预约单' :
            this._editModal();
            break;
          case '历史申请信息' :
            this._applyHistory();
            break;
        }
      },
      _selectZtree() {
        if (this.$string(this.id).isEmpty()){
          this.$refs.ztreeModal._openZtree();
        }else{
          this.$refs.ztreeModal._openZtree(this.formObj.pid);
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
      },
    },
  }
</script>
