<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="900">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form-chemical-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="85"
              inline>
          <Form-item label="耗材编号" prop="chemicalNum" class="width-31-5">
            <Input name="chemicalNum" v-model="formObj.chemicalNum" placeholder="可自动生成"></Input>
          </Form-item>
          <Form-item label="耗材名称" prop="chemicalName" class="width-31-5">
            <autoComplete name="chemicalName"  placeholder="请输入耗材名称"
                          :downData="nameList" :value="formObj.chemicalName" @on-result-change="_nameChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="耗材类别"  class="width-31-5">
            <Input v-model="category" @on-click="_categoryZtree"
                   icon="plus-circled" readonly placeholder="请选中耗材类别"></Input>
            <input name="categoryId" v-model="categoryId" type="hidden"/>
          </Form-item>
          <Form-item label="采购数量" prop="quantity" class="width-31-5">
            <InputNumber :min="1"  v-model.number="formObj.quantity" name="quantity"
                         style="width:100%">
            </InputNumber>
          </Form-item>
          <Form-item label="单价" prop="price" class="width-31-5">
            <InputNumber  :min="1"  v-model.number="formObj.price" name="price"  style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="规格" prop="spec" class="width-31-5">
            <Input name="spec" v-model="formObj.spec" placeholder="请输入规格"></Input>
          </Form-item>
          <Form-item label="供应商" prop="supplier" class="width-31-5">
            <autoComplete name="supplier"  placeholder="请输入制造商"
                          :downData="supplierList" :value="formObj.supplier" @on-result-change="_supplierChange"
            ></autoComplete>
          </Form-item>
          <!--<Form-item label="供应商电话" prop="suppliertel" class="width-31-5">
            <autoComplete name="suppliertel"  placeholder="请输入供应商联系方式" :value="formObj.suppliertel"
                          :downData="telList"  @on-result-change="_telChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="供应商邮箱" prop="supplieremil" class="width-31-5">
            <autoComplete name="supplieremil"  placeholder="请输入供应商email" :value="formObj.supplieremil"
                          :downData="emailList"  @on-result-change="_emailChange"
            ></autoComplete>
          </Form-item>-->
          <Form-item label="制造商" prop="manufacturer" class="width-31-5">
            <autoComplete name="manufacturer"  placeholder="请输入制造商"
                          :downData="manufacturerList" :value="formObj.manufacturer" @on-result-change="_manufacturerChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-31-5">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_reset" type="ghost" style="margin-left: 8px">重置</Button>
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">添加到采购单</Button>
      </div>
    </Modal>
    <!-- 上级类别  ztree  -->
    <LmsSelectCategoryZtree ref="ztreeModal" @on-result-change="_ztree"></LmsSelectCategoryZtree>
  </div>
</template>
<script>
  /**
   * 采购新耗材
   */
  const defVal = {
    chemicalNum: '', //编号
    categoryId:'',
    price: '',
    id: '',
    chemicalName: '',
    manufacturer: '',
    spec: '',
    remark: '',
    supplier:'',//供应商
    quantity:'',//采购数量
  };
  // import UserChemicalCategory from '../../../../components/lims/UserChemicalCategory.vue'
  import LmsSelectCategoryZtree from './LmsSelectCategoryZtree.vue'
  import autoComplete from '../../../components/base/autoComplete.vue'


  export default {
    components: {
      // UserChemicalCategory,
      LmsSelectCategoryZtree,
      autoComplete
    },
    data() {
      return {
        id: '',
        modalTitle: '',
        unitList: [],
        formObj: defVal,
        validDate: '',
        ruleValidate: {
          chemicalName: [{required: true, message: '耗材名称不能为空', trigger: 'blur'}],
          categoryId: [{required: true, message: '耗材类别不能为空', trigger: 'change'}],
        },
        showEditModal: false,
        categoryId: '',
        category: '',
        nameListTemp:[],
        nameList: [],
        name:'',
        storehouseListTemp:[],
        storehouseList:[],
        manufacturerListTemp:[],
        manufacturerList:[],
        supplierListTemp:[],
        supplierList:[],
      }
    },
    methods: {
      //从字典中查询类别
      _dicSearch() {
        this.$store.dispatch('LmsBaseDict/getItem', '耗材名称').then(() => {
          let nameList = this.$store.state.LmsBaseDict.item;
          this.nameList = nameList;
          this.nameListTemp = nameList;
        });
        this.$store.dispatch('LmsBaseDict/getItem', '耗材制造厂商').then(() => {
          let manufacturerList = this.$store.state.LmsBaseDict.item;
          this.manufacturerList = manufacturerList;
          this.manufacturerListTemp = manufacturerList;
        });
        this.$store.dispatch('LmsBaseDict/getItem', '耗材供应商').then(() => {
          let supplierList = this.$store.state.LmsBaseDict.item;
          this.supplierList = supplierList;
          this.supplierListTemp = supplierList;
        });
      },
      //耗材名称
      _nameChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.chemicalName = data;
            break;
          default:
            this._nameQuery(data);
        }
      },
      _nameQuery(query) {
        this.formObj.chemicalName = query;
        if (query === '') {
          this.nameList = this.nameListTemp;
        } else {
          this.nameList = this.nameListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //制造商
      _manufacturerChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.manufacturer = data;
            break;
          default:
            this._manufacturerQuery(data);
        }
      },
      _manufacturerQuery(query) {
        this.formObj.manufacturer = query;
        if (query === '') {
          this.manufacturerList = this.manufacturerListTemp;
        } else {
          this.manufacturerList = this.manufacturerListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //供应商
      _supplierChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.supplier = data;
            break;
          default:
            this._supplierQuery(data);
        }
      },
      _supplierQuery(query) {
        this.formObj.supplier = query;
        if (query === '') {
          this.supplierList = this.supplierListTemp;
        } else {
          this.supplierList = this.supplierListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalPurchase.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            let data = this.$serialize('edit-form-chemical-edit');
            this.$extend(data, {
              spec: this.formObj.spec,
            });
            // if (this.$string(this.id).isEmpty()) {
              // 添加);
              this.$store.dispatch('LmsChemicalPurchase/addNewChemical', data).then(() => {
                this._resultChange('添加成功!');
              });
            /*} else {
              // 编辑
              this.$store.dispatch('LmsChemical/edit', {id: this.id, obj: data}).then(() => {
                this._resultChange('编辑成功!');
              });
            }*/
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
      //  if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = {};
          this.modalTitle = '采购新耗材';
       /* } else {
          this.id = formObj.id;
          this.category = formObj.category;
          this.categoryId = formObj.categoryId;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材';
          this.storehouse = formObj.storehouse;
        }*/
        this._dicSearch();
      },
      _categoryZtree() {
        this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
      },
      _ztree(result) {
        this.categoryId = result.id;
        this.category = result.name;
      },
    }
  }
</script>
