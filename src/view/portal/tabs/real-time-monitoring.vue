<template>
  <div class="map-content">
    <baidu-map
      class="map"
      :center="{lng: 125.097738, lat: 46.594031}"
      :zoom="10"
      :scroll-wheel-zoom="true"
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
      ak="aG56F3tsFublm17FeQrFGQyGC6XTSQKT">
      <!--      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>-->
      <!--      mapType="BMAP_SATELLITE_MAP"-->
      <bm-marker
        v-for="(item,index) in shaftList"
        :key="item.name"
        :position="item.position"
        :dragging="false"
        @mouseover="mapMouseover(item,index)"
        @mouseout="mapMouseout"
        :icon="{url: require('../../../assets/images/portal/map/position-' + markerIcon[item.workState === '测量中' ? 0 : item.workState === '自清洗' ? 2:(item.workState === '异常' || item.workState === '故障' ) ? 3 : 1] +'.png'), size: {width: 40, height: 50}}">
      </bm-marker>
      <bm-overlay
        ref="markerInfoOverlay"
        v-show="markerInfoShow"
        pane="labelPane"
        class="markerInfo"
        @draw="draw">
        <div class="markerInfo-block" v-if="markerInfo.workState !== ''">
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_0.png" alt="">
            <div>井口编号</div>
            <div>{{markerInfo.deviceName}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_1.png" alt="">
            <div>含水率</div>
            <div>{{markerInfo.waterRate}}%</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_2.png" alt="">
            <div>工作状态</div>
            <div>{{(markerInfo.workState === '异常' || markerInfo.workState === '故障') ? '预警' : markerInfo.workState === ''
              ? '离线' : markerInfo.workState}}
            </div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_3.png" alt="">
            <div>持续时间</div>
            <div>{{(markerInfo.workDuration / 3600).toFixed(2)}}h</div>
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
            <img src="../../../assets/images/portal/map/markerInfo_8.png" alt="">
            <div>流量</div>
            <div>{{markerInfo.workFlow || '- -'}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_6.png" alt="">
            <div>位置</div>
            <div>{{markerInfo.position}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_7.png" alt="">
            <div>防盗</div>
            <div>{{markerInfo.prevention || '- -'}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_3.png" alt="">
            <div>采集时间</div>
            <div>{{markerInfo.acquisitionTime}}</div>
          </div>
        </div>
        <div class="markerInfo-block" v-else>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_0.png" alt="">
            <div>井口编号</div>
            <div>{{markerInfo.deviceName}}</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_1.png" alt="">
            <div>含水率</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_2.png" alt="">
            <div>工作状态</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_3.png" alt="">
            <div>持续时间</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_4.png" alt="">
            <div>温度(探头)</div>
            <div>--</div>
          </div>
          <div>
            <img src="" alt="">
            <div>温度(罐体)</div>
            <div>--</div>
          </div>
          <div>
            <img src="" alt="">
            <div>温度(设备)</div>
            <div>--</div>
          </div>
          <div>
            <img src="" alt="">
            <div>温度(环境)</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_5.png" alt="">
            <div>压力(管线)</div>
            <div>--</div>
          </div>
          <div>
            <img src="" alt="">
            <div>压力(设备)</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_8.png" alt="">
            <div>流量</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_6.png" alt="">
            <div>位置</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_7.png" alt="">
            <div>防盗</div>
            <div>--</div>
          </div>
          <div>
            <img src="../../../assets/images/portal/map/markerInfo_3.png" alt="">
            <div>采集时间</div>
            <div>--</div>
          </div>
        </div>
      </bm-overlay>
    </baidu-map>
    <div :class="['overlay-left-top',{'overlay-left-top-hide':infoOne}]">
      <div class="info-toggle" @click="hideInfo(0)">{{infoOne? '展开' : '隐藏' }}</div>
      <div class="m-title">
        <img src="../../../assets/images/portal/map/p.png" alt="">预警状态
      </div>
      <div class="m-table">
        <div class="m-table-head">
          <div>井口编号</div>
          <div>预警总数</div>
          <div>已处理</div>
          <div>未处理</div>
        </div>
        <div class="m-table-body">
          <div v-for="item in warningList" :key="item.deviceName">
            <div>{{item.deviceName}}</div>
            <div>{{item.errorCount}}</div>
            <div>{{item.yclCount}}</div>
            <div>{{item.wclCount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['overlay-left-bottom' ,{'overlay-left-bottom-hide':infoTwo}]">
      <div class="info-toggle" @click="hideInfo(1)">{{infoTwo? '展开' : '隐藏' }}</div>
      <div>井口颜色说明</div>
      <div>
        <img src="../../../assets/images/portal/map/g.png" alt="">
        <span>自清洗</span>
      </div>
      <div>
        <img src="../../../assets/images/portal/map/b.png" alt="">
        <span>测量中</span>
      </div>
      <div>
        <img src="../../../assets/images/portal/map/y.png" alt="">
        <span>预警</span>
      </div>
      <div>
        <img src="../../../assets/images/portal/map/r.png" alt="">
        <span>离线</span>
      </div>
    </div>
    <div class="overlay-chart" v-show="markerInfoShow">
      <div class="m-title">
        <img src="../../../assets/images/portal/map/p.png" alt="">
        近8小时含水率数据
      </div>
      <div class="waterChart">
        <div id="waterChart" ref="waterChart"></div>
      </div>
      <div>
        <div>最大值：{{max.toFixed(2)}}</div>
        <div>最小值：{{min.toFixed(2)}}</div>
        <div>平均值：{{avg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getWarning, getShaft, getOneShaft} from '@/api/portal'
  import Highcharts from 'highcharts'
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
  import BmOverlay from 'vue-baidu-map/components/overlays/Overlay.vue'
  import BmMapType from 'vue-baidu-map/components/controls/MapType.vue'

  export default {
    name: "real-time-monitoring",
    data() {
      return {
        markerIcon: ['b', 'r', 'g', 'y'],
        markerInfoShow: false,
        markerInfo: {},
        drawIndex: 0,
        charData: [],
        shaftList: [],
        warningList: [],
        min: 0,
        max: 0,
        avg: 0,
        infoOne: false,
        infoTwo: false
      }
    },
    components: {
      BaiduMap,
      BmMarker,
      BmOverlay,
      BmMapType
    },
    created() {
      this.charData = [
        {
          data: [['1', 1], ['2', 2]],
          color: '#71bbff',
          gColor: '#71bbff',
          name: '含水率',
          id: 'analysis_1'
        }]
      this.loadWarning()
      this.loadShafts()
    },
    mounted() {
      this.drawChart()
    },
    methods: {
      //获取预警信息
      loadWarning() {
        getWarning().then(res => {
          this.warningList = res.data
        })
      },
      //获取预警信息
      loadShafts() {
        getShaft().then(res => {
          let arr = []
          res.data.forEach(item => {
            if (item.position) {
              arr.push({
                position: {lng: item.position.split(',')[0], lat: item.position.split(',')[1]},
                name: item.deviceName,
                workState: item.workState
              })
            }
          })
          this.shaftList = arr
        })
      },
      //记载具体井信息
      loadShaft(name) {
        getOneShaft(name).then(res => {
          let arr = []
          let num = []
          let count = 0
          res.data.waterRatesList.forEach(item => {
            let h = item.key.substring(item.key.indexOf(' '), item.key.lastIndexOf(':'))
            arr.push([h, item.value])
          })
          this.charData = [
            {
              data: arr,
              color: '#71bbff',
              gColor: '#71bbff',
              name: '含水率',
              id: 'analysis_1'
            }]
          this.markerInfo = res.data.sysWellheadConfig
          this.charData[0].data.forEach(item => {
            num.push(item[1])
            count += item[1]
          })
          num.sort(function (a, b) {
            return a - b
          })
          this.min = num[0]
          this.max = num[num.length - 1]
          this.avg = parseFloat(count / num.length).toFixed(2)
        })
      },
      //地图点鼠标移入
      mapMouseover(obj, i) {
        this.$refs.markerInfoOverlay.reload()
        this.drawIndex = i
        this.markerInfoShow = true
        this.loadShaft(obj.name)
      },
      //地图点鼠标移出
      mapMouseout() {
        this.markerInfoShow = false
      },
      //点信息
      draw({el, BMap, map}) {
        if (!this.shaftList[this.drawIndex]) {
          return false
        }
        const pixel = map.pointToOverlayPixel(new BMap.Point(this.shaftList[this.drawIndex].position.lng, this.shaftList[this.drawIndex].position.lat))
        el.style.left = pixel.x + 40 + 'px'
        el.style.top = pixel.y - 25 + 'px'
      },
      //图表
      drawChart() {
        let obj = this.charData
        let xArr = []
        obj[0].data.forEach(item => {
          xArr.push(item[0])
        })
        let series = []
        obj.forEach(item => {
          series.push({
            type: 'area',
            name: item.name,
            lineWidth: 3,
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
        let options = {
          chart: {
            // zoomType: 'x'
            // backgroundColor: '#2a2f55',
            backgroundColor: 'rgba(42, 47, 85, 0)',
            margin: [10, 0, 40, 40]
          },
          title: false,
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
              style: {
                color: '#ffffff'
              },
              formatter: function (chart) {
                return chart.value
              },
              y: 15
            },
            // tickAmount: 6,
          },
          yAxis: {
            lineWidth: 1,
            lineColor: '#647592',
            // gridLineWidth: 1,
            gridLineColor: '#495c83',
            gridLineDashStyle: 'Dash',
            title: false,
            // ceiling: 100,
            // floor: 0.6,
            // ceiling: 1,
            min: 0.6,
            max: 1,
            labels: {
              style: {
                color: '#ffffff'
              },
              formatter: function () {
                return (this.value * 100) + '%'
              },
              x: -10
            },
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
          legend: false,
        }
        options.series = series
        this.chart = Highcharts.chart('waterChart', options)
      },
      hideInfo(type) {
        if (type) {
          this.infoTwo = !this.infoTwo
        } else {
          this.infoOne = !this.infoOne
        }
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
  .map-content, .map {
    height: 100%;
  }

  .map-content {
    transform: translate(0, 0);
  }

  .markerInfo, .overlay-left-top, .overlay-left-bottom, .overlay-chart {
    background-color: rgba(42, 47, 85, 0.8);
    border-radius: @precision*8;
  }

  .markerInfo {
    padding: @precision*10;
    position: absolute;
  }

  .markerInfo-block > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @precision*26;
  }

  .markerInfo-block > div div {
    width: @precision*100;
    text-align: left;
    height: @precision*26;
    line-height: @precision*26;
    font-size: @precision*14;
    color: #ffffff;
  }

  .markerInfo-block > div div:last-child {
    width: @precision*200;
    white-space: nowrap;
  }

  .markerInfo-block img {
    width: @precision*16;
    height: @precision*16;
    margin-right: @precision*10;
  }

  .overlay-left-top {
    position: fixed;
    top: @precision*20;
    left: 0;
    width: @precision*425;
    /*<!--max-height: @precision*315;-->*/
    color: #ffffff;
    transform: translate(0, 0);
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-image: linear-gradient(to right, rgba(42, 47, 85, 0.8), rgba(90, 164, 250, 1), rgba(42, 47, 85, 0.8)) 30 30;
    transition: left 1s linear;
  }

  .overlay-left-top-hide {
    left: -@precision*425
  }

  .info-toggle {
    display: inline-flex;
    align-items: center;
    position: fixed;
    right: -@precision*20;
    top: -3px;
    width: @precision*20 !important;
    height: @precision*60;
    /*<!--padding: @precision*20 0;-->*/
    color: #ffffff;
    font-size: @precision*10;
    /*background-color: rgba(42, 47, 85, 0.8);*/
  }

  .info-toggle::before {
    border-color: transparent transparent transparent rgba(42, 47, 85, 0.8);
    border-style: solid none solid solid;
    border-width: @precision*10 0 @precision*10 @precision*20;
    content: "";
    display: inline-block;
    position: fixed;
    height: @precision*60;
    right: -@precision*20;
    width: 0;
    z-index: -1;
  }

  .overlay-left-top .m-title, .overlay-chart .m-title {
    display: flex;
    align-items: center;
    padding: @precision*20;
    font-size: @precision*16;
    border-bottom: 2px solid #38435c;
  }

  .m-title img {
    width: @precision*14;
    height: @precision*14;
    margin-right: @precision*10;
  }

  .m-table {
    padding: 0 @precision*20;
  }

  .m-table-head > div {
    height: @precision*50;
    line-height: @precision*50;
  }

  .m-table-head, .m-table-body > div {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #49557a;
  }

  .m-table-head div, .m-table-body > div div {
    flex: 1;
  }

  .m-table-body {
    max-height: @precision*260;
    overflow-y: scroll;
  }

  .m-table-body div {
    height: @precision*40;
    line-height: @precision*40;
  }

  .overlay-left-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    color: #ffffff;
    padding: @precision*20;
    font-size: @precision*12;
    transform: translate(0, 0);
    transition: left 0.5s linear;
  }

  .overlay-left-bottom-hide {
    left: -@precision*150;
  }

  .overlay-left-bottom .info-toggle {
    top: @precision*20;
  }

  .overlay-left-bottom > div {
    width: @precision*110;
    display: flex;
    align-items: center;
    height: @precision*30;
  }

  .overlay-left-bottom img {
    width: @precision*30;
    height: @precision*30;
  }

  .overlay-left-bottom > div:first-child {
    font-size: @precision*14;
  }

  .overlay-left-bottom > div span {
    font-size: @precision*12;
  }

  .overlay-chart {
    position: fixed;
    top: 10vh;
    right: @precision*40;
    width: @precision*500;
    color: #ffffff;

    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-image: linear-gradient(to right, rgba(42, 47, 85, 0.8), rgba(90, 164, 250, 1), rgba(42, 47, 85, 0.8)) 30 30;
  }

  .waterChart {
    padding: @precision*20;
  }

  #waterChart {
    height: @precision*300;
  }

  .overlay-chart > div:last-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @precision*60;
    padding: 0 @precision*40;
  }
</style>
