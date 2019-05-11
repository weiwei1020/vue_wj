<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
          <Row>
            <Col span="24" style="margin-top: 15px;">
              <Form id="search-form" inline onsubmit="return false" :label-width="70">
                <label class="label-sign"></label>
                <Form-item class="width-21" label="类别名称:">
                  <Input v-model="apparatusSortName" placeholder="请输入类别名称" @on-enter="_pageChange(1)"/>
                </Form-item>
                <Form-item class="search-btn">
                  <Button type="primary" @click="_pageChange(1)">搜索</Button>
                </Form-item>
              </Form>

            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 15px;">
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
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
    <!-- 添加、编辑 -->
    <LmsEquipClassEdit ref="editModal" @on-result-change="_search"></LmsEquipClassEdit>
    <!-- 查看详情 -->
    <LmsEquipClassDetail ref="detailModal"></LmsEquipClassDetail>
  </div>
</template>
<script>
  import LmsEquipClassEdit from './LmsEquipClassEdit.vue'
  import LmsEquipClassDetail from './LmsEquipClassDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  export default {
    components: {
      IconList,
      BtnList,
      BreadCrumbs,
      LmsEquipClassEdit,
      LmsEquipClassDetail,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'trash-a', id: '', name: '删除'},
        ],
        loading: true,
        id: '',
        apparatusSortName: '',
        selectIds: [],
        selectObj: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '类别名称', key: 'apparatusSortName', width: 160, align: 'center', ellipsis: true, fixed: 'left', sortable: 'true',
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row.apparatusSortId);
                    }
                  }
                }, data.row.apparatusSortName),
              ]);
            }
          },
          {title: '描述', key: 'apparatusSortRemark', align: 'center', ellipsis: true,},
          {
            title: '操作', key: 'action', width: 160, fixed: 'right', align: 'center',
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
        contLength: 0,
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('tabSearch');
      }
    },
    mounted(){
      this._page();
    },
    methods: {
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.apparatusSortId);
            break;
          case '删除' :
            this._deleteById(data.row.apparatusSortId);
            break;
        }
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
            this.$store.dispatch('LmsEquipClass/deleteByIds', ids.join(',')).then(() => {
              if (this.$store.state.LmsEquipClass.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.$bus.$emit('class', 'class')
              }
            });
          }
        });
      },
      _refresh() { //刷新
        this.apparatusSortName = '';
        this._search();
      },
      _page() {
        this.$store.dispatch('LmsEquipClass/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipClass.page;
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
        var data = this.$serialize('search-form');
        if (this.apparatusSortName !== '') {
          this.$extend(data, {apparatusSortName: this.apparatusSortName.trim()});
        }
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>
