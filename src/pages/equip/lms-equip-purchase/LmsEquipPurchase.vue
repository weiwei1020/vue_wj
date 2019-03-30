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
                <Form-item class="width-22" label="申请名称:">
                  <Input name="name" placeholder="请输入申请名称" @on-enter="_search"/>
                </Form-item>
                <Form-item class="width-22" label="状态:">
                  <Select name="status" clearable placeholder="请选择状态">
                    <Option value="0">草稿</Option>
                    <Option value="1">待技术主管审批</Option>
                    <Option value="2">待中心主任审批</Option>
                    <Option value="3">设备待验收</Option>
                    <Option value="4">带存档入库</Option>
                    <Option value="5">申购成功</Option>
                    <Option value="6">技术主管驳回</Option>
                    <Option value="7">中心主任废除</Option>
                    <Option value="8">设备验收废除</Option>
                    <Option value="9">审批完成</Option>
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
          <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 添加、编辑 -->
    <LmsEquipPurchaseEdit ref="editModal" @on-result-change="_search"></LmsEquipPurchaseEdit>
    <!-- 查看详情 -->
    <LmsEquipPurchaseDetail ref="detailModal"></LmsEquipPurchaseDetail>
  </div>
</template>
<script>
  import LmsEquipPurchaseEdit from './LmsEquipPurchaseEdit.vue'
  import LmsEquipPurchaseDetail from './LmsEquipPurchaseDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  var dateFormat = require('dateformat');

  export default {
    components: {
      LmsEquipPurchaseEdit,
      LmsEquipPurchaseDetail,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-purchase-add', name: '添加'},
          {type: 'error', id: 'equip-purchase-batch-delete', name: '删除'},
        ],
        iconMsg:[
          {type:'edit',id:'equip-purchase-edit',name:'编辑'},
          {type:'close',id:'equip-purchase-delete',name:'删除'},
        ],
        panelVal: '',
        heightSearch: '',
        loading: true,
        tableHeight: '300',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {
            title: '状态', key: 'status', "width": 160, "ellipsis": true, fixed: 'left',
            render: (h, data) => {
              var status = {
                "0": "草稿",
                "1": "待技术主管审批",
                "2": "待中心主任审批",
                "3": "设备待验收",
                "4": "待存档入库",
                "5": "申购成功",
                "6": "技术主管驳回",
                "7": "中心主任废除",
                "8": "设备验收废除",
                "9": "审批完成",
              }
              let operate = [];
              if (data.row.status == undefined) {
                operate.push(
                  h('div', {
                  }, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status == 4 || data.row.status == 5 ? '#6FBA2C' : data.row.status == 1
                      || data.row.status == 2 || data.row.status == 3 ? '#00a0e9' : data.row.status == 0 ? '#F8BB2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {
            title: '申请名称', key: 'name', width: 160, align: 'center', ellipsis: true, fixed: 'left',
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

          {title: '申请原因', key: 'applyReason', width: 160, align: 'center', ellipsis: true},
          {title: '申请人', key: 'applyName', width: 160, align: 'center', ellipsis: true},
          {
            title: '申请时间', key: 'applyTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              let applyTime = '';
              if (params.row.applyTime != undefined) {
                applyTime = dateFormat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', applyTime);
            }
          },
          {title: '技术主管意见', key: 'firstStepAdvice', width: 160, align: 'center', ellipsis: true,},
          {title: '技术主管', key: 'firstStepName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '技术主管签字时间', key: 'firstStepTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              let firstStepTime = '';
              if (params.row.firstStepTime != undefined) {
                firstStepTime = dateFormat(params.row.firstStepTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', firstStepTime);
            }
          },
          {title: '中心主任意见', key: 'secondStepAdvice', width: 160, align: 'center', ellipsis: true,},
          {title: '中心主任', key: 'secondStepName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '中心主任签字时间', key: 'secondStepTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              let secondStepTime = '';
              if (params.row.secondStepTime != undefined) {
                secondStepTime = dateFormat(params.row.secondStepTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', secondStepTime);
            }
          },
          {title: '登记人', key: 'registerName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '登记时间', key: 'registerTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', dateFormat(params.row.registerTime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {title: '备注', key: 'remark', width: 160, align: 'center', ellipsis: true,},
          {
            title: '操作', key: 'action', width: 100, fixed: 'right',align:'center',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this. iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res,data)
                      }
                    }
                  },),
                ]);
            }
          },
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
      _iconClick(res,data){
        switch (res){
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
        }
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
        this.$store.dispatch('LmsEquipPurchase/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipPurchase.page;
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
          if (data[i].status != 0) {
            this.$Message.warning('不可操作已提交的数据！');
            return;
          }
          idList.push(data[i].id);
        }
        this.selectIds = idList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipPurchase/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipPurchase.success) {
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
        this.$store.dispatch('LmsEquipPurchase/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipPurchase.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipPurchase/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipPurchase.model);
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
        }
      },
    },
  }
</script>
