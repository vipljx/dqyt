import {login, logout, getUserInfo, getCurrentUserMenu} from '@/api/user'
import {setToken, getToken} from '@/libs/util'

export default {
  state: {
    // userName: '',
    // userId: '',
    // nickName: '',
    // avatarImgPath: '',
    token: getToken(),
    // access: [],
    hasGetInfo: false,
    // userDesc: '',
    // mobile: '',
    // email: '',
    userInfo: {},
    permissions: [],//权限
    menus: [],// 用户菜单
  },
  mutations: {
    // setAvatar(state, avatarPath) {
    //   state.avatarImgPath = avatarPath
    // },
    // setNickName(state, nickName) {
    //   state.nickName = nickName
    // },
    // setUserId(state, id) {
    //   state.userId = id
    // },
    // setUserName(state, name) {
    //   state.userName = name
    // },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, {token, auto}) {
      state.token = token
      setToken(token, auto)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMenus(state, menus) {
      state.menus = menus
    }
  },
  actions: {
    // 登录
    handleLogin({commit}, data) {
      let auto = data.auto
      return new Promise((resolve, reject) => {
        login(data).then(res => {
          if (res.code === 0) {
            let token = res.data
            commit('setToken', {token, auto})
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogout({state, commit}) {
      return new Promise((resolve, reject) => {
        // logout().then(res => {
          commit('setToken', '')
          // commit('setAccess', [])
          commit('setHasGetInfo', false)
          resolve()
        // }).catch(err => {
        //   reject(err)
        // })
      })
    },
    // 获取用户相关信息
    getUserInfo({state, commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          console.log(res)
          if (res.code === 0) {
            let arr = []
            res.data.permissions.forEach(item => {
              arr.push(item.menuAuthority)
            })
            commit('setUserInfo', res.data.sysUser)
            // commit('setAccess', arr)
            commit('setMenus', res.data.menus)
            // const access = []
            // if (res.data.authorities) {
            //   res.data.authorities.map(item => {
            //     if (item.authority) {
            //       access.push(item.authority)
            //     }
            //   })
            // }
            // // 转换权限
            // commit('setAccess', access)
            commit('setHasGetInfo', true)
            // getCurrentUserMenu().then(res => {
            //   if (res.code === 0) {
            //     commit('setUserMenus', res.data)
            //     resolve(state)
            //   }
            // }).catch(err => {
            //   reject(err)
            // })
            resolve(state)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
