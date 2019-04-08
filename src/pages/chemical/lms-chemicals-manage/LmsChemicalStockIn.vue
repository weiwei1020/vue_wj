<template>
  <div>
    <Modal v-model="chemicalStockInModal" :mask-closable="false" class='zIndex-1100'>
      <p slot="header">耗材入库</p>
      <div>
        <Form id="storage-form-storeIn" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="数量" prop="stock">
            <label style="width: 40%">
              <InputNumber :min="1" name="stock" v-model.number="formObj.stock" style="width: 100%"></InputNumber>
            </label>
            <label style="width: 10%;text-align: center">{{formObj.unit}}</label>
            <input hidden name="unit" v-model="formObj.unit">
          </Form-item>
          <Form-item label="价格" prop="price">
            <label style="width: 40%">
              <InputNumber :min="1" name="price" v-model.number="formObj.price" style="width: 100%"></InputNumber>
            </label>
            <label style="width: 10%;text-align: center">元</label>
          </Form-item>
          <Form-item label="入库人" prop="salesman">
            <Input name="salesman" v-model="formObj.registrant" placeholder="请选择入库人员"
                   @click.native="_selectUser" icon="plus-circled" readonly></Input>
          </Form-item>
          <Form-item label="入库时间" prop="time">
            <Date-picker type="datetime" placeholder="入库时间"
                         v-model="formObj.regdate" style="width: 100%;"
                         @on-change="_timeChange"></Date-picker>
            <input name="time" type="hidden">
          </Form-item>
          <Form-item label="入库原因" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
    <!--选择人员（单选）-->
    <User ref="userModal" @on-result-change="_userData"></User>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材库存表
   */
  const defVal = {
    stock: 1,
    unit: '',
    remark: '',
    salesman: '',
    salesmanId: '',
    time: new Date(),
    price: 1
  };
  import User from '../../../components/userInfo/User'
  import Global from '../../../api/config'

  export default {
    components:
      {
        User,
        Global
      },
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
        id: '',
        formObj: defVal,
        chemicalStockInModal: false,
        chemicalId: '',
        ruleValidate: {
          stock: [
            {validator: validateNumber, trigger: 'blur', type: 'number'},
          ],
          remark: [{required: true, trigger: 'blur', message: '入库原因不能为空'}],
        }
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalStock.success) {
          this.formObj = defVal;
          this.chemicalStockInModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('storage-form-storeIn');
            data.chemicalId = this.chemicalId;
            this.$store.dispatch('LmsChemicalStock/purchaseStoreIn', data).then(() => {
              this._resultChange('入库成功!');
            });

          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.chemicalStockInModal = false;
      },
      _open(data) {
        this.formObj.unit = data.unit;
        this.chemicalId = data.id;
        this.chemicalStockInModal = true;
        this.formObj.regdate=new Date();
        this.$refs['formObj'].resetFields();
        this._getUser();
        $('input[name=time]').val(this.$dateformat(new Date(), 'yyyy-mm-dd HH:MM:SS'));
      },
      //入库时间
      _timeChange(data) {
        $('input[name="time"]').val(data);
      },
      _getUser() {
        let user = Global.getUserInfo();
        this.formObj.salesman = user.realname;
      },
      //选择人员
      _selectUser() {
        this.$refs.userModal._open('stockInMan');
      },
      _userData(data) {
        this.formObj.salesman = data.realname;
      },
    }
  }
</script>
