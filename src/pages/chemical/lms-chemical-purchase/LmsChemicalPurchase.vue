<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-left" :style="treeStyleObj" v-show="isTree">
          <Card dis-hover class="card_tree">
            <p slot="title" style="width: 60%">耗材类别列表</p>
            <p slot="title" style="width: 40%;text-align: right">
              <a @click="_refresh">
                <Icon type="refresh" size="20"></Icon>
              </a>
            </p>
            <div>
              <CategoryTree ref="tree" @on-result-change="_treeData"></CategoryTree>
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
              <Form-item class="width-20" label="耗材编号:">
                <input name="categoryId" type="hidden"/>
                <Input name="num" placeholder="请输入耗材编号" @on-enter="_formSearch"></Input>
              </Form-item>
              <Form-item class="width-20" label="耗材名称:">
                <Input name="name" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
              </Form-item>
             <!-- <Form-item class="width-20" label="耗材类别:">
                <Input name="category" placeholder="请输入耗材类别" @on-enter="_formSearch"></Input>
              </Form-item>-->
              <Form-item>
                <Button type="primary" @click="_formSearch">搜索</Button>
              </Form-item>
            </Form>
            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 15px;">
            <div>
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
            </div>
            </Col>
            <Col span="24" style="margin-bottom: 10px">
            <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                       ref="pageTable" :getPage="getPage">

            </PageTable>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!-- 生成采购单 -->
    <LmsChemicalPurchaseEdit ref="editModal" @on-result-change="_search"></LmsChemicalPurchaseEdit>
    <!--耗材详情-->
    <LmsChemicalDetail ref="chemicalDetailModel"></LmsChemicalDetail>
    <!--添加进采购单-->
    <LmsChemicalPurchaseAdd ref="addModel" @on-result-change="_search"></LmsChemicalPurchaseAdd>
    <!--耗材申请历史记录-->
    <LmsChemicalHistory ref="applyHistory" @on-result-change="_copyByGroupId"></LmsChemicalHistory>
    <!--编辑申请单-->
    <!--<LmsChemicalHistoryEdit ref="editHistory"></LmsChemicalHistoryEdit>-->
    <!--采购新耗材-->
    <LmsChemicalManageEdit ref="editNewModal"  @on-result-change="_search"></LmsChemicalManageEdit>
  </div>
</template>
<script>
  import LmsChemicalPurchaseEdit from './LmsChemicalPurchaseEdit.vue'
  import CategoryTree from '../CategoryTree.vue'
  import LmsChemicalDetail from './LmsChemicalDetail.vue'
  import LmsChemicalPurchaseAdd from './LmsChemicalPurchaseAdd.vue'
  import LmsChemicalHistory from './LmsChemicalHistory.vue'
  // import LmsChemicalHistoryEdit from './LmsChemicalHistoryEdit.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import LmsChemicalManageEdit from './LmsChemicalManageEdit.vue'


  export default {
    components: {
      LmsChemicalPurchaseEdit,
      CategoryTree,
      LmsChemicalDetail,
      LmsChemicalPurchaseAdd,
      LmsChemicalHistory,
      // LmsChemicalHistoryEdit,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
      LmsChemicalManageEdit,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加到采购单'},
          // {type: 'success', id: '', name: '采购新耗材'},
          {id: '', name: '生成采购单'},
          {id: '', name: '历史申请信息'},
        ],
        btnObj: { //按钮权限
          add: '',
          view: ''
        },
        iconMsg:[
          // {type:'plus-round',id:'',name:'添加'},
        ],
        heightSearch: '',
        tableHeight: '300',
        showInputNumber: false,
        inputNum: 1,
        numObj: {
          id: '',
          quantity: '',
          name: ''
        },
        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, fixed: 'left', align: 'center'},
          {title: '耗材编号', width: 140, key: 'num', ellipsis: true,sortable:'true',},
          {
            title: '耗材名称', key: 'name', width: 140, align: 'left', ellipsis: true,sortable:'true',
            render: (h, data) => {
              let operate = [];
              let btnView = h('a', {
                on: {
                  click: () => {
                    this._detailChemicalModal(data.row.id);
                  }
                }
              }, data.row.name);
              if (this.$showBtn(this.btnObj.view)) {
                operate.push(btnView);
              }
              return h('div', operate.length > 0 ? operate : data.row.name);
            }
          },
          {title: '耗材类别', width: 140, key: 'category', ellipsis: true,sortable:'true',},
          {title: '仓库位置', width: 180, key: 'storehouse', ellipsis: true,sortable:'true',},
          {title: '库存量', width: 100, key: 'stock', ellipsis: true,sortable:'true',},
          {title: '计量单位', width: 120, key: 'unit', ellipsis: true,sortable:'true',},
          {title: '制造厂商', width: 200, key: 'manufacturer', ellipsis: true,sortable:'true',},
          {title: '供应商', width: 200, key: 'supplier', ellipsis: true,sortable:'true',},
          {title: '备注', width: 140, key: 'remark', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 70, fixed: 'right',align:'center',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this. iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res,data)
                      }
                    }
                  },),
                ]);
            }
          },
        ],
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
         'margin-left': '215px'
        },
        isTree: true,
        categoryId: '',
        getPage: {},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 90
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _iconClick(res,data){
        switch (res){
          case '添加' :
            this._addModal(data.row.id, data.row.name, data.row.spec);
            break;
        }
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._search();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        this.treeStyleObj.height = document.documentElement.clientHeight - 110 + 'px';
        switch (this.contLength) {
          case 0 :
            this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
            break;
          default:
            this.tableHeight = this.$tableHeight(val, this.btnVal, this.dVal);
        }
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemical/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _refresh() { //刷新
        $('input[name=categoryId]').val('');
        this._page();
        this._page();
      },
      _addPurIds(ids) {
        this.$store.dispatch('LmsChemicalPurchase/addPros', ids).then(() => {
          if (this.$store.state.LmsChemicalPurchase.success) {
            this.$Message.success('成功加入采购单！');
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
      _search() {
        this._tree();
        this._page();
      },
      _treeData(data) {
        $('input[name=categoryId]').val(data.id);
        this._formSearch();
      },
      _tree() {
        this.$refs.tree._Ztree();
      },
      // 申请历史记录窗口
      _applyHistory() {
        this.$refs.applyHistory._open();
      },
      //历史申请单
      _copyByGroupId(data) {
        this._editHistoryModal(data);
      },
      // 编辑历史记录
      _editHistoryModal(groupId) {
        this.$refs.editHistory._open(groupId, true);
      },
      _detailChemicalModal(id) {
        // 查看
        this.$store.dispatch('LmsChemical/getById', id).then(() => {
          this.$refs.chemicalDetailModel._open(this.$store.state.LmsChemical.model);
        });
      },
      _addModal(id, name, spec) {
        this.$refs.addModel._open(id, name, spec);
      },
      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '15px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '215px'
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加到采购单' :
            this._addSelected();
            break;
          case '采购新耗材' :
            this._addNewChemical();
            break;
          case '生成采购单' :
            this._editModal();
            break;
          case '历史申请信息' :
            this._applyHistory();
            break;
        }
      },
      _addNewChemical(){
        this.$refs.editNewModal._open();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemical.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
