<template>
  <div class="login-wrapper">
    <div class="login-wrapper-bg">
      <img src="/image/login-bg.jpg">
    </div>
    <div class="login-left">
      <div class="login-left-title animated fadeInDown">
        <div class="logo">
          <img src="/image/logo.png">
        </div>
        <div class="product">
          <h3>YULI CLOUD</h3>
        </div>
      </div>
      <div class="login-left-center">
        <vue-typed-js :strings="['一款开源敏捷开发框架']"
                      cursorChar="_"
                      :typeSpeed="100">
          <h1 class="typing"></h1>
        </vue-typed-js>
        <!-- <h1>一款开源敏捷开发框架</h1> -->
      </div>
      <div class="left-footer-copyright animated fadeInUp">
        <p>
          Copyright
          <i class="fa fa-copyright"
             aria-hidden="true"></i>
          2020 YULI CLOUD 出品
          <a href="https://github.com/hanguilin">
            @hanguilin
          </a>
        </p>
      </div>

    </div>
    <div class="login-right animated slideInRight">
      <div class="login-form-wrapper animated fadeIn">
        <el-form ref="loginForm"
                 label-position="top"
                 :rules="rules"
                 :model="formLogin"
                 size="default">
          <el-form-item prop="username">
            <el-input type="text"
                      v-model="formLogin.username"
                      placeholder="用户名">
              <i slot="prepend"
                 class="fa fa-user-circle-o"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
                      v-model="formLogin.password"
                      placeholder="密码">
              <i slot="prepend"
                 class="fa fa-keyboard-o"></i>
            </el-input>
          </el-form-item>
          <el-button v-noMoreClick="3000"
                     size="default"
                     @click="submit"
                     type="primary"
                     class="login-button">
            登录
          </el-button>
          <el-form-item>
            <div class="auth-operation">
              <p><i class="fa fa-question-circle"
                   aria-hidden="true"></i>忘记密码</p>
              <p>注册用户</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      // 表单
      formLogin: {
        username: 'han',
        password: '123456',
        code: 'v9am'
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('sys/account', [
      'login'
    ]),
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password
          }).then((success) => {
            // 重定向对象不存在则返回顶层路径
            this.$router.replace(this.$route.query.redirect || '/')
          })
        } else {
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background-size: cover;
  .login-wrapper-bg {
    > img {
      width: 100%;
      height: 100%;
      animation: bg-trans 15s infinite linear;
      position: absolute;
      z-index: -1;
    }
  }
  .login-left {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .login-left-title {
      height: 10vh;
      color: white;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 2vh;
    }
    .login-left-center {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      letter-spacing: 1rem;
      font-family: NSimSun;
      margin-top: -20vh;
    }
    .left-footer-copyright {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      height: 10vh;
      a {
        color: white;
        &:hover {
          color: orange;
        }
      }
    }
  }
  .login-right {
    width: 30%;
    color: white;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    .login-button {
      width: 100%;
    }
    .auth-operation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .login-right-footer {
      height: 5vh;
    }
  }
}
@keyframes bg-trans {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
