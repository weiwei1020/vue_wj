<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器报废信息表详情" :width="750">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                            <th>申请名称</th>
                            <td>{{obj.name}}</td>
                            <th>状态</th>
                            <td>{{status}}</td>
                        </tr>
                        <tr>
                            <th>申请原因</th>
                            <td colspan="3">{{obj.applyReason}}</td>
                        </tr>
                        <tr>
                            <th>申请人</th>
                            <td>{{obj.applyName}}</td>
                            <th>申请时间</th>
                            <td>{{date.applyTime}}</td>
                        </tr>
                        <tr>
                            <th>技术主管意见</th>
                            <td colspan="3">{{obj.firstStepAdvice}}</td>
                        </tr>
                        <tr>
                            <th>技术主管</th>
                            <td>{{obj.firstStepName}}</td>
                            <th>技术主管签字时间</th>
                            <td>{{date.firstStepTime}}</td>
                        </tr>
                        <tr>
                            <th>中心主任意见</th>
                            <td colspan="3">{{obj.secondStepAdvice}}</td>
                        </tr>
                        <tr>
                            <th>中心主任</th>
                            <td>{{obj.secondStepName}}</td>
                            <th>中心主任签字时间</th>
                            <td>{{date.secondStepTime}}</td>
                        </tr>
                        <tr>
                            <th>登记人</th>
                            <td>{{obj.registerName}}</td>
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
          <Row>
            <!-- 表格 -->
            <Col span="24" style="margin-top: 10px">
            <Table :columns="pageColumns" :data="obj.lmsEquipScrapDetailVOList" size="small" border highlight-row stripe
                   :height="200"></Table>
            </Col>
          </Row>
        </Modal>
    </div>
</template>
<script>
    /**
     * 仪器报废信息表详情
     */
    var dateFormat = require('dateformat');
    export default {
        data() {
            return {
                obj: {},
                showDetailModal: false,
                status:'',
                date:{
                  applyTime:'',
                  firstStepTime:'',
                  secondStepTime:'',
                },
              pageColumns: [
                {type: 'index',title:'序号', width: 60, align: 'center', fixed: 'left',},
                {title: '仪器名称', key: 'name', width: 160, align: 'center'},
                {title: '仪器编号', key: 'equipNum', width: 160, align: 'center'},
                {title: '规格型号', key: 'spec', width: 160, align: 'center'},
                {title: '实验室编号', key: 'labNum', width: 160, align: 'center'},
                {title: '使用科别', key: 'departmentName', width: 160, align: 'center'},
                {title: '使用位置', key: 'locationName', width: 160, align: 'center'},
                {
                  title: '购买日期', key: 'buyDate', "width": 160,
                  render: (h, params) => {
                    let buyDate = '';
                    if (params.row.buyDate != undefined) {
                      buyDate = dateFormat(params.row.buyDate, "yyyy-mm-dd HH:mm:ss")
                    }
                    return h('div', buyDate);
                  }
                },
                {
                  title: '有效日期', key: 'effectDate', "width": 160,
                  render: (h, params) => {
                    let effectDate = '';
                    if (params.row.effectDate != undefined) {
                      effectDate = dateFormat(params.row.effectDate, "yyyy-mm-dd HH:mm:ss")
                    }
                    return h('div', effectDate);
                  }
                },
                {title: '金额', key: 'money', width: 160, align: 'center'},
                {title: '备注', key: 'remark', width: 160, align: 'center'},
              ],
            }
        },
        methods: {
            _open(obj) {
                this.showDetailModal = true;
                this.obj = obj;

              if(obj.status == 0){
                this.status = '草稿';
              }else if(obj.status == 1){
                this.status = '技术主管审批';
              }else if(obj.status == 2){
                this.status = '中心主任审批';
              }else if(obj.status == 3){
                this.status = '技术主管审批驳回';
              }else if(obj.status == 4){
                this.status = '中心主管审批通过';
              }else if(obj.status == 5){
                this.status = '中心主管审批驳回';
              }else if(obj.status == 6){
                this.status = '审批完成-通过';
              }else if(obj.status == 7){
                this.status = '审批完成-不通过';
              }else{
                this.status = '';
              }

              if(obj.applyTime!=undefined){
                this.date.applyTime=dateFormat(obj.applyTime,"yyyy-mm-dd");
              }else{
                this.date.applyTime='';
              }
              if(obj.firstStepTime!=undefined){
                this.date.firstStepTime=dateFormat(obj.firstStepTime,"yyyy-mm-dd");
              }else{
                this.date.firstStepTime='';
              }
              if(obj.secondStepTime!=undefined){
                this.date.secondStepTime=dateFormat(obj.secondStepTime,"yyyy-mm-dd");
              }else{
                this.date.secondStepTime='';
              }

            }
        }
    }
</script>
