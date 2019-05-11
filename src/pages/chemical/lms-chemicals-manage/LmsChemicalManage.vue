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
              <div class="coll-search" v-show="isSearch">
                <Form id="search-form-chemical-manage" inline onsubmit="return false" :label-width="70">
                  <label class="label-sign"></label>
                  <Form-item class="width-23-2" label="耗材名称:">
                    <input name="consumable" type="hidden"/>
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
    <!--查看详情-->
    <LmsChemicalDetail ref="chemicalDetailModal"></LmsChemicalDetail>
  </div>
</template>
<script>
  import CategoryTree from '../CategoryTree.vue'
  import LmsChemicalManageEdit from './LmsChemicalManageEdit.vue'
  import LmsChemicalDetail from './LmsChemicalDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      CategoryTree,
      LmsChemicalDetail,
      LmsChemicalManageEdit,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
          // {type: 'error', id: '', name: '删除'},
        ],
        isSearch: true,
        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, fixed: 'left', align: 'center',},
          {title: '耗材编号', width: 140, key: 'num', ellipsis: true,sortable:'true',fixed:'left'},
          {
            title: '耗材名称', key: 'name', width: 200, align: 'left', ellipsis: true,sortable:'true',fixed:'left',
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
          {title: '耗材类别', width: 140, key: 'consumable', ellipsis: true,sortable:'true',},
          {title: '仓库位置', width: 180, key: 'storehouse', ellipsis: true,sortable:'true',},
          {title: '库存量', width: 100, key: 'stock', ellipsis: true,sortable:'true',},
          {title: '备注', width: 140, key: 'remark', ellipsis: true},
          {title: '计量单位', width: 120, key: 'unit', ellipsis: true,sortable:'true',},
          {title: '备注', width: 200, key: 'remark', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 140, fixed: 'right', align: 'center',
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
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('search');
      }
    },
    mounted() {
      this._search();
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
      _page() {
        this.$refs.pageTable._page('search-form-chemical-manage', 'LmsChemicalManage/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _refresh() { //刷新
        $('input[name=consumable]').val('');
        this._page();
        this.treeObj = {};
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalManage/deleteById', ids.join(',')).then(() => {
              if (this.$store.state.LmsChemicalManage.success) {
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
          this.$store.dispatch('LmsChemicalManage/getById', id).then(() => {
            this.$refs.editModal._open('', this.$store.state.LmsChemicalManage.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open(this.treeObj, '');
        }
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsChemicalManage/getById', id).then(() => {
          this.$refs.chemicalDetailModal._open(this.$store.state.LmsChemicalManage.model);
        });
      },
      _search() {
        this._tree();
        this._page();
      },
      _treeData(data) {
        $('input[name=consumable]').val(data.consumableSortName);
        this.treeObj = data;
        this._formSearch();
      },
      _tree() {
        this.$refs.tree._Ztree();
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
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalManage.page;
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
