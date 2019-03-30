<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24"
               style="margin-top: 20px">
          <Form id="search-form" inline onsubmit="return false" :label-width="80">
            <label class="label-sign"></label>
            <Form-item class="width-20" label="仪器名称:">
              <Input name="name" placeholder="请输入仪器名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-20" label="实验室编号:">
              <Input name="labNum" placeholder="请输入实验室编号" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-20" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option value="0">未过期</Option>
                <Option value="1">已过期</Option>
                <Option value="2">已完成</Option>
              </Select>
            </Form-item>
            <Form-item class="width-20" label="检定日期:">
              <Date-picker type="daterange" placement="bottom" placeholder="检定日期"
                           @on-change="_dateChange" style="width: 100%;"></Date-picker>
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

  export default {

    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-verify-add', name: '添加'},
          {type: 'error', id: 'equip-verify-batch-delete', name: '删除'},
          {id: 'equip-verify-submit', name: '提交'},
        ],
        btnObj: { //按钮权限
          edit: 'equip-verify-edit',
          delete: 'equip-verify-delete',
        },
        loading: true,
        tableHeight: '430',
        selectIds: [],
        pageParams: {
          rows: 10,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '状态', key: 'status', "width": 160, ellipsis: true, fixed: 'left',
            render: (h, data) => {
              let status = {"0": "未过期", "1": "已过期", "2": "已完成"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 0 ? '#6FBA2C' : data.row.status === 1 ? '#F8BB2C' : data.row.status === 2 ? '#00a0e9' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {
            title: '仪器名称', key: 'name', width: 160, align: 'center', fixed: "left", ellipsis: true,
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
          {title: '实验室编号', key: 'labNum', width: 160, align: 'center', ellipsis: true,},
          {title: '检定周期（月）', key: 'period', width: 160, align: 'center', ellipsis: true,},
          {title: '提前提醒（天）', key: 'warningDays', width: 160, align: 'center', ellipsis: true,},
          {
            title: '检定日期', key: 'verifyDate', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.verifyDate ? this.$dateformat(params.row.verifyDate, "yyyy-mm-dd") : '');
            }
          },
          {
            title: '下次检定日期', key: 'nextVerifyDate', "width": 160, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.nextVerifyDate ? this.$dateformat(params.row.nextVerifyDate, "yyyy-mm-dd") : '');
            }
          },
          {title: '检定结果', key: 'verifyResult', width: 160, align: 'center', ellipsis: true,},
          {title: '检定部门', key: 'verifyDepartmentName', width: 160, align: 'center', ellipsis: true,},
          {title: '检定范围', key: 'verifyRange', width: 160, align: 'center', ellipsis: true,},
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
                    class: 'icons',
                    style: {marginRight: '10px', marginTop: '3px'},
                    attrs: {id: this.btnObj.delete}, //添加自定义属性
                  })
                  ])
                ]);
              if (data.row.status !== 2) {
                if (this.$showBtn(this.btnObj.edit)) {
                  operate.push(btnEdit);
                }
                if (this.$showBtn(this.btnObj.delete)) {
                  operate.push(btnDel);
                }
              }
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
      }
    },
    computed: {
      getPage() {
        return this.$store.state.LmsEquipVerify.page;
      }
    },
    methods: {
      _dateChange(e) {

      },
      _tabOpen(equipId) {
        this.equipId = equipId;
        this._search();
      },
      _page() {
        this.$store.dispatch('LmsEquipVerify/page', this._searchParams()).then(() => {
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
          if (data[i].status === 2) {
            this.$Message.warning('不可操作已完成数据！');
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
            this.$store.dispatch('LmsEquipVerify/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipVerify.success) {
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
        let ids = this.selectIds;
        if (ids === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipVerify/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipVerify.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipVerify/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipVerify.model);
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
        Object.assign(data, {equipId: this.equipId});
        return this.$extend(data, this.pageParams);
      },
      _submitSelected() {
        let ids = this.selectIds;
        if (ids === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: '确定提交该记录？',
            onOk: () => {
              this.$store.dispatch('LmsEquipVerify/submitByIds', ids).then(() => {
                if (this.$store.state.LmsEquipVerify.success) {
                  this._page();
                  this.$Message.success('提交成功！');
                }
              });
            }
          });
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
          case '提交' :
            this._submitSelected();
            break;
        }
      },
    },
  }
</script>
