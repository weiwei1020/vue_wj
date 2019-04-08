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
                <Form-item class="width-23" label="申请原因:">
                  <Input name="remark" placeholder="请输入申请原因" @on-enter="_formSearch"></Input>
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
    <!-- 申请原因 -->
    <LmsChemicalPurchaseOrderEdit ref="editModal" @on-result-change="_search"></LmsChemicalPurchaseOrderEdit>
    <!-- 通过原因 -->
    <LmsChemicalPurchaseOrderApproveEdit ref="approveModal" @on-result-change="_search"></LmsChemicalPurchaseOrderApproveEdit>
    <!-- 驳回原因 -->
    <LmsChemicalPurchaseOrderDelEdit ref="delModal" @on-result-change="_search"></LmsChemicalPurchaseOrderDelEdit>
    <!-- 采购详情 -->
    <LmsChemicalPurchaseOrderDetail ref="chemicalPurchaseOrderDetail"
                                    @on-result-change="_search"></LmsChemicalPurchaseOrderDetail>
  </div>
</template>
<script>
  import LmsChemicalPurchaseOrderApproveEdit from './LmsChemicalPurchaseOrderApproveEdit.vue'
  import LmsChemicalPurchaseOrderDelEdit from './LmsChemicalPurchaseOrderDelEdit.vue'
  import LmsChemicalPurchaseOrderEdit from './LmsChemicalPurchaseOrderEdit.vue'
  import LmsChemicalPurchaseOrderDetail from './LmsChemicalPurchaseOrderDetail.vue'
  import PageTable from '../../../components/table/PageTable'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsChemicalPurchaseOrderApproveEdit,
      LmsChemicalPurchaseOrderDelEdit,
      LmsChemicalPurchaseOrderEdit,
      LmsChemicalPurchaseOrderDetail,
      PageTable,
      IconList,
      BreadCrumbs
    },
    data() {
      return {
        btnObj: { //按钮权限
          reason: '', //申请原因
          approve: '', //提交审批
          del: '', //删除
          detail: '',//采购单详情
          putStorage:'',//入库
        },
        heightSearch: '',
        tableHeight: '300',
        pageColumns: [
          {title: '订单编号', key: 'num', width: 220, align: 'center', ellipsis: true,sortable:'true', fixed: 'left'},
          {title: '申请人', key: 'applyer', width: 180, align: 'center', ellipsis: true,sortable:'true', fixed: 'left'},

          {
            title: '状态', key: 'status', width: 150,sortable:'true',
            render: (h, data) => {
              let val = data.row.status.value;
              return h('div', {
                style: {
                  color: val == 'WAIT_APPROVAL' || val == 'WAIT_PURCHASE' ? '#00a0e9' : val == 'IN_APPROVAL' ? '#F8BB2C' : val == 'APPROVAL_FAILED' ? 'red' : '#6FBA2C'
                }
              }, data.row.status.display);
            }
          },
          {
            title: '申请原因', key: 'remark', ellipsis: true, width: 350,sortable:'true',
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
            title: '创建时间', key: 'ctime', width: 160,sortable:'true',
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {
            title: '最后修改时间', key: 'ltime', width: 160,sortable:'true',
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ltime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {
            title: '审批批注', key: 'postil', ellipsis: true, width: 420,sortable:'true',
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
                }, data.row.postil),
                h('div', {
                  slot: 'content',
                  style: {
                    padding: '3px',
                    whiteSpace: 'normal'
                  }
                }, [
                  h('div', data.row.postil)
                ])

              ]);
            }
          },
          {
            title: '操作', key: 'action', width: 160, align: 'left', fixed: 'right',
            render: (h, data) => {
              let status = data.row.status.value;
              let stockStatus = data.row.stockStatus;
              let operate = [];
              let btnDetail =
                h('Tooltip', {
                  props: {
                    content: '采购单详情',
                    key: '采购单详情',
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
                    content: '入库',
                    key: '入库',
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
                      type: 'soup-can',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.putStorage}, //添加自定义属性
                  })
                  ])
                ]);
              if (this.$showBtn(this.btnObj.detail)) {
                operate.push(btnDetail);
              }
              // 待审批状态可以操作
              if (this.$showBtn(this.btnObj.reason) == true && status == 'WAIT_APPROVAL') {
                operate.push(btnReason);
              }
            //审批中可以操作
              if (this.$showBtn(this.btnObj.approve) == true && status == 'IN_APPROVAL') {
                operate.push(btnApprove);
              }
              if (this.$showBtn(this.btnObj.del) == true && status == 'IN_APPROVAL') {
                operate.push(btnDel);
              }
              if (this.$showBtn(this.btnObj.putStorage) == true && stockStatus == '0') {
                operate.push(putStorage);
              }
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
        this.$refs.pageTable._page('search-form', 'LmsChemicalPurchaseOrder/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _submitApprove(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定通过采购审批？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalPurchaseOrder/flowSubmit', id).then(() => {
              if (this.$store.state.LmsChemicalPurchaseOrder.success) {
                this.$Message.success('审批通过成功！');
                // 刷新分页
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
            this.$store.dispatch('LmsChemicalPurchaseOrder/deleteById', id).then(() => {
              if (this.$store.state.LmsChemicalPurchaseOrder.success) {
                this._search();
                this.$Message.success('驳回成功！');
              }
            });
          }
        });
      },
      _chemicalPurchaseOrderDetail(purchaseOrder) {
        this.$refs.chemicalPurchaseOrderDetail._open(purchaseOrder);
      },
      _editModal(id) {
        // 编辑
        this.$store.dispatch('LmsChemicalPurchaseOrder/getById', id).then(() => {
          this.$refs.editModal._open(this.$store.state.LmsChemicalPurchaseOrder.model);
        });
      },
      _approveModal(id) {
        // 通过原因
        this.$store.dispatch('LmsChemicalPurchaseOrder/getById', id).then(() => {
          this.$refs.approveModal._open(this.$store.state.LmsChemicalPurchaseOrder.model);
        });
      },
      _delModal(id) {
        // 驳回原因
        this.$store.dispatch('LmsChemicalPurchaseOrder/getById', id).then(() => {
          this.$refs.delModal._open(this.$store.state.LmsChemicalPurchaseOrder.model);
        });
      },
      _putStorage(id){
        this.$Modal.confirm({
          title: '提示',
          content: '确定入库？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalPurchaseOrder/inStock', id).then(() => {
              if (this.$store.state.LmsChemicalPurchaseOrder.success) {
                this._search();
                this.$Message.success('入库成功！');
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
            this.getPage = this.$store.state.LmsChemicalPurchaseOrder.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
