<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form-chemical-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="85"
              inline>
          <Form-item label="耗材编号" prop="num" class="width-48">
            <Input name="num" v-model="formObj.num" placeholder="可自动生成"></Input>
          </Form-item>
          <Form-item label="耗材名称" prop="name" class="width-48">
            <Input name="name" v-model="formObj.name" placeholder="请输入耗材名称" ></Input>
          </Form-item>
          <Form-item label="耗材类别" prop="consumable" class="width-48">
            <Input name="consumable" v-model="formObj.consumable" @on-click="_categoryZtree"
                   icon="plus-circled" readonly placeholder="请选中耗材类别"></Input>
            <input name="consumableId" v-model="formObj.consumableId" type="hidden"/>
          </Form-item>
          <Form-item label="仓库位置" prop="storehouse" class="width-48">
            <Input name="storehouse" v-model="formObj.storehouse" placeholder="请填写仓库位置" ></Input>
          </Form-item>
          <Form-item label="库存量" prop="stock" class="width-48">
            <InputNumber :min="0"  v-model.number="formObj.stock" name="stock"
                         style="width:100%">
            </InputNumber>
          </Form-item>
          <Form-item label="计量单位" prop="unit" class="width-48">
            <Input name="unit" v-model="formObj.unit" placeholder="请输入计量单位"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 96%;">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_reset" type="ghost" style="margin-left: 8px">重置</Button>
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
    <!-- 上级类别  ztree  -->
    <LmsSelectCategoryZtree ref="ztreeModal" @on-result-change="_ztree"></LmsSelectCategoryZtree>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材详情表
   */
  const defVal = {
    id: '',
    num: '', //编号
    name: '',
    unit: '',
    consumable: '',
    consumableId:'',
    stock:'',//库存量
    storehouse:'',
    remark: '',
  };
  import LmsSelectCategoryZtree from './LmsSelectCategoryZtree.vue'


  export default {
    components: {
      LmsSelectCategoryZtree,
    },
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '耗材名称不能为空', trigger: 'blur'}],
          consumable: [{required: true, message: '耗材类别不能为空', trigger: 'change'}],
        },
        showEditModal: false,
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalManage.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form-chemical-edit');
            this.$extend(data, {
              id:this.formObj.id,
              unit: this.formObj.unit,
            });
            if (this.$string(this.id).isEmpty()) {
              // 添加);
              this.$store.dispatch('LmsChemicalManage/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsChemicalManage/edit', data).then(() => {
                this._resultChange('编辑成功!');
              });
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _reset(){
        this.formObj=[];
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(treeObj, formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = {};
          this.modalTitle = '添加试验耗材';
          this.storehouse = '';
          if (JSON.stringify(treeObj) !== '{}') {
            this.formObj.consumable = treeObj.consumableSortName;
            this.formObj.consumableId = treeObj.consumableSortId;
          } else {
            this.formObj.consumable = '';
            this.formObj.consumableId = '';
          }
        } else {
          this.id = formObj.id;
          this.formObj.consumable = formObj.consumable;
          this.formObj.consumableId = formObj.consumableId;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材';
          this.formObj.storehouse = formObj.storehouse;
        }
      },
      _categoryZtree() {
        this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
      },
      _ztree(result) {
        this.formObj.consumableId = result.consumableSortId;
        this.formObj.consumable = result.consumableSortName;
      },
    }
  }
</script>
