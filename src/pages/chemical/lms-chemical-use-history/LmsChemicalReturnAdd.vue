<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="400">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform-add" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80" inline>
          <Form-item label="归还数量" prop="consunmableStock" style="width: 100%">
            <InputNumber :min="1" v-model.number="formObj.consunmableStock" style="width: 100%"></InputNumber>
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
    consunmableStock: 1,
    purchaseRemark:'',
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
        }
      }
    },
    methods: {
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform-add');
            data.purchaseId= this.formObj.purchaseId;
            data.consunmableStock = this.formObj.consunmableStock;
            data.purchaseRemark =this.formObj.purchaseRemark;
            // 添加
            this.$store.dispatch('LmsChemicalReturn/add', data).then(() => {
              if (this.$store.state.LmsChemicalReturn.success) {
                this.showEditModal = false;
                this.$Message.success('归还单提交成功！');
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
      _open(obj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.modalTitle = '归还单：耗材名称 一 ' + obj.name;//耗材名称
        this.formObj.purchaseId=obj.purchaseId;
        this.formObj.consunmableStock = 1;
        this.formObj.purchaseRemark = '';
      },
    }
  }
</script>
