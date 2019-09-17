<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :style="{background: color}" :src="userAvatar">{{nickName.substring(0,1)}}</Avatar>
      <label class="user-name">{{userName}}</label>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="setting">
          <Icon size="16" type="md-person"/>
          个人设置
        </DropdownItem>
        <DropdownItem divided name="monitor">
          <Icon size="16" type="md-power"/>
          监控系统
        </DropdownItem>
        <DropdownItem divided name="logout">
          <Icon size="16" type="md-power"/>
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions} from 'vuex'

  const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
  const rnd = ((n, m) => {
    let random = Math.floor(Math.random() * (m - n + 1) + n)
    return random
  })

  export default {
    name: 'User',
    props: {
      userName: {
        type: String,
        default: ''
      },
      nickName: {
        type: String,
        default: ''
      },
      userAvatar: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        color: ColorList[rnd(0, ColorList.length - 1)]
      }
    },
    methods: {
      ...mapActions([
        'handleLogout'
      ]),
      handleClick(name) {
        switch (name) {
          case 'setting':
            this.$router.push({
              name: 'setting'
            })
            break
          case 'logout':
            this.$Modal.confirm({
              title: '是否确认退出系统？',
              width: 250,
              onOk: () => {
                this.handleLogout().then(() => {
                  // 地址栏重新刷新
                  location.reload()
                })
              }
            })
            break
          case 'monitor':
            this.$router.push({
              name: 'realTimeMonitoring'
            })
            break
        }
      }
    }
  }
</script>
