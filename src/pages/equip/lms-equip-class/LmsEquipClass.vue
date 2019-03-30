<!--仪器类别-->
<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
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
            <Col span="24" style="margin-top: 15px;">
            <Form id="search-form" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item class="width-21" label="类别名称:">
                <Input v-model="name" name="name" placeholder="类别名称" @on-enter="_search"/>
              </Form-item>
              <Form-item class="search-btn">
                <Button type="primary" @click="_search">搜索</Button>
              </Form-item>
            </Form>
            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 15px;">
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
            </Col>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                   stripe
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
    <!-- 添加、编辑 -->
    <LmsEquipClassAdd ref="editModal" @on-result-change="_search"></LmsEquipClassAdd>
    <!-- 查看详情 -->
    <LmsEquipClassDetail ref="detailModal"></LmsEquipClassDetail>
  </div>
</template>
<script>
  import LmsEquipClassAdd from './LmsEquipClassEdit.vue'
  import LmsEquipClassDetail from './LmsEquipClassDetail.vue'
  import LmsEquipClassTree from './LmsEquipClassTree.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import BtnList from '../../../components/base/BtnList.vue'

  export default {
    components: {
      LmsEquipClassAdd,
      LmsEquipClassDetail,
      LmsEquipClassTree,
      BreadCrumbs,
      IconList,
      BtnList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
        ],
        panelVal: '',
        heightSearch: '',
        loading: true,
        tableHeight: '300',
        name: '',
        selectIds: [],
        id: '',
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '类别名', key: 'name', ellipsis: true,sortable:'true',
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
          {title: '上级类别', key: 'pname', ellipsis: true,sortable:'true',},
          {title: '描述', key: 'remark', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 100, fixed: 'right', align: 'center',
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
          'margin-left': '230px' //215
        },
        isTree: true,
        contLength: 0,
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipClass.page;
      }
    },
    mounted() {
      this._classTree();
      this._initCont();
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
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
        }
      },
      _initCont() {
        this.contLength = $(".contHide").find('button').length;
        if (this.contLength) {
          this.tableHeight = this.$newTableHeight('btn');
        } else {
          this.tableHeight = this.$newTableHeight('noBtn');
        }
        this.treeStyleObj.height = document.documentElement.clientHeight - 110 + 'px';
        this._search();
      },
      _refresh() { //刷新
        this.id = '';
        this.name = '';
        this._search();
        this._classTree();
      },
      _page() {
        this.$store.dispatch('LmsEquipClass/page', this._searchParams()).then(() => {
          this.loading = false;
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
        let idList = [];
        for (let i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipClass/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipClass.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.$bus.$emit('class', 'class')
              }
            });
          }
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
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipClass/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipClass.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipClass/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipClass.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        let data = this.$serialize('search-form');
        if (this.name === '') {//刷新时有延迟
          this.$extend(data, {name: this.name});
        }
        if (!this.id) {
          this.$extend(data, {id: 0});
        }else{
          this.$extend(data, {id: this.id});
        }
        return this.$extend(data, this.pageParams);
      },
      _classTree() {
        this.$refs.classTree._Ztree();
      },
      _classData(result, msg) {
        this.id = result;
        this._pageChange(1);
      },

      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '15px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '230px'
      },
    },
  }
</script>
