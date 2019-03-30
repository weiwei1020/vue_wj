<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器使用记录信息表详情" :width="700">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                          <th>仪器名称</th>
                          <td>{{obj.name}}</td>
                          <th>状态</th>
                          <td v-if="obj.status == 0">草稿</td>
                          <td v-else="obj.status == 1">已提交</td>
                        </tr>
                        <tr>
                          <th>使用实验室</th>
                          <td>{{obj.labName}}</td>
                          <th>使用日期</th>
                          <td>{{date.useDate}}</td>
                        </tr>
                        <tr>
                          <th>使用开始日期</th>
                          <td>{{date.useStartTime}}</td>
                          <th>使用结束时间</th>
                          <td>{{date.useEndTime}}</td>
                        </tr>
                        <tr>
                          <th>开始性能</th>
                          <td>{{obj.performanceStart}}</td>
                          <th>结束性能</th>
                          <td>{{obj.performanceEnd}}</td>
                        </tr>
                        <tr>
                          <th>使用人</th>
                          <td>{{obj.userName}}</td>
                          <th>检品编号/批号</th>
                          <td>{{obj.checkNum}}</td>
                        </tr>
                        <tr>
                          <th>检测项目</th>
                          <td>{{obj.checkItem}}</td>
                          <th>其他要求</th>
                          <td>{{obj.other}}</td>
                        </tr>
                        <tr>
                          <th>登记时间</th>
                          <td>{{date.registerTime}}</td>
                        </tr>
                        <tr>
                          <th>备注</th>
                          <td colspan="3">{{obj.remark}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>
    </div>
</template>
<script>
    /**
     * 仪器使用记录信息表详情
     */
    var dateFormat = require('dateformat');
    export default {
        data() {
            return {
                obj:{},
                showDetailModal: false,
                date:{
                  useDate:'',
                  useStartTime:'',
                  useEndTime:'',
                  registerTime:''
                }
            }
        },
        methods: {
            _open(obj) {
                this.showDetailModal = true;
                this.obj = obj;
                //日期转换
              if(obj.useDate!=undefined){
                this.date.useDate = dateFormat(obj.useDate,"yyyy-mm-dd");
              }else{
                this.date.useDate ='';
              }
              if(obj.useStartTime!=undefined){
                this.date.useStartTime = dateFormat(obj.useStartTime,"yyyy-mm-dd");
              }else{
                this.date.useStartTime ='';
              }
              if(obj.useEndTime!=undefined){
                this.date.useEndTime = dateFormat(obj.useEndTime,"yyyy-mm-dd");
              }else{
                this.date.useEndTime ='';
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
