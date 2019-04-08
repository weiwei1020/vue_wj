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
            <Form-item class="width-23" label="申请人:">
              <Input name="uname" placeholder="请输入申请人" @on-enter="_formSearch"></Input>
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_formSearch">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                     ref="pageTable" :getPage="getPage">

          </PageTable>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 通过原因 -->
    <LmsChemicalApproveEdit ref="approveModal" @on-result-change="_search"></LmsChemicalApproveEdit>
    <!-- 驳回原因 -->
    <LmsChemicalDelEdit ref="delModal" @on-result-change="_search"></LmsChemicalDelEdit>
    <!-- 申请详情 -->
    <LmsChemicalDetail ref="chemicalPurchaseOrderDetail"
                                    @on-result-change="_search"></LmsChemicalDetail>
  </div>
</template>
<script>
  import LmsChemicalApproveEdit from './LmsChemicalApproveEdit.vue'
  import LmsChemicalDelEdit from './LmsChemicalDelEdit.vue'
  import LmsChemicalDetail from './LmsChemicalDetail.vue'
  import PageTable from '../../../components/table/PageTable'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsChemicalApproveEdit,
      LmsChemicalDelEdit,
      LmsChemicalDetail,
      PageTable,
      IconList,
      BreadCrumbs
    },
    data() {
      return {
        btnObj: { //按钮权限
          reason: '', //申请原因
          approve: '', //通过审批
          del: '', //驳回审批
          detail: '',//申请单详情
          putStorage:'',//出库
          deleteBtn:'',//删除
        },
        heightSearch: '',
        tableHeight: '300',
        pageColumns: [
          {title: '申请单编号', key: 'num', width: 220, align: 'center', ellipsis: true,sortable:'true', },
          {title: '申请人', key: 'uname', width: 180, align: 'center', ellipsis: true,sortable:'true', },
          {
            title: '状态', key: 'status', width: 100, ellipse: true, align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('div', {
                style: {
                  color: row.status === 0 ? '#F8BB2C' : row.status === 1 ? '#00a0e9' : 'red'
                },
              }, row.status === 0 ? '审批中' : row.status === 1 ? '已同意' : '已拒绝');
            }
          },
          {
            title: '申请原因', key: 'remark', ellipsis: true, width: 200,sortable:'true',
            render: (h, data) => {
              return h('Tooltip', {
                props: {
                  placement: 'top-start'
                },
                style: {
                  cursor: 'pointer'
                }
              }, [
                h('div', {
                  style: {
                    display: 'block',
                    maxWidth: '360px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, data.row.remark),
                h('div', {
                  slot: 'content',
                  style: {
                    padding: '3px',
                    whiteSpace: 'normal'
                  }
                }, [
                  h('div', data.row.remark)
                ])

              ]);
            }
          },

          {
            title: '申请时间', key: 'ctime', width: 160,sortable:'true',
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {
            title: '审批批注', key: 'approverRemark', ellipsis: true,sortable:'true',
            render: (h, data) => {
              return h('Tooltip', {
                props: {
                  placement: 'top-start'
                },
                style: {
                  cursor: 'pointer'
                }
              }, [
                h('div', {
                  style: {
                    display: 'block',
                    maxWidth: '380px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, data.row.approverRemark),
                h('div', {
                  slot: 'content',
                  style: {
                    padding: '3px',
                    whiteSpace: 'normal'
                  }
                }, [
                  h('div', data.row.approverRemark)
                ])

              ]);
            }
          },
          {
            title: '操作', key: 'action', width: 160, align: 'left',fixed:'right',
            render: (h, data) => {
              let status = data.row.status;
              let outStatus=data.row.outStatus;
              let operate = [];
              let btnDetail =
                h('Tooltip', {
                  props: {
                    content: '申请单详情',
                    key: '申请单详情',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._chemicalPurchaseOrderDetail(data.row);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'android-document',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.detail}, //添加自定义属性
                  })
                  ])
                ]);
              let btnReason =
                h('Tooltip', {
                  props: {
                    content: '申请原因',
                    key: '申请原因',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._editModal(data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'android-list',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.reason}, //添加自定义属性
                  })
                  ])
                ]);
              let btnApprove =
                h('Tooltip', {
                  props: {
                    content: '通过审批',
                    key: '通过审批',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._approveModal(data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'android-send',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.approve}, //添加自定义属性
                  })
                  ])
                ]);
              let btnDel =
                h('Tooltip', {
                  props: {
                    content: '驳回审批',
                    key: '驳回审批',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._delModal(data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'close',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.del}, //添加自定义属性
                  })
                  ])
                ]);
              let  putStorage =
                h('Tooltip', {
                  props: {
                    content: '出库',
                    key: '出库',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._putStorage(data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'soup-can-outline',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.putStorage}, //添加自定义属性
                  })
                  ])
                ]);
              let deleteBtn =
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
                        this._delete(data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'trash-a',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.deleteBtn}, //添加自定义属性
                  })
                  ])
                ]);
              if (this.$showBtn(this.btnObj.detail)) {
                operate.push(btnDetail);
              }
              //审批中可以操作
              if (this.$showBtn(this.btnObj.approve) == true && status == '0') {
                operate.push(btnApprove);
              }
              if (this.$showBtn(this.btnObj.del) == true && status == '0') {
                operate.push(btnDel);
              }
              //审批同意后可以出库
              if (this.$showBtn(this.btnObj.putStorage) == true && outStatus == '0'&& status == '1') {
                operate.push(putStorage);
              }
              // 拒绝状态可以操作
             /* if (this.$showBtn(this.btnObj.deleteBtn) == true && status == '2') {
                operate.push(deleteBtn);
              }*/
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
        noBtnVal: 250,
        dVal: 57,
        getPage: {}
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _contHide() {
        this._judgePanel(0);
        this._page();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemicalUse/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      //删除
      _delete(id){
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除该申请？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalUse/flowSubmit', id).then(() => {
              if (this.$store.state.LmsChemicalUse.success) {
                this.$Message.success('删除成功！');
                this._search();
              }
            });
          }
        });
      },
      _submitApprove(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定通过申请审批？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalUse/flowSubmit', id).then(() => {
              if (this.$store.state.LmsChemicalUse.success) {
                this.$Message.success('审批通过成功！');
                this._search();
              }
            });
          }
        });
      },
      _deleteById(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定驳回该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalUse/deleteById', id).then(() => {
              if (this.$store.state.LmsChemicalUse.success) {
                this._search();
                this.$Message.success('驳回成功！');
              }
            });
          }
        });
      },
      _chemicalPurchaseOrderDetail(obj) {
        this.$refs.chemicalPurchaseOrderDetail._open(obj);
      },
      _editModal(id) {
        // 编辑
        this.$store.dispatch('LmsChemicalUse/getById', id).then(() => {
          this.$refs.editModal._open(this.$store.state.LmsChemicalUse.model);
        });
      },
      _approveModal(id) {
        this.$refs.approveModal._open(id);
        // 通过原因
      /*  this.$store.dispatch('LmsChemicalUse/getById', id).then(() => {
         // this.$refs.approveModal._open(this.$store.state.LmsChemicalUse.model);
        });*/
      },
      _delModal(id) {
        // 驳回原因
        this.$store.dispatch('LmsChemicalUse/getById', id).then(() => {
          this.$refs.delModal._open(this.$store.state.LmsChemicalUse.model);
        });
      },
      _putStorage(id){
        this.$Modal.confirm({
          title: '提示',
          content: '确定出库？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalUse/OutStock', id).then(() => {
              if (this.$store.state.LmsChemicalUse.success) {
                this._search();
                this.$Message.success('出库成功！');
              }
            });
          }
        });
      },
      _search() {
        this._page();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalUse.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
