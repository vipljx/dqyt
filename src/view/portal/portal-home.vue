<template>
  <div>
    <portal-header ref="pHead" @watchRoute="watchRoute"></portal-header>
    <div :class="{'p-bg' :!flag}" ref="pPg" :style="{height:h + 'px'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import PortalHeader from '@/components/portal/portal-header.vue'

  export default {
    name: "top-menu",
    data() {
      return {
        flag: false,
        h: 0
      }
    },
    components: {
      PortalHeader
    },
    created() {
      this.initSelected()
    },
    mounted() {
      this.initHeight()
    },
    methods: {
      initHeight() {
        let h = document.body.offsetHeight
        this.h = h - this.$refs.pHead.$el.clientHeight
      },
      initSelected(src) {
        let localUrl = src || window.location.href
        this.flag = localUrl.indexOf('/portalHome/realTimeMonitoring') !== -1
      },
      watchRoute(src) {
        this.initSelected(src)
      }
    }
  }
</script>

<style scoped>

</style>
