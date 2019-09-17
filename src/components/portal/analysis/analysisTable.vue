<template>
  <div class="p-content">
    <div class="line title">
      <div>时间</div>
      <div>井口编号</div>
      <div>含水率</div>
      <div>管线压力</div>
      <div>设备压力</div>
      <div>罐体温度</div>
      <div>设备温度</div>
      <!--      <div>状态</div>-->
    </div>
    <div class="line" v-for="(item,index) in tableData" :key="index">
      <div>{{item.timeStr || item.collectionTime}}</div>
      <div>{{item.deviceName}}</div>
      <div>{{item.waterRate.toFixed(2)}}%</div>
      <div>{{item.pipelinePressure.toFixed(2)}}MPa</div>
      <div>{{item.equipmentPressure.toFixed(2)}}MPa</div>
      <div>{{item.tankTemperature.toFixed(2)}}℃</div>
      <div>{{item.equipmentTemperature.toFixed(2)}}℃</div>
      <!--      <div>{{item.isOnline || (item.workState === '' ? '离线' : '在线')}}</div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "analysisTable",
    props: {
      tableData: {
        type: Array,
        default: () => {
          return []
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .p-content {
    width: 100%;
    height: 100%;
    padding: @precision*30;
    border-radius: @precision*10;
    background-color: #2a2f55;
    overflow-y: scroll;
  }


  .line {
    display: flex;
  }

  .line > div {
    flex: 1;
    height: @precision*60;
    line-height: @precision*60;
    padding-left: @precision*30;
    text-align: left;
    font-size: @precision*16;
    color: #ffffff;
  }

  .title {
    background-color: #151a3b;
    font-size: @precision*18;
  }
</style>
