<template>
  <div class="f">
    <div class="action-bar" ref="actionBar">
      <span class="navigation"><i @click="goback">数据分析</i>/单井综合指数分析</span>
      <div>
        <span>井口编号：</span>
        <Select v-model="shaft" style="width:9.37vw">
          <Option v-for="item in shaftList" :value="item.label" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div>
        <span>指标：</span>
        <Select v-model="shaftType" style="width:9.37vw">
          <Option v-for="item in quotaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="date-search">
        <span>时间选择：</span>
        <div class="date-change">
          <DatePicker
            :type="changeIndex ? 'datetimerange' :'daterange'"
            :format="changeIndex ? 'yyyy-MM-dd HH:mm' :'yyyy-MM-dd'"
            placeholder="开始时间~结束时间"
            confirm
            :value="dateTime"
            @on-change="dateChange"
            style="width: 17.7vw"></DatePicker>
          <div class="change">
            <span>{{changeIndex ? '小时' : '天'}}</span>
            <img src="../../../assets/images/portal/change.png" alt="切换" @click="change">
          </div>
        </div>
        <button type="button" @click="loadByDay(changeIndex ? 24 : 10)">{{changeIndex ? '近24小时' : '近10天'}}</button>
        <button type="button" @click="loadByDay(changeIndex ? 48 : 30)">{{changeIndex ? '近48小时' : '近30天'}}</button>
        <button type="button" class="search" @click="search">查询</button>
      </div>
    </div>
    <div class="content">
      <div class="analytics-chart">
        <polyline-chart
          :charData="charData"
          :isWater="shaftType === '1'"
          :id="'id'"></polyline-chart>
      </div>
      <div class="analytics-table">
        <analysis-table :tableData="tableData"></analysis-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getDataDnalysisDetail, getShaft, getDataDnalysisTable} from '@/api/portal'
  import PolylineChart from '@/components/portal/chart/polylineChart.vue'
  import AnalysisTable from '@/components/portal/analysis/analysisTable.vue'

  export default {
    name: "analysisDetailOne",
    data() {
      return {
        shaftList: [],
        shaft: '',
        quotaList: [{
          value: '1',
          label: '含水率'
        }, {
          value: '2',
          label: '管线压力'
        }, {
          value: '3',
          label: '罐体压力'
        }, {
          value: '4',
          label: '罐体温度'
        }, {
          value: '5',
          label: '设备温度'
        }],
        shaftType: '1',
        identifier: '',
        dateTime: [],
        charData: [],
        tableData: [],
        changeIndex: 0
      }
    },
    components: {
      PolylineChart,
      AnalysisTable
    },
    created() {
      this.init()
    },
    methods: {
      //初始化
      init() {
        getShaft().then(res => {
          console.log(res)
          let arr = []
          res.data.forEach(item => {
            arr.push({
              value: item.wellheadId,
              label: item.deviceName
            })
          })
          this.shaftList = arr
          this.shaft = arr[0].label
          let date = this.initDate()
          this.loadChart(1, this.shaft, date[0], date[1])
        })
      },
      //初始化时间
      initDate(type) {
        let nowTime = new Date()//当前时间
        let endTime = nowTime.getHours()//结束小时
        let starTime = new Date(nowTime.getTime() - (1000 * 3600 * 12))//开始小时时间（12小时前）
        let endDate = nowTime.getFullYear() + '-' + ((nowTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (nowTime.getMonth() + 1) + '-' + nowTime.getDate()//结束日期
        let pastTime = new Date(new Date(nowTime).getTime() - (1000 * 3600 * 24 * 19))//20天前
        let starDate = pastTime.getFullYear() + '-' + ((pastTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (pastTime.getMonth() + 1) + '-' + pastTime.getDate()//开始日期（20天前）
        if (type === 'time') {
          starDate = starTime.getFullYear() + '-' + ((starTime.getMonth() + 1).toString.length === 2 ? '' : '0') + (starTime.getMonth() + 1) + '-' + starTime.getDate() + ' ' + starTime.getHours() + ':00'
          endDate = endDate + ' ' + endTime + ':00'
        }
        this.dateTime = [starDate, endDate]
        return [starDate, endDate]
      },
      //日期选择
      dateChange(val) {
        this.dateTime = val
      },
      //查询
      search() {
        this.loadChart(this.shaftType, this.shaft, this.dateTime[0], this.dateTime[1])
      },
      //加载图表
      loadChart(i, deviceName, startTime, endTime, defaultQuery) {
        // getDataDnalysisDetail(i, deviceName, startTime, endTime, defaultQuery ? 'day' : this.changeIndex ? 'hour' : 'day', defaultQuery).then(res => {
        getDataDnalysisDetail(i, deviceName, startTime, endTime, this.changeIndex ? 'hour' : 'day', defaultQuery).then(res => {
          let arr = []
          res.data[this.shaft].forEach(item => {
            arr.push({
              // year: item.key.split(' ')[defaultQuery ? 0 : this.changeIndex],
              year: item.key.split(' ')[this.changeIndex],
              type: this.shaft,
              value: parseFloat(item.value.toFixed(2))
            })
          })
          this.charData = [arr]
        })
        // getDataDnalysisTable(deviceName, startTime, endTime, defaultQuery ? 'day' : this.changeIndex ? 'hour' : 'day', defaultQuery).then(res => {
        getDataDnalysisTable(deviceName, startTime, endTime, this.changeIndex ? 'hour' : 'day', defaultQuery).then(res => {
          this.tableData = res.data
        })
      },
      //指定天数
      loadByDay(day) {
        this.loadChart(this.shaftType, this.shaft, this.dateTime[0], this.dateTime[1], day)
      },
      //切换 天和小时
      change() {
        let arr = [0, 1]
        arr.splice(arr.indexOf(this.changeIndex), 1)
        this.changeIndex = arr[0]
        this.initDate(this.changeIndex ? 'time' : '')
      },
      //返回数据分析
      goback() {
        this.$router.push({
          path: '/portalHome/dataAnalysis'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .f {
    height: 100%;
  }

  .content {
    height: 95%;
    overflow-y: scroll;
    margin-top: @precision*20;
  }

  .action-bar > div {
    display: flex;
    align-items: center;
  }

  .action-bar span {
    font-size: @precision*18;
    color: #ffffff;
  }

  .action-bar span i {
    font-style: normal;
    cursor: pointer;
  }

  .action-bar .navigation {
    font-size: @precision*22;
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

  .analytics-chart {
    height: @precision*420;
    margin-bottom: @precision*15;
  }

  .analytics-table {
    height: @precision*350;
  }

  .date-change {
    display: flex;
    align-items: center;
  }

  .date-change .change {
    display: flex;
    align-items: center;
    background-color: #2a2f55;
    border-bottom-right-radius: @precision*10;
    border-top-right-radius: @precision*10;
  }

  .date-change span {
    font-size: @precision*18;
    padding: @precision*10;
    color: #a5a8bb;
    line-height: 1.5;
    height: auto;
    min-width: @precision*80;
    text-align: center;
    display: inline-block;
    border: 1px solid #2a2f55;
  }

  .date-change img {
    width: @precision*26;
    height: @precision*26;
    margin-right: @precision*10;
  }


</style>
