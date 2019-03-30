<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="start-edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
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
          <Input name="detailId" v-model="formObj.detailId" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(1)" type="info">开始保养</Button>
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
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {},
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
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('start-edit-form');
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
        this.modalTitle = '开始保养';
        this.formObj.maintainStartTimePlan = formObj.maintainStartTimePlan ? new Date(formObj.maintainStartTimePlan) : '';
        this.formObj.maintainEndTimePlan = formObj.maintainEndTimePlan ? new Date(formObj.maintainEndTimePlan) : '';
        this.formObj.maintainStartTimeAct=new Date();
      },
    }
  }
</script>
