<template>
  <div class="f">
    <div :class="[{'p-left-w' : selected === 2},'p-left']">
      <div class="action-bar">
        <div class="left-top">
          <div class="action-bar-left">
            <button :class="{'p-active' : index === selected}" v-for="(item,index) in leftBar" :key="item"
                    @click="changeBar(index)">
              {{item}}
            </button>
          </div>
          <div class="p-search" v-if="selected !== 2">
            <input type="text" placeholder="请输入井口编号" v-model="searchText">
            <div class="search-img">
              <img src="../../../assets/images/portal/search.png" alt="搜索" @click="PHMSearch">
            </div>
          </div>
          <div class="date-search" v-else>
            <span>时间选择：</span>
            <DatePicker
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              placeholder="开始时间~结束时间"
              confirm
              :value="dateTime"
              @on-change="dateChange"
              style="width: 300px"></DatePicker>
            <button type="button" @click="nearTime(24)">近24小时</button>
            <button type="button" @click="nearTime(48)">近48小时</button>
            <button type="button" class="search" @click="search">查询</button>
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="selected !== 2">
          <shaft-card
            v-for="(item,index) in cardData"
            :key="item.deviceName"
            :cardData="item"
            @toDetail="toDetail"
            :cardType="selected"
            :hasMR="((index + 1) % 3) !== 0"></shaft-card>
        </div>
        <div
          v-else
          class="risk"
          v-for="(item,index) in riskData"
          :key="item.name">
          <div class="risk-left">
            <h5>{{item.name}}</h5>
            <img src="../../../assets/images/portal/shaft.png"/>
          </div>
          <div class="risk-chart">
            <curve-gradients-legend-title :id="'middle_' + index"
                                          :charData="item.data[0]"></curve-gradients-legend-title>
          </div>
          <div class="risk-chart">
            <curve-gradients-legend-title :id="'right_' + index"
                                          :charData="item.data[1]"></curve-gradients-legend-title>
          </div>
        </div>
      </div>
    </div>
    <div class="p-right" v-show="selected !== 2">
      <h5>运行概况</h5>
      <div class="p-right-content">
        <situation :leftData="leftDate" :rightData="rightData" :bottomData="bottomData"
                   :title="situationTitle"></situation>
      </div>
      <h5 class="h-t">{{selected ? '最近半年告警处理率' : '最近半年良好设备率'}} </h5>
      <div class="">
        <curve-gradients :charData="bottomRightData" v-if="selected === 0"></curve-gradients>
        <curve-gradients-legend :charData="bottomRightData" v-if="selected === 1"></curve-gradients-legend>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPHMInfo, getPHMShaftCard, getPHMZZShaftCard, getPHMZZInfo, getPHMDetail} from '@/api/portal'
  import ShaftCard from '@/components/portal/shaft/shaft-card.vue'
  import Situation from '@/components/portal/shaft/situation.vue'
  import CurveGradients from '@/components/portal/chart/curve-gradients.vue'
  import CurveGradientsLegend from '@/components/portal/chart/curve-gradients-legend.vue'
  import CurveGradientsLegendTitle from '@/components/portal/chart/curve-gradients-legend-title.vue'

  export default {
    name: "PHM",
    data() {
      return {
        colorArr: ['#f39800', '#902dff', '#00b7ee', '#e5004f'],
        selected: 0,
        leftBar: ['设备概览', '设备自诊', '风险预测'],
        cardData: [],
        leftDate: {
          color: '#0077ff',
          value: 0
        },//右上 左图
        rightData: {
          data: [
            {
              type: '运行率',
              value: 0
            }],
          color: '#b53cfe',
          text: '未运行率'
        },//右上 右图
        bottomData: [],//右上 下图
        bottomRightData: [],//右下数据
        bottomRightOption: [],//右下配置
        situationTitle: ['运行总数', '工作状态'],
        dateTime: [],
        riskData: [],
        searchText: ''
      }
    },
    components: {
      ShaftCard,
      Situation,
      CurveGradients,
      CurveGradientsLegend,
      CurveGradientsLegendTitle
    },
    created() {
      this.initDate()
      this.loadPHMInfoOne()
      this.loadPHMShaftCard()
    },
    methods: {
      //设备概览概况信息
      loadPHMInfoOne() {
        getPHMInfo().then(res => {
          this.initRightInfo(res.data.runCount, res.data.runRate * 100, res.data.runWorkState, res.data.equipmentHealthyRate, 1)
        })
      },
      //设备自诊概况信息
      loadPHMInfoTwo() {
        getPHMZZInfo().then(res => {
          this.initRightInfo(res.data.errorCount, res.data.clRate * 100, res.data.ycTypeList, [res.data.sumExceptionChart, res.data.yclExceptionChart], 0)
        })
      },
      //风险预测信息
      loadPHMInfoThree() {
        let promiseArr = []
        this.cardData.forEach(item => {
          promiseArr.push(getPHMDetail(item.deviceName, this.dateTime[0], this.dateTime[1], 0))
        })
        Promise.all(promiseArr).then(values => {
          let arr = []
          values.forEach((item, index) => {
            let obj = {
              name: this.cardData[index].deviceName,
              data: [
                [
                  {
                    data: this.resetArr(item.data.temperatureList[1]),
                    color: '#ebc443',
                    gColor: '#ebc443',
                    name: '罐体温度',
                    title: '温度'
                  }, {
                  data: this.resetArr(item.data.temperatureList[0]),
                  color: '#00ffd5',
                  gColor: '#00ffd5',
                  name: '设备温度',
                  title: '温度'
                }
                ], [
                  {
                    data: this.resetArr(item.data.pressureList[0]),
                    color: '#a200ff',
                    gColor: '#a200ff',
                    name: '管线压力',
                    title: '压力'
                  }, {
                    data: this.resetArr(item.data.pressureList[1]),
                    color: '#ea4b59',
                    gColor: '#ea4b59',
                    name: '罐体压力',
                    title: '压力'
                  }
                ]
              ]
            }
            arr.push(obj)
          })
          this.riskData = arr
        })
      },
      resetArr(arr) {
        let a = []
        arr.forEach((item, index) => {
          a.push([new Date(item.key).getTime(), item.value])
          // a.push([index, item.value])
        })
        return a
      },
      //右侧数据
      initRightInfo(l, r, b, c, t) {
        //左饼
        this.leftDate = {
          color: t ? '#0077ff' : '#f39800',
          value: l
        }
        //右饼
        this.rightData = {
          data: [
            {
              type: t ? '运行率' : '已处理',
              value: r
            }
          ],
          color: t ? '#b53cfe' : '#77ffa7',
          text: t ? '未运行率' : '未处理'
        }
        //下饼
        this.bottomData = this.initBottomData(b)
        //右下图表
        this.bottomRightDataInit(c, t)
      },
      bottomRightDataInit(data, t) {
        let arr = []
        if (t) {
          data.forEach(item => {
            let ym = item.key.split(' ')[0].split('-')
            arr.push([ym[0] + '年' + ym[1] + '月', parseFloat((item.value * 100).toFixed(2))])
          })
        } else {
          let data_1 = []
          let data_2 = []
          data[0].forEach(item => {
            data_1.push([item.key.split(' ')[0].split('-')[1] + '月', item.value])
          })
          data[1].forEach(item => {
            data_2.push([item.key.split(' ')[0].split('-')[1] + '月', item.value])
          })
          arr.push({
            data: data_1,
            color: '#ff9745',
            gColor: '#ff9745',
            name: '告警总数',
            id: 'cll_1'
          }, {
            data: data_2,
            color: '#72bcfe',
            gColor: '#72bcfe',
            name: '已处理数量',
            id: 'cll_1'
          })
        }
        this.bottomRightData = arr
      },
      initBottomData(data) {
        let c = this.colorArr
        let arr = []
        data.forEach((item, index) => {
          arr.push({
            type: item.key,
            value: item.value,
            color: c[index % 4]
          })
        })
        return arr
      },
      //设备井口卡片信息
      loadPHMShaftCard() {
        getPHMShaftCard(this.searchText).then(res => {
          this.cardData = res.data
        })
      },
      //设备自诊井口卡片信息
      loadPHMZZShaftCard() {
        getPHMZZShaftCard(this.searchText).then(res => {
          this.cardData = res.data
        })
      },
      //初始化时间
      initDate(day) {
        let nowTime = new Date()//当前时间
        let starTime = new Date(nowTime.getTime() - (1000 * 3600 * (day ? day : 12)))//开始小时时间（12小时前）
        let endDate = nowTime.getFullYear() + '-' + ((nowTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (nowTime.getMonth() + 1) + '-' + nowTime.getDate() + ' ' + nowTime.getHours() + ':00'//结束时间
        let starDate = starTime.getFullYear() + '-' + ((starTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (starTime.getMonth() + 1) + '-' + starTime.getDate() + ' ' + starTime.getHours() + ':00'//开始时间
        this.dateTime = [starDate, endDate]
      },
      //左上tab
      changeBar(i) {
        this.selected = i
        this.situationTitle = this.selected ? ['异常/故障总数', '异常/故障类别'] : ['运行总数', '工作状态']
        switch (i) {
          case 0:
            this.loadPHMInfoOne()
            this.loadPHMShaftCard()
            break
          case 1:
            this.loadPHMInfoTwo()
            this.loadPHMZZShaftCard()
            break
          case 2:
            this.loadPHMInfoThree()
            break
        }
      },
      //时间选择
      dateChange(val) {
        this.dateTime = val
      },
      //详情
      toDetail(obj) {
        console.log(obj)
        localStorage.setItem('shaftInfo', JSON.stringify(obj))
        let rName = this.selected ? 'PHMDetailTwo' : 'PHMDetailOne'
        this.$router.push({
          name: rName
        })
      },
      //搜索
      search() {
        this.loadPHMInfoThree()
      },
      //PHM搜索
      PHMSearch() {
        this.selected ? this.loadPHMZZShaftCard() : this.loadPHMShaftCard()
      },
      //近 24 48
      nearTime(type) {
        this.initDate(type)
        this.loadPHMInfoThree()
      }
    }
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
    width: 74.5%;
  }

  .p-left-w {
    width: 100%;
  }

  .p-right {
    width: 25.5%;
    padding-left: 2%;
    position: fixed;
    top: 0;
    right: 0;
  }

  .p-left, .p-right {
    height: 100%;
    display: inline-block;
  }

  .left-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .p-search {
    display: flex;
    /*align-items: center;*/
    width: @precision*600;
  }

  .p-search input {
    flex: 1;
    padding: @precision*10 @precision*15;
    font-size: @precision*18;
    color: #a5a8bb;
    background-color: #2a2f55;
    border: none;
    outline: none;
    border-top-left-radius: @precision*10;
    border-bottom-left-radius: @precision*10;
  }

  .p-search .search-img {
    flex: 0.2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0589f8;
    border-top-right-radius: @precision*10;
    border-bottom-right-radius: @precision*10;
  }

  .p-right h5 {
    padding: @precision*10 0;
    font-size: @precision*22;
    color: #ffffff;
  }

  .h-t {
    height: @precision*40;
    line-height: @precision*40;
    padding: 0 !important;
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

  .risk {
    height: @precision*382;
    display: flex;
    margin-bottom: @precision*20;
  }

  .risk-left {
    width: 19.6%;
    padding: @precision*10 @precision *20;
    border-radius: @precision*10;
    background-color: #2a2f55;
  }

  .risk-left h5 {
    height: @precision*70;
    line-height: @precision*70;
    font-size: @precision*22;
    color: #ffffff;
  }

  .risk-left img {
    width: 100%;
    height: @precision*280;
  }

  .risk-chart {
    width: 39%;
    margin-left: 0.7%;
  }
</style>
