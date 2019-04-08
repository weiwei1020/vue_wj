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
            <Col span="24" style="margin-bottom: 15px;margin-top: 15px;">
            <div class="">
              <!--<div class="coll-search-title" @click="_panelChange">
                <div class="coll-search-name">查询条件</div>
                <div>
                  <img src="http://static.patzn.com/img/search-right.png" v-if="!isSearch">
                  <img src="http://static.patzn.com/img/search-down.png" v-else>
                </div>
              </div>-->
              <div class="coll-search" v-show="isSearch">
                <Form id="search-form-chemical-manage" inline onsubmit="return false" :label-width="70">
                  <label class="label-sign"></label>
                  <Form-item class="width-23-2" label="耗材编号:">
                    <Input name="num" placeholder="请输入耗材编号" @on-enter="_formSearch"></Input>
                  </Form-item>
                  <Form-item class="width-23-2" label="耗材名称:">
                    <input name="categoryId" type="hidden"/>
                    <Input name="name" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
                  </Form-item>
                  <Form-item>
                    <Button type="primary" @click="_formSearch">搜索</Button>
                  </Form-item>
                </Form>
              </div>
            </div>
            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 15px;">
            <BtnList :msg="btn" class="cont_hide" @on-result-change="_btnClick"></BtnList>
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
    <!-- 添加、编辑 -->
    <LmsChemicalManageEdit ref="editModal" @on-result-change="_search"></LmsChemicalManageEdit>
    <!-- 库存详情 -->
    <LmsChemicalStock ref="chemicalStockModal" @on-result-change="_searchChemical"></LmsChemicalStock>
    <!--归类-->
    <LmsChemicalStockClassify ref="detailClassifyModal" @on-result-change="_searchChemical"></LmsChemicalStockClassify>
    <!--出入库记录-->
    <LmsChemicalStockUserecord ref="chemicalStockUserecordModal"></LmsChemicalStockUserecord>
    <!--仓库位置-->
    <!--<StoreHoseTree ref="storeModal"></StoreHoseTree>-->
    <!--查看详情-->
    <LmsChemicalDetail ref="chemicalDetailModal"></LmsChemicalDetail>
    <!--导入-->
    <DownloadImportExcel ref="importModal" @on-result-change="_search"></DownloadImportExcel>
    <!--修改记录-->
    <LmsChemicalChangeQuery ref="changeModal"></LmsChemicalChangeQuery>
  </div>
