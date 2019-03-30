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
            <Form-item class="width-22" label="计划名称:">
              <Input name="name" placeholder="请输入计划名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option value="0">草稿</Option>
                <Option value="1">待技术主管审批</Option>
                <Option value="2">技术主管审批通过</Option>
                <Option value="3">技术主管审批不通过</Option>
                <Option value="4">审批完成</Option>
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
                 @on-selection-change="_selectRowChange" :height="tableHeight"></Table>
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
    <!-- 添加、编辑 -->
    <LmsEquipMaintainEdit ref="editModal" @on-result-change="_search"></LmsEquipMaintainEdit>
    <!-- 查看详情 -->
    <LmsEquipMaintainDetail ref="detailModal"></LmsEquipMaintainDetail>
  </div>
</template>
<script>
  import LmsEquipMaintainEdit from './LmsEquipMaintainEdit.vue'
  import LmsEquipMaintainDetail from './LmsEquipMaintainDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipMaintainEdit,
      LmsEquipMaintainDetail,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-maintain-add', name: '添加'},
          {type: 'error', id: 'equip-maintain-batch-delete', name: '删除'},
        ],

        applyBeginTime: '',
        applyEndTime: '',
        loading: true,
        tableHeight: '300',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '状态', key: 'status', "width": 130, ellipsis: true, fixed: 'left',align: 'center',
            render: (h, data) => {
              let status = {
                "0": "草稿",
                "1": "技术主管审批",
                "2": "技术主管审批通过",
                "3": "技术主管审批不通过",
                "4": "审批完成",
              };
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('Tag', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 0 ? '#F8BB2C' : data.row.status === 1 ? '#00a0e9' : data.row.status === 2 ? '#6FBA2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {
            title: '计划名称', key: 'name', width: 160, align: 'center', ellipsis: true, fixed: 'left',
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
          {title: '申请原因', key: 'applyReason', width: 160, ellipsis: true, align: 'center'},
          {title: '申请人', key: 'applyName', width: 160, ellipsis: true, align: 'center'},
          {
            title: '申请时间', key: 'applyTime', "width": 160, ellipsis: true,align: 'center',
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '技术主管建议', key: 'firstStepAdvice', width: 160, ellipsis: true, align: 'center'},
          {title: '技术主管', key: 'firstStepName', width: 160, ellipsis: true, align: 'center'},
          {
            title: '技术主管准批时间', key: 'firstStepTime', ellipsis: true, "width": 160,align: 'center',
            render: (h, params) => {
              return h('div', params.row.firstStepTime ? this.$dateformat(params.row.firstStepTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '备注', key: 'remark', width: 160, ellipsis: true, align: 'center'},
          {title: '登记人', key: 'registerName', width: 160, ellipsis: true, align: 'center'},
          {
            title: '登记时间', key: 'registerTime', "width": 160, ellipsis: true,align: 'center',
            render: (h, params) => {
              return h('div', params.row.registerTime ? this.$dateformat(params.row.registerTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              let editObj = {type: 'edit', id: 'equip-maintain-edit', name: '编辑'};
              let deleteObj = {type: 'close', id: 'equip-maintain-delete', name: '删除'};
              let iconMsg = [];
              if (data.row.status === 0) {
                iconMsg.push(editObj);
                iconMsg.push(deleteObj);
              }
              return h('div', [
                h(IconList, {
                  props: {msg: iconMsg},
                  on: {
                    'on-result-change': (res) => {
                      this._iconClick(res, data)
                    }
                  }
                }),
              ]);
            }
          }
        ],
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 57,
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipMaintain.page;
      }
    },
    mounted() {
      this._contHide(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _dateChange(e) {
        this.applyBeginTime = e[0];
        this.applyEndTime = e[1];
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._search();
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
      _iconClick(res, data){
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
        }
      },

      _page() {
        this.$store.dispatch('LmsEquipMaintain/page', this._searchParams()).then(() => {
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
          if (data[i].status !== 0) {
            this.$Message.warning('不可操作已提交的数据！');
            return;
          }
          idList.push(data[i].id);
        }
        this.selectIds = idList;
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipMaintain/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipMaintain.success) {
                this._page();
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
        this.$store.dispatch('LmsEquipMaintain/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipMaintain.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipMaintain/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipMaintain.model);
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
          case '删除' :
            this._deleteSelected();
            break;
        }
      },
    },
  }
</script>
