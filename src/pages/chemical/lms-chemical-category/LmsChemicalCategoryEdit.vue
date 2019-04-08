<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="分类名称" prop="name">
            <Tooltip content="只能输入中英文字符且长度为0-40" placement="bottom-start">
              <Input name="name" v-model="formObj.name" placeholder="请输入名称" style="width: 408px"></Input>
            </Tooltip>
          </Form-item>
          <Form-item label="上级分类" prop="parentName">
            <Input v-model="formObj.parentName" @on-click="_selectZtree" icon="plus-circled" readonly style="width: 408px"></Input>
            <input name="pid" v-model.number="formObj.pid" hidden>
          </Form-item>
          <Form-item label="编号" prop="num">
            <Input name="num" v-model="formObj.num" placeholder="可自动生成" style="width: 408px"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Tooltip content="长度为0-100" placement="bottom-start">
              <Input name="remark" v-model="formObj.remark" placeholder="请输入备注" style="width: 408px"></Input>
            </Tooltip>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
    <!-- 父id  ztree  -->
    <LmsChemicalCategoryZtree ref="ztreeModal" @on-result-change="_ztree"></LmsChemicalCategoryZtree>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材分类表
   */
  const defVal = {
    pid: '0',
    name: '',
    parentName: '根目录',
    remark:'',
    num:''
  };
  import LmsChemicalCategoryZtree from './LmsChemicalCategoryZtree.vue'

  export default {
    components: {LmsChemicalCategoryZtree},
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
          remark: [{max:50, message: '备注不能超过50字符', trigger: 'blur'}],
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
            this.$extend(data);
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsChemicalCategory/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsChemicalCategory/edit', {id: this.formObj.id, obj: data}).then(() => {
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
      _open(treeObj,formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.formObj.pid = '0';
          this.formObj.parentName = '';
          this.modalTitle = '添加试验耗材分类表';
          if(JSON.stringify(treeObj) !== '{}'){
            this.formObj.parentName = treeObj.name;
            this.formObj.pid = treeObj.id;
          }else{
            this.formObj.parentName = '根目录';
            $('input[name=pid]').val('0');
          }
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材分类表';
        }
      },
      _selectZtree() {
        this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
      },
      _ztree(result) {
        if(result == undefined){ //未选中数据的时候
          this.formObj.pid = '0';
          this.formObj.parentName = '';
        }else{                 //选中数据以后
          this.formObj.pid = result.id;
          this.formObj.parentName = result.name;
        }
      },
    }
  }
</script>
