<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="start-edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
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
          <Input name="detailId" v-model="formObj.detailId" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(1)" type="info">开始维修</Button>
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
    repairStartTimePlan: '',
    repairEndTimePlan: '',
    repairStartTimeAct: '',
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
        // if (this.formObj.repairStartTimeAct < this.formObj.repairStartTimePlan) {
        //   this.$Message.warning('实际维修开始时间不能早于计划维修开始时间');
        //   return false;
        // } else if (this.formObj.repairEndTimeAct < this.formObj.repairStartTimeAct) {
        //   this.$Message.warning('实际维修结束时间不能早于实际维修开始时间');
        //   return false;
        // } else {
        //   return true;
        // }
        return true;
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            valid = this._validateDate();//验证时间
          }
          if (valid) {
            var data = this.$serialize('start-edit-form');
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
        this.id = formObj.id;
        this.formObj = formObj;
        this.formObj.repairStartTimePlan = formObj.repairStartTimePlan ? new Date(formObj.repairStartTimePlan) : '';
        this.formObj.repairEndTimePlan = formObj.repairEndTimePlan ?new Date(formObj.repairEndTimePlan) : '';
        this.formObj.repairStartTimeAct=new Date();
        this.modalTitle = '开始维修';
      },
    }
  }
</script>
