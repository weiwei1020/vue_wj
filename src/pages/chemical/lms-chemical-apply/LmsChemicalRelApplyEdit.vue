<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="350">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="领用数量：" prop="stockNumber">
            <InputNumber  :min="1"  v-model.number="formObj.stockNumber" style="width: 100%"></InputNumber>
          </Form-item>
          <Form-item label="原因：" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入原因"></Input>
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
    stockNumber: 1,
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
          stockNumber: [
            { validator: validateNumber, trigger: 'blur',type:'number'}
          ],
        },
        id: '',
        name:'',
      }
    },
    methods: {
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform-edit');
            data.stockNumber = this.formObj.stockNumber;
            data.remark = this.formObj.remark;
            // 编辑
            this.$store.dispatch('LmsChemicalApply/addReceiveOne', {id: this.id, obj: data}).then(() => {
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
        if (this.$store.state.LmsChemicalApply.success) {
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change");
        }
      },
      _open(id, name) { //编辑
        this.showEditModal = true;
        this.id = id;
        this.name=name;
        this.modalTitle = '耗材名称 一 ' + this.name;
        /* this.chemicalId = chemicalId; //耗材id
         this._getDetail(id); //回显*/
      },
      _getDetail(id) {
        this.$store.dispatch('LmsChemicalApply/detailChemical', id).then(() => {
          var list = this.$store.state.LmsChemicalApply.list;
          this.formObj = list;
          this.modalTitle = '耗材名称 一 ' + this.formObj.chemicalName;
        });
      },
    }
  }
</script>
