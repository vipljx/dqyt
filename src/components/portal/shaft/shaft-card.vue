<template>
  <div :class="[{'no-mr': !hasMR}, 'p-content']" @click="toDetail">
    <h5>{{cardData.deviceName}}</h5>
    <div class="p-middle">
      <img src="../../../assets/images/portal/shaft.png" alt="井">
      <div v-if="!cardType">
        <div class="info-card">
          <p>设备状态</p>
          <div>
            <img src="../../../assets/images/portal/shaft_0.png" alt="">
            <span>{{cardData.workState === '' ? '离线' : '在线'}}</span>
          </div>
        </div>
        <div class="info-card">
          <p>工作状态</p>
          <div>
            <img src="../../../assets/images/portal/shaft_1.png" alt="">
            <span>{{(cardData.workState === '异常' || cardData.workState === '故障') ? '预警' : cardData.workState === ''
              ? '离线' : cardData.workState}}</span>
          </div>
        </div>
        <div class="info-card">
          <p>持续时间</p>
          <div>
            <img src="../../../assets/images/portal/shaft_2.png" alt="">
            <span>{{(cardData.workDuration / 3600).toFixed(2)}}小时</span>
          </div>
        </div>
      </div>
      <div v-else class="p-error">
        <div>
          <div><img src="../../../assets/images/portal/shaft_3.png" alt=""></div>
          <div>
            <p class="error-title">异常诊断</p>
            <div class="error-b" v-if="cardData.ycMsg">
              <p v-for="item in cardData.ycMsg.split(',')" :key="item">{{item}}</p>
            </div>
          </div>
        </div>
        <div>
          <div><img src="../../../assets/images/portal/shaft_4.png" alt=""></div>
          <div>
            <p class="error-title">故障诊断</p>
            <div class="error-b" v-if="cardData.gzMsg">
              <p v-for="item in cardData.gzMsg.split(',')" :key="item">{{item}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-bottom">
      <div v-if="!cardType">
        <!--        <p>设备运行总时长</p>-->
        <!--        <b>{{cardData.workDuration}}</b>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shaft-card",
    props: {
      cardData: {
        type: Object,
        default: () => {
          return {
            data: {}
          }
        }
      },
      hasMR: {
        type: Boolean,
        default: true
      },
      cardType: {
        type: Number,
        default: 0
      }
    },
    methods: {
      toDetail() {
        this.$emit('toDetail', this.cardData)
      }
    }
  }
</script>

<style scoped lang="less">
  .p-content {
    width: 32.5%;
    margin: 0 1.25% @precision*20 0;
    display: inline-block;
    padding: @precision*20 @precision*30;
    border-radius: @precision*10;
    background-color: #2a2f55;
  }

  .no-mr {
    margin-right: 0;
  }

  .p-content > h5 {
    height: @precision*60;
    line-height: @precision*60;
    font-size: @precision*18;
    color: #ffffff;
  }

  .p-middle {
    display: flex;
  }

  .p-middle > img {
    width: @precision*220;
    height: @precision*220;
  }

  .p-middle > div {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .info-card p {
    font-size: @precision*14;
    color: #a5a8bb;
    padding: @precision*5 0;
  }

  .info-card div {
    display: flex;
    align-items: center;
  }

  .info-card > div {
    width: @precision*110;
  }

  .info-card img {
    width: @precision*20;
    margin-right: @precision*10;
  }

  .info-card span {
    font-size: @precision*16;
    color: #ffffff;
  }

  .p-bottom {
    height: @precision*46;
    margin-top: @precision*16;
  }

  .p-bottom p {
    font-size: @precision*14;
    height: @precision*22;
    color: #a5a8bb;
    margin: @precision*16 0 @precision*4 0;
  }

  .p-bottom b {
    font-size: @precision*14;
    height: @precision*20;
    color: #ffffff;
  }

  .p-error > div {
    display: flex;
  }

  .p-error img {
    width: @precision*25;
    margin-right: @precision*5;
  }

  .p-error p {
    min-width: @precision*80;
    font-size: @precision*16;
    color: #fff;
    line-height: @precision*30;
  }

  .p-error .error-title {
    font-size: @precision*14;
    color: #a5a8bb;
  }

  .error-b {
    width: @precision*80;
    height: @precision*80;
    overflow-y: scroll;
  }
</style>
