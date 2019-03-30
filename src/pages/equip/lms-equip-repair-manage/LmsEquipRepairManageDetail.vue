<template>
    <div>
        <Modal v-model="showDetailModal" title="详情">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                            <th>状态</th>
                            <td>{{status}}</td>
                        </tr>
                        <tr>
                            <th>维修方式</th>
                            <td>{{obj.repairMethod}}</td>
                        </tr>
                        <tr>
                            <th>维修费用</th>
                            <td>{{obj.repairFee}}</td>
                        </tr>
                        <tr>
                            <th>维修人员</th>
                            <td>{{obj.repairerName}}</td>
                        </tr>
                        <tr>
                            <th>维修时间</th>
                            <td>{{date.repairTime}}</td>
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
                date:{
                  repairTime:'',
                }
            }
        },
        methods: {
            _open(obj) {
                this.showDetailModal = true;
                this.obj = obj;

                this.date.repairTime=dateFormat(obj.repairTime,"yyyy-mm-dd");

              if(obj.status == 0){
                this.status = '待维修';
              }else if(obj.status == 1){
                this.status = '维修中'
              }else if(obj.status == 2){
                this.status = '已维修';
              }else if(obj.status == 3){
                this.status = '已提交';
              }else if(obj.status == 4){
                this.status = '已废止';
              }else{
                this.status = '';
              }
            }
        }
    }
</script>
