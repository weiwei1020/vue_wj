<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" class="martop-20">
              <Form id="search-form" inline onsubmit="return false" :label-width="70">
                <label class="label-sign"></label>
                <Form-item class="width-22" label="状态:">
                  <Select name="status" clearable placeholder="请选择状态">
                    <Option value="TECHNOLOGY_CHECK">待审批</Option>
                    <Option value="TECHNOLOGY_CHECK_PASS">审批通过</Option>
                    <Option value="TECHNOLOGY_CHECK_BACK">审批不通过</Option>
                  </Select>
                </Form-item>
                <Form-item class="width-22" label="仪器名称:">
                  <Input name="name" placeholder="请输入仪器名称" @on-enter="_search"/>
                </Form-item>
                <Form-item class="search-btn">
                  <Button type="primary" @click="_search">搜索</Button>
                </Form-item>
              </Form>
          </Col>
         <!-- &lt;!&ndash;操作&ndash;&gt;
          <Col span="24" style="margin-bottom: 10px;">
          <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </Col>-->
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                 stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
          </Col>
          <!--分页-->
          <Col span="24">
          <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>

  import global from '../../../api/config'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      BtnList,
      BreadCrumbs
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-order-query-export', name: '导出'},
        ],
        panelVal: '',
        heightSearch: '',
        loading: true,
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {
            title: '状态', key: 'status', "width": 100, "ellipsis": true,sortable:'true',
            render: (h, data) => {
              let status = {"DRAFT": "草稿", "TECHNOLOGY_CHECK": "待审批", "TECHNOLOGY_CHECK_PASS": "审批通过", "TECHNOLOGY_CHECK_BACK": "审批不通过"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {
                  }, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status.value === 'DRAFT' ? '#F8BB2C' : data.row.status.value === 'TECHNOLOGY_CHECK' ? '#00a0e9' : data.row.status.value === 'TECHNOLOGY_CHECK_PASS' ? '#6FBA2C' : data.row.status.value === 'TECHNOLOGY_CHECK_BACK' ? 'red' : 'gray'
                    }
                  }, status[data.row.status.value] ? status[data.row.status.value] : '')
                );
              }
              return h('div', operate);
            //  return h('div', data.row.status);
            }
          },
          {title: '仪器编号', key: 'equipNum', align: 'center', width: 250,sortable:'true',},
          {title: '仪器名称', key: 'name', align: 'center', width: 250,sortable:'true',},
          {title: '申请人', key: 'applyName', align: 'center', width: 150,sortable:'true',},
          {title: '申请时间', key: 'applyTime', align: 'center', width: 200,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.applyTime?this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '申请原因', key: 'applyReason', align: 'center', width: 300,sortable:'true',},
          {
            title: '预约使用开始时间', key: 'orderStartTime', align: 'center', "width": 200, ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.orderStartTime?this.$dateformat(params.row.orderStartTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {
            title: '预约使用结束时间', key: 'orderEndTime', align: 'center', "width": 200, ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.orderEndTime?this.$dateformat(params.row.orderEndTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          //{title: '备注', key: 'remark', align: 'center', "width": 160},
        ],
        equipId:'',
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('noSearch');
      },
      getPage() {
        return this.$store.state.LmsEquipOrder.page;
      }
    },
    mounted() {
      this._page();
    },
    methods: {
      _page() {
        this.$store.dispatch('LmsEquipOrder/queryPage', this._searchParams()).then(() => {
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
      _btnClick(msg) {
        switch (msg) {
          case '导出' :
            this._export();
            break;
        }
      },
      //excel文件到处部分
      _export() {
        var ids = this.selectIds;
        var msg = "";
        if (ids == '') {
          msg = '确定要导出所有数据？';
        } else {
          msg = '确定导出 ' + ids.length + ' 条记录？';
        }

        this.$Modal.confirm({
          title: '提示',
          content: msg,
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/equip_order/export?ids=' + ids, '_blank');
          }
        });
      },
    },
  }
</script>
