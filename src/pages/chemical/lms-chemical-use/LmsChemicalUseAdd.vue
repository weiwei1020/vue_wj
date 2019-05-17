<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="400">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform-add" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80" inline>
          <Form-item label="领用人" prop="purchasePerson" style="width: 100%">
            <Input name="purchasePerson" v-model="formObj.purchasePerson" placeholder="请输入领用人" disabled></Input>
          </Form-item>
          <Form-item label="当前库存" style="width: 100%">
            <Input name="stock" v-model="stock" disabled></Input>
          </Form-item>
          <Form-item label="领用数量" prop="consunmableStock" style="width: 100%">
            <InputNumber :max="stock" :min="1" v-model.number="formObj.consunmableStock" style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="领用原因" prop="reason" style="width: 100%">
            <Input name="reason" v-model="formObj.reason" placeholder="请输入原因"></Input>
          </Form-item>
          <Form-item label="备注" prop="purchaseRemark" style="width: 100%">
            <Input name="purchaseRemark" v-model="formObj.purchaseRemark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    purchaseId:'',
    purchaseConsumableId:'',
    name:'',
    consunmableStock: 1,
    reason:'',
    purchaseRemark: '',
    purchasePerson:localStorage.getItem('personName')
  };
  export default {
    data() {
      const validateNumber = (rule, value, callback) => { //只能输入正整数，不能输入小数
        let reg = /^\+?[1-9]\d*$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('数量只能输入整数'));
        }
      };
      return {
        modalTitle: '',
        chemicalId: '',
        formObj: defVal,
        showEditModal: false,
        supplierList: [],
        ruleValidate: {
          consunmableStock: [
            {validator: validateNumber, trigger: 'blur', type: 'number'}
          ],
          reason: [{required: true, message: '领用原因不能为空', trigger: 'change'}],
        },
        stock:'',
      }
    },
    methods: {
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform-add');
            data.purchaseId= this.formObj.purchaseId;
            data.purchaseConsumableId= this.formObj.purchaseConsumableId;
            data.name = this.formObj.name;
            data.consunmableStock = this.formObj.consunmableStock;
            data.reason = this.formObj.reason;
            data.purchaseRemark =this.formObj.purchaseRemark;
            data.purchasePerson = this.formObj.purchasePerson;
            // 添加
            this.$store.dispatch('LmsChemicalUse/add', data).then(() => {
              if (this.$store.state.LmsChemicalUse.success) {
                this.showEditModal = false;
                this.$Message.success('申请提交成功！');
                this.$emit("on-result-change")
              }
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _check(consunmableStock){
         if(consunmableStock>this.stock){
           this.$Message.warning('库存不足！');
           this.formObj.consunmableStock = 1;
         }
      },
      _open(obj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.modalTitle = '领用单：耗材名称 一 ' + obj.name;//耗材名称
        this.formObj.purchaseConsumableId = obj.id;
        this.formObj.name = obj.name;
        this.formObj.consunmableStock = 1;
        this.formObj.purchaseRemark = '';
        this.formObj.reason='';
        this.formObj.purchasePerson=localStorage.getItem('personName');
        this.stock=obj.stock
      },
    }
  }
</script>