</template>
<script>
  import global from '../../../api/config'
  import LmsChemicalManageEdit from './LmsChemicalManageEdit.vue'
  import UserChemicalCategory from '../../../components/lims/UserChemicalCategory.vue'
  import CategoryTree from '../CategoryTree.vue'
  import LmsChemicalStock from './LmsChemicalStock.vue'
  import LmsChemicalStockClassify from '../lms-chemical-classify/LmsChemicalStockClassify.vue'
  import LmsChemicalStockUserecord from './LmsChemicalStockUserecord.vue'
  import LmsChemicalDetail from './LmsChemicalDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import DownloadImportExcel from '../../../components/import/DownloadImportExcel'
  import LmsChemicalChangeQuery from './LmsChemicalChangeQuery.vue'


  export default {
    components: {
      LmsChemicalManageEdit,
      UserChemicalCategory,
      CategoryTree,
      LmsChemicalStock,
      LmsChemicalStockClassify,
      LmsChemicalStockUserecord,
      LmsChemicalDetail,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
      DownloadImportExcel,
      LmsChemicalChangeQuery,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
          {type: 'error', id: '', name: '删除'},
          {type: '', id: '', name: '导入'},
          {type: '', id: '', name: '导出'},
         //{type: 'success', id: 'chemical-purchase-create', name: '生成采购单'},
        ],
        btnObj: { //按钮权限
          edit: '',
          view: '',
          del: '',
         /* stock: 'chemical-manage-stock', //库存详情
          classify: 'chemical-manage-classify', //归类
          record: 'chemical-manage-record', //使用记录*/
        },
        isSearch: true,
        tableHeight: '300',
        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, fixed: 'left', align: 'center',fixed:'left',},
          {title: '耗材编号', width: 140, key: 'num', ellipsis: true,sortable:'true',fixed:'left'},
          {
            title: '耗材名称', key: 'name', width: 200, align: 'left', ellipsis: true,sortable:'true',fixed:'left',
            render: (h, data) => {

              let operate = [];
              let btnView = h('a', {
                on: {
                  click: () => {
                    this._chemicalDetailModal(data.row.id);
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
          {title: '备注', width: 140, key: 'remark', ellipsis: true},
          {title: '计量单位', width: 120, key: 'unit', ellipsis: true,sortable:'true',},
          {title: '制造厂商', width: 200, key: 'manufacturer', ellipsis: true,sortable:'true',},
          {title: '供应商', width: 200, key: 'supplier', ellipsis: true,sortable:'true',},
          {title: '供应商电话', width: 200, key: 'suppliertel', ellipsis: true,sortable:'true',},
          {title: '供应商邮箱', width: 200, key: 'supplieremil', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 180, fixed: 'right', align: 'center',
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
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
          {type: 'android-document', id: '', name: '修改记录'},
          /*{type: 'filing', id: 'chemical-manage-stock', name: '归类'},
          {type: 'android-document', id: 'chemical-manage-classify', name: '库存详情'},
          {type: 'ios-clock', id: 'chemical-manage-record', name: '出入库记录'},*/
        ],
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
          'margin-left': '230px'
        },
        isTree: true,
        getPage: {},
        treeObj: {},
        contLength: 0,
        noBtnVal: 240,
        btnVal: 270,
        dVal: 70
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '修改记录' :
            this._changeRecord(data.row.id);
            break;
         /* case '归类' :
            this._detaiClassifyModal(data.row.id);
            break;
          case '库存详情' :
            this._chemicalStockModal(data.row);
            break;
          case '出入库记录' :
            this._chemicalStockUserecordModal(data.row.id);
            break;*/
        }
      },
      _contHide() {
        this.contLength = $(".cont_hide").find('button').length;
        this._judgePanel(0);
        this._search();
      },
      _panelChange() { //点击折叠面板
        this.isSearch = !this.isSearch;
        if (this.isSearch) {
          this._judgePanel(1);
        } else {
          this._judgePanel(0);
        }
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
        this.$refs.pageTable._page('search-form-chemical-manage', 'LmsChemical/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _refresh() { //刷新
        $('input[name=categoryId]').val('');
        this._page();
        this.treeObj = {};
      },
      //修改记录
      _changeRecord(id){
        this.$refs.changeModal._open(id);
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemical/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsChemical.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.selectIds = [];
              }
            });
          }
        });
      },
      _deleteById(id) {
        // 删除一条记录
        this._deleteByIds([id]);
      },
      _deleteSelected() {
        // 批量删除
        let ids = this.selectIds;
        if (ids === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsChemical/getById', id).then(() => {
            this.$refs.editModal._open('', this.$store.state.LmsChemical.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open(this.treeObj, '');
        }
      },
      _chemicalDetailModal(chemicalId) {
        // 查看
        this.$store.dispatch('LmsChemical/getById', chemicalId).then(() => {
          this.$refs.chemicalDetailModal._open(this.$store.state.LmsChemical.model);
        });
      },
      _search() {
        this._tree();
        this._page();
      },
      _treeData(data) {
        $('input[name=categoryId]').val(data.id);
        this.treeObj = data;
        this._formSearch();
      },
      _tree() {
        this.$refs.tree._Ztree();
      },
      _chemicalStockModal(data) {
        this.$refs.chemicalStockModal._openStorage(data);
      },
      _detaiClassifyModal(id) {
        this.$refs.detailClassifyModal._open(id);
      },
      _chemicalStockUserecordModal(id) {
        this.$refs.chemicalStockUserecordModal._open(id, '');
      },
      _searchChemical() {
        this._search();
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
          case '添加' :
            this._editModal(false);
            break;
          case '删除' :
            this._deleteSelected();
            break;
          case '导入' :
            this._importModule();
            break;
          case '导出' :
            this._export();
            break;
        }
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
      //导入
      _importModule() {
        let tempData = {
          title:'导入耗材信息',
          importUrl:'/slims/v1/chemical/import',
          downloadUrl:'/slims/v1/excel/template/LmsChemical'
        };
          this.$refs.importModal._open(tempData);
      },
     /* //导出
      _importModule() {
        let tempData = {
          title:'导出耗材信息',
          importUrl:'/slims/v1/chemical/import',
          downloadUrl:'/res/v1/excel/template/LmsChemical'
        };
        this.$refs.importModal._open(tempData);
      },*/
      //excel文件导出部分
      _export() {
        var ids = this.selectIds;
        if (!ids.length) {
         // this._exportTemplate('请选择一条或多条数据！');
          this.$Message.warning('请选择一条或多条数据！');
        }
        /*if (ids === '') {
          this.$Message.warning('请选择一条或多条数据！');
        }*/else {
          this._exportByIds(ids, '确定导出 ' + ids.length + ' 条记录？');
        }
        this.selectIds = [];
      },
      _exportTemplate(content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/chemical/export', '_blank');
          }
        });
      },
      _exportByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/chemical/export?ids=' + ids, '_blank');
           // window.open('http://api.dev.patzn.com:7000/slims/v1/chemical/export?ids=' + ids, '_blank');
          }
        });
      },
    },
  }
</script>
