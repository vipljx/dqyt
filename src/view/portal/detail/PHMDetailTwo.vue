<template>
  <div class="f">
    <div class="p-left">
      <div class="left-top">
        <h5>{{markerInfo.deviceName}}</h5>
        <img src="../../../assets/images/portal/shaft.png" alt="">
      </div>
      <div class="left-bottom">
        <h5>自诊详情</h5>
        <div class="warning">
          <div>
            <div><img src="../../../assets/images/portal/warning_one.png" alt=""></div>
            <div class="warning-block">
              <div class="warning-title"><span>异常诊断</span></div>
              <div v-for="item in yData[0]" :key="item.exceptionMsg"><span>{{item.exceptionMsg}}</span></div>
            </div>
          </div>
          <div>
            <div><img src="../../../assets/images/portal/warning_two.png" alt=""></div>
            <div class="warning-block">
              <div class="warning-title"><span>故障诊断</span></div>
              <div v-for="item in gData[0]" :key="item.exceptionMsg"><span>{{item.exceptionMsg}}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-right">
      <div class="action-bar">
        <div class="right-top">
          <div class="tab-block">
            设备状态
          </div>
          <div class="date-search">
            <span>时间选择：</span>
            <DatePicker
              type="daterange"
              format="yyyy-MM-dd"
              placeholder="开始时间~结束时间"
              confirm
              :value="dateTime"
              @on-change="dateChange"
              style="width: 400px"></DatePicker>
            <button type="button" class="search" @click="search">查询</button>
          </div>
        </div>
      </div>
      <div class="content">
        <div>
          <div id="c_1"></div>
          <div id="c_2"></div>
        </div>
        <div>
          <curve-gradients-legend-title
            :id="'right_1'"
            :np="true"
            :charData="chartData"></curve-gradients-legend-title>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPHMWarningDetail} from '@/api/portal'
  import Highcharts from 'highcharts'
  import CurveGradientsLegendTitle from '@/components/portal/chart/curve-gradients-legend-title.vue'

  export default {
    name: "PHMDetailTwo",
    data() {
      return {
        chart: null,
        dateTime: [],
        markerInfo: {},
        chartData: [],
        yData: [],
        gData: [],
        colorsOne: ['#7a39fe', '#33ffff', '#ff9c27', '#34abff', '#ff41c3', '#ffd145'],
        colorsTwo: ['#34abff', '#ff41c3', '#ffd145', '#7a39fe', '#33ffff', '#ff9c27']
      }
    },
    components: {
      CurveGradientsLegendTitle
    },
    created() {
      this.markerInfo = JSON.parse(localStorage.getItem('shaftInfo'))
      this.initDate()
      this.loadInfo()
    },
    mounted() {
    },
    methods: {
      loadInfo() {
        getPHMWarningDetail(this.markerInfo.wellheadId, this.dateTime[0], this.dateTime[1]).then(res => {
          console.log(res)
          this.yData = [res.data.ycPipeList, res.data.ycCharList]
          this.gData = [res.data.gzPipeList, res.data.gzCharList]
          let arr_1 = []
          let arr_2 = []
          this.yData[0].forEach((item, index) => {
            arr_1.push({
              name: item.exceptionMsg,
              y: item.value,
              color: this.colorsOne[index % 6]
            })
          })
          this.gData[0].forEach((item, index) => {
            arr_2.push({
              name: item.exceptionMsg,
              y: item.value,
              color: this.colorsTwo[index % 6]
            })
          })
          console.log(arr_1)
          console.log(arr_2)
          this.chartData = [this.arrToObj(this.arrToArr(this.yData[1]), '#0190e3', '#0190e3', '异常总数', '近1个月设备告警数量', '#0d0354'),
            this.arrToObj(this.arrToArr(this.gData[1]), '#d20c2c', '#d20c2c', '故障总数', '近1个月设备告警数量')]
          this.drawChart('c_1', {title: '异常诊断', data: arr_1})
          this.drawChart('c_2', {title: '故障诊断', data: arr_2})
        })
      },
      arrToArr(arr) {
        let a = []
        arr.forEach((item, index) => {
          a.push([item.key.split(' ')[0].split('-')[1] + '-' + item.key.split(' ')[0].split('-')[2], item.value])
          // a.push([index, item.value])
        })
        return a
      },
      arrToObj(arr, c, gc, n, t, bg) {
        return {
          data: arr,
          color: c,
          gColor: gc,
          name: n,
          title: t,
          bg: bg
        }
      },
      //初始化时间
      initDate(day) {
        let nowTime = new Date()//当前时间
        let starTime = new Date(nowTime.getTime() - (1000 * 3600 * 24 * (day ? day : 30)))//开始小时时间（30天前）
        let endDate = nowTime.getFullYear() + '-' + ((nowTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (nowTime.getMonth() + 1) + '-' + nowTime.getDate()//结束时间
        let starDate = starTime.getFullYear() + '-' + ((starTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (starTime.getMonth() + 1) + '-' + starTime.getDate()//开始时间
        this.dateTime = [starDate, endDate]
      },
      //时间选择
      dateChange(val) {
        this.dateTime = val
      },
      //搜索
      search() {
        this.loadInfo()
      },
      //绘图
      drawChart(id, data) {
        this.chart = Highcharts.chart(id, {
          chart: {
            backgroundColor: '#0d0354',
            colors: ['#7a39fe', '#33ffff', '#ff9c27', '#34abff', '#ff41c3', '#ffd145'],
          },
          title: {
            text: data.title,
            // floating: true,
            align: 'left',
            style: {
              "color": "#ffffff",
              "fontSize": "0.833vw"
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
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                style: {
                  "textOutline": "0px 0px contrast"
                },
                formatter: function () {
                  return '<span style="color:' + this.point.color + ';font-size: 1.04vw">' + this.point.name + '</span>'
                }
              }
            }
          },
          series: [{
            type: 'pie',
            innerSize: '50%',
            colorByPoint: true,
            borderWidth: 0,
            // colors: ['#7a39fe', '#33ffff', '#ff9c27', '#34abff', '#ff41c3', '#ffd145'],
            data: data.data

            // data: [{
            //   name: 'Chrome',
            //   y: 61.41,
            //   sliced: true,
            //   selected: true,
            //   color: '#7a39fe'
            // }, {
            //   name: 'Internet Explorer',
            //   y: 11.84
            // }, {
            //   name: 'Firefox',
            //   y: 10.85
            // }, {
            //   name: 'Edge',
            //   y: 4.67
            // }, {
            //   name: 'Safari',
            //   y: 4.18
            // }, {
            //   name: 'Sogou Explorer',
            //   y: 1.64
            // }, {
            //   name: 'Opera',
            //   y: 1.6
            // }, {
            //   name: 'QQ',
            //   y: 1.2
            // }, {
            //   name: 'Other',
            //   y: 2.61
            // }]
          }]
        })
      }
    },
  }
</script>

<style scoped lang="less">
  .f {
    height: 100%;
    transform: translate(0, 0);
    overflow-y: scroll;
  }

  .content {
    height: 95%;
    /*overflow-y: scroll;*/
    margin-top: @precision*20;
  }

  .p-right-content {
    margin-top: @precision*20;
  }


  .p-left {
    width: 21%;
  }

  .p-left-w {
    width: 100%;
  }

  .p-right {
    width: 77%;
    /*padding-left: 2%;*/
    position: fixed;
    top: 0;
    right: 0;
  }

  .p-left, .p-right {
    height: 100%;
    display: inline-block;
  }

  .right-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tab-block {
    display: flex;
    align-items: center;
    padding: @precision*10 0;
    font-size: @precision*22;
    color: #ffffff;
  }

  .tab-active {
    background-color: #0589f8;
  }

  .date-search {
    display: flex;
    align-items: center;
  }

  .date-search span {
    font-size: @precision*18;
    color: #ffffff;
  }

  .date-search button {
    padding: @precision*10 @precision*15;
    font-size: @precision*20;
    color: #ffffff;
    background-color: #0d529a;
    border: none;
    border-radius: @precision*10;
    margin-left: @precision*10;
  }

  .date-search button.search {
    width: @precision*90;
    background-color: #0589f8;
    margin-left: @precision*20;
  }

  .left-top, .content, .left-bottom {
    background-color: #2a2f55;
    border-radius: @precision*10;
    padding: @precision*20;
  }

  .left-top {
    height: @precision*382;
    margin-bottom: @precision*20;
  }

  .left-top h5, .left-bottom h5 {
    font-size: @precision*22;
    color: #ffffff;
    height: @precision*50;
    line-height: @precision*50;
  }

  .left-top img {
    width: 100%;
    height: @precision*292;
  }

  .left-bottom {
    height: @precision*442;
  }

  .left-bottom .warning > div {
    height: @precision*176;
    display: flex;
    align-items: flex-start;
  }

  .left-bottom .warning img {
    width: @precision*30;
    height: @precision*30;
  }

  .warning-block {
    height: @precision*146;
    font-size: @precision*16;
    color: #ffffff;
    flex: 1;
    overflow-y: scroll;
  }

  .warning-block > div {
    text-align: center;
    height: @precision*30;
    line-height: @precision*30;
    display: flex;
    justify-content: center;
  }

  .warning-block > div span {
    display: inline-block;
    width: @precision*190;
    text-align: left;
  }

  .warning-block .warning-title {
    height: @precision*30;
    line-height: @precision*30;
    font-size: @precision*16;
    color: #a5a8bb;
  }

  .content {
    height: @precision*774;
    overflow-y: scroll;
  }

  .content > div {
    height: @precision*357;
    margin-bottom: @precision*20;
    display: flex;
    justify-content: space-between;
  }

  .content > div:last-child {
    margin-bottom: 0;
    background-color: #0d0354;
  }

  .content > div:first-child div {
    width: 49.5%;
    background-color: #0d0354;
  }
</style>
