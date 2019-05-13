<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="500">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-add-purform" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80" inline>
          <Form-item label="申请人" prop="apparatusPurchasePerson" style="width: 100%;">
            <Input name="apparatusPurchasePerson" v-model="formObj.apparatusPurchasePerson" placeholder="请输入申请人" disabled></Input>
            <input name="apparatusPurchasePersonId" v-model="formObj.apparatusPurchasePersonId" type="hidden"/>
          </Form-item>
          <Form-item label="预约时间" prop="dateValue" style="width: 100%;">
            <DatePicker :value="dateValue" format="yyyy-MM-dd" type="daterange" placement="bottom-end"
                        placeholder="请选择预约时间" style="width: 100%" @on-change="_dateChange">
            </DatePicker>
            <input name="apparatusPurchaseCtime" type="hidden" v-model="formObj.apparatusPurchaseCtime"/>
            <input name="apparatusPurchaseLtime" type="hidden" v-model="formObj.apparatusPurchaseLtime"/>
          </Form-item>
          <Form-item label="预约原因" prop="apparatusPurchaseReason" style="width: 100%;">
            <Input name="apparatusPurchaseReason" v-model="formObj.apparatusPurchaseReason" placeholder="请输入原因"></Input>
          </Form-item>
          <Form-item label="备注" prop="apparatusPurchaseRemark" style="width: 100%;">
            <Input name="apparatusPurchaseRemark" v-model="formObj.apparatusPurchaseRemark" placeholder="请输入备注"></Input>
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
    id:'',
    apparatusPurchaseApparatusId:'',
    apparatusPurchasePerson:'',
    apparatusPurchasePersonId:'',
    apparatusPurchaseReason: '',
    apparatusPurchaseCtime:'',
    apparatusPurchaseLtime:'',
    apparatusPurchaseRemark:'',
  };
  export default {
    data() {
      return {
        modalTitle: '',
        formObj: defVal,
        showEditModal: false,
        supplierList: [],
        dateValue: [],//有效期
        ruleValidate: {
          apparatusPurchaseReason: [{required: true, message: '预约原因不能为空', trigger: 'blur', }],
        }
      }
    },
    methods: {
      _dateChange(data) { //有效期
        if (data[0] == '') { //开始和结束为同一天
          $('input[name=apparatusPurchaseCtime]').val(data[0]);
          this.formObj.apparatusPurchaseCtime=data[0];
          $('input[name=apparatusPurchaseLtime]').val(data[0]);
          this.formObj.apparatusPurchaseLtime=data[0];
        } else {
          $('input[name=apparatusPurchaseCtime]').val(data[0]);
          this.formObj.apparatusPurchaseCtime=data[0];
          $('input[name=apparatusPurchaseLtime]').val(data[1]);
          this.formObj.apparatusPurchaseLtime=data[0];
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-add-purform');
            data.id=this.formObj.id;
            data.apparatusPurchaseApparatusId = this.formObj.apparatusPurchaseApparatusId;
            data.apparatusPurchasePerson = this.formObj.apparatusPurchasePerson;
            data.apparatusPurchasePersonId = this.formObj.apparatusPurchasePersonId;
            data.apparatusPurchaseCtime = this.formObj.apparatusPurchaseCtime;
            data.apparatusPurchaseLtime = this.formObj.apparatusPurchaseLtime;
            data.apparatusPurchaseReason = this.formObj.apparatusPurchaseReason;
            data.apparatusPurchaseRemark = this.formObj.apparatusPurchaseRemark;
            // 添加
            this.$store.dispatch('LmsEquipOrder/editPros', data).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this.showEditModal = false;
                this.$Message.success('成功修改预约单！');
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
      _open(obj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.modalTitle = '仪器名称 一 ' + name;//耗材名称
        this.formObj.id=obj.id;
        this.formObj.apparatusPurchaseApparatusId=obj.apparatusPurchaseApparatusId;
        this.formObj.apparatusPurchasePerson=obj.apparatusPurchasePerson;
        this.formObj.apparatusPurchasePersonId=obj.apparatusPurchasePersonId;
        this.formObj.apparatusPurchaseReason= obj.apparatusPurchaseReason;
        this.formObj.apparatusPurchaseCtime=obj.apparatusPurchaseCtime;
        this.formObj.apparatusPurchaseLtime=obj.apparatusPurchaseLtime;
        this.formObj.apparatusPurchaseRemark=obj.apparatusPurchaseRemark;
      },
    }
  }
</script>
