<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="分类名称" prop="consumableSortName">
            <Tooltip content="只能输入中英文字符且长度为0-40" placement="bottom-start">
              <Input name="consumableSortName" v-model="formObj.consumableSortName" placeholder="请输入名称" style="width: 408px"></Input>
            </Tooltip>
          </Form-item>
          <Form-item label="编号" prop="consumableSortNumber">
            <Input name="consumableSortNumber" v-model="formObj.consumableSortNumber" placeholder="可自动生成" style="width: 408px"></Input>
          </Form-item>
          <Form-item label="备注" prop="consumableSortRemark">
            <Tooltip content="长度为0-100" placement="bottom-start">
              <Input name="consumableSortRemark" v-model="formObj.consumableSortRemark" placeholder="请输入备注" style="width: 408px"></Input>
            </Tooltip>
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
   * 添加编辑试验耗材分类表
   */
  const defVal = {
    consumableSortId: '',
    consumableSortName: '',
    consumableSortRemark:'',
    consumableSortNumber:''
  };

  export default {
    components: {},
    data() {
      const validateName = (rule, value, callback) => { //验证模块名称
        const reg = /[\u4E00-\u9FA5_a-zA-Z]+$/;
        if (value === "") {
          callback(new Error('分类名称不能为空！'));
        } else {
          if (!reg.test(value)) {
            callback(new Error('请输入中文或英文字符！'));
          } else {
            callback();
          }
        }
      };
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, validator:validateName, trigger: 'blur'},
                  {max:40, message: '分类名称不能超过40字符', trigger: 'blur'}
                ],
          consumableSortRemark: [{max:50, message: '备注不能超过50字符', trigger: 'blur'}],
        },
        showEditModal: false
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalCategory.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },

      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            this.$extend(data,{
              consumableSortId:this.formObj.consumableSortId,
            });
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsChemicalCategory/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsChemicalCategory/edit', data).then(() => {
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
          this.modalTitle = '添加试验耗材分类表';
        } else {
          this.id = formObj.consumableSortId;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材分类表';
        }
      },
    }
  }
</script>
