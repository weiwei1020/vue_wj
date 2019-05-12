<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false">
            <p slot="header">{{modalTitle}}</p>
            <div>
                <Form id="edit-form1" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
                  <Form-item label="姓名" prop="userName">
                    <Input name="userName" v-model="formObj.use-rName" placeholder="请输入姓名"></Input>
                  </Form-item>
                  <Form-item label="手机号码" prop="userMobile">
                    <Input name="userMobile" v-model="formObj.userMobile" placeholder="请输入手机号码"></Input>
                  </Form-item>
                  <Form-item label="密码" prop="userPassword">
                    <Input type="password" name="userPassword"
                           v-model="formObj.userPassword" placeholder="请输入密码" :maxlength="20"></Input>
                  </Form-item>
                  <Form-item label="确认密码" prop="passwordCheck">
                    <Input type="password" name="passwordCheck"
                           v-model="formObj.passwordCheck" placeholder="请再次输入密码" :maxlength="20"></Input>
                  </Form-item>
                  <Form-item label="电子邮箱" prop="userEmail">
                    <Input name="userEmail" type="email" v-model="formObj.userEmail" placeholder="请输入电子邮箱"></Input>
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
       userId:'',
       userName:'',
       userMobile:'',
       userPassword:'',
       passwordCheck:'',
       userEmail:'',
       userCompanyId:'',
       userCompanyName:'',
       userDepartmentId:'',
       userDepartmentName:'',
       userJobId:'',
       userJobName:''
  };
    export default {
        components: {
        },
        data() {
          const validatePass = (rule, value, callback) => {
            // 验证密码，必须是数字和字母的结合
            if (this.formObj.userPassword === undefined) {
              // 编辑
              callback()
            } else if (value === '') {
              // 添加
              callback(new Error('请输入您的密码'))
            } else if (value.length < 6) {
              callback(new Error('密码长度不能小于6位'))
            } else if (value === this.formObj.userPassword.replace(/[^a-zA-Z]/g, '')) {
              // 只输入英文
              callback(new Error('请输入数字和字母结合的密码'))
            } else if (value === this.formObj.userPassword.replace(/\D/g, '')) {
              // 只输入数字
              callback(new Error('请输入数字和字母结合的密码'))
            } else {
              if (this.formObj.passwordCheck !== '' && this.id !== '') {
                // 对第二个密码框单独验证
                this.$refs.formObj.validateField('passwordCheck')
              }
              callback()
            }
          }
          const validatePassCheck = (rule, value, callback) => {
            if (this.formObj.userPassword === '' && value === '') {
              callback(new Error('请再次输入您的密码'))
            } else if (value !== this.formObj.userPassword) {
              callback(new Error('两次输入的密码不匹配'))
            } else {
              callback()
            }
          }
          const validateMobile = (rule, value, callback) => {
            // 验证手机号
            const reg = /^((\+?86)|(\(\+86\)))?1\d{10}$/ // 支持+86格式的手机号
            if (value === '') {
              callback(new Error('请输入您的手机号'))
            } else if (!reg.test(this.formObj.userMobile)) {
              callback(new Error('手机号格式不正确'))
            } else {
              callback()
            }
          }
          return {
              id: '',
              modalTitle: '',
              formObj: defVal,
              ruleValidate: {
                userName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
                userPassword: [{ validator: validatePass, trigger: 'blur' }],
                passwordCheck: [{ validator: validatePassCheck, trigger: 'blur' }],
                userMobile: [
                  { required: true, validator: validateMobile, trigger: 'blur' }
                ],
                userEmail: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
              },
              showEditModal: false,
            companyList:[],
            departmentList:[],
            jobList:[],
          }
        },
        methods: {
          _resultChange(msg) {
              if (this.$store.state.JobManage.success) {
                  this.formObj = defVal;
                  this.showEditModal = false;
                  this.$Message.success(msg);
                  this.$emit("on-result-change")
              }
          },
          _companyChange(data) {
            if (data) {
              this.formObj.userCompanyName = data.label;
              this.formObj.userCompanyId = data.value;
            } else {
              this.formObj.userCompanyName = '';
              this.formObj.userCompanyId = '';
            }
            this._getDepartmentList(this.formObj.userCompanyId)
          },
          _getDepartmentList(userCompanyId){
            let that =this;
            this.$store.dispatch('DepartmentManage/list',{departmentCompanyId:userCompanyId}).then(() => {
              let result;
              result =that.$store.state.DepartmentManage.list;
              this.departmentList=result;
            });
          },
          _departmentChange(data){
            if (data) {
              this.formObj.userDepartmentName = data.label;
              this.formObj.userDepartmentId = data.value;
            } else {
              this.formObj.userDepartmentName = '';
              this.formObj.userDepartmentId = '';
            }
            this._getJobList(this.formObj.userDepartmentId)
          },
          _getJobList(userDepartmentId){
            let that =this;
            this.$store.dispatch('JobManage/list',{jobDepartmentId:userDepartmentId}).then(() => {
              let result;
              result =that.$store.state.JobManage.list;
              this.jobList=result;
            });
          },
          _jobChange(data){
            if (data) {
              this.formObj.userJobName = data.label;
              this.formObj.userJobId = data.value;
            } else {
              this.formObj.userJobName = '';
              this.formObj.userJobId = '';
            }
          },
          _ok() {
              this.$refs['formObj'].validate((valid) => {
              if (valid) {
                  var data = this.$serialize('edit-form1');
                  data.userCompanyId=this.formObj.userCompanyId;
                  data.userCompanyName=this.formObj.userCompanyName;
                  data.userDepartmentId=this.formObj.userDepartmentId;
                  data.userDepartmentName=this.formObj.userDepartmentName;
                  data.userJobId=this.formObj.userJobId;
                  data.userJobName=this.formObj.userJobName;
                // this.$extend(data,  {  });
                  if (this.$string(this.id).isEmpty()) {
                      // 添加
                      this.$store.dispatch('PersonnelManage/add', data).then(() => {
                          this._resultChange('添加成功!');
                      });
                  }
                  else {
                    // 编辑
                    data.userId=this.formObj.userId;
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
                  this.id = formObj.id;
                  this.formObj = formObj;
                  this.formObj.userId=formObj.userId;
                  this.formObj.passwordCheck=formObj.userPassword;
                  this.modalTitle = '编辑人员信息';
              }
              this._getCompanyList();
          },
          _getCompanyList(){
            let that =this;
            this.$store.dispatch('CompanyManage/list').then(() => {
              let result;
              result =that.$store.state.CompanyManage.list;
              this.companyList=result;
            });
          },
        }
    }
</script>
