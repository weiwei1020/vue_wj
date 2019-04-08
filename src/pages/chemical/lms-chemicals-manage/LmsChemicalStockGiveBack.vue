<template>
  <div>
    <Modal v-model="showGiveBackModal" :mask-closable="false">
      <p slot="header">耗材归还</p>
      <div>
        <Form id="storage-form-back" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="数量" prop="stock">
            <label style="width: 40%">
              <InputNumber :min="1" name="stock" v-model.number="formObj.stock" style="width: 100%"
                           @on-change="_changeStock"></InputNumber>
            </label>
            <label style="width: 10%;text-align: center">{{formObj.unit}}</label>
            <input hidden name="unit" v-model="formObj.unit">
          </Form-item>
          <Form-item label="剩余量" prop="exstock">
            <label style="width: 40%">
              <InputNumber :min="1" name="exstock" v-model.number="formObj.exstock" style="width: 100%"></InputNumber>
            </label>
            <label style="width: 10%;text-align: center">{{formObj.exunit}}</label>
            <input hidden name="exunit" v-model="formObj.exunit">
          </Form-item>
          <Form-item label="归还人" prop="salesman">
            <Input name="salesman" v-model="formObj.salesman" placeholder="请选择归还人"
                   @click.native="_selectUser" icon="plus-circled" readonly></Input>
          </Form-item>
          <Form-item label="归还时间" prop="time">
            <Date-picker type="datetime" placeholder="归还时间"
                         v-model="formObj.time" style="width: 100%;"
                         @on-change="_timeChange"></Date-picker>
            <input name="time" type="hidden">
          </Form-item>
          <Form-item label="归还原因" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入归还原因"></Input>
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
    exstock: 1,
    unit: '',
    exunit: '',
    remark: '',
    salesman: '',
    time: new Date(),
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
      const validateStockNumber = (rule, value, callback) => { //剩余量不能大于数量*转换率
        let reg = /^\+?[1-9]\d*$/;
        if (!reg.test(value)) {
          callback(new Error('数量只能输入整数'));
          //} else if (value > this.exstockMax) {
          // callback(new Error('剩余量不能大于转换库存数量'));
        } else {
          callback();
        }
      };
      return {
        id: '',
        formObj: defVal,
        showGiveBackModal: false,
        chemicalId: '',
        exchange: '', //转化率
        exstockMax: '', //最大值
        ruleValidate: {
          stock: [
            {validator: validateNumber, trigger: 'blur', type: 'number'}
          ],
          exstock: [
            {validator: validateStockNumber, trigger: 'blur', type: 'number'}
          ],
        }
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalStock.success) {
          this.formObj = defVal;
          this.showGiveBackModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('storage-form-back');
            data.chemicalId = this.chemicalId;
            this.$store.dispatch('LmsChemicalStock/purchaseGiveBack', data).then(() => {
              this._resultChange('归还成功!');
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.showGiveBackModal = false;
      },
      _open(data, exchange) {
        this.exchange = exchange; //转化率
        this.chemicalId = data.id;
        this.showGiveBackModal = true;
        this.$refs['formObj'].resetFields();
        this._getUser();
      },
      _changeStock(data) { //改变数量
        if (this.exchange == undefined) {
          this.formObj.exstock = 1;
        } else {
          this.exstockMax = data * (this.exchange);
          this.formObj.exstock = data * (this.exchange);
        }
      },
      //归还时间
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
