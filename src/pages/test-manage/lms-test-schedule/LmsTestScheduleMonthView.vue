<template>
  <div>
    <Row>
      <!--查询-->
      <Col span="24">
      <Form id="view-search-form" inline onsubmit="return false" :label-width="70">
        <label class="label-sign"></label>
        <Form-item label="人员名称" class="width-23">
          <Select name="text" clearable placeholder="请选择实验人员" filterable>
            <Option v-for="item in staffList" :value="item.uname" :key="item.id">{{ item.uname}}</Option>
          </Select>
        </Form-item>
        <Form-item label="实验名称:" class="width-23">
          <Input v-model="color" name="color" placeholder="请填写实验名称"/>
        </Form-item>
        <Form-item class="marleft-70">
          <Button type="primary" @click="_search">搜索</Button>
        </Form-item>
      </Form>
      </Col>
      <Col span="24">
      <div id="staff_gantt"></div>
      </Col>
    </Row>
    <OrgZtree ref="ztreeOrgModal" @on-result-change="_ztreeOrg"></OrgZtree>
  </div>
</template>
<script>
  import OrgZtree from '../../../components/Ztree/single-select/OrgZtree'

  let dateFormat = require('dateformat');
  export default {
    components: {
      OrgZtree
    },
    data() {
      return {
        tasks: {data:[]},
        staffList: [],
        orgId:'',
        departs:'',
        color:'',
        text:'',
       /* numberList: [
          {value: 0, name: '早班'},
          {value: 1, name: '中班'},
          {value: 2, name: '晚班'},
        ],*/
      }
    },
    methods: {
      _open() {
        this._getStaffList();
        this._search();
      },
      _search() {
        this.$store.dispatch('LmsTestSchedule/staffSchedule', this._searchParams()).then(() => {
          let tasks = this.$store.state.LmsTestSchedule.list;
          this.tasks.data=[];
          for (let i = 0; i < tasks.length; i++) {
            this.tasks.data.push({
              'id':tasks[i].id,
              //'text':tasks[i].text + '(' + tasks[i].color + ')',
              'text':tasks[i].text,
              'testName':tasks[i].color,
              'color':'#299cb4',//tasks[i].color,
              'start_date':dateFormat(tasks[i].startDate, 'dd-mm-yyyy'),
              'duration':tasks[i].duration
            })
          }
          //alert(this.tasks.data.length);
          this._ganttInit();
        });
      },
      _searchParams() {
        let data = this.$serialize('view-search-form');
        return data;
      },
      _ganttInit() {
        /*默认添加任务，所以显示之前如果有任务就清空*/
        if (gantt.getTaskCount()) {
          gantt.clearAll();
        }
        $("#staff_gantt").height(document.documentElement.clientHeight - 180);
        $("#staff_gantt").width(document.documentElement.clientWidth - 210);
        gantt.config.readonly = true;
        gantt.config.columns = [
          {name: "testName", label: "实验名称", width: 190, tree: true,align: "lfet",},
          {name: "text", label: "人员名称", width: 190, tree: true,align: "lfet",},
          {
            name: "startDate", label: "实验开始时间", width: 140, align: "left", template: function (item) {
              return dateFormat(item.start_date, 'yyyy-mm-dd');
            }
          },
          {
            name: "duration", label: "实验持续时间", width: 75, align: "lfet", template: function (item) {
              return item.duration + '天';
            }
          },
        ];
        gantt.config.grid_resize = true;//拖动右边调整大小(已弃用)
        gantt.templates.tooltip_text = function (start, end, task) {
          return "<b>实验名称:</b> " + task.testName
            + "<br/><b>持续时间:</b> " + task.duration
            + "<br/><b>开始时间:</b>" + dateFormat(start, 'yyyy-mm-dd')
            + "<br/><b>结束时间:</b>" + dateFormat(end, 'yyyy-mm-dd');

        };
        gantt.init("staff_gantt");
        gantt.parse(this.tasks);

      },
      _selectOrgZtree() {
        this.$refs.ztreeOrgModal._openZtree();
      },
      _ztreeOrg(data) {
        if(data){
          this.orgId=data.id;
          this.departs=data.name;
        }else{
          this.orgId='';
          this.departs='';
        }
      },
      _getStaffList() {
        this.$store.dispatch('LmsStaffInfo/list').then(() => {
          this.staffList = this.$store.state.LmsStaffInfo.list;
        });
      },
    }
  }
</script>
