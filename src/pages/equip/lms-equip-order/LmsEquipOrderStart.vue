<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="800">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="start-edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Form-item label="实际使用开始时间" prop="useStartTime" class="width-48">
            <Date-picker name="useStartTime" type="datetime" placeholder="实际使用开始时间"
                         v-model="formObj.useStartTime" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="开始性能" prop="startPerformance" class="width-48">
            <Input name="startPerformance" v-model="formObj.startPerformance" placeholder="请输入开始性能"/>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="info">开始使用</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    useStartTime: '',
    startPerformance: '',
  };
  export default {
    data() {
      const validateStartTime = (rule, value, callback) => {
        if (!this.formObj.useStartTime) {
          callback(new Error("实际使用开始时间不能为空"));
        } else if (this.formObj.useStartTime > new Date()) {
          callback(new Error("实际使用开始时间不能大于当前时间"));
        } else {
          callback();
        }
      };
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          useStartTime: [{validator: validateStartTime, trigger: 'change'}],
          startPerformance: [{required: true, message: '开始性能不能为空', trigger: 'blur'}],
        },
        showEditModal: false
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipOrder.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('start-edit-form');
            Object.assign(data,{id:this.id});
            this.$store.dispatch('LmsEquipOrder/startUse', data).then(() => {
              this._resultChange('编辑成功!');
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
        this.id=id;
        this.modalTitle = '编辑';
        this.formObj.useStartTime = new Date()
      }
    }
  }
</script>
