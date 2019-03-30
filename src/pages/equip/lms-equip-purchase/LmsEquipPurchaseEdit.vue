<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false" width="1100">
            <p slot="header">{{modalTitle}}</p>
            <div>
              <Alert>
                <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline class="coll-search">
                  <Form-item label="申请名称" prop="name" class="width-32">
                    <Input name="name" v-model="formObj.name" placeholder="请输入申请名称"></Input>
                  </Form-item>
                  <Form-item label="申请原因" prop="applyReason" class="width-32">
                    <Input name="applyReason" v-model="formObj.applyReason" placeholder="请输入申请原因"></Input>
                  </Form-item>
                  <Form-item label="备注" prop="remark" class="width-32">
                    <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
                  </Form-item>
                </Form>
              </Alert>
              <!--采购详情-->
              <Row>
                <Col span="24" style="margin-bottom: 10px;">
                <div>
                  <Button type="success" @click="_editModal">添加</Button>
                  <Button type="error" @click="_deleteSelected">删除</Button>
                </div>
                </Col>
                <!-- 表格 -->
                <Col span="24" style="margin-bottom: 10px">
                <Table :columns="pageColumns" :data="getPageList" size="small" border highlight-row stripe
                       @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="250"></Table>
                </Col>
              </Row>
            </div>
            <div slot="footer">
                <Button @click="_cancel"  style="margin-left: 8px">取消</Button>
                <Button @click="_ok(0)"   style="margin-left: 8px">草稿</Button>
                <Button @click="_ok(1)" type="primary">提交</Button>
            </div>
        </Modal>
      <!--添加仪器采购明细-->
      <LmsEquipPurchasedEdit ref="editModal" @on-result-change="_purchaseData"></LmsEquipPurchasedEdit>
    </div>
</template>

