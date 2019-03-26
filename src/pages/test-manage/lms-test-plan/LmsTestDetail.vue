<template>
  <div>
    <Modal v-model="showDetailModal" title="人员实验-详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>实验名称</th>
            <td>{{obj.testName}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td>{{obj.remark}}</td>
          </tr>
          <tr>
            <th>开始时间</th>
            <td>{{date.beginDate}}</td>
          </tr>
          <tr>
            <th>结束时间</th>
            <td>{{date.endDate}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 人员实验-详情
   */
  var dateFormat = require('dateformat');

  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false,
        date:{
          beginDate:'',
          endDate:'',
        },
      }
    },
    methods: {
      _open(obj) {
        this.showDetailModal = true;
        this.obj = obj;
        if(obj.beginDate!=undefined){
          this.date.beginDate = dateFormat(obj.beginDate,"yyyy-mm-dd HH:MM:ss");
        }else{
          this.date.beginDate='';
        }
        if(obj.endDate!=undefined){
          this.date.endDate = dateFormat(obj.endDate,"yyyy-mm-dd HH:MM:ss");
        }else{
          this.date.endDate='';
        }
      }
    }
  }
</script>
