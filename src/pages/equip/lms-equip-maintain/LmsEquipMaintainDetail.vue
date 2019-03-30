<template>
  <div>
    <Modal v-model="showDetailModal" title="仪器保养计划信息表详情" :width="750">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>计划名称</th>
            <td>{{obj.name}}</td>
          </tr>
          <tr>
            <th>登记状态</th>
            <td>{{status}}</td>
          </tr>
          <tr>
            <th>申请人</th>
            <td>{{obj.applyName}}</td>
          </tr>
          <tr>
            <th>申请时间</th>
            <td>{{date.applyTime}}</td>
          </tr>
          <tr>
            <th>技术主管建议</th>
            <td>{{obj.firstStepAdvice}}</td>
          </tr>
          <tr>
            <th>技术主管</th>
            <td>{{obj.firstStepName}}</td>
          </tr>
          <tr>
            <th>技术主管时间</th>
            <td>{{date.firstStepTime}}</td>
          </tr>
          <tr>
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
      <!--维保详情-->
      <Row>
        <!-- 表格 -->
        <Col span="24" style="margin-bottom: 10px;margin-top:10px">
        <Table :columns="pageColumns" :data="obj.lmsEquipMaintainDetailVOList" size="small" border highlight-row stripe
               :height="200"></Table>
        </Col>
      </Row>
      <Form  :label-width="90" inline style="margin-left: -50px" v-show="obj.lmsEquipFiles&&obj.lmsEquipFiles.length!==0">
        <Form-item label="附件" style="width: 98.6%;">
          <div class="file-upload-list" v-for="item in obj.lmsEquipFiles">
            <div>
              <div class="file-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="_handleView(item)"></Icon>
                <Icon type="ios-cloud-download-outline" @click.native="_downloadFile(item)"></Icon>
              </div>
            </div>
            {{item.orginName}}
          </div>
        </Form-item>
      </Form>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="'https://obs.myhwclouds.com/lims/'+filePath" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
  /**
   * 仪器保养计划信息表详情
   */
  var dateFormat = require('dateformat');
  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false,
        status: '',
        date: {
          applyTime: '',
          firstStepTime: '',
          registerTime: ''
        },
        visible:false,
        filePath:'',
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
                buyDate = dateFormat(params.row.buyDate, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', buyDate);
            }
          },
          {
            title: '有效日期', key: 'effectDate', "width": 160,
            render: (h, params) => {
              let effectDate = '';
              if (params.row.effectDate != undefined) {
                effectDate = dateFormat(params.row.effectDate, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', effectDate);
            }
          },
          {title: '维保项目名称', key: 'projectName', width: 160, align: 'center'},
          {title: '维保内容', key: 'maintainContent', width: 160, align: 'center'},
          {
            title: '计划维保日期', key: 'maintainDate', "width": 160,
            render: (h, params) => {
              let maintainDate = '';
              if (params.row.maintainDate != undefined) {
                maintainDate = dateFormat(params.row.maintainDate, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', maintainDate);
            }
          },
          {title: '维保人员', key: 'maintainerName', width: 160, align: 'center'},
          {title: '备注', key: 'remark', width: 160, align: 'center'},
        ],
      }
    },
    methods: {
      _open(obj) {
        this.showDetailModal = true;
        this.obj = obj;

        if (obj.status == 0) {
          this.status = '草稿'
        } else if (obj.status == 1) {
          this.status = '技术主管审批'
        } else if (obj.status == 2) {
          this.status = '技术主管审批通过'
        } else if (obj.status == 3) {
          this.status = '技术主管审批不通过'
        } else if (obj.status == 4) {
          this.status = '审批完成-通过'
        } else if (obj.status == 5) {
          this.status = '审批完成-不通过'
        } else {
          this.status = ''
        }

        if (obj.applyTime != undefined) {
          this.date.applyTime = dateFormat(obj.applyTime, "yyyy-mm-dd");
        } else {
          this.date.applyTime = '';
        }
        if (obj.firstStepTime != undefined) {
          this.date.firstStepTime = dateFormat(obj.firstStepTime, "yyyy-mm-dd");
        } else {
          this.date.firstStepTime = '';
        }
        if (obj.registerTime != undefined) {
          this.date.registerTime = dateFormat(obj.registerTime, "yyyy-mm-dd");
        } else {
          this.date.registerTime = '';
        }
      },
      _handleView(data) {
        this.filePath = data.filePath;
        let index1=this.filePath.lastIndexOf(".");
        let index2=this.filePath.length;
        let suffix=this.filePath.substring(index1+1,index2);//后缀名
        if(suffix=='png'||suffix=='jpg'||suffix=='jpeg'){
          this.visible = true;
        }else{
          this.$Message.warning({
            content:'非图片文件无法查看，请下载查看',
            duration:3
          });
          this.visible = false;
        }
      },
      _downloadFile(file) {//下载文件
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            var url = 'https://obs.myhwclouds.com/lims/' + file.filePath;
            window.open(url);
            return;
          }
        });
      },
    }
  }
</script>
