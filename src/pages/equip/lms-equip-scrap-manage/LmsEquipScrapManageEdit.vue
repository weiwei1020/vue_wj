<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline>
          <Form-item label="报废日期" prop="scrapDate" class="width-48">
            <Date-picker name="scrapDate" type="date" placeholder="报废日期"
                         v-model="formObj.scrapDate" style="width: 100%;"/>
          </Form-item>
          <Form-item label="申请日期" prop="applyTime" class="width-48">
            <Date-picker name="applyTime" type="date" placeholder="申请日期"
                         v-model="formObj.applyTime" style="width: 100%;" disabled="true" />
          </Form-item>
          <Form-item label="备注" prop="remark" class="width-48">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(1)" type="success">报废完成</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑仪器报废管理
   */
  const defVal = {
    detailId: '',
    scrapDate: '',
    applyTime:'',
    remark: '',
    companyId: '',
  };
  export default {
    data() {
      const validateDate = (rule, value, callback) => {
        if (this.formObj.scrapDate === '' || this.formObj.scrapDate === undefined) {
          callback(new Error("报废日期不能为空"));
        }else if(this.formObj.scrapDate<=this.formObj.applyTime){
          callback(new Error("报废日期不能早于申请日期"));
        } else {
          callback();
        }
      };
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          scrapDate: [{required: true,validator: validateDate,trigger: 'blur'}],
        },
        showEditModal: false,
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipScrapManage.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
        if (valid) {
          var data = this.$serialize('edit-form');
          this.$extend(data, {status: status});
          if (this.$string(this.id).isEmpty()) {
            // 添加
            this.$store.dispatch('LmsEquipScrapManage/add', data).then(() => {
              this._resultChange('添加成功!');
            });
          } else {
            // 编辑
            this.$store.dispatch('LmsEquipScrapManage/edit', {id: this.formObj.id, obj: data}).then(() => {
            this._resultChange('编辑成功!');
          });
          }
        } else {
          this.$Message.error('表单验证失败!');
        }
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.modalTitle = '添加仪器报废管理';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this. _showTime ();
          this.modalTitle = '编辑仪器报废管理';
        }
      },
      _showTime (){
        if(this.formObj.scrapDate===undefined){
          this.formObj.scrapDate='';
        }else{
          this.formObj.scrapDate=new Date(this.formObj.scrapDate);
        }

        if(this.formObj.applyTime===undefined){
          this.formObj.applyTime='';
        }else{
          this.formObj.applyTime=new Date(this.formObj.applyTime);
        }

      },
    }
  }
</script>
