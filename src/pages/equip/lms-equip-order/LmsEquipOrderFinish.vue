<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="800">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="finish-edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Form-item label="实际使用开始时间" prop="useStartTime" class="width-48">
            <Date-picker name="useStartTime" type="datetime" placeholder="实际使用开始时间"
                         v-model="formObj.useStartTime" style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="实际使用结束时间" prop="useEndTime" class="width-48">
            <Date-picker name="useEndTime" type="datetime" placeholder="实际使用结束时间"
                         v-model="formObj.useEndTime" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="开始性能" prop="startPerformance" class="width-48">
            <Input name="startPerformance" v-model="formObj.startPerformance" placeholder="请输入开始性能"/>
          </Form-item>
          <Form-item label="结束性能" prop="endPerformance" class="width-48">
            <Input name="endPerformance" v-model="formObj.endPerformance" placeholder="请输入结束性能"/>
          </Form-item>
          <Form-item label="检测编号/批号" prop="checkNum" class="width-48">
            <Input name="checkNum" v-model="formObj.checkNum" placeholder="请输入检测编号/批号"/>
          </Form-item>
          <Form-item label="检测项目" prop="checkItem" class="width-48">
            <Input name="checkItem" v-model="formObj.checkItem" placeholder="请输入检测项目"/>
          </Form-item>
          <Form-item label="其他要求" prop="other" class="width-48">
            <Input name="other" v-model="formObj.other" placeholder="请输入其他要求"/>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-48">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"/>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="success">使用完成</Button>
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
    useEndTime: '',
    startPerformance: '',
    endPerformance: '',
    checkNum: '',
    checkItem: '',
    other: '',
    remark: '',
  };
  export default {
    data() {
      const validateTime = (rule, value, callback) => {
        if (!this.formObj.useEndTime) {
          callback(new Error("实际使用结束时间不能为空"));
        } else if (this.formObj.useEndTime > new Date()) {
          callback(new Error("实际使用结束时间不能大于当前时间"));
        } else if (this.formObj.useEndTime < this.formObj.useStartTime) {
          callback(new Error("实际使用结束时间不能小于实际使用开始时间"));
        } else {
          callback();
        }
      };
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          useEndTime: [{validator: validateTime, trigger: 'change'}],
          endPerformance: [{required: true, message: '结束性能不能为空', trigger: 'blur'}],
          checkNum: [{required: true, message: '检测编号/批号不能为空', trigger: 'blur'}],
          checkItem: [{required: true, message: '检测项目不能为空', trigger: 'blur'}],
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
            var data = this.$serialize('finish-edit-form');
            Object.assign(data, {id: this.id});
            this.$store.dispatch('LmsEquipOrder/endUse', data).then(() => {
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
      _open(formObj) {
        this.showEditModal = true;
        this.id = formObj.id;
        this.formObj = formObj;
        this.formObj.useStartTime = this.formObj.useStartTime ? new Date(formObj.useStartTime) : '';
        this.formObj.useEndTime = new Date();
        this.modalTitle = '编辑';

      }
    }
  }
</script>
