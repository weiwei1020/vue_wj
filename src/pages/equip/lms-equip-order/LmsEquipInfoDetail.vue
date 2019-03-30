<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器资产信息表详情" :width="700">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                       <th>联系邮箱</th>
                          <td>{{obj.supplieremil}}</td>
                          <th>仪器名称</th>
                          <td>{{obj.name}}</td>
                        </tr>
                        <tr>
                          <th>仪器类别</th>
                          <td>{{obj.className}}</td>
                          <th>数量</th>
                          <td>{{obj.counts}}</td>
                        </tr>
                        <tr>
                          <th>仪器品牌</th>
                          <td>{{obj.brand}}</td>
                          <th>仪器价格</th>
                          <td>{{obj.price}}</td>
                        </tr>
                        <tr>
                          <th>仪器编号</th>
                          <td>{{obj.equipNum}}</td>
                          <th>备注</th>
                          <td>{{obj.remark}}</td>
                        </tr>

                        <!-- <tr>
                          <th>证书编号</th>
                          <td>{{obj.ceNum}}</td>
                          <th>实验室编号</th>
                          <td>{{obj.labNum}}</td>
                        </tr>
                       <tr>
                          <th>使用科别</th>
                          <td>{{obj.departmentName}}</td>
                          <th>使用地点</th>
                          <td>{{obj.locationName}}</td>
                        </tr>
                        <tr>
                          <th>设备管理人</th>
                          <td>{{obj.equipAdminName}}</td>
                          <th>检定周期（月）</th>
                          <td>{{obj.period}}</td>
                        </tr>
                        <tr>
                          <th>有效日期</th>
                          <td>{{date.effectDate}}</td>
                          <th>购买日期</th>
                          <td>{{date.buyDate}}</td>
                        </tr>
                        <tr>
                          <th>备注</th>
                          <td>{{obj.remark}}</td>
                        </tr>-->
                    </tbody>
                </table>
            </div>
        </Modal>
    </div>
</template>
<script>
    /**
     * 仪器资产信息表详情
     */
    var dateFormat = require('dateformat');
    export default {
        data() {
            return {
                obj: {},
                showDetailModal: false,
                status:'',
                date:{
                  effectDate:'',
                  buyDate:''
                }
            }
        },
        methods: {
            _open(obj) {
                this.showDetailModal = true;
                this.obj = obj;

                if(obj.status == 0){
                  this.status = '闲置'
                }else if(obj.status == 1){
                  this.status = '在用'
                }else if(obj.status == 2){
                  this.status = '保养中'
                }else if(obj.status == 3){
                  this.status = '维修中'
                }else if(obj.status == 4){
                  this.status = '已报废'
                }else{
                  this.status = ''
                }

              if(obj.effectDate!=undefined){
                this.date.effectDate = dateFormat(obj.effectDate,"yyyy-mm-dd");
              }else{
                this.date.effectDate='';
              }
              if(obj.buyDate!=undefined){
                this.date.buyDate = dateFormat(obj.buyDate,"yyyy-mm-dd");
              }else{
                this.date.buyDate='';
              }
            }
        }
    }
</script>
