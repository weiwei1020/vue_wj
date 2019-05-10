<template>
  <div>
    <!--&lt;!&ndash; 面包屑 &ndash;&gt;
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>-->
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24">
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-22" label="仪器名称:">
              <Input name="name" placeholder="请输仪器名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="仪器编号:">
              <Input name="equipNum" placeholder="请输仪器编号" @on-enter="_search"/>
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_search">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                 stripe
                 @on-selection-change="_selectRowChange" :height="tableHeight"></Table>
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
</template>
<script>
  import BtnList from '../../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'
  import IconList from '../../../../components/base/IconList1.vue'

  export default {
    components: {
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        loading: true,
        selectIds: [],
        pageParams: {
          rows: 20,
        },
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
          {title: '仪器名称', key: 'names', align: 'center', ellipsis: true,sortable:'true',},
          {title: '申请人', key: 'apparatusPurchasePerson', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '审批人', key: 'apparatusPurchaseAuditPerson', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '预约原因', key: 'apparatusPurchaseReason', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '备注', key: 'apparatusPurchaseRemark', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '使用开始时间', key: 'apparatusPurchaseCtime', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {title: '使用结束时间', key: 'apparatusPurchaseLtime', width: 180, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, data) => {
              let deleteObj={type: 'trash-a', id: '', name: '删除'};
              let iconMsg = [];
              if (data.row.status === '0') {
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
        getPage:{},
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('tabNoSearchNoBtn');
      }
    },
    mounted() {
      this._page();
    },
    methods: {

      _iconClick(res, data){
        switch (res) {
          case '删除' :
            this._deleteById(data.row.id);
            break;
        }
      },
      _page() {
        this.$store.dispatch('LmsEquipOrder/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage= this.$store.state.LmsEquipOrder.page;
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
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        data.status='TECHNOLOGY_CHECK';
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>
