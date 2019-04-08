<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="通过意见" prop="approverRemark">
            <Input name="approverRemark" v-model="formObj.approverRemark" type="textarea" :rows="4" placeholder="默认同意，可不填"></Input>
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
    approverRemark: '同意该申请',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '通过原因',
        formObj: defVal,
        showEditModal: false,
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalUse.success) {
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
            data.approverRemark=this.formObj.approverRemark;
            data.status=1;
            this.$store.dispatch('LmsChemicalUse/approval', data).then(() => {
              if (this.$store.state.LmsChemicalUse.success) {
                this._resultChange('已同意该申请！');
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
      _open(id) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.id = id;
        this.formObj = formObj;
        this.modalTitle = '通过原因';
      }
    }
  }
</script>
