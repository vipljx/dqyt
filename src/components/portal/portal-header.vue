<template>
  <div class="p-header">
    <header>
      <img src="../../assets/images/portal/logo.png" alt="logo"/>
      <h5>单井运行(含水)在线分析系统</h5>
    </header>
    <ul>
      <li v-for="(item,index) in routerList" :key="item.title" :class="{ 'p-active' : index === selected }"
          @click="changeSelected(index)">
        <!--        <router-link :to="item.path">{{item.title}}</router-link>-->
        <a>{{item.title}}</a>
      </li>
      <li><a @click="toHome">系统管理</a></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "portal-header",
    data() {
      return {
        routerList: [
          {
            path: '/portalHome/realTimeMonitoring',
            title: '实时监控'
          },
          {
            path: '/portalHome/dataAnalysis',
            title: '数据分析'
          },
          {
            path: '/portalHome/PHM',
            title: 'PHM'
          },
        ],
        selected: 0
      }
    },
    created() {
      this.initSelected()
    },
    methods: {
      //初始化选中菜单
      initSelected() {
        let localUrl = window.location.href
        this.routerList.forEach((item, index) => {
          if (localUrl.indexOf(item.path) !== -1) {
            this.selected = index
          }
        })
      },
      //菜单切换
      changeSelected(i) {
        this.selected = i
        this.$emit('watchRoute', this.routerList[i].path)
        this.$router.push({
          path: this.routerList[i].path
        })
      },
      //系统管理
      toHome() {
        this.$router.push({
          name: this.$config.homeName
        })
        // let url = window.location.origin + '/' + this.$config.homeName
        // window.open(url)
      }
    }
  }
</script>

<style scoped lang="less">
  .p-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2a2f55;
    height: @precision*95;
    color: #ffffff;
  }

  .p-header header {
    display: flex;
    align-items: center;
  }

  header img {
    width: @precision*40;
    margin: 0 @precision*10;
  }

  header h5 {
    font-size: @precision*24;
  }

  ul {
    display: flex;
    margin-right: @precision*40;
  }

  ul li {
    list-style: none;
    height: @precision*95;
    line-height: @precision*95;
    padding: 0 @precision*10;
    margin: 0 @precision*20;
  }

  ul li a {
    color: #ffffff;
    font-size: @precision*18;
  }

  ul li.p-active {
    color: #0589f8;
    border-bottom: @precision*3 solid #0589f8;
  }

  ul li.p-active a {
    color: #0589f8;
  }
</style>
