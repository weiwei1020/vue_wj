<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="类别名称" prop="apparatusSortName">
            <Input name="apparatusSortName" v-model="formObj.apparatusSortName" placeholder="请输入类别名称"></Input>
          </Form-item>
          <Form-item label="描述" prop="apparatusSortRemark">
            <Input name="apparatusSortRemark" v-model="formObj.apparatusSortRemark" placeholder="请输入描述" type="textarea" :rows="5"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel('formObj')" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok('formObj')" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    apparatusSortName: '',
    apparatusSortId: '',
    apparatusSortRemark: '',
  };
  export default {
    components: {},
    data() {
      return {
        id: '',
        modalTitle: '添加仪器分类',
        formObj: defVal,
        ruleValidate: {
          apparatusSortName: [{required: true, message: '类别名称不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        pname: ''
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipClass.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change");
          this.$bus.$emit('class','class')
        }
      },
      _ok(name) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            this.$extend(data, {
              apparatusSortId: this.formObj.apparatusSortId,
            });
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipClass/add', data).then(() => {
                this._resultChange('添加成功!');
                this.id = '';
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipClass/edit', data).then(() => {
                this._resultChange('编辑成功!');
                this.id = '';
              });
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel(name) {
        this.showEditModal = false;
        this.id = '';
      },
      _open(formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
        } else {
          this.id = formObj.apparatusSortId;
          this.formObj = formObj;
          this.modalTitle = '编辑仪器分类';
        }
      },
    }
  }
</script>
