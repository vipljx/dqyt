<template>
  <div :class="[{'no-mr': !hasMR}, 'p-col']">
    <div class="p-block">
      <p :class="{'nop' : type !== '含水率' }">{{title}}</p>
      <div :id="id" ref="chartEle" v-if="type === '含水率'"></div>
      <curve-gradients-legend
        v-else
        :hasPD="false"
        :h="true"
        :charData="charData"></curve-gradients-legend>
      <div class="p-bottom">
        <span>最大值：{{max}}</span>
        <span>最小值：{{min}}</span>
        <span>平均值：{{avg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import G2 from '@antv/g2'
  import {View} from '@antv/data-set'
  import Highcharts from 'highcharts'
  import CurveGradientsLegend from '@/components/portal/chart/curve-gradients-legend.vue'

  export default {
    name: "polyline-color",
    data() {
      return {
        chart: null,
        max: 0,
        min: 0,
        avg: 0
      }
    },
    components: {
      CurveGradientsLegend
    },
    props: {
      charData: {
        type: Array,
        default: () => {
          return {
            data: []
          }
        }
      },
      id: String,
      title: String,
      type: String,
      hasMR: {
        type: Boolean,
        default: true
      },
      isWater: {
        type: Boolean,
        default: false
      }
    },
    created() {
    },
    mounted() {
      if (this.type === '含水率') {
        this.drawChart()
        this.countNum()
      }
    },
    methods: {
      //求值
      countNum() {
        if (this.type === '含水率') {
          let arr = []
          let count = 0
          this.charData.forEach(item => {
            arr.push(item.value)
            count += item.value
          })
          arr.sort(function (a, b) {
            return a - b
          })
          this.min = arr[0]
          this.max = arr[arr.length - 1]
          this.avg = parseFloat(count / arr.length).toFixed(2)
        }
      },
      //实例化图
      // drawChart(str) {
      //   let that = this
      //   // let w = document.body.offsetWidth
      //   let w = window.innerWidth
      //   // this.$refs.chartEle.innerHTML = ""
      //   let type = this.type
      //   this.chart = new G2.Chart({
      //     container: this.id,
      //     forceFit: true,
      //     padding: 'auto',
      //     height: 250 / 1920 * w
      //     // height: window.innerHeight
      //   })
      //   this.chart.source(this.charData)
      //   this.chart.scale({
      //     value: {
      //       // range: [0.6, 1],
      //       // tickCount: 5
      //     },
      //     // year: {
      //     //   range: [0, 1]
      //     // }
      //   })
      //   this.chart.axis('value', {
      //     label: {
      //       formatter: function formatter(val) {
      //         return that.isWater ? (parseFloat(val).toFixed(2) * 100 + '%') : val
      //       },
      //       textStyle: {
      //         fill: '#a5a8bb', // 文本的颜色
      //         fontSize: '12', // 文本大小
      //       }
      //     }
      //   })
      //   this.chart.axis('key', {
      //     label: {
      //       textStyle: {
      //         fill: '#a5a8bb', // 文本的颜色
      //         fontSize: '12', // 文本大小
      //       }
      //     }
      //   })
      //   this.chart.tooltip({
      //     crosshairs: {
      //       type: 'line'
      //     },
      //     itemTpl: '<li data-index={index}>'
      //       + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>'
      //       + '<span style="margin-right:20px;">' + (str || type) + '</span> {value}'
      //       + '</li>'
      //   })
      //   this.chart.area().position('key*value')
      //   this.chart.line().position('key*value').size(2)
      //   this.chart.render()
      // }
      drawChart(str) {
        let w = document.body.offsetWidth
        let obj = this.charData
        let that = this
        let xArr = []
        let d = []
        obj.forEach(item => {
          xArr.push(item.key)
          d.push(item.value)
        })
        let option = {
          chart: {
            type: 'area',
            backgroundColor: '#2a2f55',
            height: 250 / 1920 * w,
            margin: [10, 10, 50, 40]
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
              // // step: 1,
              // formatter: function (chart) {
              //   if (typeof chart.value === 'number') {
              //     let time = new Date(chart.value)
              //     return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
              //   } else {
              //     return chart.value
              //   }
              // },
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
          legend: false,
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
          // tooltip: {
          //   formatter: function () {
          //     let s = ''
          //     if (typeof this.x === 'number') {
          //       s = '<b>' + new Date(this.x).getHours() + ':' + new Date(this.x).getMinutes() + ':' + new Date(this.x).getSeconds() + '</b>'
          //       s += '<br/>' + this.series.name + ': ' + this.y
          //       return s
          //     } else {
          //       s = '<b>' + this.x + '</b>'
          //       s += '<br/>' + this.series.name + ': ' + this.y
          //       return s
          //     }
          //
          //   },
          // },
          series: [{
            name: that.type,
            data: d,
            color: '#1F69BB'
          }]
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
      type(newValue) {
        if (newValue === '含水率') {
          this.$nextTick(() => {
            this.drawChart(newValue)
            this.countNum()
          })
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">


  .p-col {
    display: inline-block;
    width: 32.5%;
    margin: 0 1.25% @precision*20 0;
  }

  .p-col.no-mr {
    margin-right: 0;
  }

  .p-block {
    background-color: #2a2f55;
    /*padding: 15px;*/
    padding: @precision*30;
    border-radius: @precision*10;
  }

  .p-block p {
    font-size: @precision*18;
    color: #ffffff;
    padding: @precision*10 0;
  }

  .p-block p.nop {
    padding: 0;
  }

  .p-block .p-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    font-size: @precision*14;
  }
</style>
