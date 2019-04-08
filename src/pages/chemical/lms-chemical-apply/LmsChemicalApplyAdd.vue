<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform-add" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80" inline>
          <Form-item label="单价" prop="price" class="width-48">
            <InputNumber :min="1" v-model.number="formObj.price" style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="采购数量" prop="quantity" class="width-48">
            <InputNumber :min="1" v-model.number="formObj.quantity" style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-48">
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
   * 添加编辑
   */
  const defVal = {
    chemicalIds: '',
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
        let reg = /^\+?[1-9]\d*$/;
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
            {validator: validateNumber, trigger: 'blur', type: 'number'}
          ],
          price: [
            {validator: validateNumber, trigger: 'blur', type: 'number'}
          ],
          price: [{required: true, message: '仪器价格不能为空', trigger: 'change', type: 'number'}],
        }
      }
    },
    methods: {
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform-add');
            data.chemicalIds = this.chemicalIds;
            data.price = this.formObj.price;
            data.quantity = this.formObj.quantity;
            // 添加
            this.$store.dispatch('LmsChemicalApply/addChemical', data).then(() => {
              if (this.$store.state.LmsChemicalApply.success) {
                this.showEditModal = false;
                this.$Message.success('添加成功！');
                this.$emit("on-result-change")
              }
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(id, name) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.chemicalId = id; //耗材id
        this.chemicalIds = id; //需要提交的数据id
        this.modalTitle = '耗材名称 一 ' + name;//耗材名称
        this.supplierList = [];
        this.formObj.price = '';
        this._getSupplier();
      },
      _getSupplier() {  //获取供应商
        this.$store.dispatch('LmsChemicalApply/getSupplier', this.chemicalId).then(() => {
          this.supplierList = this.$store.state.LmsChemicalApply.supplierList;
        });
      },
      _selSupplier(id) { //选择供应商
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
