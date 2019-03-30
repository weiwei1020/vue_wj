<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="finish-edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Form-item label="计划维修开始时间" prop="repairStartTimePlan" class="width-48">
            <Date-picker name="repairStartTimePlan" type="datetime" placeholder="计划维修开始时间"
                         v-model="formObj.repairStartTimePlan" style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="计划维修结束时间" prop="repairEndTimePlan" class="width-48">
            <Date-picker name="repairEndTimePlan" type="datetime" placeholder="计划维修结束时间"
                         v-model="formObj.repairEndTimePlan" style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="实际维修开始时间" prop="repairStartTimeAct" class="width-48">
            <Date-picker name="repairStartTimeAct" type="datetime" placeholder="实际维修开始时间"
                         v-model="formObj.repairStartTimeAct" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="实际维修结束时间" prop="repairEndTimeAct" class="width-48">
            <Date-picker name="repairEndTimeAct" type="datetime" placeholder="实际维修结束时间"
                         v-model="formObj.repairEndTimeAct" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="维修方式" prop="repairMethod" class="width-97-8333">
            <Input name="repairMethod" v-model="formObj.repairMethod" placeholder="请输入维修方式"/>
          </Form-item>
          <Form-item label="故障原因" prop="breakdown" class="width-48">
            <Input name="breakdown" v-model="formObj.breakdown" readonly/>
          </Form-item>
          <Form-item label="维修费用" prop="repairFee" class="width-48">
            <InputNumber name="repairFee" :min="0" :precision="2" v-model.number="formObj.repairFee"
                         style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-97-8333">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"/>
          </Form-item>
          <Input name="detailId" v-model="formObj.detailId" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(2)" type="success">维修完成</Button>
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
    repairMethod: '',
    repairFee: 0,
    repairStartTimePlan: '',
    repairEndTimePlan: '',
    repairStartTimeAct: '',
    repairEndTimeAct: '',
    remark: '',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          repairMethod: [{required: true, message: '维修方式不能为空', trigger: 'blur'}],
          repairFee: [{required: true, type: 'number', min: 1, message: '维修费用不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
      }
    },
    mounted() {
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipRepairManage.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _validateDate() {
       if (this.formObj.repairEndTimeAct < this.formObj.repairStartTimeAct) {
          this.$Message.warning('实际维修结束时间不能早于实际维修开始时间');
          return false;
        } else {
          return true;
        }
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            valid = this._validateDate();//验证时间
          }
          if (valid) {
            var data = this.$serialize('finish-edit-form');
            this.$extend(data, {status: status});
            this.$store.dispatch('LmsEquipRepairManage/edit', {id: this.formObj.id, obj: data}).then(() => {
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
        this.formObj.repairFee = 0;
        this.formObj.repairStartTimePlan = formObj.repairStartTimePlan ? new Date(formObj.repairStartTimePlan) : '';
        this.formObj.repairEndTimePlan = formObj.repairEndTimePlan ? new Date(formObj.repairEndTimePlan) : '';
        this.formObj.repairStartTimeAct = formObj.repairStartTimeAct ? new Date(formObj.repairStartTimeAct) : '';
        this.formObj.repairEndTimeAct=new Date();
        this.modalTitle = '维修结束';
      },
    }
  }
</script>
