<template>
  <div :class="['p-content',{'noP' :np}]">
    <div :id="id" :ref="id"></div>
  </div>
</template>

<script>
  import Highcharts from 'highcharts'

  export default {
    name: "curve-gradients-legend-title",
    props: {
      charData: {
        type: Array,
        default: () => {
          return {
            data: []
          }
        }
      },
      id: {
        type: String
      },
      np: {
        type: Boolean,
        default: false
      },
      isWater: {
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
        let that = this
        let xArr = []
        let series = []
        obj[0].data.forEach(item => {
          xArr.push(item[0])
        })
        obj.forEach(item => {
          series.push({
            type: 'area',
            name: item.name,
            lineWidth: 1,
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
        let option = {
          chart: {
            // zoomType: 'x'
            backgroundColor: obj[0].bg || '#2a2f55',
            margin: [50, 10, 50, 50]
          },
          loading: {
            hideDuration: 100,
            showDuration: 100,
          },
          boost: {
            // useGPUTranslations: true
            enabled: false
          },
          title: {
            text: obj[0].title,
            floating: true,
            align: 'left',
            style: {
              "color": "#ffffff",
              "fontSize": "18px"
            }
          },
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
              // step: 1,
              formatter: function (chart) {
                if (typeof chart.value === 'number') {
                  let time = new Date(chart.value)
                  return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
                } else {
                  return chart.value
                }
              },
              y: 15
            },
            // tickAmount: xArr.length,
          },
          yAxis: {
            lineWidth: 1,
            lineColor: '#647592',
            // gridLineWidth: 1,
            gridLineColor: '#495c83',
            gridLineDashStyle: 'Dash',
            // tickAmount: 3,
            title: false,
            // floor: 0.6,
            // min: 0.6,
            // max: 1,
            labels: {
              x: -10,
              formatter: function (chart) {
                return that.isWater ? (chart.value * 100) + '%' : chart.value
              }
            },
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
          tooltip: {
            formatter: function () {
              let s = ''
              if (typeof this.x === 'number') {
                s = '<b>' + new Date(this.x).getHours() + ':' + new Date(this.x).getMinutes() + ':' + new Date(this.x).getSeconds() + '</b>'
                s += '<br/>' + this.series.name + ': ' + this.y
                return s
              } else {
                s = '<b>' + this.x + '</b>'
                s += '<br/>' + this.series.name + ': ' + this.y
                return s
              }

            },
            // headerFormat: '<span style="font-size: 10px">{' + new Date(point.key) + '}</span><br/>'
          },
          series: series
        }
        if (this.isWater) {
          option.yAxis.min = 0.6
          option.yAxis.max = 1
          // option.yAxis.tickAmount = 2
        }
        // min: 0,
        // max: 100,
        // }
        this.chart = Highcharts.chart(this.id, option, (chart) => {
          chart.hideLoading()
        })
        // .showLoading()
        // this.chart.showLoading()
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
    /*<!--height: @precision*382;-->*/
    height: 100%;
    padding: @precision*10 @precision *20;
    border-radius: @precision*10;
    background-color: #2a2f55;
  }

  .p-content.noP {
    padding: 0;
  }

  .p-content > div {
    width: 100%;
    height: 100%;
  }
</style>
