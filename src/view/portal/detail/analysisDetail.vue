<template>
  <!--  <div>-->
  <!--    <analysis-table :tableData="tableData"></analysis-table>-->
  <!--  </div>-->
  <div class="f">
    <div class="action-bar" ref="actionBar">
      <span class="navigation"><i @click="goback">数据分析</i>/明细数据</span>
      <div>
        <span>井口编号：</span>
        <Select v-model="shaft" style="width:9.37vw">
          <Option v-for="item in shaftList" :value="item.label" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="date-search">
        <span>时间选择：</span>
        <DatePicker type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="开始时间~结束时间"
                    confirm
                    :value="dateTime"
                    @on-change="dateChange"
                    style="width: 17.7vw"></DatePicker>
        <button type="button" class="search" @click="search">查询</button>
        <button type="button" class="search" @click="exportPDF">
          <img src="../../../assets/images/portal/export.png" alt="导出">
          导出
        </button>
      </div>
    </div>
    <div class="content">
      <div class="analytics-table">
        <analysis-table :tableData="tableData"></analysis-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getShaft, getDataTop} from '@/api/portal'
  import {export_json_to_excel} from '@/libs/excel'
  import AnalysisTable from '@/components/portal/analysis/analysisTable.vue'

  export default {
    name: "analysisDetail",
    data() {
      return {
        tableData: [],
        shaftList: [],
        shaft: '',
        dateTime: [],
      }
    },
    components: {
      AnalysisTable
    },
    created() {
      this.init()
    },
    mounted() {
      // this.init()
    },
    methods: {
      //初始化
      init() {
        getShaft().then(res => {
          let arr = []
          res.data.forEach(item => {
            arr.push({
              value: item.wellheadId,
              label: item.deviceName
            })
          })
          arr.unshift({
            value: '',
            label: '全部'
          })
          this.shaftList = arr
          this.shaft = arr[0].label
          let nowTime = new Date()
          let endTime = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-' + nowTime.getDate() + ' 00:00'
          let pastTime = new Date(new Date(nowTime).getTime() - (1000 * 3600 * 24 * 19))
          let starTime = pastTime.getFullYear() + '-' + (pastTime.getMonth() + 1) + '-' + pastTime.getDate() + ' 00:00'
          this.dateTime = [starTime, endTime]
          this.loadTable(this.shaft, starTime, endTime, 1)
        })
      },
      loadTable(shaft, starTime, endTime, type) {
        getDataTop(shaft === '全部' ? '' : shaft, starTime, endTime, type).then(res => {
          console.log(res)
          if (type === 2) {
            // {res.data, key, title, filename, autoWidth}
            let obj = {
              data: res.data,
              key: ['collectionTime', 'deviceName', 'waterRate', 'pipelinePressure', 'equipmentPressure', 'tankTemperature', 'equipmentTemperature'],
              title: {
                'collectionTime': '时间',
                'deviceName': '井口编号',
                'waterRate': '含水率（%）',
                'pipelinePressure': '管线压力（MPa）',
                'equipmentPressure': '设备压力（MPa）',
                'tankTemperature': '罐体温度（℃）',
                'equipmentTemperature': '设备温度（℃）'
              },
              filename: '明细数据',
              autoWidth: true
            }
            export_json_to_excel(obj)
          } else {
            this.tableData = res.data
          }
        })
      },
      //时间选择
      dateChange(val) {
        this.dateTime = val
      },
      //查询
      search() {
        this.loadTable(this.shaft, this.dateTime[0], this.dateTime[1], 1)
      },
      //导出
      exportPDF() {
        this.loadTable(this.shaft, this.dateTime[0], this.dateTime[1], 2)
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
    padding-left: @precision*20;
    padding-right: @precision*20;
    background-color: #0589f8;
    margin-left: @precision*20;
    display: flex;
    align-items: center;
  }

  .date-search button img {
    width: @precision*30;
    height: @precision*30;
    margin-right: @precision*10;
  }

</style>
