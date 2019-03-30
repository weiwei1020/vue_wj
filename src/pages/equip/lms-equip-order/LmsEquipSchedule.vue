<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
      <p slot="header">{{modalTitle}}</p>
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
    </Modal>
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
        modalTitle: '',
        showEditModal: false,
      }
    },
    mounted() {
      this._search();
      //this._initForm(this.$route.query.data);
     // this._initForm(this.$route.query.data);
    },
    methods: {
      _initForm(data) {
        this.showEditModal=true;
        this.modalTitle=data.name+'-排程图';
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
        $("#equip_gantt").width(document.documentElement.clientWidth - 470);
        gantt.config.readonly = true;
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
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%F %d";
        gantt.config.min_column_width = 50;
        gantt.config.duration_unit = "hour";
        gantt.config.scale_height = 54;
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

