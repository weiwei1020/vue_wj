<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform"  :label-width="80">
          <Form-item label="耗材名称" prop="chemicalName" >
            <Input name="chemicalName" v-model="chemicalName" readonly></Input>
          </Form-item>
          <Form-item label="规格型号" prop="spec" >
            <Input name="spec" v-model="spec" readonly></Input>
          </Form-item>
          <Form-item label="剩余量" prop="surplusQuantity" >
            <Input name="surplusQuantity" v-model="surplusQuantity" readonly></Input>
          </Form-item>
        </Form>
        <Form id="edit-add-purform-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="使用量" prop="usageQuantity">
            <Input name="usageQuantity" v-model="formObj.usageQuantity" placeholder="请输入使用量"></Input>
          </Form-item>
          <Form-item label="使用原因" prop="receiveRemark">
            <Input name="receiveRemark" v-model="formObj.receiveRemark" placeholder="请输入使用原因"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    usageQuantity: '',
    receiveRemark:'',
  };
  export default {
    data() {
      const validateNumber = (rule, value, callback) => {
        let  reg = /^\+?[1-9]\d*$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('数量只能输入整数'));
        }
      };
      return {
        modalTitle: '',
        formObj: defVal,
        showEditModal: false,
        supplierList: [],
        ruleValidate: {
          receiveRemark: [{required: true, message: '使用原因不能为空', trigger: 'blur'}],
          usageQuantity: [{required: true, message: '使用量不能为空', trigger: 'blur'}],
        },
        id: '',
        chemicalName:'',
        surplusQuantity:'',
        spec:'',
      }
    },
    methods: {
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform-edit');
            data.ReceiveId = this.id;
            data.usageQuantity = this.formObj.usageQuantity;
            data.receiveRemark = this.formObj.receiveRemark;
            if(parseInt(this.formObj.usageQuantity)>parseInt(this.surplusQuantity)){
              this.$Message.warning('使用量不能大于剩余量！');
            }else{
              // 编辑
              this.$store.dispatch('LmsChemicalUseHistory/addUse', {ReceiveId: this.id, obj: data}).then(() => {
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
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalUseHistory.success) {
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change");
        }
      },
      _open(data) { //编辑
        this.showEditModal = true;
        this.modalTitle=data.chemicalName+'一 使用记录';
        this.id = data.id;
        this.chemicalName=data.chemicalName;
        this.spec=data.spec;
        this.surplusQuantity=data.surplusQuantity;
      },
    }
  }
</script>
