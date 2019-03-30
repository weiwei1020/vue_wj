<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>

    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
              <Form id="search-form" inline onsubmit="return false" :label-width="70" @on-change="_panelChange">
                <label class="label-sign"></label>
                <Form-item prop="equipId" class="width-22" label="仪器名称:">
                  <Select
                    v-model="queryParams.equipId"
                    name="equipId"
                    placeholder="请填写仪器名称"
                    style="width:100%"
                    filterable
                    remote
                    clearable
                    :remote-method="_getEquip"
                    :loading="eqLoading">
                    <Option v-for="item in equipList" :value="item.id" :key="item.id">{{item.name}}</Option>
                  </Select>
                </Form-item>
                <Form-item label="开始时间:" prop="startTime" class="width-22">
                  <Date-picker name="startTime" type="datetime"  placeholder="有效日期"  v-model="queryParams.startTime" style="width: 100%;"></Date-picker>
                </Form-item>
                <Form-item label="结束时间:" prop="endTime" class="width-22">
                  <Date-picker name="endTime" type="datetime"  placeholder="有效日期"  v-model="queryParams.endTime" style="width: 100%;" ></Date-picker>
                </Form-item>
                <Form-item class="search-btn">
                  <Button type="primary" @click="_doRandom">搜索</Button>
                </Form-item>
              </Form>
          </Col>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
            <div class="echarts">
              <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
            </div>
          </Col>

        </Row>
      </div>
    </div>
  </div>
</template>
<script>
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  import IEcharts from 'vue-echarts-v3/src/full.js';
  let dateFormat = require('dateformat');
  export default {
    name: 'view',
    components: {
      IEcharts,
      BreadCrumbs
    },
    props: {},
    data: () => ({
      heightSearch: 'search',
      queryParams:{
        equipId:'',  //仪器id
        startTime:'',
        endTime:'',
      },
      equipList:[],
      eqLoading: false,
      /******以下是echart*****/
      loading: true,
      bar: {
        title: {
          text: '仪器使用率',
          left: 'center'
        },
        tooltip: {},
        legend: {
          data:['使用率'],
          x: 'left',
        },
        xAxis: {
          data: [],
          name:'仪器名称',
        },
        yAxis: {
          name:'使用率',
        },
        series: [{
          name: '使用率',
          type: 'bar',
          data: []
        }]
      }
    }),
    mounted() {
      this._initData();
    },
    methods: {
      _tableHeight(val){
        this.styleObj.height = document.documentElement.clientHeight -val + 'px';
      },
      _panelChange(rel) { //点击折叠面板
        if (rel.length === 1) {
          this._tableHeight(372);
        } else {
          this._tableHeight(315);
        }
      },
      _getEquip(data) {
        if (this.$string(data).isEmpty()) {
          this.equipList = [];
        } else {
          this.loading = true;
          this.$store.dispatch('LmsEquipSchedule/equipList', data).then(() => {
            this.loading = false;
            this.equipList = this.$store.state.LmsEquipSchedule.equipList;
          });
        }
      },
      _initData(){
        let date=new Date();
        let nowDay=new Date(date.getFullYear(),date.getMonth(),date.getDate());
        let nowTime = date.getHours()+':'+date.getMinutes()+';'+date.getSeconds();
        this.queryParams.endTime=dateFormat(new Date(nowDay), "yyyy-mm-dd")+nowTime;
        this.queryParams.startTime=dateFormat(date.setMonth(0,1), "yyyy-mm-dd")+'00:00:00';
         setTimeout(()=>{
            this._doRandom();
          },100)
      },
      _doRandom() {
        const that = this;
        this.$store.dispatch('LmsEquipUseRecord/useRate', this.$serialize('search-form')).then(() => {
            that.loading = false;
            that.bar.series[0].data=this.$store.state.LmsEquipUseRecord.model.valueList;
            that.bar.xAxis.data=this.$store.state.LmsEquipUseRecord.model.nameList;
        });
      },
      onReady(instance) {
        //console.log(instance);
      },
      onClick(event, instance, echarts) {
       // console.log(arguments);
      }
    }
  }
</script>
<style scoped>
  .echarts {
    width: 90%;
    height: 600px;
  }
</style>
