<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <!--      <Card icon="log-in" title="欢迎登录" :bordered="false">-->
      <Card icon="log-in" :bordered="false">
        <div class="form-con">
          <div class="welcome-login">
            欢迎登录
          </div>
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名"/>
              <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
              </span>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码"/>
              <span slot="prepend">
                <Icon :size="14" type="md-lock"></Icon>
              </span>
            </FormItem>
            <!--            <FormItem prop="inputCode">-->
            <!--              <Input type="text" v-model="form.inputCode" class="inputCode" placeholder="请输入验证码"/>-->
            <!--              <img :src="'data:image/jpg;base64,' + form.verificationCodeSrc" alt="验证码"-->
            <!--                   @click="thisGetVerificationCode">-->
            <!--              <span slot="prepend">-->
            <!--                <Icon :size="14" type="md-lock"></Icon>-->
            <!--              </span>-->
            <!--            </FormItem>-->
            <FormItem>
              <Button @click="handleSubmit" :loading="loading" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <!--          <p class="login-tip">其他登录方式-->
          <!--            <Icon custom="icon iconfont icon-QQ-circle-fill" @click="handleClick('qq')" color="#0099ff" size="20"/>-->
          <!--            <Icon custom="icon iconfont icon-wechat-fill" @click="handleClick('wechat')" color="#339900" size="20"/>-->
          <!--            <Icon custom="icon iconfont icon-gitee" @click="handleClick('gitee')" color="#cc0000" size="20"/>-->
          <!--          </p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {getVerificationCode} from '@/api/user'

  export default {
    name: 'LoginForm',
    props: {
      usernameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      },
      // inputCodeRules: {
      //   type: Array,
      //   default: () => {
      //     const validatePassCheck = (rule, value, callback) => {
      //       if (!value) {
      //         callback('验证码不能为空')
      //       } else {
      //         callback()
      //       }
      //     }
      //     return [
      //       {validator: validatePassCheck, trigger: 'blur'}
      //     ]
      //   }
      // }
    },
    data() {
      return {
        loading: false,
        form: {
          username: '',
          password: '',
          inputCode: '',
          uuid: '',
          verificationCodeSrc: '',
          auto: true,
        },
        config: {}
      }
    },
    computed: {
      rules() {
        return {
          username: this.usernameRules,
          password: this.passwordRules,
          // inputCode: this.inputCodeRules
        }
      }
    },
    created() {
      // this.thisGetVerificationCode()
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      //获取验证码
      thisGetVerificationCode() {
        getVerificationCode().then(res => {
          this.form.uuid = res.data.uuid
          this.form.verificationCodeSrc = res.data.image
        })
      },
      handleClick(type) {
        let url = this.config[type]
        if (!url) return
        this.openWin(url, type, 650, 500)
      },
      openWin(url, name, iWidth, iHeight) {
        //获得窗口的垂直位置
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2
        //获得窗口的水平位置
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2
        window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no')
      },
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            let loginParams = {}
            loginParams.userAccount = this.form.username
            loginParams.passWord = this.form.password
            loginParams.verCode = this.form.inputCode
            loginParams.uuid = this.form.uuid
            loginParams.auto = this.form.auto
            this.handleLogin(loginParams).then(res => {
              if (res.code === 0) {
                this.$Message.success('登录成功')
                var obj = this
                setTimeout(function () {
                  // obj.$router.push({
                  //   name: obj.$config.homeName
                  // })
                  obj.$router.push({
                    path: 'portalHome/realTimeMonitoring'
                  })
                }, 1500)
              } else {
                this.thisGetVerificationCode()
              }
            }).finally(() => {
              this.loading = false
            })
          }
        })
      }
    },
    mounted: function () {

    }
  }
</script>
<style scoped lang="less">
  .inputCode {
    width: 60%;
  }

  .inputCode + img {
    width: 30%;
    float: right;
    height: 32px;
  }

  .welcome-login {
    height: @precision*80;
    line-height: @precision*80;
    color: #ffffff;
    font-size: @precision*46;
    text-align: center;
  }
</style>
