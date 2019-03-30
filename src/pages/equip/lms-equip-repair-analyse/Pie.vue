<template>
  <div class="border-chart-color">
    <div class="chartTitle">
      <label>{{groupName}}故障类型占比</label>
    </div>
    <div class="chartCont" :style="heightObj">
      <div style="width:90%">
        <IEcharts :option="option" style="width:100%;" :style="optionObj"></IEcharts>
      </div>
    </div>
    <form id="repair-pie">
      <input name="equipId" type="hidden"/>
      <input name="beginDate" type="hidden"/>
      <input name="endDate" type="hidden"/>
      <input name="equipName" type="hidden"/>
    </form>
  </div>
</template>

<script>
  let echartColor = ['#00a0e9', '#33b16d', '#fa8e19', '#fad819',
    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
    '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
  import IEcharts from 'vue-echarts-v3/src/full';

  export default {
    components: {IEcharts},
    data() {
      return {
        //科室名称
        groupName: '',
        heightObj: {
          height: '300px',
        },
        option: {
          title: {
            x: 'center',
            textStyle:{
              fontSize:14,
              fontWeight:'normal',
            }
          },
          tooltip: {
            trigger: 'item',
            formatter:  function (a) {
              return ( a['name']
                + '</br>次数: ' +a['value']
                + '<br>占比: ' +  a['data'].items+'%'
              );
            }
          },
          legend: {
            orient: 'horizontal',
            y: 'bottom',
            data: []
          },
          color: echartColor,
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['40%','70%'],
              center: ['50%', '50%'],
              data: [],
              label: {
                normal: {
                  show: false,
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
            }
          ]
        },
        optionObj: {
          height: ''
        }
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _contHide() {
        this.optionObj.height = document.documentElement.clientHeight - 300 + 'px';
        this.heightObj.height = document.documentElement.clientHeight - 272 + 'px';
        this._open()
      },
      _open(){
        var date_ = new Date();
        var year = date_.getFullYear();
        var firstdate = year + '-01' + '-01'
        this.beginDate = firstdate;
        $('input[name=beginDate]').val(firstdate);
        $('input[name=endDate]').val(this.$dateformat(new Date(), 'yyyy-mm-dd'));
        this._getTask()
      },
      _tableOpen(data){
        console.log(data)
        $('input[name=equipName]').val(data.equipName);
        $('input[name=equipId]').val(data.equipId);
        this._getTask();
      },
      _openPie(data) {
        $('input[name=equipName]').val(data.equipName);
        $('input[name=beginDate]').val(data.beginDate);
        $('input[name=endDate]').val(data.endDate);
        $('input[name=equipId]').val(data.equipId);
        this.equipName = data.equipName;
        this._getTask();
      },
      _getTask() {
        let testerList = [];
        let seriesList = [];
        let total = 0;
        this.$store.dispatch('StatisticEquipRepair/pieAna', this._searchParams()).then(() => {
          let result = this.$store.state.StatisticEquipRepair.pie;
          if(result !== undefined){
            for (let i = 0; i < result.length; i++) {
              testerList.push(result[i].breakdown);
              seriesList.push({ name: result[i].breakdown, value: result[i].playCount})
            }
          }
          this.option.legend.data = testerList;
          let total = 0;
          for (let j = 0; j < seriesList.length; j++) {
            total += parseInt(seriesList[j].value)
          }
          for (let k = 0; k < seriesList.length; k++) {
            let num = parseInt(seriesList[k].value)
            let radio = num*100/ total;
            seriesList[k].items = radio
          }
          this.option.series[0].data = seriesList;
        });
      },
      _searchParams() {
        var data = this.$serialize('repair-pie');
        return this.$extend(data);
      },
    }
  }
</script>
