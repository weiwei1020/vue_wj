<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline>
          <Form-item label="企业ID" prop="companyId" class="width-48">
            <Input name="companyId" v-model="formObj.companyId" placeholder="请输入企业ID"></Input>
          </Form-item>
          <Form-item label="合同仪器ID" prop="contractEquipId" class="width-48">
            <Input name="contractEquipId" v-model="formObj.contractEquipId" placeholder="请输入合同仪器ID"></Input>
          </Form-item>
          <Form-item label="使用来源" prop="useSource" class="width-48">
            <Input name="useSource" v-model="formObj.useSource" placeholder="请输入使用来源"></Input>
          </Form-item>
          <Form-item label="领用人ID" prop="receiptorId" class="width-48">
            <Input name="receiptorId" v-model="formObj.receiptorId" placeholder="请输入领用人ID"></Input>
          </Form-item>
          <Form-item label="领用人" prop="receiptor" class="width-48">
            <Input name="receiptor" v-model="formObj.receiptor" placeholder="请输入领用人"></Input>
          </Form-item>
          <Form-item label="领用时间" prop="receiveDate" class="width-48">
            <Input name="receiveDate" v-model="formObj.receiveDate" placeholder="请输入领用时间"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-48">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
          <Form-item label="创建人ID" prop="uid" class="width-48">
            <Input name="uid" v-model="formObj.uid" placeholder="请输入创建人ID"></Input>
          </Form-item>
          <Form-item label="创建时间" prop="ctime" class="width-48">
            <Input name="ctime" v-model="formObj.ctime" placeholder="请输入创建时间"></Input>
          </Form-item>
          <Form-item label="最后修改人ID" prop="lid" class="width-48">
            <Input name="lid" v-model="formObj.lid" placeholder="请输入最后修改人ID"></Input>
          </Form-item>
          <Form-item label="最后修改时间" prop="ltime" class="width-48">
            <Input name="ltime" v-model="formObj.ltime" placeholder="请输入最后修改时间"></Input>
          </Form-item>
          <Form-item label="是否删除" prop="deleted" class="width-48">
            <Input name="deleted" v-model="formObj.deleted" placeholder="请输入是否删除"></Input>
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
   * 添加编辑
   */
  const defVal = {
    companyId: '',
    contractEquipId: '',
    useSource: '',
    receiptorId: '',
    receiptor: '',
    receiveDate: '',
    remark: '',
    uid: '',
    ctime: '',
    lid: '',
    ltime: '',
    deleted: '',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          companyId: [{required: true, message: '企业ID不能为空', trigger: 'blur'}],
          contractEquipId: [{required: true, message: '合同仪器ID不能为空', trigger: 'blur'}],
          useSource: [{required: true, message: '使用来源不能为空', trigger: 'blur'}],
          receiptorId: [{required: true, message: '领用人ID不能为空', trigger: 'blur'}],
          receiptor: [{required: true, message: '领用人不能为空', trigger: 'blur'}],
          receiveDate: [{required: true, message: '领用时间不能为空', trigger: 'blur'}],
          remark: [{required: true, message: '备注不能为空', trigger: 'blur'}],
          uid: [{required: true, message: '创建人ID不能为空', trigger: 'blur'}],
          ctime: [{required: true, message: '创建时间不能为空', trigger: 'blur'}],
          lid: [{required: true, message: '最后修改人ID不能为空', trigger: 'blur'}],
          ltime: [{required: true, message: '最后修改时间不能为空', trigger: 'blur'}],
          deleted: [{required: true, message: '是否删除不能为空', trigger: 'blur'}],
        },
        showEditModal: false
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipReturnManage.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
        if (valid) {
          var data = this.$serialize('edit-form');
          if (this.$string(this.id).isEmpty()) {
            // 添加
            this.$store.dispatch('LmsEquipReturnManage/add', data).then(() => {
              this._resultChange('添加成功!');
            });
          } else {
            // 编辑
            this.$store.dispatch('LmsEquipReturnManage/edit', {id: this.formObj.id, obj: data}).then(() => {
            this._resultChange('编辑成功!');
          });
          }
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
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.modalTitle = '添加';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this.modalTitle = '编辑';
        }
      }
    }
  }
</script>