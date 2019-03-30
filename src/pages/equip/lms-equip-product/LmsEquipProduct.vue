<!--仪器产品-->
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
            <Col span="24" class="martop-20">
                <Form id="search-form" inline onsubmit="return false" :label-width="80">
                  <label class="label-sign"></label>
                  <Form-item class="width-21" label="产品名:">
                    <Input v-model="name" name="name" placeholder="请输入产品名" @on-enter="_pageChange(1)"/>
                  </Form-item>
                  <Form-item class="width-21" label="供应商名称:">
                    <Input  name="supplierName" placeholder="请输入供应商名称" @on-enter="_pageChange(1)"/>
                  </Form-item>
                  <Form-item class="width-21" label="生产商:">
                    <Input  name="productPlace" placeholder="请输入生产商" @on-enter="_pageChange(1)"/>
                  </Form-item>
                  <Form-item class="search-btn">
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
            <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
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
    <LmsEquipProductAdd ref="editModal" @on-result-change="_search"></LmsEquipProductAdd>
    <!-- 查看详情 -->
    <LmsEquipProductDetail ref="detailModal"></LmsEquipProductDetail>
  </div>
</template>
<script>
  import global from '../../../api/config'
  import LmsEquipProductAdd from './LmsEquipProductEdit.vue'
  import LmsEquipProductDetail from './LmsEquipProductDetail.vue'
  import LmsEquipClassTree from './LmsEquipClassTree.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import BtnList from '../../../components/base/BtnList.vue'

  export default {
    components: {
      LmsEquipProductAdd,
      LmsEquipProductDetail,
      LmsEquipClassTree,
      BreadCrumbs,
      IconList,
      BtnList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-product-add', name: '添加'},
          {
            type: '', id: 'equip-product-import', name: '导入', upload: true,
            action: global.baseURL + '/slims/v1/equip_product/import'
          },
          {type: '', id: 'equip-product-export', name: '导出'},
        ],
        btnObj: { //按钮权限
          edit: 'equip-product-edit',
        },
        iconMsg: [
          {type: 'edit', id: 'equip-product-edit', name: '编辑'},
        ],
        loading: true,
        tableHeight: '300',
        name: '',
        classId: '',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '产品名称', key: 'name',  ellipsis: true, width: 160, align: 'center', fixed: 'left',
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
          {title: '仪器类别', key: 'className', ellipsis: true, width: 160, align: 'center'},
          {title: '供应商名称', key: 'supplierName',  ellipsis: true, width: 160, align: 'center'},
          {title: '生厂商', key: 'productPlace',  ellipsis: true, width: 160, align: 'center'},
          {title: '品牌', key: 'brand',  ellipsis: true, width: 160, align: 'center'},
          {title: '规格型号', key: 'spec',  ellipsis: true, width: 160, align: 'center'},
          {title: '使用范围', key: 'range',  ellipsis: true, width: 160, align: 'center'},
          {title: '不确定度', key: 'uncertainty',  ellipsis: true, width: 160, align: 'center'},
          {title: '精度', key: 'accuracy',  ellipsis: true, width: 160, align: 'center'},
          {title: '计量类别', key: 'meterType',  ellipsis: true, width: 160, align: 'center'},
          {
            title: '报价', key: 'price',  ellipsis: true, width: 160, align: 'center',
            render: (h, data) => {
              if (data.row.price === undefined) {
                return h('div', '');
              } else {
                return h('div', parseFloat(data.row.price).toFixed(2));
              }
            }
          },
          {title: '联系电话', key: 'tel',  ellipsis: true, width: 160, align: 'center'},
          {title: '描述', key: 'remark',  ellipsis: true, width: 160, align: 'center'},
          {
            title: '操作', key: 'action', width: 70, fixed: 'right', align: 'center',
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
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
          'margin-left': '215px'
        },
        isTree: true,
        contLength: 0,
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
        this.classId = '';
        this.name = '';
        this._search();
        this._classTree();
      },
      _page() {
        this.$store.dispatch('LmsEquipProduct/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipProduct.page;
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
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipProduct/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipProduct.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipProduct/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipProduct.model);
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
        if (this.name === '') {
          this.$extend(data, {name: this.name});
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
      //excel文件到处部分
      _export() {
        var ids = this.selectIds;
        if (!ids.length) {
          this._exportTemplate('确定要导出模板？');
        } else {
          this._exportByIds(ids, '确定导出 ' + ids.length + ' 条记录？');
        }
        this.selectIds = [];
      },
      _exportTemplate(content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/equip_product/exportAll', '_blank');
          }
        });
      },
      _exportByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/equip_product/export?ids=' + ids, '_blank');
          }
        });
      },
      //excel文件导入
      _beupload(file) {
        this.dataObj.file = file.name;
      },
      _handelsuccess(response, file, fileList) { //上传成功
        if (response.success) {
          this.$Message.success('上传成功！');
        } else {
          this.$Message.warning(response.msg);
        }
        this._search();
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
          case '添加' :
            this._editModal(false);
            break;
          case '导出':
            this._export();
            break;
          case 'upload':
            this._search();
            break;
        }
      },
    },
  }
</script>
