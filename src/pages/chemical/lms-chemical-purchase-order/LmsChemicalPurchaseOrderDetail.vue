<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1000">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Collapse style="margin-bottom: 10px;" class="coll-search">
          <Panel>查询条件
            <p slot="content">
            <Form id="edit-form-chemical-purchase" inline onsubmit="return false" :label-width="90">
             <!-- <Form-item class="width-23" label="耗材编号:">
                <Input  name="chemicalNum" placeholder="请输入耗材编号" @on-enter="_search"></Input>
              </Form-item>-->
              <Form-item class="width-23" label="耗材名称:">
                <Input  name="chemicalName" placeholder="请输入耗材名称" @on-enter="_search"></Input>
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
          <div v-show="delBtn">
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </div>
          </Col>
          <!-- 采购单基本信息 -->
          <Col span="24" style="margin-bottom: 10px">
          <table class="tableClass">
            <tbody>
            <tr>
              <th>订单编号</th>
              <td>{{purchaseOrder.num}}</td>
              <th>状态</th>
              <td>{{purchaseOrder.status == 0 ? '禁用' : '正常'}}</td>
              <th>创建时间</th>
              <td>{{this.$dateformat(purchaseOrder.ctime, "yyyy-mm-dd HH:MM")}}</td>
            </tr>
            <tr>
              <th>申请原因</th>
              <td colspan="5">{{purchaseOrder.remark}}</td>
            </tr>
            </tbody>
          </table>
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
        <Button @click="_recall" id="recallApproveBtn" type="danger">驳回审批</Button>
        <Button @click="_pass" id="submitApproveBtn" type="success">通过审批</Button>
      </div>
    </Modal>
    <!-- 通过原因 -->
    <LmsChemicalPurchaseOrderApproveEdit ref="approveModal" @on-result-change="_search"></LmsChemicalPurchaseOrderApproveEdit>
    <!-- 驳回原因 -->
    <LmsChemicalPurchaseOrderDelEdit ref="delModal" @on-result-change="_search"></LmsChemicalPurchaseOrderDelEdit>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  import LmsChemicalPurchaseOrderApproveEdit from './LmsChemicalPurchaseOrderApproveEdit.vue'
  import LmsChemicalPurchaseOrderDelEdit from './LmsChemicalPurchaseOrderDelEdit.vue'


  export default {
    components: {
      BtnList,
      LmsChemicalPurchaseOrderApproveEdit,
      LmsChemicalPurchaseOrderDelEdit,
    },
    data() {
      return {
        btn:[
          {type:'error',id:'',name:'批量移除'},
        ],
        btnObj:{ //按钮权限
          save:'',
          del:''
        },
        delBtn:false,
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
        pageColumns: [],
      }
    },
    methods: {
      _page() {
        this.queryData.purchaseId = this.purchaseOrder.id;
        this.queryData.obj = this._searchParams();
        this.$store.dispatch('LmsChemicalPurchase/purchaseChemicalPage', this.queryData).then(() => {
          this.loading = false;
          this.formObj = this.$store.state.LmsChemicalPurchase.page;
        });
      },
      //驳回
      _recall(){
            this.$store.dispatch('LmsChemicalPurchaseOrder/getById', [this.purchaseOrder.id]).then(() => {
              this.$refs.delModal._open(this.$store.state.LmsChemicalPurchaseOrder.model);
              this.showEditModal = false;
              this.$emit("on-result-change");
            });
      },
      //通过
      _pass(){
            this.$store.dispatch('LmsChemicalPurchaseOrder/getById', [this.purchaseOrder.id]).then(() => {
              this.$refs.approveModal._open(this.$store.state.LmsChemicalPurchaseOrder.model);
              this.showEditModal = false;
              this.$emit("on-result-change");
            });
      },
      _delModal(id) {
        // 驳回原因
        this.$store.dispatch('LmsChemicalPurchaseOrder/getById', id).then(() => {
          this.$refs.delModal._open(this.$store.state.LmsChemicalPurchaseOrder.model);
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
        let status = purchaseOrder.status.value;
        // 待审批显示 " 提交审批 " 按钮
        if (status == 'IN_APPROVAL') {//WAIT_APPROVAL
          $('#submitApproveBtn').show();
          $('#recallApproveBtn').show();
          this.delBtn=true;

        } else {
          $('#submitApproveBtn').hide();
          $('#recallApproveBtn').hide();
          this.delBtn=false;
        }
        let pageColumns = [];
        // 0、待审批 允许删除
        if (status == 'IN_APPROVAL') {
          pageColumns.push({type: 'selection', width: 60, align: 'center'});
          $('#batchDeleteBtn').show();
        } else {
          pageColumns.push({type: 'index', title:'序号', width: 60, align: 'center'});
          $('#batchDeleteBtn').hide();
        }
        this.showEditModal = true;
        this.modalTitle = '采购单详情';
        pageColumns.push({title: '耗材编号', key: 'chemicalNum', width: 100,ellipsis: true,});
        pageColumns.push({title: '耗材名称', key: 'chemicalName', ellipsis: true, width: 120,
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
        if (status == 'WAIT_APPROVAL') {
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
        }
     /*   pageColumns.push({title: '规格', key: 'spec', width: 100, ellipsis: true});*/
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
//        pageColumns.push({title: '制造厂商', key: 'manufacturer', width: 200, ellipsis: true});

       // pageColumns.push({title: '已入库量', key: 'alreadyQuantity', width: 100, ellipsis: true});
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
        if (status == 'WAIT_APPROVAL') {
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
        }
        this.pageColumns = pageColumns;
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
           /* this.$store.dispatch('LmsChemicalPurchase/deletePurIds', {id: this.purchaseOrder.id, ids: ids}).then(() => {
              if (this.$store.state.LmsChemicalPurchase.success) {
                this._page();
                this.$Message.success('移除成功！');
              }
            });*/
            this.$store.dispatch('LmsChemicalPurchase/deleteParent', ids).then(() => {
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
        this.$emit("on-result-change");
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
