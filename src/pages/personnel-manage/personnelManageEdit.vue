<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false">
            <p slot="header">{{modalTitle}}</p>
            <div>
                <Form id="edit-form1" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
                  <Form-item label="姓名" prop="personName">
                    <Input name="personName" v-model="formObj.personName" placeholder="请输入姓名"></Input>
                  </Form-item>
                  <Form-item label="年龄" prop="personAge">
                    <Input name="personAge" v-model="formObj.personAge" placeholder="请输入年龄"></Input>
                  </Form-item>
                  <Form-item label="性别" prop="personGender">
                    <el-radio v-model="formObj.personGender" label="男">男</el-radio>
                    <el-radio v-model="formObj.personGender" label="女">女</el-radio>
                  </Form-item>
                  <Form-item label="角色" prop="personRoleName">
                    <el-radio v-model="formObj.personRoleName" label="老师">老师</el-radio>
                    <el-radio v-model="formObj.personRoleName" label="学生">学生</el-radio>
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
     * 添加编辑人员管理
     */
    const defVal = {
       personId:'',
       personName:'',
       personAge:'',
       personGender:'男',
       personRoleName:'学生',
  };
    export default {
        components: {
        },
        data() {
          return {
              id: '',
              modalTitle: '',
              formObj: defVal,
              ruleValidate: {
                personName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
                personAge: [{required: true, message: '年龄不能为空', trigger: 'blur'}],
              },
              showEditModal: false,
            companyList:[],
            departmentList:[],
            jobList:[],
          }
        },
        methods: {
          _resultChange(msg) {
              if (this.$store.state.PersonnelManage.success) {
                  this.formObj = defVal;
                  this.showEditModal = false;
                  this.$Message.success(msg);
                  this.$emit("on-result-change")
              }
          },
          _ok() {
              this.$refs['formObj'].validate((valid) => {
              if (valid) {
                  var data = this.$serialize('edit-form1');
                  data.personGender=this.formObj.personGender;
                  data.personRoleName=this.formObj.personRoleName;
                // this.$extend(data,  {  });
                  if (this.$string(this.id).isEmpty()) {
                      // 添加
                      this.$store.dispatch('PersonnelManage/add', data).then(() => {
                          this._resultChange('添加成功!');
                      });
                  }
                  else {
                    // 编辑
                    data.personId=this.formObj.personId;
                    this.$store.dispatch('PersonnelManage/edit', data).then(() => {
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
                  this.modalTitle = '添加人员信息';
              } else {
                  this.id = formObj.personId;
                  this.formObj = formObj;
                  this.formObj.personId=formObj.personId;
                  this.formObj.personName=formObj.personName;
                  this.formObj.personAge=formObj.personAge.toString();
                  this.formObj.personGender=formObj.personGender;
                  this.formObj.personRoleName=formObj.personRoleName;
                  this.modalTitle = '编辑人员信息';
              }
          },
        }
    }
</script>
