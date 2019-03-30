<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
          <Form id="search-form-use" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-30" label="仪器编号:">
              <Input name="equipNum" placeholder="请输仪器编号" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-30" label="使用时间:">
              <DatePicker type="datetimerange" placement="bottom-end" placeholder="使用时间" style="width:100%"
                          @on-change="_getDate"></DatePicker>
              <input type="hidden" name="queryUseStartTime" v-model="queryUseStartTime"/>
              <input type="hidden" name="queryUseEndTime" v-model="queryUseEndTime"/>
            </Form-item>
            <Form-item class="marleft-70">
              <Button type="primary" @click="_search">搜索</Button>
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
          {type: 'success', id: 'equip-order-query-export', name: '导出'},
        ],
        loading: true,
        tableHeight: '430',
        selectIds: [],
        pageParams: {
          rows: 10,
        },
        queryUseStartTime: '',
        queryUseEndTime: '',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: "left"},
          /*{
            title: '状态', key: 'status', "width": 160, ellipsis: true, fixed: "left",
            render: (h, data) => {
              let status = {"0": "草稿", "1": "已提交"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 0 ? '#F8BB2C' : data.row.status === 1 ? '#6FBA2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);

            }
          },*/
          {title: '仪器名称', key: 'name', width: 160, align: 'center', ellipsis: true, fixed: "left",},
          {title: '仪器编号', key: 'equipNum', width: 160, align: 'center', ellipsis: true,},
          {title: '证书编号', key: 'ceNum', width: 160, align: 'center', ellipsis: true,},
          {title: '实验室编号', key: 'labNum', width: 160, align: 'center', ellipsis: true,},
          {
            title: '使用日期', key: 'useDate', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.useDate ? this.$dateformat(params.row.useDate, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '使用开始时间', key: 'useStartTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.useStartTime ? this.$dateformat(params.row.useStartTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '使用结束时间', key: 'useEndTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.useEndTime ? this.$dateformat(params.row.useEndTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '开始性能', key: 'performanceStart', width: 160, align: 'center', ellipsis: true,},
          {title: '结束性能', key: 'performanceEnd', width: 160, align: 'center', ellipsis: true,},
          {title: '使用人', key: 'userName', width: 160, align: 'center', ellipsis: true,},
          {title: '使用实验室', key: 'labName', width: 160, align: 'center', ellipsis: true,},
          {title: '检品编号/批号', key: 'checkNum', width: 160, align: 'center', ellipsis: true,},
          {title: '检测项目', key: 'checkItem', width: 160, align: 'center', ellipsis: true,},
          {title: '其他要求', key: 'other', width: 160, align: 'center', ellipsis: true,},
          {title: '备注', key: 'remark', width: 160, align: 'center', ellipsis: true,},
          {title: '登记人', key: 'registerName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '登记时间', key: 'registerTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.registerTime ? this.$dateformat(params.row.registerTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          }
        ],
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipUseRecord.page;
      }
    },
    methods: {
      _tabOpen(equipId) {
        this.equipId = equipId;
        this._search();
      },
      _getDate(date) {
        this.queryUseStartTime = date[0];
        this.queryUseEndTime = date[1];
      },
      _page() {
        this.$store.dispatch('LmsEquipUseRecord/page', this._searchParams()).then(() => {
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
        var data = this.$serialize('search-form-use');
        this.$extend(data, {status: 1, equipId: this.equipId});
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
            window.open(global.baseURL + '/slims/v1/equip_use_record/export?ids=' + ids, '_blank');
          }
        });
      },
    },
  }
</script>
