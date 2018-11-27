<template>
  <div>
    <Modal v-model="showSubmitModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form  ref="formObj" :model="formObj" :rules="ruleValidate"  :label-width="80">
          <Form-item  :label="modalTitle" prop="remark">
            <Input  v-model="formObj.remark" :placeholder="placeholder" style="width:100%"></Input>
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
   * 退回原因(全局)
   */
  export default {
    components: {
    },
    data() {
      return {
        modalTitle: '',
        showSubmitModal: false,
        formObj:{
          remark:'',
        },
        ruleValidate: {
          remark: [{required: true, message: '内容不能为空', trigger: 'blur'}],
        },
        placeholder:''
      }
    },
    methods: {
      _open(title) {
        this.modalTitle = title;
        this.placeholder = '请输入'+title;
        this.showSubmitModal = true;
        this.formObj.remark =''
      },
      _cancel(){
        this.showSubmitModal = false;
      },
      _ok(){
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            this.$emit('on-result-change',this.formObj.remark);
            this.showSubmitModal = false;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
    }
  }
</script>
