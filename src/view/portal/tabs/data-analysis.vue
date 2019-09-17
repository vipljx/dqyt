<template>
  <div class="f">
    <div class="action-bar" ref="actionBar">
      <div class="action-bar-left">
        <button :class="{'p-active' : index === selected}" v-for="(item,index) in leftBar" :key="item"
                @click="changeBar(index)">
          {{item}}
        </button>
      </div>
      <div class="action-bar-right">
        <button v-for="(item,index) in rightBar" :key="item" @click="rightClick(index)">{{item}}</button>
      </div>
    </div>
    <div class="content">
      <polyline-color
        v-for="(item,index) in charData"
        :key="item.title"
        :charData="item.data"
        :title="item.title"
        :id="'c'+index"
        :type="type"
        :isWater="true"
        :hasMR="((index + 1) % 3) !== 0"
      ></polyline-color>
    </div>
  </div>
</template>

<script>
  import {getDataDnalysis} from '@/api/portal'
  import PolylineColor from '@/components/portal/chart/polyline-color.vue'
  import analysisDetail from "../detail/analysisDetail"

  export default {
    name: "data-analysis",
    data() {
      return {
        selected: 0,
        leftBar: ['含水率', '压力', '温度'],
        rightBar: ['单井综合指数分析', '多井含水指数分析', '明细数据'],
        type: '含水率',
        charData: [],
      }
    },
    components: {
      PolylineColor,
    },
    created() {
      this.loadOne(1, 0)
    },
    methods: {
      //加载含水率
      loadOne(i, index) {
        getDataDnalysis(i).then(res => {
          let arr = []
          for (let i in res.data) {
            res.data[i].forEach(item => {
              item.key = item.key.split(' ')[1].slice(0, 5)
              item.value = parseFloat(item.value.toFixed(2))
            })
            let obj = {
              title: i + '井',
              data: res.data[i]
            }
            arr.push(obj)
          }
          this.charData = arr
          this.selected = index
          this.type = this.leftBar[index]
        })
      },
      //加载压力
      loadTwo(sel) {
        let that = this
        Promise.all([getDataDnalysis(2), getDataDnalysis(3)]).then(function (values) {
          let arr = []
          let index = 0
          for (let i in values[0].data) {
            let arr_1 = []
            let arr_2 = []
            values[0].data[i].forEach(item => {
              arr_1.push([item.key.split(' ')[1].slice(0, 5), parseFloat(item.value.toFixed(2))])
            })
            values[1].data[i].forEach(item => {
              arr_2.push([item.key.split(' ')[1].slice(0, 5), parseFloat(item.value.toFixed(2))])
            })
            let id = index++
            let obj = {
              title: i + '井',
              data: [
                {
                  data: arr_1,
                  color: '#a200ff',
                  gColor: '#a200ff',
                  name: '管线压力',
                  id: 'analysis_' + id
                }, {
                  data: arr_2,
                  color: '#ea4b59',
                  gColor: '#ea4b59',
                  name: '罐体压力',
                  id: 'analysis_' + id
                }
              ]
            }
            arr.push(obj)
          }
          that.charData = arr
          that.selected = sel
          that.type = that.leftBar[sel]
        })
      },
      //加载温度
      loadThird(sel) {
        let that = this
        Promise.all([getDataDnalysis(4), getDataDnalysis(5)]).then(function (values) {
          let arr = []
          let index = 0
          for (let i in values[0].data) {
            let arr_1 = []
            let arr_2 = []
            values[0].data[i].forEach(item => {
              arr_1.push([item.key.split(' ')[1].slice(0, 5), parseFloat(item.value.toFixed(2))])
            })
            values[1].data[i].forEach(item => {
              arr_2.push([item.key.split(' ')[1].slice(0, 5), parseFloat(item.value.toFixed(2))])
            })
            let id = index++
            let obj = {
              title: i + '井',
              data: [
                {
                  data: arr_1,
                  color: '#ebc443',
                  gColor: '#ebc443',
                  name: '罐体温度',
                  id: 'analysis_' + id
                }, {
                  data: arr_2,
                  color: '#00ffd5',
                  gColor: '#00ffd5',
                  name: '设备温度',
                  id: 'analysis_' + id
                }
              ]
            }
            arr.push(obj)
          }
          that.charData = arr
          that.selected = sel
          that.type = that.leftBar[sel]
        })
      },
      //左侧bar点击
      changeBar(i) {
        // this.selected = i
        // this.type = this.leftBar[i]
        switch (i) {
          case 0:
            this.loadOne(1, i)
            break
          case 1:
            this.loadTwo(i)
            break
          case 2:
            this.loadThird(i)
            break
        }
      },
      rightClick(i) {
        let str = ''
        switch (i) {
          case 0:
            str = 'analysisDetailOne'
            break
          case 1:
            str = 'analysisDetailMore'
            break
          case 2:
            str = 'analysisDetail'
            break
        }
        this.$router.push({
          name: str
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
</style>
