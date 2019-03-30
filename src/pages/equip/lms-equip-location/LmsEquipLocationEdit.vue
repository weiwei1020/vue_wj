<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" >
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90">
          <Form-item label="上级位置" prop="pid">
            <Input name="pname" v-model="pname" placeholder="请先选择类别"  @click.native="_selectZtree" icon="plus-circled" readonly></Input>
          </Form-item>
          <Form-item label="名称" prop="name">
            <Input name="name" v-model="formObj.name" placeholder="请输入点位名称"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
    <!--上级类别弹出树-->
    <LmsEquipLocationZtree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipLocationZtree>
  </div>
</template>
<script>
  import LmsEquipLocationZtree from './LmsEquipLocationZtree.vue'
  /**
   * 添加编辑仪器位置信息表
   */
  const defVal = {
    name: '',
    pid: '',
    remark: '',
    companyId: '',
    pname:'',
  };
  export default {
    components: {
      LmsEquipLocationZtree
    },
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        pname:'',
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipLocation.success) {
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
          if (data.pname == undefined){
            this.$extend(data, {pid: 0});
          } else {
            this.$extend(data, {pid: this.formObj.pid} );
          }

          if (this.$string(this.id).isEmpty()) {
            // 添加
            this.$store.dispatch('LmsEquipLocation/add', data).then(() => {
              this._resultChange('添加成功!');
              this._reset(name);
              this.id = '';
            });
          } else {
            // 编辑
            this.$store.dispatch('LmsEquipLocation/edit', {id: this.formObj.id, obj: data}).then(() => {
            this._resultChange('编辑成功!');
            this.id = '';
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
        this.formObj.pname= '';
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.pname='';
          this.modalTitle = '添加仪器位置信息表';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this.pname=formObj.pname;
          this.modalTitle = '编辑仪器位置信息表';
        }
      },
      _selectZtree() {
        if (this.$string(this.id).isEmpty()) {
          this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        }else{
          this.$refs.ztreeModal._openZtree(this.formObj.pid);  //打开上ztreeModel
        }
      },
      _ztree(result) {
        this.pname='';
        if(result === undefined){ //未选中数据的时候
          this.formObj.pid = '0';
          this.formObj.pname = '';
        }else{                 //选中数据以后
          this.formObj.pid = result.id;
          this.pname = result.name;
        }
      },
    }
  }
</script>
