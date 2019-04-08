<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
       <!-- <div class="position-left" :style="treeStyleObj" v-show="isTree">
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
        </div>-->
        <div class="position-right"  :style="tableStyleObj">
          <Row>
            <!--查询-->
            <Col span="24" style="margin-top: 10px">
            <Form id="search-form" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item class="width-20" label="耗材编号:">
                <Input name="chemicalNum" placeholder="请输入耗材编号" @on-enter="_formSearch"></Input>
              </Form-item>
              <Form-item class="width-20" label="耗材名称:">
                <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
              </Form-item>
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
    <!-- 生成申请单 -->
    <LmsChemicalApplyEdit ref="editModal" @on-result-change="_search"></LmsChemicalApplyEdit>
    <!--耗材详情-->
    <LmsChemicalApplyDetail ref="chemicalDetailModel"></LmsChemicalApplyDetail>
    <!--添加进申请单-->
    <LmsChemicalRelApplyEdit ref="addModel" @on-result-change="_search"></LmsChemicalRelApplyEdit>
    <!--编辑申请单-->
    <!--<LmsChemicalHistoryEdit ref="editHistory"></LmsChemicalHistoryEdit>-->
  </div>
</template>
<script>
  import LmsChemicalApplyEdit from './LmsChemicalApplyEdit.vue'
  import LmsChemicalRelApplyEdit from './LmsChemicalRelApplyEdit.vue'
  import CategoryTree from '../CategoryTree.vue'
  import LmsChemicalApplyDetail from './LmsChemicalApplyDetail.vue'
  //import LmsChemicalApplyAdd from './LmsChemicalApplyAdd.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'


  export default {
    components: {
      LmsChemicalApplyEdit,
      LmsChemicalRelApplyEdit,
      CategoryTree,
      LmsChemicalApplyDetail,
    //  LmsChemicalApplyAdd,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加到申请单'},
          {id: '', name: '生成申请单'},
        ],
        btnObj: {
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
          {title: '耗材编号', width: 140, key: 'chemicalNum', ellipsis: true,sortable:'true',},
          {title: '耗材名称', width: 140, key: 'chemicalName', ellipsis: true,sortable:'true',},
          {title: '库存量', width: 140, key: 'stock', ellipsis: true,sortable:'true',},
          {title: '规格', width: 140, key: 'spec', ellipsis: true,sortable:'true',},
          {title: '申请数量', key: 'quantity', ellipsis: true,sortable:'true',},
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
       /* tableStyleObj: {
          'margin-left': '215px'
        },*/
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
            this._addModal(data.row.id, data.row.chemicalName);
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
        this.$refs.pageTable._page('search-form', 'LmsChemicalApply/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _refresh() { //刷新
        $('input[name=categoryId]').val('');
        this._page();
      },
      _addPurIds(ids) {
        this.$store.dispatch('LmsChemicalApply/addPros', ids).then(() => {
          if (this.$store.state.LmsChemicalApply.success) {
            this.$Message.success('成功加入领用申请单！');
            this.$refs.selection.selectAll(false);
            this.selectIds = [];
          }
        });
      },
      _addSelected() {
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
      //  this._tree();
        this._page();
      },
      _treeData(data) {
        $('input[name=categoryId]').val(data.id);
        this._formSearch();
      },
      _tree() {
        this.$refs.tree._Ztree();
      },
      _detailChemicalModal(id) {
        // 查看
        this.$store.dispatch('LmsChemicalApply/getById', id).then(() => {
          this.$refs.chemicalDetailModel._open(this.$store.state.LmsChemical.model);
        });
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
        this.tableStyleObj.marginLeft = '215px'
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加到申请单' :
            this._addSelected();
            break;
          case '生成申请单' :
            this._editModal();
            break;
        }
      },
      _addNewChemical(){
        this.$refs.editNewModal._open();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
           this.getPage=this.$store.state.LmsChemicalApply.page;
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
