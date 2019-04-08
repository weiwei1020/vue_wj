<template>
  <div>
    <Modal v-model="chemicalStockOutModal" :mask-closable="false">
      <p slot="header">耗材出库</p>
      <div>
        <Form id="storage-form-storeOut" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="数量" prop="stock">
            <label style="width: 40%">
              <InputNumber :min="1" name="stock" v-model.number="formObj.stock" style="width: 100%"></InputNumber>
            </label>
            <label style="width: 10%;text-align: center">{{formObj.unit}}</label>
            <input hidden name="unit" v-model="formObj.unit">
          </Form-item>
          <Form-item label="科室" prop="department">
            <Input name="department" v-model="formObj.department" placeholder="请选择科室"
                   @click.native="_selectUserGroup" icon="plus-circled" readonly></Input>
          </Form-item>
          <Form-item label="使用人" prop="registrant">
            <Select @on-change="_selectChange" style="width:100%">
              <Option v-for="item in selectList" :value="item.realname" :key="item.id">{{ item.realname }}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="出库时间" prop="time">
            <Date-picker type="date" placeholder="出库时间"
                         v-model="formObj.regdate" style="width: 100%;"
                         @on-change="_timeChange"></Date-picker>
            <input name="regdate" type="hidden">
          </Form-item>
          <Form-item label="出库原因" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入出库原因"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
    <!--选择科室（单选）-->
    <UserGroup ref="userGroupModal" @on-result-change="_userGroupData"></UserGroup>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材库存表
   */
  const defVal = {
    stock: 1,
    unit: '',
    depId: '',
    department: '',
    registrant: '',
    remark: '',
    regdate: new Date(),

  };
  import UserGroup from '../../../components/userInfo/UserGroup'

  export default {
    components: {UserGroup},
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
        chemicalStockOutModal: false,
        chemicalId: '',
        ruleValidate: {
          stock: [
            {validator: validateNumber, trigger: 'blur', type: 'number'}
          ],
          department: [{required: true, trigger: 'blur', message: '科室不能为空'}],
          registrant: [{required: true, trigger: 'change', message: '使用人不能为空'}],
        },
        selectList: []
      }
    },
    methods: {
      _selectChange(data) {
        this.formObj.registrant = data;
      },
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalStock.success) {
          this.formObj = defVal;
          this.chemicalStockOutModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('storage-form-storeOut');
            data.chemicalId = this.chemicalId;
            data.registrant = this.formObj.registrant;
            this.$store.dispatch('LmsChemicalStock/purchaseStoreOut', data).then(() => {
              this._resultChange('出库成功!');
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.chemicalStockOutModal = false;
      },
      _open(data) {
        this.formObj.unit = data.unit;
        this.formObj.remark = '';
        this.chemicalId = data.id;
        this.chemicalStockOutModal = true;
        this.$refs['formObj'].resetFields();
        $('input[name=regdate]').val(this.$dateformat(new Date(), 'yyyy-mm-dd HH:MM:SS'));
        this.formObj.department = '';
        this.formObj.depId = '';
        this.remark = '';
        this.selectList = [];
      },
      //出库时间
      _timeChange(data) {
        $('input[name="regdate"]').val(data);
      },
      //选择科室
      _selectUserGroup() {
        this.$refs.userGroupModal._openDepart();
      },
      _userGroupData(data) {
        this.formObj.department = data.name;
        this.formObj.depId = data.id;
        this.$store.dispatch('LmsMarshalManage/userPage', {rows: 500, groupId: data.id}).then(() => {
          let result = this.$store.state.LmsMarshalManage.userPage.records;
          this.selectList = result;
        });
      },
    }
  }
</script>
