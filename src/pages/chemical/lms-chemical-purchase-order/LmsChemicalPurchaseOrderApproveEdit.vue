<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="通过意见" prop="reason">
            <Input name="reason" v-model="formObj.reason" type="textarea" :rows="4" placeholder="默认同意，可不填"></Input>
          </Form-item>
          <Form-item label="通知供应商" prop="supplierPush">
            <RadioGroup v-model="supplierPush">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
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
   * 添加通过原因
   */
  const defVal = {
    reason: '审批通过',
    supplierPush:'0',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        showEditModal: false,
        supplierPush:'0',
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalPurchaseOrder.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            let data = this.$serialize('edit-form');
            data.id = this.id;
            data.postil=this.formObj.reason;
            data.supplierPush=this.supplierPush;
            this.$store.dispatch('LmsChemicalPurchaseOrder/flowSubmit', data).then(() => {
              if (this.$store.state.LmsChemicalPurchaseOrder.success) {
                this._resultChange('审批通过成功！');
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
      _open(formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.id = formObj.id;
        this.formObj = formObj;
        this.modalTitle = '通过原因';
      }
    }
  }
</script>
