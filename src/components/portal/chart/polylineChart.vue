<template>
  <div class="p-content">
    <div :id="id" ref="rectChart"></div>
  </div>
</template>

<script>
  import Highcharts from 'highcharts'
  import G2 from '@antv/g2'

  export default {
    name: "polylineChart",
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
      isWater: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        chart: null,
        colors: ['#1d77d5', '#a200ff', '#e3001d', '#fad041', '#02f1ce']
      }
    },
    mounted() {
      this.initChart()
    },
    methods: {
      // initChart() {
      //   let that = this
      //   let data = this.charData
      //   let h = this.$refs.rectChart.offsetHeight
      //   this.$refs.rectChart.innerHTML = ""
      //   this.chart = new G2.Chart({
      //     container: this.id,
      //     forceFit: true,
      //     height: h,
      //     padding: [20, 20, 30, 50]
      //   })
      //   // this.chart.source(data, {
      //   //   value: {
      //   //     range: [0.6, 1]
      //   //   }
      //   // })
      //   this.chart.source(data)
      //   // this.chart.scale({
      //   //   value: {
      //   //     // range: [0.6, 1],
      //   //     tickCount: 5
      //   //   }
      //   // })
      //   this.chart.axis('year', {
      //     line: {
      //       stroke: '#2c73c0', // 坐标轴线的颜色
      //       // strokeOpacity: {number},
      //       lineWidth: 2
      //     },
      //     label: {
      //       textStyle: {
      //         fill: '#aaaaaa'
      //       }
      //     }
      //   })
      //   this.chart.axis('value', {
      //     line: {
      //       stroke: '#244f8d', // 坐标轴线的颜色
      //       strokeOpacity: 0.8,
      //       lineWidth: 1
      //     },
      //     // subTickCount: 5,
      //     label: {
      //       textStyle: {
      //         fill: '#aaaaaa'
      //       },
      //       formatter: function formatter(val) {
      //         // return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      //         return that.isWater ? (parseFloat(val).toFixed(2) * 100 + '%') : val
      //       }
      //     }
      //   })
      //   this.chart.legend({
      //     useHtml: true,
      //     position: 'top-right',
      //     offsetY: -5,
      //     // reactive: true,
      //     legendStyle: {
      //       MARKER_CLASS: {
      //         width: '9px',
      //         height: '9px',
      //         lineHeight: '9px',
      //         borderRadius: '50%',
      //         marginRight: '4px',
      //         textAlign: 'center',
      //         marginTop: '3px'
      //       }
      //     },
      //     containerTpl: '<div class="g2-legend"><div class="g2-legend-list"></div></div>',
      //     itemTpl: function itemTpl(value, color, checked, index) {
      //       let markerDom = '<div class="g2-legend-marker" style="background-color:' + color + '"></div>'
      //       let nameDom = '<div class="legend-item-name">' + value + '</div>'
      //       return '<div class="g2-legend-list-item" style="display: inline-flex !important;align-items: center" data-value="' + value + '">' + markerDom + nameDom + '</div>'
      //     }
      //   })
      //   this.chart.line().position('year*value').color('type', ['#1d77d5', '#a200ff', '#e3001d', '#fad041', '#02f1ce'])
      //   this.chart.render()
      // }
      initChart() {
        let h = this.$refs.rectChart.offsetHeight
        this.$refs.rectChart.innerHTML = ""
        let obj = this.charData
        let that = this
        let xArr = []
        let series = []
        obj.forEach((item, index) => {
          let d = []
          let name = ''
          item.forEach(list => {
            xArr.push(list.year)
            d.push(list.value)
            name = list.type
          })
          series.push({
            name: name,
            data: d,
            color: this.colors[index % 5]
          })
        })
        let option = {
          chart: {
            type: 'line',
            backgroundColor: '#2a2f55',
            height: h,
            margin: [30, 10, 50, 40]
          },
          loading: {
            hideDuration: 100,
            showDuration: 100,
          },
          title: {
            enabled: false
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
          // legend: false,
          legend: {
            align: 'right',
            verticalAlign: 'top',
            y: -50,
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
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                  hover: {
                    enabled: true
                  }
                }
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
          series: series
        }
        if (this.isWater) {
          option.yAxis.min = 0.6
          option.yAxis.max = 1
        }
        this.chart = Highcharts.chart(this.id, option, (chart) => {
          chart.hideLoading()
        })
      }
    },
    watch: {
      charData() {
        this.initChart()
      }
    }
  }
</script>

<style scoped lang="less">
  .p-content {
    width: 100%;
    height: 100%;
    padding: @precision *30;
    border-radius: @precision*10;
    background-color: #2a2f55;
  }

  .p-content > div {
    width: 100%;
    height: 100%;
  }
</style>
