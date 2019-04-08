<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="900">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form-chemical-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="85"
              inline>
          <Form-item label="耗材编号" prop="num" class="width-31-5">
            <Input name="num" v-model="formObj.num" placeholder="可自动生成"></Input>
          </Form-item>
          <Form-item label="耗材名称" prop="name" class="width-31-5">
            <!--<Input name="name" v-model="formObj.name" placeholder="请输入耗材名称"></Input>-->
            <autoComplete name="name"  placeholder="请输入耗材名称"
                          :downData="nameList" :value="formObj.name" @on-result-change="_nameChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="耗材类别" prop="category" class="width-31-5">
            <Input name="category" v-model="formObj.category" @on-click="_categoryZtree"
                   icon="plus-circled" readonly placeholder="请选中耗材类别"></Input>

            <input name="categoryId" v-model="categoryId" type="hidden"/>

          </Form-item>
          <Form-item label="仓库位置" prop="storehouse" class="width-31-5">
            <autoComplete name="storehouse"  placeholder="请填写仓库位置" :value="formObj.storehouse"
                          :downData="storehouseList"  @on-result-change="_storehouseChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="库存量" prop="stock" class="width-31-5">
            <InputNumber :min="1"  v-model.number="formObj.stock" name="stock"
                         style="width:100%">
            </InputNumber>
          </Form-item>
          <Form-item label="计量单位" prop="unit" class="width-31-5">
            <Input name="unit" v-model="formObj.unit" placeholder="请输入计量单位"></Input>

          </Form-item>

          <Form-item label="供应商" prop="supplier" class="width-31-5">
            <autoComplete name="supplier"  placeholder="请输入制造商"
                          :downData="supplierList" :value="formObj.supplier" @on-result-change="_supplierChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="供应商电话" prop="suppliertel" class="width-31-5">
            <autoComplete name="suppliertel"  placeholder="请输入供应商联系方式" :value="formObj.suppliertel"
                          :downData="telList"  @on-result-change="_telChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="供应商邮箱" prop="supplieremil" class="width-31-5">
            <autoComplete name="supplieremil"  placeholder="请输入供应商email" :value="formObj.supplieremil"
                          :downData="emailList"  @on-result-change="_emailChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="制造商" prop="manufacturer" class="width-31-5">
            <autoComplete name="manufacturer"  placeholder="请输入制造商"
                          :downData="manufacturerList" :value="formObj.manufacturer" @on-result-change="_manufacturerChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 63%;">
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
    <!--仓库 tree-->
    <RelStoreHoseTree ref="relStoreModal" @on-result-change="_relStoreZtree"></RelStoreHoseTree>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材详情表
   */
  const defVal = {
    batchNo: '',
    price: '',
    id: '',
    typeId: '',
    name: '',
    num: '', //编号
    spec: '',
    unsure: '',
    status: '',
    manufacturer: '',
    quality: '',
    standard: '',
    unit: '',
    exchange: 1,
    exunit: '',
    remark: '',
    category: '',
    supplier:'',//供应商
    stock:'',//库存量
    categoryList:[
      {id:0,name:'贵重耗材'},
      {id:1,name:'危险品'},

    ],//类别列表
  };
  import UserChemicalCategory from '../../../components/lims/UserChemicalCategory.vue'
  import LmsSelectCategoryZtree from './LmsSelectCategoryZtree.vue'
  import RelStoreHoseTree from './RelStoreHoseTree.vue'
  import  autoComplete from '../../../components/base/autoComplete.vue'


  export default {
    components: {
      UserChemicalCategory,
      LmsSelectCategoryZtree,
      RelStoreHoseTree,
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
          name: [{required: true, message: '耗材名称不能为空', trigger: 'blur'}],
          category: [{required: true, message: '耗材类别不能为空', trigger: 'change'}],
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
        telList:[],
        telListTemp:[],
        emailList:[],
        emailListTemp:[],
      }
    },
    methods: {
      //从字典中查询类别
      _dicSearch() {
        this.$store.dispatch('LmsBaseDict/getItem', '耗材名称').then(() => {
          let nameList = this.$store.state.LmsBaseDict.item;
          /*for (let i = 0; i < nameList.length; i++) {
            if(nameList[i] != null) {
              list.push(nameList[i].name)
            }
          }*/
          this.nameList = nameList;
          this.nameListTemp = nameList;
        });
        this.$store.dispatch('LmsBaseDict/getItem', '耗材仓库位置').then(() => {
          let storehouseList = this.$store.state.LmsBaseDict.item;
          this.storehouseList = storehouseList;
          this.storehouseListTemp = storehouseList;
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
        //供应商联系方式
        this.$store.dispatch('LmsBaseDict/getItem', '耗材供应商电话').then(() => {
          let telList = this.$store.state.LmsBaseDict.item;
          this.telList = telList;
          this.telListTemp = telList;
        });
        // email
        this.$store.dispatch('LmsBaseDict/getItem', '耗材供应商邮箱').then(() => {
          let emailList = this.$store.state.LmsBaseDict.item;
          this.emailList = emailList;
          this.emailListTemp = emailList;
        });
      },
      //耗材名称
      _nameChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.name = data;
            break;
          default:
            this._nameQuery(data);
        }
      },
      _nameQuery(query) {
        this.formObj.name = query;
        if (query === '') {
          this.nameList = this.nameListTemp;
        } else {
          this.nameList = this.nameListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //仓库位置
      _storehouseChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.storehouse = data;
            break;
          default:
            this._storehouseQuery(data);
        }
      },
      _storehouseQuery(query) {
        this.formObj.storehouse = query;
        if (query === '') {
          this.storehouseList = this.storehouseListTemp;
        } else {
          this.storehouseList = this.storehouseListTemp.filter(item => item.indexOf(query) > -1);
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
      //供应商联系方式
      _telChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.suppliertel = data;
            break;
          default:
            this._telQuery(data);
        }
      },
      _telQuery(query) {
        this.formObj.suppliertel = query;
        if (query === '') {
          this.telList = this.telListTemp;
        } else {
          this.telList = this.telListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //供应商email
      _emailChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.supplieremil = data;
            break;
          default:
            this._emailQuery(data);
        }
      },
      _emailQuery(query) {
        this.formObj.supplieremil = query;
        if (query === '') {
          this.emailList = this.emailListTemp;
        } else {
          this.emailList = this.emailListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //选择计量方式(联动)
      _unitChange(data){
        this.formObj.exunit = data;
      },
      _resultChange(msg) {
        if (this.$store.state.LmsChemical.success) {
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
              unit: this.formObj.unit,
              exunit: this.formObj.exunit,
            });
            if (this.$string(this.id).isEmpty()) {
              // 添加);
              this.$store.dispatch('LmsChemical/addChemical', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsChemical/edit', {id: this.id, obj: data}).then(() => {
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
            this.formObj.category = treeObj.name;
            this.category = treeObj.name;
            this.categoryId = treeObj.id;
          } else {
            this.formObj.category = '';
            this.categoryId = '';
          }
        } else {
          this.id = formObj.id;
          this.category = formObj.category;
          this.categoryId = formObj.categoryId;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材';
          this.storehouse = formObj.storehouse;
        }
        this._dicSearch();
      },
      _selectChange(data) {
        this.category = data;
      },
      _categoryZtree() {
        this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        this.$store.dispatch('LmsChemical/getUnit').then(() => {
          this.categoryList = this.$store.state.LmsChemical.categoryList;
        });
      },
      _ztree(result) {
        this.categoryId = result.id;
        this.formObj.category = result.name;
      },
      //仓库位置
      _storeZtree() {
        this.$refs.relStoreModal._openZtree();
      },
      _relStoreZtree(data) {
        this.storehouse = data.storehouseNames.join(',')
      },
    }
  }
</script>
