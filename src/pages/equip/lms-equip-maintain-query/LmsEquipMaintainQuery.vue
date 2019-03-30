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
                <Form-item class="width-22" label="仪器名称:">
                  <Input name="equipName" placeholder="请输入仪器名称" @on-enter="_search"/>
                </Form-item>
                <Form-item class="width-22" label="项目名称:">
                  <Input name="projectName" placeholder="请输入项目名称" @on-enter="_search"/>
                </Form-item>
                <Form-item class="width-22" label="申请时间:">
                  <DatePicker type="datetimerange" placement="bottom" placeholder="请选择申请时间"
                              @on-change="_dateChange" style="width: 100%"></DatePicker>
                </Form-item>
                <input type="hidden" name="applyLeftTime" v-model="applyLeftTime">
                <input type="hidden" name="applyRightTime" v-model="applyRightTime">
                <Form-item class="width-22" label="状态:">
                  <Select name="status" clearable placeholder="请选择状态">
                    <Option value="0">待保养</Option>
                    <Option value="1">保养中</Option>
                    <Option value="2">已保养</Option>
                    <Option value="3">已提交</Option>
                    <Option value="4">已废止</Option>
                  </Select>
                </Form-item>
                <Form-item class="search-btn">
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
          {type: 'success', id: 'equip-maintain-query-export', name: '导出'},
        ],
        applyLeftTime:'',
        applyRightTime:'',
        panelVal: '',
        heightSearch: '',
        loading: true,
        tableHeight: '300',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '状态', key: 'status', "width": 160, "ellipsis": true, fixed: 'left',
            render: (h, data) => {
              let status = {"0": "待保养", "1": "保养中", "2": "已保养", "3": "已提交", "4": "已废止"};
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
                      color: data.row.status === 0 ? '#F8BB2C' : data.row.status === 1 ? '#00a0e9' : data.row.status === 2 ? '#6FBA2C' : data.row.status === 2 ? 'red' : 'gray'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {title: '仪器名称', key: 'equipName', align: 'center', width: 160},
          {title: '实验室编号', key: 'labNum', align: 'center', width: 160},
          {title: '计划名称', key: 'maintainName', align: 'center', width: 160,},
          {title: '维保项目名称', key: 'projectName', align: 'center', width: 160},
          {
            title: '计划保养开始时间', key: 'maintainStartTimePlan', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.maintainStartTimePlan?this.$dateformat(params.row.maintainStartTimePlan, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {
            title: '计划保养结束时间', key: 'maintainEndTimePlan', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.maintainEndTimePlan?this.$dateformat(params.row.maintainEndTimePlan, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {
            title: '实际保养开始时间', key: 'maintainStartTimeAct', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.maintainStartTimeAct?this.$dateformat(params.row.maintainStartTimeAct, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {
            title: '实际保养结束时间', key: 'maintainEndTimeAct', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.maintainEndTimeAct?this.$dateformat(params.row.maintainEndTimeAct, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '维保人员', key: 'maintainerNames', align: 'center', width: 160},
          {title: '维保内容', key: 'maintainContent', align: 'center', width: 160},
          {title: '维保费用', key: 'maintainFee', align: 'center', width: 160},
          {title: '申请原因', key: 'applyReason', align: 'center', width: 160},
          {
            title: '申请时间', key: 'applyTime', "width": 160,
            render: (h, params) => {
              return h('div', params.row.applyTime?this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '申请人', key: 'applyName', align: 'center', width: 160},
          {title: '备注', key: 'remark', align: 'center', width: 160,}
        ],
        getPage: {},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 57,
      }
    },
    mounted() {
      this._contHide(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _dateChange(e) {
        this.applyLeftTime = e[0];
        this.applyRightTime = e[1];
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._search();
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
      _page() {
        this.$store.dispatch('LmsEquipMaintainManage/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipMaintainManage.page;
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
            window.open(global.baseURL + '/slims/v1/equip_maintain_manage/export?ids=' + ids, '_blank');
          }
        });
      },
    },
  }
</script>
