<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <Col span="24" style="margin-top: -10px;">

              <Form id="search-form" inline onsubmit="return false" :label-width="70" >
                <label class="label-sign"></label>
                <Form-item class="width-22" label="仪器名称:">
                  <Input name="apparatusName" v-model="apparatusName" placeholder="请输仪器名称" @on-enter="_search"/>
                </Form-item>
                <Form-item class="search-btn" style="margin-left: 80px;">
                  <Button type="primary" @click="_pageChange(1)">搜索</Button>
                </Form-item>
              </Form>

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
    </div>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      IconList,
      BtnList,
      BreadCrumbs,
    },
    data() {
      return {
        iconMsg: [
          {type: 'close', id: '', name: '驳回'},
          {type: 'checkmark-circled', id: '', name: '通过'},
        ],
        loading: true,
        id:'',
        apparatusName:'',
        selectIds: [],
        selectObj: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {
            title: '预约状态', key: 'apparatusPurchaseStatus', width: 180, align: 'center',"ellipsis": true,sortable:'true',
            render: (h, data) => {
              let apparatusPurchaseStatus = {"0": "草稿", "1": "待审批", "2": "已通过", "3": "已驳回"};
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
          {title: '审批人', key: 'apparatusPurchaseAuditPerson', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '预约原因', key: 'apparatusPurchaseReason', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '备注', key: 'apparatusPurchaseRemark', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '使用开始时间', key: 'apparatusPurchaseCtime', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '使用结束时间', key: 'apparatusPurchaseLtime', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 120, align: 'center',fixed: 'right',
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
        return this.$tableHeight('tabNoSearchNoBtn');
      },
    },
    mounted(){
      this._page();
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '驳回' :
            this._reject(data.row.id);
            break;
          case '通过' :
            this._pass(data.row.id);
            break;

        }
      },
      _reject(id){
        this.$Modal.confirm({
          title: '提示',
          content : '确定驳回该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/reject', id).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._page();
                this.$Message.success('驳回成功！');
                this.selectIds = [];
              }
            });
          }
        });
      },
      _pass(id){
        this.$Modal.confirm({
          title: '提示',
          content : '确定通过该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/pass', id).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._page();
                this.$Message.success('审批成功！');
                this.selectIds = [];
              }
            });
          }
        });
      },
      _refresh() { //刷新
        this.apparatusName = '';
        this._search();
      },
      _open() {
        this._page();
      },
      _page() {
        this.$store.dispatch('LmsEquipOrder/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipOrder.page;
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
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>
<style scoped>
  .ivu-select-dropdown{
    left:80px !important;
  }
</style>
