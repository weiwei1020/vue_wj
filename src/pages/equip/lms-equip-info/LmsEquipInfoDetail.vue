<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器资产信息表详情" :width="800">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                          <th>仪器编号</th>
                          <td>{{obj.apparatusNum}}</td>
                          <th>仪器名称</th>
                          <td>{{obj.apparatusName}}</td>
                        </tr>
                        <tr>
                          <th>仪器类别</th>
                          <td>{{obj.apparatusSortName}}</td>
                          <th>仪器品牌</th>
                          <td>{{obj.apparatusBrand}}</td>
                        </tr>
                        <tr>
                          <th>仪器价格</th>
                          <td>{{obj.apparatusPrice}}</td>
                          <th>购买日期</th>
                          <td>{{obj.apparatusBuyTime}}</td>
                        </tr>
                        <tr >
                          <th>备注</th>
                          <td colspan="3">{{obj.apparatusRemark}}</td>
                        </tr>
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
    export default {
        data() {
            return {
                obj: {},
                showDetailModal: false,
                status:'',
                date:{
                  apparatusBuyTime:''
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
              if(obj.apparatusBuyTime!=undefined){
                this.date.apparatusBuyTime = obj.apparatusBuyTime;
              }else{
                this.date.apparatusBuyTime='';
              }
            }
        }
    }
</script>
