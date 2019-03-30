<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1000">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Collapse style="margin-bottom: 10px;" class="coll-search">
          <Panel>查询条件
            <p slot="content">
            <Form id="edit-form-chemical-purchase" inline onsubmit="return false" :label-width="90">
              <Form-item class="width-23" label="仪器名称:">
                <Input  name="name" placeholder="请输入仪器名称" @on-enter="_search"></Input>
              </Form-item>
              <Form-item class="marleft-90">
                <Button type="primary" @click="_search">搜索</Button>
              </Form-item>
            </Form>
            </p>
          </Panel>
        </Collapse>
        <Row>
          <Col span="24" style="margin-bottom: 10px;">
          <div>
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </div>
          </Col>
          <!-- 表格 -->
          <Col span="24">
          <Table :loading="loading" :columns="pageColumns" :data="formObj.records" size="small" border highlight-row
                 stripe :height="300" @on-selection-change="_selectRowChange" @on-select-all='_selectAll'></Table>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <!--<Button @click="_ok" id="submitApproveBtn" type="primary">提交审批</Button>-->
      </div>
    </Modal>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  export default {
    components: {
      BtnList
    },
    data() {
      return {
        btn:[
          {type:'error',id:'chemical-purchase-order-detail-del-all',name:'批量移除'},
        ],
        btnObj:{ //按钮权限
          save:'chemical-purchase-order-detail-save',
          del:'chemical-purchase-order-detail-del'
        },
        loading: true,
        purchaseOrder: {},
        orderStatus: 0,
        queryData: {},
        formObj: {},
        quantity: '',
        remark: '',
        modalTitle: '',
        showEditModal: false,
        min: 1,
        selectIds: [],
        DATA: {},
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {
            title: '申请状态', key: 'status', "width": 100, "ellipsis": true, fixed: 'left',
            render: (h, data) => {
              return h('div', data.row.status.display);
            }
          },
          {
            title: '仪器名称', key: 'names', width: 400, align: 'center', ellipsis: true, fixed: 'left',
          },
          {title: '预约人', key: 'applyName', width: 200, align: 'center', ellipsis: true,},

          {
           title: '预约使用开始时间', key: 'orderStartTime', "width": 150, align: 'center',
           render: (h, params) => {
             return h('div', params.row.orderStartTime ? this.$dateformat(params.row.orderStartTime, "yyyy-mm-dd HH:MM:ss") : '');
           }
         },
         {
           title: '预约使用结束时间', key: 'orderEndTime', "width": 150, ellipsis: true, align: 'center',
           render: (h, params) => {
             return h('div', params.row.orderEndTime ? this.$dateformat(params.row.orderEndTime, "yyyy-mm-dd HH:MM:ss") : '');
           }
         },
        ],
        groupId:'',
        id:'',
      }
    },
    mounted(){
     // this._open(id);
    },
    methods: {
      _page() {
       /* this.queryData.purchaseId = this.purchaseOrder.id;
        this.queryData.obj = this._searchParams();*/
       this.queryData.groupId=this.groupId;
        this.$store.dispatch('LmsEquipOrder/editById', this.queryData).then(() => {
          this.loading = false;
          this.formObj = this.$store.state.LmsEquipOrder.page;
        });
      },
      _ok() {
        this.$Modal.confirm({
          title: '提示',
          content: '确定提交采购审批？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalPurchaseOrder/flowSubmit', [this.purchaseOrder.id]).then(() => {
              if (this.$store.state.LmsChemicalPurchaseOrder.success) {
                this.$Message.success('审批提交成功！');
                this.showEditModal = false;
                this.$emit("on-result-change");
              }
            });
          }
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(id) {
        this.groupId = id;
       /* let status = purchaseOrder.status.value;
        // 待审批显示 " 提交审批 " 按钮
        if (status == 'WAIT_APPROVAL') {
          $('#submitApproveBtn').show();
        } else {
          $('#submitApproveBtn').hide();
        }
        let pageColumns = [];
        // 0、待审批 允许删除
        if (status == 'WAIT_APPROVAL') {
          pageColumns.push({type: 'selection', width: 60, align: 'center'});
          $('#batchDeleteBtn').show();
        } else {
          pageColumns.push({type: 'index', title:'序号', width: 60, align: 'center'});
          $('#batchDeleteBtn').hide();
        }*/
        /*let pageColumns = [];
        this.showEditModal = true;*/
        this.modalTitle = '采购单详情';
      /*  pageColumns.push({title: '仪器名称', key: 'name', width: 100,ellipsis: true,});
        pageColumns.push({title: '仪器编号', key: 'equipId', ellipsis: true, width: 120,
          render: (h, params) => {
            return h('Tooltip', {
              props: {
                placement: 'top-start'
              },
              style:{
                cursor:'pointer'
              }
            }, [
              h('div', {
                style:{
                  display:'block',
                  maxWidth:'80px',
                  overflow:'hidden',
                  whiteSpace:'nowrap',
                  textOverflow:'ellipsis'
                }
              },params.row.chemicalName),
              h('div', {
                slot: 'content',
                style:{
                  padding:'3px',
                  whiteSpace: 'normal'
                }
              }, [
                h('div', params.row.chemicalName)
              ])
            ]);
          }
        });
        pageColumns.push({title: '单价', key: 'price', width: 100, ellipsis: true});
       /!* if (status == 'WAIT_APPROVAL') {
          pageColumns.push(
            {
              title: '采购量', key: 'quantity', width: 120, align: 'center',
              render: (h, data) => {
                this.quantity = data.row.quantity;
                return h('InputNumber', {
                  props: {value: data.row.quantity, min: this.min},
                  on: {
                    input: (val) => {
                      this.quantity = val;
                    },
                  },
                });
              },
            },
          );
        }else{
          pageColumns.push({ title: '采购量', key: 'quantity', width: 100, align: 'center',ellipsis: true});
        }*!/
        pageColumns.push({
          title: '供应商', key: 'supplier', width: 200, ellipsis: true,
          render: (h, data) => {
            return h('div', [
              h('div', {
                on: {
                  click: () => {
                    if (data.row.status.value != 'WAIT_PURCHASE') {
                      this._changeSupplier(data.row.id, data.row.purchaseId);
                    }
                  }
                }
              }, null == data.row.supplier ? "/" : data.row.supplier),
            ]);
          }
        });

        pageColumns.push({title: '备注', key: 'remark', ellipsis: true, width: 285,
          render: (h, params) => {
            return h('Tooltip', {
              props: {
                placement: 'top-start'
              },
              style:{
                cursor:'pointer'
              }
            }, [
              h('div', {
                style:{
                  display:'block',
                  maxWidth:'245px',
                  overflow:'hidden',
                  whiteSpace:'nowrap',
                  textOverflow:'ellipsis'
                }
              },params.row.remark),
              h('div', {
                slot: 'content',
                style:{
                  padding:'3px',
                  whiteSpace: 'normal'
                }
              }, [
                h('div', params.row.remark)
              ])
            ]);
          }
        });
       /!* if (status == 'WAIT_APPROVAL') {
          pageColumns.push({
            title: '操作', key: 'action', width: 160, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              let btnSave =
                h('Button', {
                  props: {type: 'info', size: 'small',},
                  style: {marginRight: '5px'},
                  attrs:{id:this.btnObj.save}, //添加自定义属性
                  on: {
                    click: () => {
                      this._saveStore(data.row.id);
                    }
                  }
                }, '保存');
              let btnDel =
                h('Button', {
                  props: {type: 'error', size: 'small',},
                  attrs:{id:this.btnObj.del}, //添加自定义属性
                  on: {
                    click: () => {
                      this._remove(data.row.id, data.row.status);
                    }
                  }
                }, '移除');
              if(this.$showBtn(this.btnObj.save)){
                operate.push(btnSave);
              }
              if(this.$showBtn(this.btnObj.del)){
                operate.push(btnDel);
              }
              return h('div',operate.length > 0 ? operate : '--');
            }
          });
        }*!/
        this.pageColumns = pageColumns;*/
        // 刷新界面
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('edit-form-chemical-purchase');
        return this.$extend(data);
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _remove(id, status) { //移除一条数据
        if (status == 'APPROVAL_FAILED') {
          this.$Message.error('采购单正在审批无法移除！');
          return false;
        }
        if (status == 'END') {
          this.$Message.error('采购已完成无法移除！');
          return false;
        }
        this._deletePurIds([id]);
      },
      _deletePurIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定移除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalPurchase/deletePurIds', {id: this.purchaseOrder.id, ids: ids}).then(() => {
              if (this.$store.state.LmsChemicalPurchase.success) {
                this._page();
                this.$Message.success('移除成功！');
              }
            });
          }
        });
      },
      _deleteSelected() {  // 批量移除
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deletePurIds(ids, '确定移除 ' + ids.length + ' 条记录？');
        }
      },
      _search() {
        this._page();
      },
      _saveStore(id) { //保存
        this.DATA.quantity = this.quantity;//数量
        this.DATA.id = id;
        this.$Modal.confirm({
          title: '提示',
          content: '确定要保存数量？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalPurchase/changeQuantity', this.DATA).then(() => {
              if (this.$store.state.LmsChemicalPurchase.success) {
                this._search();
                this.$Message.success('保存成功！');
              }
            });
          }
        });

      },
      _btnClick(msg){
        switch (msg){
          case '批量移除' :
            this._deleteSelected();
            break;
        }
      },
    }
  }
</script>
