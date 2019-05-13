<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
          <Row>
            <!--查询-->
            <Col span="24">
            <Form id="search-form" inline onsubmit="return false" :label-width="90">
              <label class="label-sign"></label>
              <Form-item class="width-23" label="分类名称:">
                <Input name="consumableSortName" placeholder="请输入分类名称" @on-enter="_formSearch"></Input>
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
    <!-- 添加、编辑 -->
    <LmsChemicalCategoryEdit ref="editModal" @on-result-change="_search"></LmsChemicalCategoryEdit>
    <!-- 查看详情 -->
    <LmsChemicalCategoryDetail ref="detailModal"></LmsChemicalCategoryDetail>
  </div>
</template>
<script>
  import LmsChemicalCategoryEdit from './LmsChemicalCategoryEdit.vue'
  import LmsChemicalCategoryDetail from './LmsChemicalCategoryDetail.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsChemicalCategoryEdit,
      LmsChemicalCategoryDetail,
      PageTable,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
        //  {type: 'error', id: '', name: '删除'},
        ],
        btnObj: { //按钮权限
          edit: '',
          view: ''
        },
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
        ],
        selectIds: [],
        consumableSortName:'',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '编号', key: 'consumableSortNumber', width: 200, ellipsis: true},
          {
            title: '分类名称', key: 'consumableSortName', width: 240, ellipsis: true,
            render: (h, data) => {
              let operate = [];
              let btnView = h('a', {
                on: {
                  click: () => {
                    this._detailModal(data.row.consumableSortId);
                  }
                }
              }, data.row.consumableSortName);
              if (this.$showBtn(this.btnObj.view)) {
                operate.push(btnView);
              }
              return h('div', operate.length > 0 ? operate : data.row.consumableSortName);
            }
          },
          {title: '备注', key: 'consumableSortRemark', ellipsis: true},
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
        getPage: {},
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
            this._editModal(true, data.row.consumableSortId);
            break;
          case '删除' :
            this._deleteById(data.row.consumableSortId);
            break;
        }
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
            this.$store.dispatch('LmsChemicalCategory/deleteById', ids.join(',')).then(() => {
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
            this.$refs.editModal._open(this.$store.state.LmsChemicalCategory.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
      },
      _search() {
        this._page();
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
            this.getPage = this.$store.state.LmsChemicalCategory.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
<style>
  a {
     color: #007bff !important;
     text-decoration: none;
     background-color: transparent;
    -webkit-text-decoration-skip: objects;
  }
</style>

