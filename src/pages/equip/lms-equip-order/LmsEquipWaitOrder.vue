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
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-22" label="仪器名称:">
              <Input name="name" placeholder="请输仪器名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="仪器编号:">
              <Input name="equipNum" placeholder="请输仪器编号" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option v-for="item in statusList" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </Form-item>
            <Form-item class="width-22" label="预约时间:">
              <DatePicker type="datetimerange" placement="bottom-end" placeholder="请选择预约时间" style="width:100%"
                          @on-change="_getDate"></DatePicker>
              <input type="hidden" name="queryStartDate" v-model="queryStartDate">
              <input type="hidden" name="queryEndDate" v-model="queryEndDate">
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
          <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 添加、编辑 -->
    <LmsEquipOrderEdit ref="editModal" @on-result-change="_search"></LmsEquipOrderEdit>
    <!-- 查看详情 -->
    <LmsEquipOrderDetail ref="detailModal"></LmsEquipOrderDetail>
    <!-- 开始 -->
    <LmsEquipOrderStart ref="startOrderModal" @on-result-change="_search"></LmsEquipOrderStart>
    <!-- 保养 -->
    <LmsEquipOrderFinish ref="finishOrderModal" @on-result-change="_search"></LmsEquipOrderFinish>
  </div>
</template>
<script>
  import LmsEquipOrderStart from './LmsEquipOrderStart.vue'
  import LmsEquipOrderFinish from './LmsEquipOrderFinish.vue'
  import LmsEquipOrderEdit from './LmsEquipOrderEdit.vue'
  import LmsEquipOrderDetail from './LmsEquipOrderDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipOrderStart,
      LmsEquipOrderFinish,
      LmsEquipOrderEdit,
      LmsEquipOrderDetail,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-order-add', name: '添加'},
          {type: '', id: 'equip-order-batch-delete', name: '删除'},
          {type: '', id: 'equip-order-abolish', name: '废止'},
          {type: '', id: 'equip-order-submit', name: '提交'},
        ],
        statusList:[
          {value:'DRAFT',label:'草稿'},
          {value:'TECHNOLOGY_CHECK',label:'待技术主管审批'},
          {value:'TECHNOLOGY_CHECK_PASS',label:'技术主管审批通过'},
          {value:'TECHNOLOGY_CHECK_BACK',label:'技术主管审批不通过'},
          {value:'CHECK_END',label:'审批完成'},
          {value:'WAIT_USE',label:'待使用'},
          {value:'USING',label:'使用中'},
          {value:'USE_END',label:'使用完成'},
          {value:'SUBMITTED',label:'已提交'},
          {value:'ABOLISH',label:'废止'},
        ],
        loading: true,
        tableHeight: '',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        queryStartDate: '',
        queryEndDate: '',
        selectData: [],
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {
            title: '状态', key: 'status', "width": 160, "ellipsis": true, fixed: 'left',
            render: (h, data) => {
              return h('div', data.row.status.display);
            }
          },
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
          {title: '仪器编号', key: 'equipNum', width: 160, align: 'center', ellipsis: true,},

          {title: '预约使用实验室', key: 'orderLabName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '预约日期', key: 'orderDate', "width": 150, align: 'center',
            render: (h, params) => {
              return h('div', params.row.orderDate ? this.$dateformat(params.row.orderDate, "yyyy-mm-dd") : '');
            }
          },
          {
            title: '预约使用开始时间', key: 'orderStartTime', "width": 160, align: 'center',
            render: (h, params) => {
              return h('div', params.row.orderStartTime ? this.$dateformat(params.row.orderStartTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '预约使用结束时间', key: 'orderEndTime', "width": 160, ellipsis: true, align: 'center',
            render: (h, params) => {
              return h('div', params.row.orderEndTime ? this.$dateformat(params.row.orderEndTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '预约原因', key: 'applyReason', width: 160, align: 'center', ellipsis: true,},
          {title: '预约人', key: 'applyName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '预约时间', key: 'applyTime', width: 160, align: 'center', ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '审批意见', key: 'firstStepAdvice', width: 160, align: 'center', ellipsis: true,},
          {title: '审批人', key: 'firstStepName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '审批时间', key: 'firstStepTime', width: 160, align: 'center', ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.firstStepTime ? this.$dateformat(params.row.firstStepTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '实际使用开始时间', key: 'useStartTime', align: 'center', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.useStartTime ? this.$dateformat(params.row.useStartTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '实际使用结束时间', key: 'useEndTime', align: 'center', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.useEndTime ? this.$dateformat(params.row.useEndTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '开始性能', key: 'startPerformance', align: 'center', "width": 160},
          {title: '结束性能', key: 'endPerformance', align: 'center', "width": 160},
          {title: '备注', key: 'remark', width: 160, align: 'center', ellipsis: true,},
          {
            title: '操作', key: 'action', width: 140, align: 'center', fixed: 'right',
            render: (h, data) => {
              let editObj={type: 'edit', id: 'equip-order-edit', name: '编辑'};
              let deleteObj={type: 'close', id: 'equip-order-delete', name: '删除'};
              let startObj={type: 'log-in', id: 'equip-order-start', name: '开始使用'};
              let finishObj={type: 'checkmark', id: 'equip-order-finish', name: '使用完成'};

              let iconMsg = [];
              if (data.row.status.value === 'DRAFT') {
                iconMsg.push(editObj);
                iconMsg.push(deleteObj);
              }
              if (data.row.status.value === 'CHECK_END') {
                iconMsg.push(startObj);
              }
              if (data.row.status.value === 'USING') {
                iconMsg.push(finishObj);
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
        contLength: 0,
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipOrder.page;
      }
    },
    mounted() {
      this._initCont(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _initCont() {
        this.contLength = $(".contHide").find('button').length;
        if (this.contLength) {
          this.tableHeight = this.$newTableHeight('btn');
        } else {
          this.tableHeight = this.$newTableHeight('noBtn');
        }
        this._search();
      },
      _iconClick(res, data){
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '开始使用' :
            this._startOrderModal(data.row.id);
            break;
          case '使用完成' :
            this._finishOrderModal(data.row);
            break;
        }
      },
      _startOrderModal(id) {
        this.$refs.startOrderModal._open(id);
      },
      _finishOrderModal(data) {
        this.$refs.finishOrderModal._open(data);
      },
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
      _page() {
        this.$store.dispatch('LmsEquipOrder/page', this._searchParams()).then(() => {
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
            this.$store.dispatch('LmsEquipOrder/deleteByIds', ids).then(() => {
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
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipOrder/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipOrder.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipOrder/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipOrder.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
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
          case '添加' :
            this._editModal(false);
            break;
          case '删除':
            this._deleteSelected();
            break;
          case '废止' :
            this._updateSelected(4);
            break;
          case '提交':
            this._updateSelected(3);
            break;
        }
      },
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
