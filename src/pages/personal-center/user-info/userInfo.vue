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
              <p><span>用户名：</span>{{personName}}</p>
              <p><span>性别：</span>{{personGender}}</p>
              <p><span>年龄：</span>{{personAge}}</p>
              <p><span>所属角色：</span>{{personRoleName}}</p>
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
      personName:'',
      personAge:'',
      personGender:'',
      personRoleName:'',
      height: document.documentElement.clientHeight - 120 + 'px'
    }
  },
  mounted() {
    this._getUserInfo()
  },
  methods: {
    _getUserInfo() {
      let id=localStorage.getItem('personId');
      this.$store.dispatch('PersonnelManage/getById',id).then(() => {
        let result;
        result =this.$store.state.PersonnelManage.model;
        this.personName=result.personName;
        this.personAge=result.personAge;
        this.personGender=result.personGender;
        this.personRoleName=result.personRoleName;
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
