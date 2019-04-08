<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <Col span="9">
          <Row>
            <!--查询-->
            <Col span="24" style="margin-top: 20px">
                <Form id="search-form" inline onsubmit="return false" :label-width="70">
                  <label class="label-sign"></label>
                  <Form-item label="归类名称:" style="width:50%">
                    <Input name="name" placeholder="请输入归类名称" @on-enter="_pageChange(1)"></Input>
                  </Form-item>
                  <Form-item class="marleft-70">
                    <Button type="primary" @click="_pageChange(1)">搜索</Button>
                  </Form-item>
                </Form>
            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 10px;">
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
            </Col>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border highlight-row disabled-hover
                   :height="tableHeight"
                   class="tableClassName" ref="currentRowTable" @on-current-change="_rowChange"
                   :row-class-name="_rowClassName"></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                  @on-page-size-change='_pageSizeChange'
                  placement="top" show-total></Page>
            </Col>
          </Row>
          </Col>
          <Col span="15">
          <!-- 查看产品详情 -->
          <LmsClassifyChemicalLook ref="classifyChemicalLook" @on-result-change="_search"></LmsClassifyChemicalLook>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 添加、编辑 -->
    <LmsChemicalClassifyEdit ref="editModal" @on-result-change="_search"></LmsChemicalClassifyEdit>
    <!-- 查看详情 -->
    <LmsChemicalClassifyDetail ref="detailModal"></LmsChemicalClassifyDetail>
  </div>
</template>
<script>
  import LmsChemicalClassifyEdit from './LmsChemicalClassifyEdit.vue'
  import LmsChemicalClassifyDetail from './LmsChemicalClassifyDetail.vue'
  import LmsClassifyChemicalLook from './LmsClassifyChemicalLook.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  export default {
    components: {
      LmsChemicalClassifyEdit,
      LmsChemicalClassifyDetail,
      LmsClassifyChemicalLook,
      BtnList,
      IconList,
      BreadCrumbs
    },
    data() {
      return {
        btn:[
          {type:'success',id:'chemical-classify-add',name:'添加'},
        ],
        panelVal:'',
        keyword:'',
        loading: true,
        heightSearch: '',
        tableHeight: '300',
        pageParams: {
          rows: 20,

        },
        pageColumns: [
          {
            title: '归类名称', key: 'name', align: 'left', ellipsis: true, width: 150,
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
          {title: '归类库存量', width: 120, key: 'stock', ellipsis: true},
          {title: '计量方式', width: 120, key: 'unit', ellipsis: true},
          {title: '预警库存量', key: 'warning', ellipsis: true,width: 100},
          {title: '消息通知', key: 'inform',width: 115,
            render: (h, params) => {
              let text = '开启', color = 'green';
              if (params.row.inform == 0) {
                text = '关闭';
                color = 'yellow';
              }
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {title: '备注', key: 'remark', ellipsis: true,width: 120},
          {
            title: '操作', key: 'action', width: 100, fixed: 'right',align:'center',
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
        iconMsg:[
          {type:'edit',id:'chemical-classify-edit',name:'编辑'},
          {type:'close',id:'chemical-classify-del',name:'删除'},
        ],
        getPage:{},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 57
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {

      _iconClick(res,data){
        switch (res){
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
        this._page();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        switch (this.contLength) {
          case 0 :
            this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
            break;
          default:
            this.tableHeight = this.$tableHeight(val, this.btnVal, this.dVal);
        }
      },
      _rowClassName (row, index) {
        if(row.stock < row.warning){ //归类库存量小于预警库存量
          return 'table-error-row';
        }else{
          return '';
        }
      },
      _tableHeight(val) {
        this.panelVal = val;
        this.tableHeight = document.documentElement.clientHeight -this.panelVal;
      },
      _page() {
        this.$store.dispatch('LmsChemicalClassify/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsChemicalClassify.page;
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
      _deleteById(id) {
        // 删除一条记录
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalClassify/deleteById', id).then(() => {
              if (this.$store.state.LmsChemicalClassify.success) {
                this._search();
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsChemicalClassify/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsChemicalClassify.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsChemicalClassify/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsChemicalClassify.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
      },
      _search() {
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        return this.$extend(data, this.pageParams);
      },
      _rowChange(currentRow, oldCurrentRow) { //选中当前行数据
        this.$refs.classifyChemicalLook._open(currentRow.id);
      },
      _btnClick(msg){
        switch (msg){
          case '添加' :
            this._editModal(false);
            break;
        }
      },
    },
  }
</script>
