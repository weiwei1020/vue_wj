<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="110">
          <Form-item label="人员名称" prop="staffId">
            <StaffAutoComplete :value="formObj.staffName" placeholder="请选择员工"
                               :downData="staffList" @on-result-change="_staffChange"
            ></StaffAutoComplete>
          </Form-item>
          <Form-item label="班次" prop="shift">
            <Select v-model="formObj.shift" @on-change="_shiftChange">
              <Option v-for="item in shiftList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="排班开始日期" prop="scheduleStartTime">
            <Date-picker name="scheduleStartTime" type="date" placeholder="排班开始时间"
                         v-model="formObj.scheduleStartTime" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="排班开始时间" prop="scheduleStartTimeHms">
            <Date-picker name="scheduleStartTimeHms" type="time" placeholder="排班开始时间"
                         v-model="formObj.scheduleStartTimeHms" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="排班结束日期" prop="scheduleEndTime">
            <Date-picker name="scheduleEndTime" type="date" placeholder="排班结束时间" v-model="formObj.scheduleEndTime"
                         style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="排班结束时间" prop="scheduleEndTimeHms">
            <Date-picker name="scheduleEndTimeHms" type="time" placeholder="排班结束时间" v-model="formObj.scheduleEndTimeHms"
                         style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"/>
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
<script>/**
 * 添加编辑人员管理-人员排班
 */

const defVal = {
  staffId: '',
  staffName: '',
  shift: 0,
  scheduleStartTime: new Date(),
  scheduleEndTime: new Date(),
  scheduleStartTimeHms: '08:00:00',
  scheduleEndTimeHms: '16:00:00',
  remark: '',
};
import StaffAutoComplete from '../StaffAutoComplete'

export default {
  components: {
    StaffAutoComplete
  },
  data() {
    return {
      id: '',
      modalTitle: '',
      formObj: defVal,
      ruleValidate: {},
      staffList: [], //人员列表数据
      staffListTemp: [], //人员列表数据
      showEditModal: false,
      shiftList: [
        {value: 0, name: '早班'},
        {value: 1, name: '中班'},
        {value: 2, name: '晚班'},
      ],
    }
  },
  methods: {
    _staffChange(msg, data) {
      switch (msg) {
        case'select':
          this.formObj.staffId = data.id;
          this.formObj.staffName = data.name;
          break;
        default:
          this._staffQuery(data);
      }
    },
    _staffQuery(query) {
      if (query === '') {
        this.staffList = this.staffListTemp;
      } else {
        this.staffList = this.staffListTemp.filter(item => item.name.indexOf(query) > -1);
      }
    },
    _shiftChange(data) {
      this.formObj.shift = data;
      if (data == 0) {
        this.formObj.scheduleStartTimeHms = '08:00:00';
        this.formObj.scheduleEndTimeHms = '16:00:00';
      } else if (data == 1) {
        this.formObj.scheduleStartTimeHms = '16:00:00';
        this.formObj.scheduleEndTimeHms = '00:00:00';
      } else if (data == 2) {
        this.formObj.scheduleStartTimeHms = '00:00:00';
        this.formObj.scheduleEndTimeHms = '08:00:00';
      }
    },
    _resultChange(msg) {
      if (this.$store.state.LmsTestSchedule.success) {
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
          this.$extend(data, {staffId: this.formObj.staffId, shift: this.formObj.shift});
          this.formObj.staffName = '';
          if (this.$string(this.id).isEmpty()) {
            // 添加
            this.$store.dispatch('LmsTestSchedule/add', data).then(() => {
              this._resultChange('添加成功!');
            });
          } else {
            // 编辑
            this.$store.dispatch('LmsTestSchedule/edit', {id: this.formObj.id, obj: data}).then(() => {
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
      this.formObj.staffName = '';
      this._getStaffList();
      if (this.$string(formObj).isEmpty()) {
        this.id = '';
        this.formObj = defVal;
        this.modalTitle = '添加人员管理-人员排班';
      } else {
        this.id = formObj.id;
        this.formObj = formObj;
        this._showTime();
        this.modalTitle = '编辑人员管理-人员排班';
      }
    },
    _showTime() {
      if (this.formObj.scheduleStartTime === undefined) {
        this.formObj.scheduleStartTime = '';
      } else {
        this.formObj.scheduleStartTime = new Date(this.formObj.scheduleStartTime);
      }

      if (this.formObj.scheduleEndTime === undefined) {
        this.formObj.scheduleEndTime = '';
      } else {
        this.formObj.scheduleEndTime = new Date(this.formObj.scheduleEndTime);
      }

    },
    _getStaffList() {
      this.$store.dispatch('LmsStaffInfo/list').then(() => {
        this.staffList = this.$store.state.LmsStaffInfo.list;
        this.staffListTemp = this.$store.state.LmsStaffInfo.list;
      });
    },
  }
}
</script>
