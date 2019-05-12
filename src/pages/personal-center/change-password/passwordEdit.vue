<template>
  <div>
    <div class="selfClass" :style="{height}">
      <Card :bordered="false" style="width:600px;margin:50px auto auto auto">
        <div>
          <Row>
            <Col span="24">
            <div class="self-avatar">
              <h2>修改密码</h2>
            </div>
            </Col>
            <Col span="24">
            <Form id="edit-password-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
              <Form-item label="旧密码" prop="personPassword">
                <Input
                  type="password"
                  v-model="formObj.personPassword"
                  name="personPassword"
                  placeholder="请输入您的密码"
                  size="large"
                  icon="compose"
                />
              </Form-item>
              <Form-item label="新密码" prop="personNewPasswords" class="margin-top-30">
                <Input
                  type="password"
                  v-model="formObj.personNewPasswords"
                  name="personNewPasswords"
                  placeholder="请输入您的新密码"
                  size="large"
                  icon="compose"
                />
              </Form-item>
              <Form-item label="确认密码" prop="checkPassword" class="margin-top-30">
                <Input
                  type="password"
                  v-model="formObj.checkPassword"
                  placeholder="请再次输入您的新密码"
                  size="large"
                  icon="compose"
                />
              </Form-item>
            </Form>
            <div style="text-align: center;" class="margin-top-30">
              <modal-footer ref="footerModal" :footer="footerList" @on-result-change="_footerResult" />
            </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
/**
 * 修改密码
 */
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else if (value === this.formObj.personNewPasswords.replace(/[^a-zA-Z]/g, '')) {
        // 只输入英文
        callback(new Error('请输入数字和字母结合的密码'))
      } else if (value === this.formObj.personNewPasswords.replace(/\D/g, '')) {
        // 只输入数字
        callback(new Error('请输入数字和字母结合的密码'))
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入您的新密码'))
      } else if (value !== this.formObj.personNewPasswords) {
        callback(new Error('两次输入的密码不匹配'))
      } else {
        callback()
      }
    }
    return {
      formObj: {
        personPassword: '',
        personNewPasswords: '',
        checkPassword: ''
      },
      ruleValidate: {
        personPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        personNewPasswords: [
          { validator: validatePassword, trigger: 'blur', required: true }
        ],
        checkPassword: [
          { validator: validatePassCheck, trigger: 'blur', required: true }
        ]
      },
      footerList: [{ name: '确认修改', type: 'primary' }],
      height: document.documentElement.clientHeight - 120 + 'px',
      oldPassword:'',
  }
  },
  mounted() {
    this._hideLoading()
  },
  methods: {
    // modal-footer
    _footerResult(name) {
      switch (name) {
        case '确认修改':
          this._ok()
          break
        case '取消':
          this._hideLoading()
          break
      }
    },
    _hideLoading() {
      this.$refs.footerModal._hideLoading()
    },
    _resultChange(msg) {
      if (this.$store.state.PersonnelManage.success) {
        this.formObj.personPassword='';
        this.formObj.personNewPasswords='';
        this.formObj.checkPassword='';
        this.$Message.success(msg);
        this.$emit("on-result-change")
      }
    },
    _ok() {
      this.$refs['formObj'].validate((valid) => {
        if (valid) {
          var data = this.$serialize('edit-form');
          data. personPassword=this.formObj.personNewPasswords;
          data.personId=localStorage.getItem('personId');
          if(this.formObj.personPassword!==localStorage.getItem('personPassword')){
            this.$Message.error('旧密码错误，请重新输入！')
          }else{
            if(data.personPassword===localStorage.getItem('personPassword')){
              this.$Message.error('新密码不能与旧密码相同！')
            }
            else{
              // 编辑
              this.$store.dispatch('PersonnelManage/changePassword', data).then(() => {
                this._resultChange('修改成功!');
                localStorage.setItem('personPassword',data.personPassword)
              });
            }
          }
        } else {
          this.$Message.error('表单验证失败!');
        }
      });
    },
  }
}
</script>

<style scoped>
.selfClass {
  background: #eee;
  padding: 20px;
}

.margin-top-30 {
  margin-top: 30px;
}

.self-avatar {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  text-align: center;
}
</style>
