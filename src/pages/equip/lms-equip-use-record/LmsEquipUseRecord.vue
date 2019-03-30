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
              <Input name="name" placeholder="请输入仪器名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="仪器编号:">
              <Input name="equipNum" placeholder="请输仪器编号" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option value="0">草稿</Option>
                <Option value="1">已提交</Option>
              </Select>
            </Form-item>
            <Form-item class="width-22" label="使用时间:">
              <DatePicker type="datetimerange" placement="bottom-end" placeholder="使用时间" style="width:100%"
                          @on-change="_getDate"></DatePicker>
            </Form-item>
            <input type="hidden" name="queryUseStartTime" v-model="queryUseStartTime"/>
            <input type="hidden" name="queryUseEndTime" v-model="queryUseEndTime"/>
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
    <LmsEquipUseRecordEdit ref="editModal" @on-result-change="_search"></LmsEquipUseRecordEdit>
    <!-- 查看详情 -->
    <LmsEquipUseRecordDetail ref="detailModal"></LmsEquipUseRecordDetail>
  </div>
</template>
<script>
  import LmsEquipUseRecordEdit from './LmsEquipUseRecordEdit.vue'
  import LmsEquipUseRecordDetail from './LmsEquipUseRecordDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipUseRecordEdit,
      LmsEquipUseRecordDetail,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-useRecord-add', name: '添加'},
          {type: 'error', id: 'equip-useRecord-batch-delete', name: '删除'},
        ],
        panelVal: '',
        heightSearch: '',
        loading: true,
        tableHeight: '320',
        selectIds: [],
        pageParams: {
          rows: 20,
        },

        queryUseStartTime: '',
        queryUseEndTime: '',

        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: "left"},
          {
            title: '状态', key: 'status', "width": 160, ellipsis: true, fixed: "left",
            render: (h, data) => {
              var status = {"0": "草稿", "1": "已提交"};
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
          },
          {
            title: '仪器名称', key: 'name', width: 160, align: 'center', ellipsis: true, fixed: "left",
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
          {title: '证书编号', key: 'ceNum', width: 160, align: 'center', ellipsis: true,},
          {title: '实验室编号', key: 'labNum', width: 160, align: 'center', ellipsis: true,},
          {
            title: '使用日期', key: 'useDate', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.useDate ? this.$dateformat(params.row.useDate, "yyyy-mm-dd") : '');
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
          {title: '检品编号/批号', key: 'checkNum', width: 160, align: 'center', ellipsis: true,},
          {title: '检测项目', key: 'checkItem', width: 160, align: 'center', ellipsis: true,},
          {title: '其他要求', key: 'other', width: 160, align: 'center', ellipsis: true,},
          {title: '使用人', key: 'userName', width: 160, align: 'center', ellipsis: true,},
          {title: '使用实验室', key: 'labName', width: 160, align: 'center', ellipsis: true,},
          {title: '备注', key: 'remark', width: 160, align: 'center', ellipsis: true,},
          {title: '登记人', key: 'registerName', width: 160, align: 'center', ellipsis: true,},
          {
            title: '登记时间', key: 'registerTime', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.registerTime ? this.$dateformat(params.row.registerTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              let editObj = {type: 'edit', id: 'equip-useRecord-edit', name: '编辑'};
              let deleteObj = {type: 'close', id: 'equip-useRecord-delete', name: '删除'};
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
                },),
              ]);
            }
          }
        ],
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 90,

      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipUseRecord.page;
      }
    },
    mounted() {
      this._contHide(); //判断‘添加’一栏是否隐藏
    },
    methods: {
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
            this.$store.dispatch('LmsEquipUseRecord/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipUseRecord.success) {
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
        this.$store.dispatch('LmsEquipUseRecord/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipUseRecord.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipUseRecord/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipUseRecord.model);
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
