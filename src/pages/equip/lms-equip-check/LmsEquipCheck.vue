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
                    <Option value="1">中心主任审批</Option>
                    <Option value="2">中心主管审批通过</Option>
                    <Option value="3">中心主管审批不通过</Option>
                    <Option value="4">审批完成-通过</Option>
                    <Option value="5">审批完成-不通过</Option>
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
    <LmsEquipCheckEdit ref="editModal" @on-result-change="_search"></LmsEquipCheckEdit>
    <!-- 查看详情 -->
    <LmsEquipCheckDetail ref="detailModal"></LmsEquipCheckDetail>
  </div>
</template>
<script>
  import LmsEquipCheckEdit from './LmsEquipCheckEdit.vue'
  import LmsEquipCheckDetail from './LmsEquipCheckDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  var dateFormat = require('dateformat');

  export default {
    components: {
      LmsEquipCheckEdit,
      LmsEquipCheckDetail,
      BtnList,
      BreadCrumbs
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-check-add', name: '添加'},
          {type: 'error', id: 'equip-check-batch-delete', name: '删除'},
        ],
        btnObj: { //按钮权限
          edit: 'equip-check-edit',
          view: 'equip-check-delete',
        },
        panelVal: '',
        heightSearch: '',
        loading: true,
        tableHeight: '',
        selectIds: [],
        pageParams: {
          rows: 20,

        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '状态', key: 'status', "width": 160, "ellipsis": true, fixed: 'left',
            render: (h, data) => {
              var status = {
                "0": "草稿",
                "1": "中心主任审批",
                "2": "中心主任审批通过",
                "3": "中心主任审批不通过",
                "4": "审批完成-通过",
                "5": "审批完成-不通过"
              };
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
                      color: data.row.status == 0 ? '#F8BB2C' : data.row.status == 1 ? '#00a0e9' : data.row.status == 2 ? '#6FBA2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {
            title: '计划名称', key: 'name', width: 160, align: 'center', fixed: 'left',
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
          {title: '部门', key: 'orgName', width: 160, align: 'center'},
          {title: '申请原因', key: 'applyReason', width: 160, align: 'center'},
          {
            title: '计划核查开始时间', key: 'checkStartTimePlan', width: 160, align: 'center',
            render: (h, params) => {
              let checkStartTimePlan = '';
              if (params.row.checkStartTimePlan !== undefined) {
                checkStartTimePlan = dateFormat(params.row.checkStartTimePlan, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', checkStartTimePlan);
            }
          },
          {
            title: '计划核查结束时间', key: 'checkEndTimePlan', width: 160, align: 'center',
            render: (h, params) => {
              let checkEndTimePlan = '';
              if (params.row.checkEndTimePlan !== undefined) {
                checkEndTimePlan = dateFormat(params.row.checkEndTimePlan, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', checkEndTimePlan);
            }
          },
          {title: '申请人', key: 'applyName', width: 160, align: 'center'},
          {
            title: '申请时间', key: 'applyTime', "width": 160,
            render: (h, params) => {
              let applyTime = '';
              if (params.row.applyTime !== undefined) {
                applyTime = dateFormat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', applyTime);
            }
          },
          {title: '中心意见', key: 'firstStepAdvice', width: 160, align: 'center'},
          {title: '中心主任', key: 'firstStepName', width: 160, align: 'center'},
          {
            title: '中心主任审批时间', key: 'firstStepTime', "width": 160,
            render: (h, params) => {
              let firstStepTime = '';
              if (params.row.firstStepTime != undefined) {
                firstStepTime = dateFormat(params.row.firstStepTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', firstStepTime);
            }
          },
          {title: '登记人', key: 'registerName', width: 160, align: 'center'},
          {
            title: '登记时间', key: 'registerTime', "width": 160,
            render: (h, params) => {
              let registerTime = '';
              if (params.row.registerTime != undefined) {
                registerTime = dateFormat(params.row.registerTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', registerTime);
            }
          },
          {title: '备注', key: 'remark', width: 160, align: 'center'},
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              let btnEdit =
                h('Tooltip', {
                  props: {
                    content: '编辑',
                    key: '编辑',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._editModal(true, data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'edit',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.edit}, //添加自定义属性
                  })
                  ])
                ]);
              let btnDel =
                h('Tooltip', {
                  props: {
                    content: '删除',
                    key: '删除',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._deleteById(data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'close',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.delete}, //添加自定义属性
                  })
                  ])
                ]);
              if (data.row.status == 0) {
                if (this.$showBtn(this.btnObj.edit)) {
                  operate.push(btnEdit);
                }
                if (this.$showBtn(this.btnObj.delete)) {
                  operate.push(btnDelete);
                }
              }
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
        getPage: {},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 57
      }
    },
    mounted() {
      this._contHide(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._page();
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
      _page() {
        this.$store.dispatch('LmsEquipCheck/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipCheck.page;
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
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipCheck/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipCheck.success) {
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
        this.$store.dispatch('LmsEquipCheck/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipCheck.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipCheck/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipCheck.model);
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
    },
  }
</script>
