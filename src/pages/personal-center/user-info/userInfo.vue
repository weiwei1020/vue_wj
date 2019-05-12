<template>
  <div>
    <div class="selfClass" :style="{height}">
      <Card :bordered="false" style="width:600px;margin:50px auto auto auto">
        <div>
          <Row>
            <Col span="24">
            <div class="self-avatar">
              <h2>个人信息</h2>
            </div>
            </Col>
            <Col span="24">
              <p><span>用户名：</span>{{userName}}</p>
              <p><span>所在公司：</span>{{userCompanyName}}</p>
              <p><span>所在部门：</span>{{userDepartmentName}}</p>
              <p><span>职位：</span>{{userJobName}}</p>
              <p><span>电子邮箱：</span>{{userEmail}}</p>
              <p><span>手机号：</span>{{userMobile}}</p>
              <p><span>入职时间：</span>{{userEntryDate}}</p>
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
    return {
      userName:'',
      userCompanyName:'',
      userDepartmentName:'',
      userJobName:'',
      userEmail:'',
      userMobile:'',
      userEntryDate:'',
      height: document.documentElement.clientHeight - 120 + 'px'
    }
  },
  mounted() {
    this._getUserInfo()
  },
  methods: {
    _getUserInfo() {
      let id=localStorage.getItem('userId');
      let that =this;
      this.$store.dispatch('PersonnelManage/getById',id).then(() => {
        let result;
        result =that.$store.state.PersonnelManage.model;
        this.userName=result.userName;
        this.userCompanyName=result.userCompanyName;
        this.userDepartmentName=result.userDepartmentName;
        this.userJobName=result.userJobName;
        this.userEmail=result.userEmail;
        this.userMobile=result.userMobile;
        this.userEntryDate=result.userEntryDate;
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
