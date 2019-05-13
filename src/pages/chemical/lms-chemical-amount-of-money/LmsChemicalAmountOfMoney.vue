<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <Card style="width:100%;">
      <div class="config_meta">
        <p class="fl">耗材采购金额统计</p>
        <div class="clear"></div>
      </div>
      <Row>
        <Col span="24">
        <div style="width:50%">
          <!--柱状图-->
          <IEcharts :option="option"  @ready="_onReady" style="height: 460px" :style="{width}"></IEcharts>
        </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
  import IEcharts from 'vue-echarts-v3/src/full.js';
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  const month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  export default {
    components: {
      IEcharts,BreadCrumbs
    },
    data() {
      return {
        queryType: 'year',
        width: '',
        /**/
        option: {
          color: this.$echartColor,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data: ['金额（元）', '订单数（份）'],
            x: 'center',
          },
          xAxis: [
            {
              type: 'category',
              data: month,
              axisPointer: {
                type: 'shadow'
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额（元）',
              min: 0,
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '订单数（份）',
              min: 0,
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '金额（元）',
              type: 'bar',
              data: []
            },
            {
              name: '订单数（份）',
              type: 'line',
              yAxisIndex: 1,
              data: []
            }
          ]
        },

      }
    },
    methods: {
      //金额与订单数量
      _getAmountMonth() {
        this.option.series[0].data = [];
        this.$store.dispatch('LmsChemicalPurchaseOrder/chemicalStatistic').then(() => {
          let result = this.$store.state.LmsChemicalPurchaseOrder.list;
          let xaxis = this.option.xAxis[0].data;
          for (let i = 0; i < xaxis.length; i++) {
            let item = result.find(item => item.month + '月' === xaxis[i]);
            if (item) {
              this.option.series[0].data.push(item.tprice);
              this.option.series[1].data.push(item.orderCount);
            } else {
              this.option.series[0].data.push(0);
              this.option.series[1].data.push(0);
            }
          }
        });
      },
      _onReady() {
      },
    },
    mounted() {
      this.width = (document.documentElement.clientWidth -300) + 'px';
      this._getAmountMonth();
    },
  }
</script>
