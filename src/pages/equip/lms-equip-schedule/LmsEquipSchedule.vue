<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <div>
      <Form id="view-search-form" inline onsubmit="return false" :label-width="70" style="margin-top: 10px">
        <label class="label-sign"></label>
        <Form-item label="仪器名称" class="width-23">
          <Input v-model="name" name="name" placeholder="请填写仪器名称" @on-enter="_search"/>
        </Form-item>
        <Form-item class="search-btn">
          <Button type="primary" @click="_search">搜索</Button>
        </Form-item>
      </Form>
      <div id="equip_gantt"></div>
    </div>
  </div>
</template>
<script>
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  let dateFormat = require('dateformat');
  export default {
    components: {
      BreadCrumbs
    },
    data() {
      return {
        tasks: {},
        name: '',
      }
    },
    mounted() {
      this._search();
      this._initForm(this.$route.query.data);
    },
    methods: {
      _initForm(data) {
       this.name=data.name;
       this._search();
      },
      _search() {
        let tasks = [];
        let data = {};
        if (this.name) {
          data.name = this.name;
        }
        this.$store.dispatch('LmsEquipSchedule/getEquipSchedule', data).then(() => {
          tasks = this.$store.state.LmsEquipSchedule.list;
          for (let i = 0; i < tasks.length; i++) {
            let type = '';
            if (undefined != tasks[i].text && tasks[i].text.length >= 0) {
              type = tasks[i].text.substring(0, 2);
            }
            tasks[i].start_date = dateFormat(tasks[i].startDate, 'dd-mm-yyyy HH:MM:ss');
            tasks[i].color='#299cb4';
          }
          this.tasks = {data: tasks};
          this._ganttInit();
        });

      },
      _ganttInit() {
        /*默认添加任务，所以显示之前如果有任务就清空*/
        if (gantt.getTaskCount()) {
          gantt.clearAll();
        }
        $("#equip_gantt").height(document.documentElement.clientHeight - 190);
        $("#equip_gantt").width(document.documentElement.clientWidth - 210);
          //gantt.config.readonly = true;(全局只读)
        //灯箱不可拖动
        gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e){
          return false;
        });
        gantt.config.columns = [
          {
            name: "text", label: "仪器名称", width: 190, tree: true,"open": true, template: function (item) {
              return undefined === item.text ? '' : item.text;
            }
          },
          {
            name: "start_date", label: "开始时间", width: 140, align: "center","open": true, template: function (item) {
              return dateFormat(item.start_date, 'yyyy-mm-dd HH:MM:ss');
            }
          },
          {
            name: "duration", label: "持续时间", width: 75, align: "center","open": true, template: function (item) {
              let days = item.duration / 24;
              let hours = item.duration % 24;
              let text = '';
              if (parseInt(days) > 0) {
                text = text + parseInt(days) + '天';
              }
              text = text + hours + '小时';
              return text;
            }
          },
          {name:"add",label:"" }
        ];
        //gantt.config.grid_resize = true;//拖动右边调整大小(已弃用)
        gantt.config.layout = {
          css: "gantt_container",
          rows:[
            {cols: [
                //默认的网格视图
                {view: "grid", scrollX:"scrollHor", scrollY:"scrollVer"},
                { resizer: true, width: 1 },
                //默认的时间轴视图
                {view: "timeline", scrollX:"scrollHor", scrollY:"scrollVer"},
                {view: "scrollbar", id:"scrollVer"}
              ]},
            {view: "scrollbar", id:"scrollHor"}
          ]
        };
        gantt.templates.grid_row_class = function( start, end, task ){
          if ( task.$level > 0 ){
            return "nested_task"
          }
          return "";
        };
        let that=this;
        gantt.attachEvent("onBeforeTaskAdd", function(id,item){
           let data={};
            data.equipId=item.parent;
          //  data.orderEndTime= item.end_date;UTC:yyyy-mm-dd'T'HH:MM:ss'Z'
          data.orderEndTime= dateFormat(item.end_date,"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");

         // data.orderStartTime=item.start_date;
          data.orderStartTime= dateFormat(item.start_date,"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");

          data.applyReason=item.text;
            that.$store.dispatch('LmsEquipOrder/submitDrafts', data).then(() => {
              if (that.$store.state.LmsEquipOrder.success) {
                that.$Message.success('申请单提交成功！');
                that.showEditModal = false;
              }else{
                that._search();
              }
              return true;
            });
        });
        gantt.config.scale_unit = "day";//第一个时间刻度
        gantt.config.date_scale = "%F %d";//x轴时间刻度，%F 作为全名的月份（1月至12月）;％d - 作为前导零的数字的日期（01到31）
        gantt.config.min_column_width = 50;//时间轴区域中列的最小宽度
        gantt.config.duration_unit = "hour";//持续时间单位
        gantt.config.scale_height = 54;//时间刻度的高度和网格的标题
        //第二个时间刻度
        gantt.config.subscales = [
          {unit: "hour", step: 1, date: "%H:%i"}
        ];
        gantt.templates.tooltip_text = function (start, end, task) {
          return "<b>Task:</b> " + task.text
            + "<br/><b>Duration:</b> " + task.duration
            + "<br/><b>startDate:</b>" + dateFormat(start, 'yyyy-mm-dd HH:MM:ss')
            + "<br/><b>endDate:</b>" + dateFormat(end, 'yyyy-mm-dd HH:MM:ss');
        };
        gantt.init("equip_gantt");
        gantt.parse(this.tasks);
      }
    }
  }
</script>
<style>
  .nested_task  .gantt_add{
    display: none !important;
  }
</style>

