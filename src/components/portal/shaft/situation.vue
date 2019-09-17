<template>
  <div class="p-content">
    <h5>{{title[0]}}</h5>
    <div class="chartContent">
      <div class="chartBlock">
        <div id="rectChartOne" ref="rectChartOne"></div>
        <div id="rectChartTwo" ref="rectChartTwo"></div>
      </div>
    </div>
    <h5>{{title[1]}}</h5>
    <div class="chartContent">
      <div class="chartBlock">
        <div id="rectChartThird" ref="rectChartThird"></div>
        <div class="third-legend">
          <div class="legend-line" v-for="item in legend" :key="item.type">
            <div class="color-legend" :style="{background:item.color}"></div>
            <div>{{item.type}}</div>
            <div>{{item.value}}{{title[1] === '异常/故障类别' ? '' : '台'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import G2 from '@antv/g2'

  export default {
    name: "situation",
    props: {
      leftData: {
        type: Object,
        default: () => {
          return {
            data: {}
          }
        }
      },
      rightData: {
        type: Object,
        default: () => {
          return {
            data: {}
          }
        }
      },
      bottomData: {
        type: Array,
        default: () => {
          return {
            data: []
          }
        }
      },
      title: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        chart: null,
        legend: [],
      }
    },
    created() {
      this.legend = this.bottomData
    },
    mounted() {
      this.topLeft()
      this.topRight()
      this.bottomChart()
    },
    methods: {
      topLeft() {
        let obj = {
          id: 'rectChartOne',
          data: [{
            type: '总数',
            value: this.leftData.value
          }],
          option: {
            color: this.leftData.color
          },
          type: 0
        }
        this.initChart(obj)
      },
      topRight() {
        let obj = {
          id: 'rectChartTwo',
          data: this.rightData.data,
          option: {
            color: this.rightData.color,
          },
          type: 1,
          text: this.rightData.text
        }
        this.initChart(obj)
      },
      bottomChart() {
        this.initChartLegend('rectChartThird')
      },
      initChartLegend(id) {
        this.$refs[id].innerHTML = ''
        let h = this.$refs.rectChartOne.offsetHeight
        let data = this.bottomData
        let colorArr = []
        data.forEach(item => {
          colorArr.push(item.color)
        })
        this.chart = new G2.Chart({
          container: id,
          forceFit: true,
          height: h,
          padding: 10
        })
        this.chart.source(data)
        this.chart.tooltip(false)
        this.chart.legend(false)
        this.chart.coord('theta', {
          radius: 1,
          innerRadius: 0.75
        })
        this.chart.intervalStack().position('value').color('type', colorArr).opacity(1)
        this.chart.render()
      },
      initChart({id, data, option, type, text}) {
        this.$refs[id].innerHTML = ''
        let h = this.$refs.rectChartOne.offsetHeight
        let hColor = option.color
        this.chart = new G2.Chart({
          container: id,
          forceFit: true,
          height: h,
          padding: 0
        })
        this.chart.source(data)
        this.chart.legend(false)
        this.chart.facet('rect', {
          fields: ['type'],
          // padding: 20,
          showTitle: false,
          eachView: function eachView(view, facet) {
            let data = facet.data
            let color = hColor
            if (type) {
              data.push({
                type: text,
                value: 100 - data[0].value
              })
            }
            view.source(data)
            view.coord('theta', {
              radius: 1,
              innerRadius: 0.8,
              // startAngle: 90,
              // endAngle: 450
            })
            view.intervalStack().position('value').color('type', [color, '#151a3b']).opacity(1)
            view.guide().html({
              position: ['50%', '50%'],
              html: '<div class="g2-guide-html" style="text-align: center;"><p class="title" style="color: #ffffff;font-weight: 600;font-size: ' + (24 / 1920 * 100) + 'vw">' + (type ? data[0].value + '%' : data[0].value) + '</p><p class="value" style="color: ' + hColor + ';font-size: ' + (14 / 1920 * 100) + 'vw">' + (data[0].type) + '</p></div>'
            })
          }
        })
        this.chart.render()
      }
    },
    watch: {
      leftData() {
        this.topLeft()
      },
      rightData() {
        this.topRight()
      },
      bottomData() {
        this.legend = this.bottomData
        this.bottomChart()
      },
    }
  }
</script>

<style scoped lang="less">
  .p-content {
    width: 100%;
    padding: @precision*10 @precision*20;
    border-radius: @precision*10;
    background-color: #2a2f55;
    margin-bottom: @precision*20;
  }

  h5 {
    height: @precision*22;
    font-size: @precision*18;
    color: #ffffff;
  }

  .chartContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chartBlock {
    padding: @precision*10;
    height: @precision*159;
    display: flex;
    justify-content: space-around;
    flex: 1;
  }

  #rectChartOne, #rectChartTwo, #rectChartThird, .third-legend {
    width: @precision*139;
    height: @precision*139;
  }

  .third-legend {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: scroll;
  }

  .legend-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .legend-line > div {
    font-size: @precision*14;
    color: #ffffff;
    padding: @precision*5;
  }

  .legend-line > div:nth-child(2) {
    width: @precision*90;
  }

  .color-legend {
    width: @precision*20;
    height: @precision*3;
    padding: 0 !important;
  }

</style>
