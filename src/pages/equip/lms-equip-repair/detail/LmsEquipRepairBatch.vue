<template>
  <div>
    <Modal v-model="showModal" :mask-closable="false" :width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="repair-batch-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Alert type="success" style="text-align: center;">仪器维修信息</Alert>
          <Form-item label="计划维修开始时间" prop="repairStartTimePlan" class="width-488">
            <Date-picker name="repairStartTimePlan" type="datetime" placeholder="计划维修开始时间"
                         v-model="formObj.repairStartTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="计划维修结束时间" prop="repairEndTimePlan" class="width-488">
            <Date-picker name="repairEndTimePlan" type="datetime" placeholder="计划维修结束时间"
                         v-model="formObj.repairEndTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="故障原因" prop="breakdown" style="width: 98.8%;">
            <Select v-model="formObj.breakdown" name="breakdown">
              <Option v-for="item in typeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="维修人员" prop="repairerIds" style="width: 98.8%;">
            <Select v-model="repairerList" filterable multiple @on-change="_inputChange" :label-in-value="true">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realname }}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98.8%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <input name="repairerIds" v-model="formObj.repairerIds" type="hidden"/>
          <input name="repairerNames" v-model="formObj.repairerNames" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  const defVal = {
    breakdown: '',
    remark: '',
    repairStartTimePlan: '',
    repairEndTimePlan: '',
    repairerIds: '',
    repairerNames: '',
  };
  export default {
    data() {
      return {
        showModal: false,
        modalTitle: '批量维护维修信息',
        formObj: defVal,
        ids: [],
        userList:[],
        repairerList:[],
        ruleValidate: {
          breakdown: [{required: true, message: '故障分析不能为空', trigger: 'blur'}],
        },
        typeList: []
      }
    },
    methods: {
      _open(ids) {
        this.$refs['formObj'].resetFields();
        this.showModal = true;
        this._getUserList();
        this._getBreakReason();
        this.ids = ids;
      },
      _getBreakReason() {
        this.$store.dispatch('LmsBaseDict/getItem', '仪器故障原因').then(() => {
          this.typeList = this.$store.state.LmsBaseDict.item;
        });
      },
      _getUserList() { //用户列表
        this.$store.dispatch('LmsEquipMaintain/userList').then(() => {
          this.userList = this.$store.state.LmsEquipMaintain.userList;
        });
      },
      _cancel() {
        this.showModal = false;
      },
      _ok() {
        let data=this.$serialize('repair-batch-edit');
        Object.assign(data,{ids: this.ids});
        this.$store.dispatch('LmsEquipRepairDetail/batchRepair',data).then(() => {
          if(this.$store.state.LmsEquipRepairDetail.success){
            this.$Message.success('操作成功');
            this.$emit("on-result-change");
            this.showModal = false;
          }
        });
      },
      _inputChange(obj){
        var ids = '';
        var names = '';
        obj.forEach(function (item) {
            ids = ids + item.value + ",";
            names = names + item.label + ",";
          }
        );

        this.formObj.repairerIds = ids.substring(0, ids.length - 1);
        this.formObj.repairerNames = names.substring(0, names.length - 1);
      }
    }
  }
</script>

<style scoped>

</style>
