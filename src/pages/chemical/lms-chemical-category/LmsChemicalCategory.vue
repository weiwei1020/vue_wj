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
              <RelCategoryZtree ref="categorytree" @on-result-change="_categoryData"></RelCategoryZtree>
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
            <Col span="24" style="margin-top: 15px">
            <Form id="search-form" inline onsubmit="return false" :label-width="90">
              <label class="label-sign"></label>
              <Form-item class="width-23" label="分类名称:">
                <Input name="name" placeholder="请输入分类名称" @on-enter="_formSearch"></Input>
                <input name="id" type="hidden">
              </Form-item>
              <Form-item class="marleft-90">
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
    <!-- 添加、编辑 -->
    <LmsChemicalCategoryEdit ref="editModal" @on-result-change="_search"></LmsChemicalCategoryEdit>
    <!-- 查看详情 -->
    <LmsChemicalCategoryDetail ref="detailModal"></LmsChemicalCategoryDetail>
    <!--导入-->
    <DownloadImportExcel ref="importModal" @on-result-change="_search"></DownloadImportExcel>
  </div>
</template>
<script>
  import LmsChemicalCategoryEdit from './LmsChemicalCategoryEdit.vue'
  import LmsChemicalCategoryDetail from './LmsChemicalCategoryDetail.vue'
  import RelCategoryZtree from './RelCategoryZtree.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import DownloadImportExcel from '../../../components/import/DownloadImportExcel'

  export default {
    components: {
      LmsChemicalCategoryEdit,
      LmsChemicalCategoryDetail,
      RelCategoryZtree,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
      DownloadImportExcel
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
        //  {type: 'error', id: '', name: '删除'},
          {type: '', id: '', name: '导入'},
        ],
        btnObj: { //按钮权限
          edit: '',
          view: ''
        },
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
        ],
        heightSearch: '',
        tableHeight: '300',
        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '编号', key: 'num', width: 100, ellipsis: true},
          {
            title: '分类名称', key: 'name', width: 140, ellipsis: true,
            render: (h, data) => {
              let operate = [];
              let btnView = h('a', {
                on: {
                  click: () => {
                    this._detailModal(data.row.id);
                  }
                }
              }, data.row.name);
              if (this.$showBtn(this.btnObj.view)) {
                operate.push(btnView);
              }
              return h('div', operate.length > 0 ? operate : data.row.name);
            }
          },
          {title: '上级类别', key: 'parentName', width: 140, ellipsis: true},
          {title: '备注', key: 'remark', ellipsis: true},
          {
            title: '操作', key: 'action', width: 120, fixed: 'right', align: 'center',
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
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
          'margin-left': '230px'
        },
        isTree: true,
        getPage: {},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 90,
        treeObj: {}
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
      _refresh() { //刷新
        $('input[name=id]').val('');
        this._page();
        this.treeObj = {};
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemicalCategory/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsChemicalCategory/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsChemicalCategory.model);
        });
      },
      _deleteById(id) {
        this._deleteByIds([id]);
      },
      _deleteSelected() {
        if (this.selectIds === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(this.selectIds, '确定删除 ' + this.selectIds.length + ' 条记录？');
        }
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalCategory/deleteById', ids).then(() => {
              if (this.$store.state.LmsChemicalCategory.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.$bus.$emit('class', 'class')
              }
            });
          }
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsChemicalCategory/getById', id).then(() => {
            this.$refs.editModal._open('', this.$store.state.LmsChemicalCategory.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open(this.treeObj, '');
        }
      },
      _search() {
        this._categoryTree();
        this._page();
      },
      _selectStatus(data) {
        $('input[name=status]').val(data);
      },
      _categoryTree() {
        this.$refs.categorytree._Ztree();
      },
      _categoryData(data) {
        $('input[name=id]').val(data.id);
        this.treeObj = data;
        this._formSearch();
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
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalCategory.page;
            break;
          default :
            this._page();
        }
      },
      _importModule() {
        let tempData = {
          title:'导入耗材类别信息',
          importUrl:'/slims/v1/chemical_category/import',
          downloadUrl:'/slims/v1/excel/template/LmsChemicalCategory'
        };
        this.$refs.importModal._open(tempData);
      },
    },
  }
</script>