<script>
    /**
     * 添加编辑仪器采购订单表
     */
    const defVal = {
        name: '',
        applyReason: '',
        remark: '',
    };
    import IconList from '../../../components/base/IconList1.vue'
    import LmsEquipPurchasedEdit from './detail/LmsEquipPurchaseDetailEdit.vue'
    export default {
      components: {
        LmsEquipPurchasedEdit,
        IconList
      },
        data() {
            return {
                id: '',
                modalTitle: '',
                formObj: defVal,
                dataObj:{
                  purchaseId:'',
                },
                ruleValidate: {
                  name: [{required: true, message: '申请名称不能为空', trigger: 'blur'}],
                  applyReason: [{required: true, message: '申请名称不能为空', trigger: 'blur'}],
                },
                selectIds: [],
                getPageList:[],
                showEditModal: false,
                pageColumns: [
                  {type: 'selection', width: 60, align: 'center',fixed: 'left',},
                  {title: '仪器名称', key: 'name', width: 200, align: 'center',ellipsis:true,},
                  {title: '规格型号', key: 'spec', width: 200, align: 'center',ellipsis:true,},
                  {title: '供应商', key: 'supplierName', width: 200, align: 'center',ellipsis:true,},
                  {title: '仪器类型', key: 'className', width: 200, align: 'center',ellipsis:true,},
                  {title: '仪器品牌', key: 'brand', width: 200, align: 'center',ellipsis:true,},
                  {title: '仪器价格', key: 'price', width: 200, align: 'center',ellipsis:true,},
                  {title: '制造厂商', key: 'productPlace', width: 200, align: 'center',ellipsis:true,},
                  {title: '计量类别', key: 'meterType', width: 200, align: 'center',ellipsis:true,},
                  {title: '不确定度', key: 'uncertainty', width: 200, align: 'center',ellipsis:true,},
                  {title: '仪器精度', key: 'accuracy', width: 200, align: 'center',ellipsis:true,},
                  {title: '使用范围', key: 'range', width: 200, align: 'center',ellipsis:true,},
                  {title: '技术参数', key: 'techParamsText', width: 200, align: 'center',ellipsis:true,},
                  {title: '数量', key: 'counts', width: 160, align: 'center',ellipsis:true,},
                  {title: '用途', key: 'uses', width: 160, align: 'center',ellipsis:true,},
                  {title: '备注', key: 'productRemark', width: 160, align: 'center',ellipsis:true,},
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
              iconMsg:[
                {type:'close',id:'sys-area-add',name:'移除'},
              ],
            }
        },
        computed: {
        },
        mounted() {

        },
        methods: {
          _iconClick(res,data){
            switch (res){
              case '移除' :
                this._deleteById(data.row.id);
                break;
            }
          },
            _open(formObj) {
              this.showEditModal = true;
              this.$refs['formObj'].resetFields();
              if (this.$string(formObj).isEmpty()) {
                this.modalTitle = '添加仪器采购订单表';
                this.$store.dispatch('LmsEquipPurchase/getTemp').then(() => {//查询有没有添加但没有保存的数据
                  this.dataObj.purchaseId=this.$store.state.LmsEquipPurchase.model.id;
                  this.getPageList=this.$store.state.LmsEquipPurchase.model.lmsEquipPurchaseDetailVOList;
                });
              }else{
                this.formObj=formObj;
                this.id = formObj.id;
                this.dataObj.purchaseId=formObj.id;
                this.getPageList=formObj.lmsEquipPurchaseDetailVOList;
                this.modalTitle = '编辑仪器采购订单表';
              }
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
          _deleteByIds(ids, content) {
            this.$Modal.confirm({
              title: '提示',
              content: content ? content : '确定删除该记录？',
              onOk: () => {
                this.$store.dispatch('LmsEquipPurchaseDetail/deleteByIds', ids).then(() => {
                  if (this.$store.state.LmsEquipPurchaseDetail.success) {
                    this._purchaseData();
                    this.$Message.success('删除成功！');
                  }
                });
              }
            });
          },
          _deleteById(id) {// 删除一条记录
            this.$Modal.confirm({
              title: '提示',
              content: '确定删除该记录？',
              onOk: () => {
                this.$store.dispatch('LmsEquipPurchaseDetail/deleteByIds', id).then(() => {
                  if (this.$store.state.LmsEquipPurchaseDetail.success) {
                    this._purchaseData();
                    this.$Message.success('删除成功！');
                  }
                });
              }
            });
          },
          _deleteSelected() {// 批量删除
            var ids = this.selectIds;
            if (ids == '') {
              this.$Message.warning('请选择一条或多条数据！');
            } else {
              this._deleteByIds(ids, '确定删除 ' + ids.length + ' 条记录？');
            }
          },
            _editModal() { //添加
              this.$refs.editModal._open(this.dataObj.purchaseId);
            },
            _resultChange(msg) {
                if (this.$store.state.LmsEquipPurchase.success) {
                    this.formObj = defVal;
                    this.showEditModal = false;
                    this.$Message.success(msg);
                    this.$emit("on-result-change");
                }
            },
            _ok(status) {
               this.$refs['formObj'].validate((valid) => {
                 if (valid) {
                   if(status==1&&(this.getPageList==''||this.getPageList==undefined)){
                     this.$Message.warning('请添加仪器后再提交！');
                     return;
                   }
                     var data = this.$serialize('edit-form');
                     this.$extend(data,{status:status});
                     if (this.$string(this.id).isEmpty()) {
                         // 添加
                         this.$store.dispatch('LmsEquipPurchase/add', data).then(() => {
                             this._resultChange('添加成功!');
                         });
                     } else {
                       // 编辑
                       this.$store.dispatch('LmsEquipPurchase/edit', {id: this.formObj.id, obj: data}).then(() => {
                         this._resultChange('编辑成功!');
                       });
                     }
                 } else {
                     this.$Message.error('表单验证失败!');
                 }
               });
            },
            _cancel() {
                this.showEditModal = false;
            },
            _purchaseData(){
              this.$store.dispatch('LmsEquipPurchaseDetail/list',this.dataObj).then(()=>{
                this.getPageList = this.$store.state.LmsEquipPurchaseDetail.list;
              });
            },
        }
    }
</script>
