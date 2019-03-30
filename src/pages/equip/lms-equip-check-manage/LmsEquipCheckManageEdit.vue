<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700" :styles="{top:'200px'}">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="110" inline>
          <Form-item label="实施过程" prop="process" style="width:98%">
            <Input name="process" v-model="formObj.process" placeholder="请输入实施过程" type="textarea" :rows="2"></Input>
          </Form-item>
          <Form-item label="实际核查开始时间" prop="checkStartTimeAct" class="width-48">
            <Date-picker name="checkStartTimeAct" type="datetime" placeholder="实际核查开始时间"
                         v-model="formObj.checkStartTimeAct" style="width: 100%;"/>
          </Form-item>
          <Form-item label="实际核查结束时间" prop="checkEndTimeAct" class="width-48">
            <Date-picker name="checkEndTimeAct" type="datetime" placeholder="实际核查结束时间" v-model="formObj.checkEndTimeAct"
                         style="width: 100%;"/>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width:98%">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(0)" type="warning">保存</Button>
        <Button @click="_ok(1)" type="primary">提交实施</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    checkId: '',
    process: '',
    processFiles: '',
    remark: '',
    companyId: '',
    status: '',
    checkStartTimeAct: '',
    checkEndTimeAct: '',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {},
        showEditModal: false
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipCheckManage.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            this.$extend(data, {status: status});
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipCheckManage/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipCheckManage/edit', {id: this.formObj.id, obj: data}).then(() => {
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
          this._showTime();
          this.modalTitle = '编辑';
        }
      },
      _showTime() {
        if (this.formObj.checkStartTimeAct === undefined) {
          this.formObj.checkStartTimeAct = '';
        } else {
          this.formObj.checkStartTimeAct = new Date(this.formObj.checkStartTimeAct);
        }
        if (this.formObj.checkEndTimeAct === undefined) {
          this.formObj.checkEndTimeAct = '';
        } else {
          this.formObj.checkEndTimeAct = new Date(this.formObj.checkEndTimeAct);
        }
      },
    }
  }
</script>
