<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器采购订单表详情" :width="750">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                          <th>申请名称</th>
                          <td>{{obj.name}}</td>
                          <th>状态</th>
                          <td >{{status}}</td>
                        </tr>
                        <tr>
                          <th>申请时间</th>
                          <td>{{date.applyTime}}</td>
                          <th>申请人</th>
                          <td>{{obj.applyName}}</td>
                        </tr>
                        <tr>
                          <th>申请原因</th>
                          <td colspan="3">{{obj.applyReason}}</td>
                        </tr>
                        <tr>
                          <th>技术主管签字时间</th>
                          <td>{{date.firstStepTime}}</td>
                          <th>技术主管</th>
                          <td>{{obj.firstStepName}}</td>
                        </tr>
                        <tr>
                          <th>技术主管意见</th>
                          <td colspan="3">{{obj.firstStepAdvice}}</td>
                        </tr>
                        <tr>
                          <th>中心主任签字时间</th>
                          <td>{{date.secondStepTime}}</td>
                          <th>中心主任</th>
                          <td>{{obj.secondStepName}}</td>
                        </tr>
                        <tr>
                          <th>中心主任意见</th>
                          <td colspan="3">{{obj.secondStepAdvice}}</td>
                        </tr>
                        <tr>
                          <th>登记时间</th>
                          <td>{{date.registerTime}}</td>
                          <th>登记人</th>
                          <td>{{obj.registerName}}</td>
                        </tr>
                        <tr>
                          <th>备注</th>
                          <td colspan="3">{{obj.remark}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          <!--内容-->
          <Row>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px;margin-top:10px">
            <Table :columns="pageColumns" :data="obj.lmsEquipPurchaseDetailVOList" size="small" border highlight-row stripe
                   :height="200"></Table>
            </Col>
          </Row>
        </Modal>
    </div>
</template>
<script>
    /**
     * 仪器采购订单表详情
     */
    var dateFormat = require('dateformat');
    export default {
        data() {
            return {
                obj: {},
                showDetailModal: false,
                status:'',
                pageColumns: [
                  {type: 'index', title:'序号', width: 60, align: 'center',fixed:'left'},
                  {title: '仪器名称', key: 'name',width:130,ellipsis: true,fixed:'left'},
                  {title: '仪器类别', key: 'className', width: 160, align:"center",ellipsis: true},
                  {title: '供应商名', key: 'supplierName', width: 160, align:"center",ellipsis: true},
                  {title: '规格型号', key: 'spec', width: 100, align:"center",ellipsis: true},
                  {title: '仪器单价', key: 'price', width: 100, align:"center",ellipsis: true},
                  {title: '制造厂商', key: 'productPlace', width: 160, align:"center",ellipsis: true},
                  {title: '计量类别', key: 'meterType', width: 100, align:"center",ellipsis: true},
                  {title: '不确定度', key: 'uncertainty', width: 100, align:"center",ellipsis: true},
                  {title: '仪器精度', key: 'accuracy', width: 100, align:"center",ellipsis: true},
                  {title: '使用范围', key: 'range', width: 160, align:"center",ellipsis: true},
                  {title: '备注', key: 'remark', width: 160, align:"center",ellipsis: true},
                ],
                date:{
                  applyTime:'',
                  firstStepTime:'',
                  secondStepTime:'',
                  registerTime:''
                }
            }
        },
        methods: {
            _open(obj) {
                this.showDetailModal = true;
                this.obj = obj;
                if(obj.status == 0){
                  this.status = '草稿';
                }else if(obj.status == 1){
                  this.status = '待技术主管审批';
                }else if(obj.status == 2){
                  this.status = '待中心主任审批';
                }else if(obj.status == 3){
                  this.status = '设备待验收';
                }else if(obj.status == 4){
                  this.status = '待存档入库';
                }else if(obj.status == 5){
                  this.status = '申购成功';
                }else if(obj.status == 6){
                  this.status = '技术主管驳回驳回';
                }else if(obj.status == 7){
                  this.status = '中心主任废除';
                }else if(obj.status == 8){
                  this.status = '设备验收废除';
                }else if(obj.status == 9){
                  this.status = '审批完成-通过';
                }else if(obj.status == 10){
                  this.status = '审批完成-不通过';
                }else{
                  this.status = '';
                }

              if(obj.applyTime!=undefined){
                this.date.applyTime = dateFormat(obj.applyTime,"yyyy-mm-dd");
              }else{
                this.date.applyTime ='';
              }
              if(obj.firstStepTime!=undefined){
                this.date.firstStepTime = dateFormat(obj.firstStepTime,"yyyy-mm-dd");
              }else{
                this.date.firstStepTime ='';
              }
              if(obj.secondStepTime!=undefined){
                this.date.secondStepTime = dateFormat(obj.secondStepTime,"yyyy-mm-dd");
              }else{
                this.date.secondStepTime ='';
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
