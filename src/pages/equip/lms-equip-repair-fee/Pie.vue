<template>
  <div class="border-chart-color">
    <div class="chartTitle">
      <label>{{equipName}}故障费用占比</label>
    </div>
    <div class="chartCont" :style="heightObj">
      <div style="width:90%">
        <IEcharts :option="option" style="width:100%;" :style="optionObj" @click="_pieClick"></IEcharts>
      </div>
    </div>
    <Form id="fee-pie">
      <input name="equipId" type="hidden"/>
      <input name="beginDate" type="hidden"/>
      <input name="endDate" type="hidden"/>
      <input name="breakdown" type="hidden"/>
      <input name="equipName" type="hidden"/>
    </Form>
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
        equipName: '',
        heightObj: {
          height: '300px',
        },
        option: {
          title: {
            x: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (a) {
              return (a['name']
                + '</br>费用: ' + a['value']
                + '<br>占比: ' + a['data'].items+'%'
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
              radius: ['40%', '70%'],
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
      _pieClick(data) {
        this.$emit('on-result-change', data.name)
      },
      _contHide() {
        this.optionObj.height = document.documentElement.clientHeight - 300 + 'px';
        this.heightObj.height = document.documentElement.clientHeight - 272 + 'px';
      },
      _open(data) {
        $('input[name=beginDate]').val(data.beginDate);
        $('input[name=endDate]').val(data.endDate);
        this._getTask()
      },
      _openPie(data) {
        $('input[name=equipName]').val(data.equipName);
        $('input[name=beginDate]').val(data.beginDate);
        $('input[name=endDate]').val(data.endDate);
        $('input[name=equipId]').val(data.equipId);
        $('input[name=breakdown]').val(data.breakdown);
        this.equipName = data.equipName;
        this._getTask();
      },
      _getTask() {
        let testerList = [];
        let seriesList = [];
        this.$store.dispatch('StatisticEquipRepair/pie', this._searchParams()).then(() => {
          let result = this.$store.state.StatisticEquipRepair.pie;
          if (result !== undefined) {
            for (let i = 0; i < result.length; i++) {
              testerList.push(result[i].breakdown);
              seriesList.push({name: result[i].breakdown, value: result[i].allFee})
            }
          }
          this.option.legend.data = testerList;
          let total = 0;
          for (let j = 0; j < seriesList.length; j++) {
            total += parseInt(seriesList[j].value)
          }
          for (let k = 0; k < seriesList.length; k++) {
            let num = parseInt(seriesList[k].value)
            let radio = num*100 / total;
            seriesList[k].items = radio
          }
          this.option.series[0].data = seriesList;
        });
      },
      _searchParams() {
        var data = this.$serialize('fee-pie');
        return this.$extend(data);
      },
    }
  }
</script>
