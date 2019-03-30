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
            <Form-item class="width-22" label="申请时间:">
              <DatePicker type="datetimerange" placement="bottom" placeholder="请选择申请时间"
                          @on-change="_dateChange" style="width: 100%"></DatePicker>
            </Form-item>
            <input type="hidden" name="applyLeftTime" v-model="applyLeftTime">
            <input type="hidden" name="applyRightTime" v-model="applyRightTime">
            <Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option value="DRAFT">草稿</Option>
                <Option value="TECHNOLOGY_CHECK">技术主管审批</Option>
                <Option value="DIRECTOR_CENTER_CHECK">中心主任审批</Option>
                <Option value="TECHNOLOGY_CHECK_BACK">技术主管审批驳回</Option>
                <Option value="DIRECTOR_CENTER_PASS">中心主管审批通过</Option>
                <Option value="DIRECTOR_CENTER_BACK">中心主管审批驳回</Option>
                <Option value="END">审批完成</Option>
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
    <!-- 添加、编辑 -->
    <LmsEquipScrapEdit ref="editModal" @on-result-change="_search"></LmsEquipScrapEdit>
    <!-- 查看详情 -->
    <LmsEquipScrapDetail ref="detailModal"></LmsEquipScrapDetail>
  </div>
</template>
<script>
  import LmsEquipScrapEdit from './LmsEquipScrapEdit.vue'
  import LmsEquipScrapDetail from './LmsEquipScrapDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsEquipScrapEdit,
      LmsEquipScrapDetail,
      BtnList,
      BreadCrumbs
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-scrap-add', name: '添加'},
          {type: 'error', id: 'equip-scrap-batch-delete', name: '删除'},
        ],
        panelVal: '',
        btnObj: { //按钮权限
          edit: 'equip-scrap-edit',
          delete: 'equip-scrap-delete',
        },
        applyLeftTime: '',
        applyRightTime: '',
        heightSearch: '',
        loading: true,
        tableHeight: '300',
        selectIds: [],
        pageParams: {
          rows: 20,

        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', ellipsis: true, fixed: 'left'},
          {
            title: '状态', key: 'status', "width": 160, ellipsis: true, fixed: 'left',
            render: (h, data) => {
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status.value === 'DRAFT' ? '#F8BB2C' : data.row.status.value === 'TECHNOLOGY_CHECK' ? '#00a0e9' : data.row.status.value === 'DIRECTOR_CENTER_CHECK' ? '#6FBA2C' : 'red'
                    }
                  }, data.row.status.display)
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

          {title: '申请原因', key: 'applyReason', width: 160, align: 'center', ellipsis: true,},
          {title: '申请人', key: 'applyName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '申请时间', key: 'applyTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.applyTime?this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '技术主管建议', key: 'firstStepAdvice', width: 160, align: 'center', ellipsis: true,},
          {title: '技术主管', key: 'firstStepName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '技术主管准批时间', key: 'firstStepTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.firstStepTime?this.$dateformat(params.row.firstStepTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '中心主任建议', key: 'secondStepAdvice', width: 160, align: 'center', ellipsis: true,},
          {title: '中心主任主管', key: 'secondStepName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '中心主任准批时间', key: 'secondStepTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.secondStepTime?this.$dateformat(params.row.secondStepTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '备注', key: 'remark', width: 160, align: 'center', ellipsis: true,},
          {title: '登记人', key: 'registerName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '登记时间', key: 'registerTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.registerTime?this.$dateformat(params.row.registerTime, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
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
                    class: 'icons',
                    style: {marginRight: '10px', marginTop: '3px'},
                    attrs: {id: this.btnObj.edit}, //添加自定义属性
                  })
                  ])
                ]);
              let btnDelete =
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
                    class: 'icons',
                    style: {marginRight: '10px', marginTop: '3px'},
                    attrs: {id: this.btnObj.delete}, //添加自定义属性
                  })
                  ])
                ]);
              if (data.row.status.value === 'DRAFT') {
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
        this.$store.dispatch('LmsEquipScrap/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipScrap.page;
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
        //this._selectRowChange(data);
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipScrap/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipScrap.success) {
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
        this.$store.dispatch('LmsEquipScrap/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipScrap.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipScrap/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipScrap.model);
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
