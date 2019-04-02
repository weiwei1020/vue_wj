<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="通过意见" prop="reason">
            <Input name="reason" v-model="formObj.reason" type="textarea" :rows="4" placeholder="请填写审批意见"></Input>
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
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          reason: [{required: true, message: '通过原因不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        groupId:'',
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipAudit.success) {
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
            data.audit=1;
            data.groupId = this.groupId;
            data.reason=this.formObj.reason;
            this.$store.dispatch('LmsEquipAudit/passOrder', data).then(() => {
              if (this.$store.state.LmsEquipAudit.success) {
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
      _open(id) {
        this.showEditModal = true;
        this.groupId = id;
        this.modalTitle = '通过原因';
      }
    }
  }
</script>
