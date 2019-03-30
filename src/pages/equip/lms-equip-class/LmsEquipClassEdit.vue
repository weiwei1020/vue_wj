<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="上级类别" prop="pname">
            <Input name="pname" v-model="pname" placeholder="请选择上级类别" @click.native="_selectZtree" icon="plus-circled"
                   readonly></Input>
          </Form-item>
          <Form-item label="类别名" prop="name">
            <Input name="name" v-model="formObj.name" placeholder="请输入类别名"></Input>
          </Form-item>
          <Form-item label="描述" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入描述" type="textarea" :rows="5"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel('formObj')" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok('formObj')" type="primary">提交</Button>
      </div>
    </Modal>
    <!--上级类别弹出树-->
    <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  import LmsEquipClassZTree from './LmsEquipClassZTree.vue'

  const defVal = {
    name: '',
    pid: '',
    remark: '',
  };
  export default {
    components: {
      LmsEquipClassZTree
    },
    data() {
      return {
        id: '',
        modalTitle: '添加仪器分类',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '类别名不能为空', trigger: 'blur'}],
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
            if (data.pname === undefined) {
              this.$extend(data, {pid: 0});
            } else {
              this.$extend(data, {pid: this.formObj.pid});
            }
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipClass/add', data).then(() => {
                this._resultChange('添加成功!');
                this.id = '';
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipClass/edit', {id: this.formObj.id, obj: data}).then(() => {
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
          this.formObj = defVal;
          this.pname = '';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this.pname = formObj.pname;
          this.modalTitle = '编辑';
        }
      },
      _selectZtree() {
        if (this.$string(this.id).isEmpty()){
          this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        }else{
          this.$refs.ztreeModal._openZtree(this.formObj.pid);  //打开上ztreeModel
        }
      },
      _ztree(result) {
        this.pname = '';
        if (result === undefined) {
          this.formObj.pid = '0';
          this.pname = '';
        } else {
          this.formObj.pid = result.id;
          this.pname = result.name;
        }

      },
    }
  }
</script>
