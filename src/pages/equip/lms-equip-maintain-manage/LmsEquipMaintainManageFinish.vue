<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="finish-edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Form-item label="计划保养开始时间" prop="maintainStartTimePlan" class="width-48">
            <Date-picker name="maintainStartTimePlan" type="datetime" placeholder="计划保养开始时间"
                         v-model="formObj.maintainStartTimePlan" style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="计划保养结束时间" prop="maintainEndTimePlan" class="width-48">
            <Date-picker name="maintainEndTimePlan" type="datetime" placeholder="计划保养结束时间"
                         v-model="formObj.maintainEndTimePlan" style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="实际保养开始时间" prop="maintainStartTimeAct" class="width-48">
            <Date-picker name="maintainStartTimeAct" type="datetime" placeholder="实际保养开始时间"
                         v-model="formObj.maintainStartTimeAct" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="实际保养结束时间" prop="maintainEndTimeAct" class="width-48">
            <Date-picker name="maintainEndTimeAct" type="datetime" placeholder="实际保养结束时间"
                         v-model="formObj.maintainEndTimeAct" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="维保费用" prop="maintainFee" class="width-48">
            <InputNumber name="maintainFee" :min="0" v-model="formObj.maintainFee" :precision-="2"
                         style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-48">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"/>
          </Form-item>
          <Input name="detailId" v-model="formObj.detailId" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(2)" type="success">保养完成</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    detailId: '',
    status: '',
    maintainStartTimePlan: '',
    maintainEndTimePlan: '',
    maintainStartTimeAct: '',
    maintainEndTimeAct: '',
    maintainFee: 0,
    remark: '',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          maintainFee: [{required: true, type: 'number', message: '维保费用不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipMaintainManage.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      //如果填写日期，那么日期不能小于实际开始日期，并且不能大于当前日期
      _validateDate() {
        return true;
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            valid = this._validateDate();//验证时间
          }
          if (valid) {
            var data = this.$serialize('finish-edit-form');
            this.$extend(data, {status: status});
            this.$store.dispatch('LmsEquipMaintainManage/edit', {id: this.formObj.id, obj: data}).then(() => {
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
        this.$refs['formObj'].resetFields();
        this.id = formObj.id;
        this.formObj = formObj;

        if (formObj.maintainFee === undefined) {
          this.formObj.maintainFee = '';
        }
        this.modalTitle = '保养完成';
        this.formObj.maintainStartTimePlan = formObj.maintainStartTimePlan ? new Date(formObj.maintainStartTimePlan) : '';
        this.formObj.maintainEndTimePlan = formObj.maintainEndTimePlan ? new Date(formObj.maintainEndTimePlan) : '';
        this.formObj.maintainStartTimeAct = formObj.maintainStartTimeAct ? new Date(formObj.maintainStartTimeAct) : '';
        this.formObj.maintainEndTimeAct = new Date();

      },
    }
  }
</script>
