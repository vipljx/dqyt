<template>
  <div :class="[{'pd': hasPD}, 'p-content',{'h':h}]">
    <div :id="charData[0].id"></div>
  </div>
</template>

<script>
  import Highcharts from 'highcharts'

  export default {
    name: "curve-gradients-legend",
    props: {
      charData: {
        type: Array,
        default: () => {
          return {
            data: []
          }
        }
      },
      hasPD: {
        type: Boolean,
        default: true
      },
      h: {
        type: Boolean,
        default: false
      }
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
        let xArr = []
        obj[0].data.forEach(item => {
          xArr.push(item[0])
        })
        let series = []
        obj.forEach(item => {
          series.push({
            type: 'area',
            name: item.name,
            lineWidth: 3,
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, item.gColor],
                [1, Highcharts.Color('#2d3862').setOpacity(0).get('rgba')]
              ]
            },
            color: item.color,
            data: item.data
          })
        })
        let options = {
          chart: {
            // zoomType: 'x'
            backgroundColor: '#2a2f55',
            margin: [50, 0, 20, 30]
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
            categories: xArr,
            // min: 0,
            // max: 5,
            labels: {
              formatter: function (chart) {
                return chart.value
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
            // ceiling: 100,
            // min: 0,
            // max: 100,
            labels: {
              x: -10
            },
          },
          plotOptions: {
            area: {
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
          legend: {
            align: 'right',
            verticalAlign: 'top',
            // x: 10,
            floating: false,
            itemStyle: {
              color: '#a9c7da'
            },
            itemHoverStyle: {
              color: '#a9c7da'
            }
          },
        }
        options.series = series
        this.$nextTick(() => {
          this.chart = Highcharts.chart(this.charData[0].id, options)
        })
        // this.chart = Highcharts.chart(this.charData[0].id, options)
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
    border-radius: @precision *10;
    background-color: #2a2f55;
  }

  .p-content.h {
    height: @precision*280;
  }

  .pd {
    padding: @precision*10 @precision *20;
  }

  .p-content > div {
    width: 100%;
    height: 100%;
  }
</style>
