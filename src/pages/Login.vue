<template>
  <div>
    <div class="selfClass" :style="{height}">
      <Card :bordered="false" style="width:600px;margin:50px auto auto auto">
        <div>
          <Row>
            <Col span="24">
            <div class="self-avatar">
              <h2>用户登陆</h2>
            </div>
            </Col>
            <Col span="24">
            <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
              <Form-item label="用户名" prop="personName">
                <Input
                  v-model="formObj.personName"
                  name="personName"
                  placeholder="请输入您的用户名"
                  size="large"
                  icon="compose"
                />
              </Form-item>
              <Form-item label="密码" prop="personPassword" class="margin-top-30">
                <Input
                  v-model="formObj.personPassword"
                  name="personPassword"
                  placeholder="请输入您的密码"
                  size="large"
                  icon="compose"
                  type="password"
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
 * 登陆
 */
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else if (value === this.formObj.personPassword.replace(/[^a-zA-Z]/g, '')) {
        // 只输入英文
        callback(new Error('请输入数字和字母结合的密码'))
      } else if (value === this.formObj.personPassword.replace(/\D/g, '')) {
        // 只输入数字
        callback(new Error('请输入数字和字母结合的密码'))
      } else {
        callback()
      }
    }
    return {
      formObj: {
        personName: '',
        personPassword: '',
      },
      // checked:false,
      ruleValidate: {
        personName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        // personPassword: [
        //   { validator: validatePassword, trigger: 'blur', required: true }
        // ],
      },
      footerList: [{ name: '登陆', type: 'primary' }],
      height: document.documentElement.clientHeight + 'px'
    }
  },
  mounted() {
    this.getCookie()
  },
  methods: {
    _footerResult(name) {
        switch (name) {
          case '登陆':
            this._ok()
            break
          case '取消':
            this._hideLoading()
            break
        }
      },
    _ok() {
      this.$refs['formObj'].validate((valid) => {
        if (valid) {
          var data = this.$serialize('edit-form');
          // 编辑
          this.$store.dispatch('PersonnelManage/login', data).then(() => {
            let person = this.$store.state.PersonnelManage.success;
            if (person) {
              localStorage.setItem('personName', person.personName);
              localStorage.setItem('personId', person.personId);
              localStorage.setItem('personPassword', person.personPassword);
              localStorage.setItem('personRole', person.personRole);
              this.$router.push('/');
              window.location.href = 'http://localhost:8080'
            }else{
              this.$Message.error('用户名或密码错误');
            }
          });
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
