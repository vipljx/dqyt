<template>
  <div class="p-content">
    <div id="container"></div>
  </div>
</template>

<script>
  // import G2 from '@antv/g2'
  import Highcharts from 'highcharts'

  export default {
    name: "curve-gradients",
    props: {
      charData: {
        type: Array,
        default: () => {
          return {
            data: []
          }
        }
      },
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.drawChart()
    },
    methods: {
      drawChart() {
        let obj = this.charData
        console.log(obj)
        let cArr = []
        obj.forEach(item => {
          cArr.push(item[0])
        })
        this.chart = Highcharts.chart('container', {
          chart: {
            // zoomType: 'x'
            backgroundColor: '#2a2f55',
            margin: [10, 0, 20, 30]
          },
          title: false,
          // 版权信息
          credits: {
            enabled: false
          },
          // 菜单
          exporting: {
            enabled: false
          },
          xAxis: {
            lineColor: '#647592',
            // gridLineWidth: 1,
            tickWidth: 0,
            categories: cArr,
            min: 0,
            max: 5,
            labels: {
              formatter: function (chart) {
                return typeof chart.value === "string" ? chart.value.split('年')[1] : ''
              },
              y: 15
            },
            // tickAmount: 6,
          },
          yAxis: {
            lineWidth: 1,
            lineColor: '#647592',
            // gridLineWidth: 1,
            gridLineColor: '#495c83',
            gridLineDashStyle: 'Dash',
            // tickAmount: 6,
            title: false,
            ceiling: 100,
            min: 0,
            // max: 100,
            labels: {
              x: -10
            },
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            area: {
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                },
                stops: [
                  [0, '#0084ff'],
                  [1, Highcharts.Color('#2d3862').setOpacity(0).get('rgba')]
                ]
              },
              marker: {
                radius: 2
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            }
          },
          series: [{
            type: 'area',
            name: '良好设备率',
            data: obj
          }]
        })
      }
    },
    watch: {
      charData() {
        this.drawChart()
      }
    }
  }
</script>

<style scoped lang="less">
  .p-content {
    width: 100%;
    height: @precision*342;
    padding: @precision*10 @precision *20;
    border-radius: @precision *10;
    background-color: #2a2f55;
  }

  #container {
    width: 100%;
    height: 100%;
  }
</style>
