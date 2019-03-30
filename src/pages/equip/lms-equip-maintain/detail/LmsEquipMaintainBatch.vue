<template>
  <div>
    <Modal v-model="showModal" :mask-closable="false" :width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="maintain-batch-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Alert type="success" style="text-align: center;">仪器维保信息</Alert>
          <Form-item label="维保项目名称" prop="projectName" class="width-48">
            <Input name="projectName" v-model="formObj.projectName" placeholder="请输入维保项目名称"/>
          </Form-item>
          <Form-item label="维保内容" prop="maintainContent" class="width-48">
            <Input name="maintainContent" v-model="formObj.maintainContent" placeholder="请输入维保内容"/>
          </Form-item>
          <Form-item label="计划保养开始时间" prop="maintainStartTimePlan" class="width-48">
            <Date-picker name="maintainStartTimePlan" type="datetime" placeholder="保养开始时间"
                         v-model="formObj.maintainStartTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="计划保养结束时间" prop="maintainEndTimePlan" class="width-48">
            <Date-picker name="maintainEndTimePlan" type="datetime" placeholder="保养结束时间"
                         v-model="formObj.maintainEndTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="维保保养人" prop="maintainerIds" style="width: 98%;">
            <Select v-model="maintainerList" filterable multiple @on-change="_maintainChange" :label-in-value="true">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realname }}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <input name="maintainerIds" v-model="formObj.maintainerIds" type="hidden">
          <input name="maintainerNames" v-model="formObj.maintainerNames" type="hidden">
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
    projectName: '',
    maintainContent: '',
    remark: '',
    maintainStartTimePlan: '',
    maintainEndTimePlan: '',
    maintainerIds: '',
    maintainerNames: '',
  };
  export default {
    data() {
      const validateStartDate = (rule, value, callback) => {
        if (this.formObj.maintainStartTimePlan === '') {
          callback(new Error("计划保养开始时间不能为空"));
        } else {
          callback();
        }
      };
      const validateEndDate = (rule, value, callback) => {
        if (this.formObj.maintainEndTimePlan === '') {
          callback(new Error("计划保养结束时间不能为空"));
        } else {
          callback();
        }
      };

      return {
        showModal: false,
        modalTitle: '批量维护维保信息',
        formObj: defVal,
        userList: [],
        ruleValidate: {
          projectName: [{required: true, message: '维保项目名称', trigger: 'blur'}],
          maintainContent: [{required: true, message: '维保内容', trigger: 'blur'}],
          maintainStartTimePlan: [{required: true, validator: validateStartDate, trigger: 'change'}],
          maintainEndTimePlan: [{required: true, validator: validateEndDate, trigger: 'change'}],
          maintainerIds: [{required: true, message: '维保保养人不能为空', trigger: 'change'}],
        },
        ids: [],
        maintainerList:[],
      }
    },
    methods: {
      _open(ids) {
        this.$refs['formObj'].resetFields();
        this.maintainerList = [];
        this.showModal = true;
        this._getUserList();
        this.ids = ids;
      },
      _getUserList() { //用户列表
        this.$store.dispatch('LmsEquipMaintain/userList').then(() => {
          this.userList = this.$store.state.LmsEquipMaintain.userList;
        });
      },
      _maintainChange(obj) {
        let ids = '';
        let names = '';
        obj.forEach(function (item) {
            ids = ids + item.value + ",";
            names = names + item.label + ",";
          }
        );

        this.formObj.maintainerIds = ids.substring(0, ids.length - 1);
        this.formObj.maintainerNames = names.substring(0, names.length - 1);
      },
      _cancel() {
        this.showModal = false;
      },
      _ok() {
        let data=this.$serialize('maintain-batch-edit');
        Object.assign(data,{ids: this.ids});
        this.$store.dispatch('LmsEquipMaintainDetail/batchMaintain',data).then(() => {
          if(this.$store.state.LmsEquipMaintainDetail.success){
            this.$Message.success('操作成功');
            this.$emit("on-result-change");
            this.showModal = false;
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
