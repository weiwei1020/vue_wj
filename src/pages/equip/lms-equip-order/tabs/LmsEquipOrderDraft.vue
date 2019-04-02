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
    <!-- 查看详情 -->
    <LmsEquipPurchaseOrderDraftDetail ref="detailModal"></LmsEquipPurchaseOrderDraftDetail>
    </div>
</template>
<script>
  import LmsEquipOrderStart from '../LmsEquipOrderStart.vue'
  import LmsEquipOrderFinish from '../LmsEquipOrderFinish.vue'
  import LmsEquipOrderEditDraft from '../LmsEquipOrderEditDraft.vue'
  import LmsEquipOrderDetail from '../LmsEquipOrderDetail.vue'
  import BtnList from '../../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'
  import IconList from '../../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipOrderStart,
      LmsEquipOrderFinish,
      LmsEquipOrderEditDraft,
      LmsEquipOrderDetail,
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
        statusList:[
          {value:'DRAFT',label:'草稿'},
        ],
        loading: true,
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        status:'DRAFT',
        queryStartDate: '',
        queryEndDate: '',
        selectData: [],
        pageColumns: [
          {
            title: '状态', key: 'status', "width": 180, align: 'center',"ellipsis": true,sortable:'true',
            render: (h, data) => {
              return h('div', data.row.status.display);
            }
          },
          {
            title: '仪器名称', key: 'names', align: 'center', ellipsis: true,sortable:'true',
          },
          {title: '申请人', key: 'applyName', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '申请时间', key: 'applyTime', "width": 180, align: 'center',sortable:'true',
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, data) => {
              let editObj={type: 'edit', id: '', name: '编辑'};
              let deleteObj={type: 'close', id: '', name: '删除'};
              let submitObj={type: 'log-in', id: '', name: '提交'};

              let iconMsg = [];
              if (data.row.status.value === 'DRAFT') {
                iconMsg.push(editObj);
                iconMsg.push(deleteObj);
                iconMsg.push(submitObj);
              } else if (data.row.status.value === 'TECHNOLOGY_CHECK_BACK') {
                iconMsg.push(editObj);
                iconMsg.push(deleteObj);
                iconMsg.push(submitObj);
              }else{
                iconMsg.push(deleteObj);
              }
              return h('div',  [
                h(IconList, {
                  props: {msg: iconMsg},
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
            this._editModal( data.row);
            break;
          case '删除' :
            this._deleteById(data.row.groupId);
            break;
          case '提交' :
            this._submitOrderDraft(data.row.groupId);
            break;
        }
      },
      _submitOrderDraft(groupId,content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定提交该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/submitOrderDraft', groupId).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._search();
                this.$Message.success('提交成功！');
              }
            });
          }
        });
      },
     /* _submitOrderDraftSelected() {
        // 批量提交
        var groupId = this.selectIds;
        if (groupId == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._submitOrderDraftByIds(groupId, '确定提交 ' + groupId.length + ' 条记录？');
        }
      },
      _submitOrderDraftByIds(groupId, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定提交除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/submitOrderDraft', groupId).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._search();
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },*/
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
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
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/deleteOrderByGroupId', ids).then(() => {
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
      /*_detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipOrder/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipOrder.model);
        });
      },*/
      _editModal(data) {
          /*this.$store.dispatch('LmsEquipOrder/editById', data.groupId).then(() => {
           // this.$refs.editModal._open(this.$store.state.LmsEquipOrder.model);
            this.$refs.editModal._open(data.groupId);
          });*/
        this.$refs.editModal._open(data.groupId);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        data.status=this.status;
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
      _updateSelected(status) {
        let ids = this.selectIds;
        if (ids === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._updateByIds(ids, status);
        }
      },
      _updateByIds(ids, status) {
        let url = null;
        let contents = '';
        let dataList = this.selectData;
        if (3 === status) {//提交
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].status.value !== 'USE_END') {
              this.$Message.error('只能提交使用完成的数据！');
              return;
            }
          }
          contents = "确定提交所选记录？";
          url = 'LmsEquipOrder/orderFinishSubmit';
        } else if (4 === status) {//废止
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].status.value !== 'CHECK_END') {
              this.$Message.error('只能废止待使用数据！');
              return;
            }
          }
          contents = "确定废止所选记录？";
          url = 'LmsEquipOrder/abolish';
        } else {
          this.$Message.success('操作错误！');
          return;
        }
        this.$Modal.confirm({
          title: '提示',
          content: contents,
          onOk: () => {
            this.$store.dispatch(url, ids).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._page();
                this.$Message.success('操作成功！');
              }
            });
          }
        });
      },

    },
  }
</script>
