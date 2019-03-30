<template>
  <div>
    <Modal v-model="showModal" :mask-closable="false" :width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Alert type="success" style="text-align: center;">仪器报废信息</Alert>
        <Form id="scrap-batch-edit" ref="formObj" :model="formObj" inline :rules="ruleValidate" :label-width="90">
          <Form-item label="金额" prop="money" class="width-48">
            <InputNumber name="money" v-model.number="formObj.money" :min="0" placeholder="请输入金额" :precision="2"
                         style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="报废原因" prop="reason" class="width-48">
            <Input name="reason" v-model="formObj.reason" placeholder="请输入报废原因"/>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98.6%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
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
    money: 0,
    reason:'',
    remark: '',
  };
  export default {
    data() {
      return {
        showModal: false,
        modalTitle: '批量维护报废信息',
        formObj: defVal,
        ids: [],
        ruleValidate:{}
      }
    },
    methods: {
      _open(ids) {
        this.$refs['formObj'].resetFields();
        this.showModal = true;
        this.ids = ids;
      },
      _cancel() {
        this.showModal = false;
      },
      _ok() {
        let data = this.$serialize('scrap-batch-edit');
        Object.assign(data, {ids: this.ids});
        this.$store.dispatch('LmsEquipScrapDetail/batchScrap', data).then(() => {
          if (this.$store.state.LmsEquipScrapDetail.success) {
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
