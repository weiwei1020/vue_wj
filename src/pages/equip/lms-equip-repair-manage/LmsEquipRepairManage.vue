<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>

    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-22" label="仪器名称:">
              <Input name="equipName" placeholder="请输入仪器名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="计划名称:">
              <Input name="repairName" placeholder="请输入计划名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option value="0">待维修</Option>
                <Option value="1">维修中</Option>
                <Option value="2">已维修</Option>
                <Option value="3">已提交</Option>
                <Option value="4">已废止</Option>
              </Select>
            </Form-item>
            <Form-item class="width-22" label="申请时间:">
              <DatePicker type="datetimerange" placement="bottom" placeholder="请选择申请时间"
                          @on-change="_dateChange" style="width: 100%"></DatePicker>
            </Form-item>
            <input type="hidden" name="applyBeginTime" v-model="applyBeginTime">
            <input type="hidden" name="applyEndTime" v-model="applyEndTime">
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
    <!-- 维修开始 -->
    <LmsEquipRepairManageStart ref="startRepairModal" @on-result-change="_search"></LmsEquipRepairManageStart>
    <!-- 维修完成 -->
    <LmsEquipRepairManageFinish ref="finishRepairModal" @on-result-change="_search"></LmsEquipRepairManageFinish>
    <!-- 查看详情 -->
    <LmsEquipRepairManageDetail ref="detailModal"></LmsEquipRepairManageDetail>
  </div>
</template>
<script>
  import LmsEquipRepairManageStart from './LmsEquipRepairManageStart.vue'
  import LmsEquipRepairManageFinish from './LmsEquipRepairManageFinish.vue'
  import LmsEquipRepairManageDetail from './LmsEquipRepairManageDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipRepairManageStart,
      LmsEquipRepairManageFinish,
      LmsEquipRepairManageDetail,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'error', id: 'equip-repair-manage-abolish', name: '废止'},
          {type: 'primary', id: 'equip-repair-manage-submit', name: '提交'},
        ],
        panelVal: '',
        heightSearch: '',
        loading: true,
        tableHeight: '300',
        selectIds: [],
        selectData: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '状态', key: 'status', "width": 160, "ellipsis": true, fixed: 'left',
            render: (h, data) => {
              let status = {"0": "待维修", "1": "维修中", "2": "已维修", "3": "已提交", "4": "已废止"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 0 ? '#00a0e9' : data.row.status === 1 ? '#F8BB2C' : data.row.status === 2 ? '#6FBA2C' : data.row.status === 2 ? 'red' : 'gray'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {title: '仪器名称', key: 'equipName', align: 'center', width: 160, ellipse: true,},
          {title: '计划名称', key: 'repairName', align: 'center', width: 160, ellipse: true,},
          {title: '实验室编号', key: 'labNum', align: 'center', width: 160, ellipse: true,},
          {title: '故障分析', key: 'breakdown', align: 'center', width: 160, ellipse: true,},
          {
            title: '计划维修开始时间', key: 'repairStartTimePlan', "width": 160, ellipse: true,
            render: (h, params) => {
              return h('div', params.row.repairStartTimePlan ? this.$dateformat(params.row.repairStartTimePlan, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '计划维修结束时间', key: 'repairEndTimePlan', "width": 160, ellipse: true,
            render: (h, params) => {
              return h('div', params.row.repairEndTimePlan ? this.$dateformat(params.row.repairEndTimePlan, "yyyy-mm-dd hh:MM:ss") : '');
            }
          },
          {
            title: '实际维修开始时间', key: 'repairStartTimeAct', "width": 160, ellipse: true,
            render: (h, params) => {
              return h('div', params.row.repairStartTimeAct ? this.$dateformat(params.row.repairStartTimeAct, "yyyy-mm-dd hh:MM:ss") : '');
            }
          },
          {
            title: '实际维修结束时间', key: 'repairEndTimeAct', "width": 160, ellipse: true,
            render: (h, params) => {
              return h('div', params.row.repairEndTimeAct ? this.$dateformat(params.row.repairEndTimeAct, "yyyy-mm-dd hh:MM:ss") : '');
            }
          },
          {title: '维修人员', key: 'repairerName', align: 'center', width: 160, ellipse: true,},
          {title: '维修方法', key: 'repairMethod', align: 'center', width: 160, ellipse: true,},
          {title: '维修费用', key: 'repairFee', align: 'center', width: 160, ellipse: true,},
          {title: '申请原因', key: 'applyReason', align: 'center', width: 160, ellipse: true,},
          {
            title: '申请时间', key: 'applyTime', "width": 160, ellipse: true,
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd") : '');
            }
          },
          {title: '申请人', key: 'applyName', align: 'center', width: 160, ellipse: true,},
          {title: '备注', key: 'remark', align: 'center', width: 160, ellipse: true,},
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              let iconMsg = [];
              let startObj = {type: 'log-in', id: '', name: '开始维修'};
              let endObj = {type: 'checkmark', id: '', name: '维修完成'};
              if (data.row.status === 0) {
                iconMsg.push(startObj);
              }
              if (data.row.status === 1) {
                iconMsg.push(endObj);
              }
              return h('div',
                [
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
        applyBeginTime: '',
        applyEndTime: '',
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
      _iconClick(res, data) {
        switch (res) {
          case '开始维修' :
            this.$refs.startRepairModal._open(data.row);
            break;
          case '维修完成' :
            this.$refs.finishRepairModal._open(data.row);
            break;
        }
      },
      _dateChange(e) {
        this.applyBeginTime = e[0];
        this.applyEndTime = e[1];
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
        this.$store.dispatch('LmsEquipRepairManage/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipRepairManage.page;
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
        this.selectIds = idList;
        this.selectData = data;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _updateByIds(ids, status) {
        let url = null;
        let contents = '';
        let dataList = this.selectData;
        if (3 === status) {//提交
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].status !== 2) {
              this.$Message.error('只能提交已维修的数据！');
              return;
            }
          }
          contents = "确定提交所选记录？";
          url = 'LmsEquipRepairManage/submit';
        } else if (4 === status) {//废止
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].status !== 0) {
              this.$Message.error('只能废止待维修数据！');
              return;
            }
          }
          contents = "确定废止所选记录？";
          url = 'LmsEquipRepairManage/abolish';
        } else {
          this.$Message.success('操作错误！');
        }
        this.$Modal.confirm({
          title: '提示',
          content: contents,
          onOk: () => {
            this.$store.dispatch(url, ids).then(() => {
              if (this.$store.state.LmsEquipRepairManage.success) {
                this._page();
                this.$Message.success('操作成功！');
              }
            });
          }
        });
      },
      _updateSelected(status) {
        let ids = this.selectIds;
        if (ids === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._updateByIds(ids, status);
        }
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        let data = this.$serialize('search-form');
        return this.$extend(data, this.pageParams);
      },
      _btnClick(msg) {
        switch (msg) {
          case '废止' :
            this._updateSelected(4);
            break;
          case '提交' :
            this._updateSelected(3);
            break;
        }
      },
    },
  }
</script>
