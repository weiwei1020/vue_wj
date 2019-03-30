<template>
  <div>
    <Modal v-model="showDetailModal" title="详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>维保单详情id</th>
            <td>{{obj.detailId}}</td>
          </tr>
          <tr>
            <th>状态</th>
            <td>{{status}}</td>
          </tr>
          <tr>
            <th>实际保养开始时间</th>
            <td>{{date.maintainStartTimeAct}}</td>
          </tr>
          <tr>
            <th>实际保养结束时间</th>
            <td>{{date.maintainEndTimeAct}}</td>
          </tr>
          <tr>
            <th>维保费用</th>
            <td>{{obj.maintainFee}}</td>
          </tr>
          <tr>
            <th>维保人员</th>
            <td>{{obj.maintainerNames}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td>{{obj.remark}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 详情
   */
  var dateFormat = require('dateformat');
  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false,
        status:'',
        date: {
          maintainStartTimeAct: '',
          maintainEndTimeAct: '',
        }
      }
    },
    methods: {
      _open(obj) {
        this.showDetailModal = true;
        this.obj = obj;

        this.date.maintainStartTimeAct = dateFormat(obj.maintainStartTimeAct, "yyyy-mm-dd HH:MM:ss");
        this.date.maintainEndTimeAct = dateFormat(obj.maintainEndTimeAct, "yyyy-mm-dd HH:MM:ss");

        if(obj.status == 0){
          this.status = '待保养'
        }else if(obj.status == 1){
          this.status = '保养中'
        }else if(obj.status == 2){
          this.status = '已保养'
        }else if(obj.status == 3){
          this.status = '已提交'
        }else if(obj.status == 4){
          this.status = '已废止'
        }else{
          this.status = ''
        }
      }
    }
  }
</script>
