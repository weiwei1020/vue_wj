<template>
  <div>
    <!--&lt;!&ndash; 面包屑 &ndash;&gt;
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>-->
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" class="martop-20">
            <Form id="search-form1" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item class="width-21" label="仪器名称:">
                <Input v-model="apparatusName" name="apparatusName" placeholder="请输入仪器名称" @on-enter="_pageChange(1)"/>
                <input name="apparatusPurchasePersonId" v-model="apparatusPurchasePersonId" type="hidden"/>
              </Form-item>
              <Form-item class="search-btn">
                <Button type="primary" @click="_pageChange(1)">搜索</Button>
              </Form-item>
            </Form>
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
    <!-- 添加、编辑 -->
    <LmsEquipOrderEditDraft ref="editModal" @on-result-change="_search"></LmsEquipOrderEditDraft>
    </div>
</template>
<script>
  import LmsEquipOrderEditDraft from '../LmsEquipPurchaseEdit.vue'
  import BtnList from '../../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'
  import IconList from '../../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipOrderEditDraft,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
         /* {type: 'success', id: 'equip-order-submit', name: '提交'},
          {type: '', id: 'equip-order-batch-delete', name: '删除'},*/
        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'trash-a', id: '', name: '删除'},
          {type: 'checkmark-circled', id: '', name: '提交'},
        ],
        loading: true,
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        apparatusName:'',
        selectData: [],
        pageColumns: [
          {
            title: '预约状态', key: 'apparatusPurchaseStatus', width: 180, align: 'center',"ellipsis": true,sortable:'true',
            render: (h, data) => {
              let apparatusPurchaseStatus = {"0": "草稿", "1": "已提交", "2": "已通过", "3": "已驳回"};
              let operate = [];
              if (data.row.apparatusPurchaseStatus === undefined) {
                operate.push(
                  h('div', {
                  }, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.apparatusPurchaseStatus == '0' ? '#F8BB2C' : data.row.apparatusPurchaseStatus == '1' ? '#00a0e9' : data.row.apparatusPurchaseStatus == '2' ? '#6FBA2C' : 'red'
                    }
                  }, apparatusPurchaseStatus[data.row.apparatusPurchaseStatus] ? apparatusPurchaseStatus[data.row.apparatusPurchaseStatus] : '')
                );
              }
              return h('div', operate);
            }
          },
          {title: '仪器名称', key: 'apparatusName', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '申请人', key: 'apparatusPurchasePerson', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '预约原因', key: 'apparatusPurchaseReason', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '使用开始时间', key: 'apparatusPurchaseCtime', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '使用结束时间', key: 'apparatusPurchaseLtime', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '备注', key: 'apparatusPurchaseRemark', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 200, align: 'center',fixed:'right',
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
          }
        ],
        getPage: {},
        apparatusPurchasePersonId:localStorage.getItem('personId')
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('tabNoSearchNoBtn');
      }
    },
    mounted() {
      this._page()
    },
    methods: {
      _iconClick(res, data){
        switch (res) {
          case '编辑' :
            this._editModal(data.row);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '提交' :
            this._submitOrderDraft(data.row.id);
            break;
        }
      },
      _page() {
        this.$store.dispatch('LmsEquipOrder/pageDraft', this._searchParams()).then(() => {
         this.getPage=this.$store.state.LmsEquipOrder.page;
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
        this.selectData = data;
        this.selectIds = idList;
      },
      _submitOrderDraft(id,content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定提交该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/submitPros', id).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._search();
                this.$Message.success('提交成功！');
              }
            });
          }
        });
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/deletePros', ids.join(',')).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._search();
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
      _editModal(data) {
          /*this.$store.dispatch('LmsEquipOrder/editById', data.id).then(() => {
           // this.$refs.editModal._open(this.$store.state.LmsEquipOrder.model);
            this.$refs.editModal._open(data.id);
          });*/
        this.$refs.editModal._open(data);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form1');
        return this.$extend(data, this.pageParams);
      },
     /* _btnClick(msg) {
        switch (msg) {
          case '删除':
            this._deleteSelected();
            break;
          case '提交':
            this._submitOrderDraft(ids);
            break;
        }
      },*/
    },
  }
</script>
