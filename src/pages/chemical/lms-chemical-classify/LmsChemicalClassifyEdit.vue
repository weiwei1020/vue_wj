<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form-classify-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90">
          <Form-item label="归类名称" prop="name">
            <Input name="name" v-model="formObj.name" placeholder="请输入归类名称"></Input>
          </Form-item>
          <Form-item label="归类库存量" prop="stock">
            <InputNumber name="stock" v-model="formObj.stock" :min="0" style="width: 100%;"></InputNumber>
          </Form-item>
          <Form-item label="计量方式" prop="unit">
            <Select v-model="formObj.unit" clearable filterable style="width:100%" placeholder="请选择计量方式">
              <Option v-for="item in unitList" :value="item.name" :key="item.name">{{item.name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="预警库存量" prop="warning">
            <InputNumber name="warning" v-model="formObj.warning" :min="0" style="width: 100%;"></InputNumber>
          </Form-item>
          <Form-item label="预警通知" prop="inform">
            <Select name="inform" v-model="formObj.inform" style="width:100%">
              <Option :value="1">开启</Option>
              <Option :value="0">关闭</Option>
            </Select>
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
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材归类表
   */
  const defVal = {
    name: '',
    stock: 0,
    unit: '',
    warning: 0,
    inform: 1,
    remark:'',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '名归类名称不能为空', trigger: 'blur'}],
          stock: [{required: true, message: '归类库存量不能为空', trigger: 'blur',type:'number'}],
          unit: [{required: true, message: '计量方式不能为空', trigger: 'blur'}],
          warning: [{required: true, message: '预警库存量不能为空', trigger: 'blur',type:'number'}],
        },
        showEditModal: false,
        unitList:[],
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalClassify.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form-classify-edit');
            this.$extend(data, {
              unit: this.formObj.unit,
            });
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsChemicalClassify/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsChemicalClassify/edit', {id: this.formObj.id, obj: data}).then(() => {
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
        this._getUnit(); //获取单位列表
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.modalTitle = '添加试验耗材归类表';
        } else {
          console.log("232323===",formObj);
          this.id = formObj.id;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材归类表';
        }
      },
      _getUnit(){
        this.$store.dispatch('LmsChemical/getUnit').then(() => {
          this.unitList = this.$store.state.LmsChemical.unitList;
        });
      },
    }
  }
</script>
