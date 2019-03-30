<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
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

  import global from '../../../../api/config'
  import BtnList from '../../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'

  export default {
    components: {
      BtnList,
      BreadCrumbs
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '导出'},
        ],
        loading: true,
        tableHeight: '430',
        selectIds: [],
        pageParams: {
          rows: 10,
        },
       pid:'',
        getPage:{},
        pageColumns: [
          {
            title: '状态', key: 'status', width: 100, ellipsis: true, fixed: 'left',
            render: (h, data) => {
              var status = {"0": "闲置", "1": "在用", "2": "保养中", "3": "维修中", "4": "已报废"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 2 || data.row.status === 3 ? '#6FBA2C' : data.row.status === 0 ? '#00a0e9' : data.row.status === 1 ? '#F8BB2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {title: '仪器编号', key: 'equipNum', width: 160, align: 'center', ellipsis: true,},
          {
            title: '仪器名称', key: 'name', width: 160, align: 'center', ellipsis: true, fixed: 'left',
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
          {title: '修改人', key: 'updateName', width: 160, align: 'center', ellipsis: true},
          {title: '修改时间', key: 'updateDate', width: 160, align: 'center', ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.updateDate ? this.$dateformat(params.row.updateDate, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },

          {title: '供应商名称', key: 'supplierId', width: 160, align: 'center', ellipsis: true},
          {title: '供应商电话', key: 'suppliertel', width: 160, align: 'center', ellipsis: true},
          {title: '供应商email', key: 'supplieremil', width: 160, align: 'center', ellipsis: true},
          {title: '仪器品牌', key: 'brand', width: 160, align: 'center', ellipsis: true,},
          {title: '仪器价格', key: 'price', width: 160, align: 'center', ellipsis: true,},
          {
            title: '购买日期', key: 'buyDate', "width": 100, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.buyDate ? this.$dateformat(params.row.buyDate, "yyyy-mm-dd") : '');
            }
          },
          {title: '备注', key: 'remark', width: 160, align: 'center', ellipsis: true,},
        ],
      }
    },
    methods: {
      _tabOpen(equipId) {
        this.pid = equipId;
        this._search();
      },
      _page() {
        this.$store.dispatch('LmsEquipInfo/getRecordChangeById', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipInfo.page;
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
        var data = this.$serialize('search-form-order');
        Object.assign(data, {pid: this.pid});
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
            window.open(global.baseURL + '/slims/v1/equip_order_manage/export?ids=' + ids, '_blank');
          }
        });
      },
    },
  }
</script>
