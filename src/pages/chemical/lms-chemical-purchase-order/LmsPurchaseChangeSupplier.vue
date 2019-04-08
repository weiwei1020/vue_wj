<template>
  <div>
    <Modal v-model="showChangeSupplierEditModal" title="选择供应商" width="1000">
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24">
          <Form id="search-form" inline>
            <Form-item>
              名称：<Input name="name" placeholder="请输入名称" style="width: 160px;"></Input>
            </Form-item>
            <Form-item>
              客户等级：<Input name="rank" placeholder="请输入客户等级" style="width: 160px;"></Input>
            </Form-item>
            <Form-item>
              主联系人：<Input name="contact" placeholder="请输入名称" style="width: 160px;"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="_search">搜索</Button>
            </Form-item>

          </Form>
          </Col>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :columns="pageColumns" :data="getPage.records" size="small" border highlight-row stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll'></Table>
          </Col>
          <!--分页-->
          <Col span="24">
          <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange" @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    </Modal>
 <!--   &lt;!&ndash; 添加、编辑 &ndash;&gt;
    <LmsSupplierEdit ref="editModal" @on-result-change="_search"></LmsSupplierEdit>
    &lt;!&ndash; 查看详情 &ndash;&gt;
    <LmsSupplierDetail ref="detailModal"></LmsSupplierDetail>-->
  </div>
</template>
<script>
 /* import LmsSupplierEdit from './LmsSupplierEdit.vue'
  import LmsSupplierDetail from './LmsSupplierDetail.vue'*/

  export default {
    components: {
      /*LmsSupplierEdit,
      LmsSupplierDetail*/
    },
    data() {
      return {
        selectIds: [],
        supplierByChemicalQueryData:{},
        relPurchaseData:{},
        chemicalId:'',
        purchaseId:'',
        showChangeSupplierEditModal:false,
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '名称', key: 'name'},
          {title: '客户等级', key: 'rank'},
          {title: '信用等级', key: 'credit'},
          {title: '主联系人', key: 'contact'},
          {title: '联系手机', key: 'mobile'},
          {title: '分类', key: 'type'},
          {
            title: '操作', key: 'action', width: 180, align: 'center',
            render: (h, data) => {
              return h('div', [
                h('Button', {
                  props: {type: 'warning', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this._saveSupplierForRelPurchase(data.row.id);
                    }
                  }
                }, '选择'),

              ]);
            }
          }
        ],
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsSupplier.page
      }
    },
   /* mounted() {
      this._page()
    },*/
    methods: {
      _page() {
        this.supplierByChemicalQueryData=this._searchParams();
        this.supplierByChemicalQueryData.chemicalId=this.chemicalId;
        this.$store.dispatch('LmsSupplier/pageSupplierByChemical', this.supplierByChemicalQueryData);
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _pageSizeChange(rows) {
        this.pageParams['rows'] = rows;
        this._page();
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
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsSupplier/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsSupplier.success) {
                this._page();
                this.$Message.success('删除成功！');
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
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsSupplier/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsSupplier.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsSupplier/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsSupplier.model);
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
      _open(chemicalId,purchaseId){
        this.supplierByChemicalQueryData={};
        this.chemicalId=chemicalId;
        this.purchaseId=purchaseId;
        this._page();
        this.showChangeSupplierEditModal=true;
      },
      _saveSupplierForRelPurchase(data){
        this.relPurchaseData.supplierId=data;
        this.relPurchaseData.id=this.purchaseId;

        this.$store.dispatch('LmsChemicalPurchase/saveSupplierForRelPurchase', this.relPurchaseData).then(() => {
          if (this.$store.state.LmsChemicalPurchase.success) {
            this.$Message.success('保存成功！');
            this.$emit("on-result-change")
          }
        });
      }
    },
  }
</script>
