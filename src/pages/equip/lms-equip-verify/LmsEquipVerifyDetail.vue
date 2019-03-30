<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器检定信息表详情">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                            <th>仪器名称</th>
                            <td>{{obj.name}}</td>
                        </tr>
                        <tr>
                            <th>状态</th>
                            <td>{{status}}</td>
                        </tr>
                        <tr>
                            <th>提前提醒（天）</th>
                            <td>{{obj.warningDays}}</td>
                        </tr>
                        <tr>
                            <th>检定日期</th>
                            <td>{{date.verifyDate}}</td>
                        </tr>
                        <tr>
                            <th>下次检定日期</th>
                            <td>{{date.nextVerifyDate}}</td>
                        </tr>
                        <tr>
                            <th>检定结果</th>
                            <td>{{obj.verifyResult}}</td>
                        </tr>
                        <tr>
                            <th>检定部门</th>
                            <td>{{obj.verifyDepartmentName}}</td>
                        </tr>
                        <tr>
                            <th>检定范围</th>
                            <td>{{obj.verifyRange}}</td>
                        </tr>
                        <tr>
                            <th>登记人</th>
                            <td>{{obj.registerName}}</td>
                        </tr>
                        <tr>
                            <th>登记时间</th>
                            <td>{{date.registerTime}}</td>
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
     * 仪器检定信息表详情
     */
    var dateFormat = require('dateformat');
    export default {
        data() {
            return {
                obj: {},
                showDetailModal: false,
                status:'',
                date:{
                  verifyDate:'',
                  nextVerifyDate:'',
                  registerTime:''
                }
            }
        },
        methods: {
            _open(obj) {
                this.showDetailModal = true;
                this.obj = obj;

                if(obj.status == 0){
                  this.status = '未过期';
                }else if(obj.status == 1){
                  this.status = '已过期';
                }else if(obj.status == 2){
                  this.status = '已完成';
                }else{
                  this.status = '';
                }
              //日期转换
              if(obj.verifyDate!=undefined){
                this.date.verifyDate = dateFormat(obj.verifyDate,"yyyy-mm-dd");
              }else{
                this.date.verifyDate='';
              }
              if(obj.nextVerifyDate!=undefined){
                this.date.nextVerifyDate = dateFormat(obj.nextVerifyDate,"yyyy-mm-dd");
              }else{
                this.date.nextVerifyDate ='';
              }
              if(obj.registerTime!=undefined){
                this.date.registerTime = dateFormat(obj.registerTime,"yyyy-mm-dd");
              }else{
                this.date.registerTime ='';
              }

            }
        }
    }
</script>
