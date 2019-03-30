<template>
  <div>
    <Modal v-model="showbaseInfoModal" :mask-closable="false" :width="1100" class="modal-index">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline>
          <Alert style="text-align: center">产品基本信息</Alert>
          <Form-item label="仪器名称" prop="name" class="width-32">
            <label
              style="width: 10%;display: inline-block;float: right;text-align: right;line-height: 38px;cursor: pointer">
              <Icon type="plus-circled" @click.native="_selEquip" size="20" color="#2d8cf0"></Icon>
            </label>
            <label style="width: 90%;display: inline-block">
              <Input name="name" v-model="formObj.name" placeholder="请选择仪器名称"></Input>
            </label>
          </Form-item>
          <Form-item label="供应商" prop="supplierName" class="width-32">
            <Select v-model="formObj.supplierId" clearable placeholder="请选择供应商" name="supplierId" style="width:100%" :disabled="isReadonly">
              <Option v-for="item in supplierList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="仪器类别" prop="className" class="width-32">
            <Input name="className" @click.native="_selectZtree" placeholder="请选择仪器类别..."
                   v-model="formObj.className" icon="plus-circled" :disabled="isReadonly"/>
          </Form-item>
          <Form-item label="规格型号" prop="spec" class="width-32">
            <Input name="spec" v-model="formObj.spec" placeholder="请输入规格型号" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="仪器品牌" prop="brand" class="width-32">
            <Input name="brand" v-model="formObj.brand" placeholder="请输入品牌" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="仪器价格" prop="price" class="width-32">
            <InputNumber name="price" v-model.number="formObj.price" placeholder="请输入报价"
                         style="width:100%" :readonly="isReadonly"></InputNumber>
          </Form-item>
          <Form-item label="制造厂商" prop="productPlace" class="width-32">
            <Input name="productPlace" v-model="formObj.productPlace" placeholder="请输入产地" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="计量类别" prop="meterType" class="width-32">
            <Input name="meterType" v-model="formObj.meterType" placeholder="请输入计量类别" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="不确定度" prop="uncertainty" class="width-32">
            <Input name="uncertainty" v-model="formObj.uncertainty" placeholder="请输入不确定度" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="仪器精度" prop="accuracy" class="width-32">
            <Input name="accuracy" v-model="formObj.accuracy" placeholder="请输入精度" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="使用范围" prop="range" class="width-32">
            <Input name="range" v-model="formObj.range" placeholder="请输入使用范围" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="产品备注" prop="productRemark" style="width: 98.6%;">
            <Input name="productRemark" placeholder="请输入产品备注" type="textarea" :rows="1"
                   v-model="formObj.productRemark" :readonly="isReadonly"/>
          </Form-item>
          <Form-item label="技术参数" prop="techParams" style="width: 98.6%;">
            <Editor ref="editorModal" @on-result-change="_editorData" v-model="formObj.techParams"></Editor>
          </Form-item>
          <Alert type="success" style="text-align: center;">采购信息</Alert>
          <Form-item label="数量" prop="counts" style="width: 48.6%">
            <InputNumber name="counts" :min="1" v-model.number="formObj.counts" style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="用途" prop="uses" style="width: 48.6%">
            <Input name="uses" v-model="formObj.uses" placeholder="请输入用途"/>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98.6%;">
            <Input name="remark" placeholder="请输入备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <input name="purchaseId" v-model="formObj.purchaseId" type="hidden">
          <input name="productId" v-model="formObj.productId" type="hidden">
          <input name="classId" v-model="formObj.classId" type="hidden">
          <input name="classIds" v-model="formObj.classIds" type="hidden">
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
    <!--选择仪器信息-->
    <RelLmsEquipProduct ref="equipModal" @on-result-change="_equipData"></RelLmsEquipProduct>
    <!--上级产品类别弹出树-->
    <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>
  </div>
</template>
<script>
  import LmsEquipClassZTree from '../../lms-equip-product/LmsEquipClassZTree.vue'
  import RelLmsEquipProduct from './RelLmsEquipProduct.vue'
  import Editor from '../../../../components/editor/Editor.vue'

  const defVal = {
    purchaseId: '',
    productId: '',
    counts: 1,
    uses: '',
    remark: '',
    supplierId: '',
    classId: '',
    classIds: '',
    name: '',
    spec: '',
    brand: '',
    price: 1,
    productPlace: '',
    meterType: '',
    uncertainty: '',
    accuracy: '',
    range: '',
    techParams: '',
    techParamsText: '',
    productRemark: '',
    className: '',
    supplierName: '',
  };
  export default {
    components: {RelLmsEquipProduct, LmsEquipClassZTree, Editor},
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          counts: [{required: true, message: '数量不能为空', trigger: 'blur', type: 'number'}],
          uses: [{required: true, message: '用途不能为空', trigger: 'blur'}],
        },
        showbaseInfoModal: false,
        supplierList: '',
        isReadonly:false,
      }
    },
    mounted() {
      this._getSupplierList();
    },
    methods: {
      _getSupplierList() {//获取供应商
        var data;
        this.$store.dispatch('LmsSupplier/list', data).then(() => {
          this.supplierList = this.$store.state.LmsSupplier.list;
        });
      },
      _resultChange(data) {
        if (data !== undefined) {
          this.$Message.success("添加成功");
          this.$emit("on-result-change");
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form-edit');
            this.$extend(data, {techParams: this.formObj.techParams,techParamsText:this.formObj.techParamsText});
            this.$store.dispatch('LmsEquipPurchase/addDetail', data).then(() => {
              this._resultChange(this.$store.state.LmsEquipPurchase.success);
              this.showbaseInfoModal = false;
            });

          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.showbaseInfoModal = false;
      },
      _open(purchaseId) {
        this.isReadonly=false;
        this.showbaseInfoModal = true;
        this.$refs['formObj'].resetFields();
        this.formObj.supplierId = '';
        this.formObj.purchaseId = purchaseId;
        this.modalTitle = '新增仪器采购明细';
        this.$refs.editorModal._open(''); //清空editor
      },
      _editorData(html,text) { //技术参数
        this.formObj.techParams = html;
        this.formObj.techParamsText = text;
      },
      _selEquip() {
        this.$refs.equipModal._open();
      },
      _equipData(result) {
        this.formObj.productId = result.id;
        this.formObj.name = result.name;
        this.formObj.supplierId = result.supplierId;
        this.formObj.classId = result.classId;
        this.formObj.classIds = result.classIds;
        this.formObj.className = result.className;
        this.formObj.spec = result.spec;
        this.formObj.brand = result.brand;
        this.formObj.price = result.price;
        this.formObj.productPlace = result.productPlace;
        this.formObj.meterType = result.meterType;
        this.formObj.uncertainty = result.uncertainty;
        this.formObj.accuracy = result.accuracy;
        this.formObj.range = result.range;
        this.formObj.techParams = result.techParams;
        this.formObj.productRemark = result.remark;
        this.$refs.editorModal._open(result.techParams);
        this.isReadonly=true;
      },
      _selectZtree() {
        if(!this.isReadonly){
          this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        }
      },
      _ztree(result) {
        if (result == undefined) {
          this.formObj.classId = '';
          this.formObj.className = '';
          this.formObj.classIds = '';
        } else {
          this.formObj.classId = result.id;
          this.formObj.className = result.name;
          this.formObj.classIds = result.pids + result.id + ',';
        }

      },
    }
  }
</script>
