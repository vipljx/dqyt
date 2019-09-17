<template>
  <div class="f">
    <div class="p-left">
      <div class="left-top">
        <h5>{{markerInfo.deviceName}}</h5>
        <img src="../../../assets/images/portal/shaft.png" alt="">
      </div>
      <div class="left-bottom">
        <h5>实时状态</h5>
        <div class="markerInfo-block">
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_3.png" alt="">
            <div>采集时间</div>
            <div>{{markerInfo.acquisitionTime}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_1.png" alt="">
            <div>含水率</div>
            <div>{{markerInfo.waterRate}}%</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_4.png" alt="">
            <div>温度(探头)</div>
            <div>{{markerInfo.probeTemperature}}</div>
          </div>
          <div>
            <img src="" alt="">
            <div>温度(罐体)</div>
            <div>{{markerInfo.tankTemperature}}℃</div>
          </div>
          <div>
            <img src="" alt="">
            <div>温度(设备)</div>
            <div>{{markerInfo.equipmentTemperature}}℃</div>
          </div>
          <div>
            <img src="" alt="">
            <div>温度(环境)</div>
            <div>{{markerInfo.ambientTemperature}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_5.png" alt="">
            <div>压力(管线)</div>
            <div>{{markerInfo.pipelinePressure}}MPa</div>
          </div>
          <div>
            <img src="" alt="">
            <div>压力(设备)</div>
            <div>{{markerInfo.equipmentPressure}}MPa</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_0.png" alt="">
            <div>工作模式</div>
            <div>{{markerInfo.workType}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_2.png" alt="">
            <div>状态</div>
            <div>{{(markerInfo.workState === '异常' || markerInfo.workState === '故障') ? '预警' : markerInfo.workState === ''
              ? '离线' : markerInfo.workState}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-right">
      <div class="action-bar">
        <div class="right-top">
          <div class="tab-block">
            <button type="button" :class="[{'tab-active' : tabActive},'tab']" @click="tabChange(true)">实时数据</button>
            <button type="button" :class="[{'tab-active' : !tabActive},'tab']" @click="tabChange(false)">历史数据</button>
          </div>
          <div class="date-search" v-show="!tabActive">
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
        <div>
          <curve-gradients-legend-title
            :id="'right_1'"
            :isWater="true"
            :charData="chartData[0]"></curve-gradients-legend-title>
        </div>
        <div>
          <curve-gradients-legend-title
            :id="'right_2'"
            :charData="chartData[1]"></curve-gradients-legend-title>
        </div>
        <div>
          <curve-gradients-legend-title
            :id="'right_3'"
            :charData="chartData[2]"></curve-gradients-legend-title>
        </div>
        <div>
          <curve-gradients-legend-title
            :id="'right_4'"
            :charData="chartData[3]"></curve-gradients-legend-title>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPHMDetail} from '@/api/portal'
  import CurveGradientsLegendTitle from '@/components/portal/chart/curve-gradients-legend-title.vue'

  export default {
    name: "PHMDetailOne",
    data() {
      return {
        tabActive: true,
        dateTime: [],
        markerInfo: {},
        chartData: [],
        timer: {}
      }
    },
    components: {
      CurveGradientsLegendTitle
    },
    created() {
      this.markerInfo = JSON.parse(localStorage.getItem('shaftInfo'))
      this.initDate()
      this.loadInfo()
      this.setTimer()
    },
    methods: {
      loadInfo() {
        getPHMDetail(this.markerInfo.deviceName, this.tabActive ? '' : this.dateTime[0], this.tabActive ? '' : this.dateTime[1], 1, this.tabActive ? 1 : '').then(res => {
          let info = res.data
          let arr = [
            [this.arrToObj(this.arrToArr(info.waterRateList), '#016cee', '#0a217e', '含水率', '含水率', '#0d0354')],
            [this.arrToObj(this.arrToArr(info.temperatureList[0]), '#f7cd42', '#f7cd42', '罐体温度', '温度', '#0d0354'), this.arrToObj(this.arrToArr(info.temperatureList[1]), '#01ebcb', '#01ebcb', '设备温度', '温度')],
            [this.arrToObj(this.arrToArr(info.pressureList[0]), '#8e00e8', '#8e00e8', '管线压力', '压力', '#0d0354'), this.arrToObj(this.arrToArr(info.pressureList[1]), '#ce4057', '#ce4057', '罐体压力', '压力')],

            [this.arrToObj(this.arrToArr(info.waterRateList), '#016cee', '#0a217e', '含水率', '综合', '#0d0354'),
              this.arrToObj(this.arrToArr(info.temperatureList[0]), '#f7cd42', '#f7cd42', '罐体温度', '综合', '#0d0354'),
              this.arrToObj(this.arrToArr(info.temperatureList[1]), '#01ebcb', '#01ebcb', '设备温度', '综合'),
              this.arrToObj(this.arrToArr(info.pressureList[0], true), '#8e00e8', '#8e00e8', '管线压力', '综合', '#0d0354'),
              this.arrToObj(this.arrToArr(info.pressureList[1], true), '#ce4057', '#ce4057', '罐体压力', '综合')
            ],
          ]
          this.chartData = arr
        })
      },
      arrToArr(arr, b) {
        let a = []
        arr.forEach((item, index) => {
          a.push([new Date(item.key).getTime(), b ? item.value * 100 : item.value])
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
        let starTime = new Date(nowTime.getTime() - (1000 * 3600 * (day ? day : 12)))//开始小时时间（12小时前）
        let endDate = nowTime.getFullYear() + '-' + ((nowTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (nowTime.getMonth() + 1) + '-' + nowTime.getDate() + ' ' + nowTime.getHours() + ':00'//结束时间
        let starDate = starTime.getFullYear() + '-' + ((starTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (starTime.getMonth() + 1) + '-' + starTime.getDate() + ' ' + starTime.getHours() + ':00'//开始时间
        this.dateTime = [starDate, endDate]
      },
      //时间选择
      dateChange(val) {
        this.dateTime = val
      },
      //tab切换
      tabChange(flag) {
        this.tabActive = flag
      },
      //搜索
      search() {
        this.loadInfo()
      },
      //近 24 48
      nearTime(type) {
        this.initDate(type)
      },
      setTimer() {
        this.timer = setInterval(() => {
          this.loadInfo()
        }, 8000)
      },
      clearTimer() {
        clearInterval(this.timer)
      }
    },
    watch: {
      tabActive(newValue) {
        if (newValue) {
          this.setTimer()
        } else {
          this.clearTimer()
        }
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
  }

  .tab {
    padding: @precision*10 @precision*15;
    font-size: @precision*20;
    color: #ffffff;
    background-color: #2a2f55;
    border: none;
    border-radius: @precision*10;
  }

  .tab-block .tab:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .tab-block .tab:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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

  .content {
    height: @precision*774;
    overflow-y: scroll;
  }

  .content > div {
    height: @precision*244;
    margin-top: @precision*1;
  }

  .content > div:last-child {
    margin-top: 0;
  }

  .markerInfo-block {
    height: @precision*352;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .markerInfo-block > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @precision*26;
  }

  .markerInfo-block > div div {
    width: @precision*140;
    text-align: left;
    height: @precision*26;
    line-height: @precision*26;
    font-size: @precision*16;
    color: #ffffff;
  }

  .markerInfo-block > div div:last-child {
    white-space: nowrap;
    text-align: right;
    flex: 1;
  }

  .markerInfo-block img {
    width: @precision*20;
    height: @precision*20;
    margin-right: @precision*20;
  }

</style>
