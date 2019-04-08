<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80" inline>
          <Form-item label="单价" prop="price" class="width-48">
            <InputNumber  :min="1"  v-model.number="formObj.price" style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="采购数量" prop="quantity" class="width-48">
            <InputNumber :min="1" v-model.number="formObj.quantity" style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="规格" prop="spec" class="width-48">
            <Input name="spec" v-model="formObj.spec" placeholder="请输入规格"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-48">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑
   */
  const defVal = {
    supplier: '',
    supplierId: '',
    price: 1,
    spec: '',
    quantity: 1,
    remark: ''
  };
  export default {
    data() {
      const validateNumber = (rule, value, callback) => { //只能输入正整数，不能输入小数
        let  reg = /^\+?[1-9]\d*$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('数量只能输入整数'));
        }
      };
      return {
        modalTitle: '',
        chemicalId: '',
        formObj: defVal,
        showEditModal: false,
        supplierList: [],
        ruleValidate: {
          quantity: [
            { validator: validateNumber, trigger: 'blur',type:'number'}
          ],
          price: [
            { validator: validateNumber, trigger: 'blur',type:'number'}
          ],
        },
        id: ''
      }
    },
    methods: {
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform-edit');
            data.price = this.formObj.price;
            data.quantity = this.formObj.quantity;
            // 编辑
            this.$store.dispatch('LmsChemicalPurchase/editChemical', {id: this.id, obj: data}).then(() => {
              this._resultChange('编辑成功!');
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalPurchase.success) {
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change");
        }
      },
      _open(id, chemicalId) { //编辑
        this.showEditModal = true;
        this.id = id;
        this.chemicalId = chemicalId; //耗材id
        this._getSupplier();
        this._getDetail(id); //回显
      },
      _getDetail(id) {
        this.$store.dispatch('LmsChemicalPurchase/detailChemical', id).then(() => {
          var list = this.$store.state.LmsChemicalPurchase.list;
          this.formObj = list;
          this.modalTitle = '耗材名称 一 ' + this.formObj.chemicalName;
          this.formObj.supplier = list.supplier;
        });
      },
      _getSupplier() {  //获取供应商
        this.$store.dispatch('LmsChemicalPurchase/getSupplier', this.chemicalId).then(() => {
          this.supplierList = this.$store.state.LmsChemicalPurchase.supplierList;
        });
      },
      _selSupplier(id) { //选择供应商回带数据
        let list = [];
        for (var i = 0; i < this.supplierList.length; i++) {
          if (id == this.supplierList[i].supplierId) {
            list = this.supplierList[i];
          }
        }
        this.formObj.supplier = list.supplier;
        this.formObj.price = list.price;
      }
    }
  }
</script>
