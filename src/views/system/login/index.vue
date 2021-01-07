<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header"></div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center">
          <!-- logo -->
          <div class="product-info">
            <div class="logo"><svg t="1610013013321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2153" width="64" height="64"><path d="M99.424 608.832l6.144 17.472c14.784 33.248 34.24 48.256 64.064 45.344a713.6 713.6 0 0 1 8.352-15.2l0.384-0.64c6.816-12.192 9.696-17.504 11.872-22.24a266.848 266.848 0 0 1-20.672-66.048c-1.856-10.208-3.2-20.32-4.192-31.136-0.384-4.16-0.736-8.256-1.056-12.96l-0.736-10.752-0.064-0.736c-8.64-0.928-19.712 1.856-34.88 11.168-27.296 17.696-39.36 56.096-29.216 85.76z m63.264-106.176a38.528 38.528 0 0 0-0.096-0.736l0.096 0.736z m32.128 140.16z m-2.656-13.888zM94.144 469.12c38.4-23.776 73.056-26.112 101.44-14.144 4.992 2.08 6.784 3.104 11.84 6.112 3.296 1.984 6.176 4.512 8.576 7.52 8.256 10.368 9.28 16.608 10.88 39.552 3.616 50.784 7.712 73.536 23.552 104.096 8.768 15.456 6.176 28.224-1.696 46.08-3.424 7.68-6.592 13.6-15.104 28.832-7.648 13.632-10.912 19.904-12.96 24.96a31.936 31.936 0 0 1-21.888 19.136c-70.72 17.728-123.104-14.336-152.608-81.12l-7.2-20.128c-19.52-57.28 2.336-126.88 55.168-160.896zM924.448 608.832l-6.176 17.472c-14.784 33.248-34.24 48.256-64.064 45.344a713.6 713.6 0 0 0-8.32-15.2l-0.416-0.64c-6.816-12.192-9.696-17.504-11.84-22.24a266.848 266.848 0 0 0 20.64-66.048c1.856-10.208 3.2-20.32 4.192-31.136 0.384-4.16 0.736-8.256 1.056-12.96l0.768-10.752 0.032-0.736c8.64-0.928 19.744 1.856 34.88 11.168 27.328 17.696 39.36 56.096 29.248 85.76z m-63.264-106.176a38.528 38.528 0 0 1 0.096-0.736l-0.096 0.736z m-32.16 140.16z m2.656-13.888z m98.048-159.84c-38.4-23.776-73.088-26.112-101.44-14.144a74.88 74.88 0 0 0-11.872 6.112 31.936 31.936 0 0 0-8.576 7.52c-8.256 10.368-9.28 16.608-10.88 39.552-3.584 50.784-7.712 73.536-23.52 104.096-8.8 15.456-6.208 28.224 1.696 46.08 3.392 7.68 6.56 13.6 15.104 28.832 7.616 13.632 10.88 19.904 12.928 24.96 3.84 9.536 11.968 16.64 21.888 19.136 70.72 17.728 123.104-14.336 152.64-81.12l7.168-20.128c19.552-57.28-2.336-126.88-55.136-160.896z" fill="#8a8a8a" p-id="2154"></path><path d="M843.104 618.688c15.008 32.128 20.896 62.208 20.896 90.176 0 63.36-31.232 117.632-82.208 163.488-14.08 12.672-29.024 24.032-44.512 34.4-10.176 6.784-14.848 9.6-28.8 17.728-82.816 47.36-310.144 47.36-392.736 0.128a416.96 416.96 0 0 1-34.24-21.12c-18.24-12.48-35.52-26.432-51.264-42.08C186.304 817.76 160 766.912 160 708.864c0-22.336 8.064-53.184 22.816-84.8-21.344-65.92-28.992-135.456-10.496-210.368 23.136-93.504 65.28-147.2 132.864-196.672 45.12-32.256 85.12-46.848 137.056-54.688 3.072-8.512 4.256-17.76 3.776-27.584a101.92 101.92 0 0 0-5.632-28.64c-8.992-27.04 19.2-51.488 44.704-38.72 18.144 9.088 77.76 59.488 105.536 95.744 50.368 8.64 88.96 23.296 132.8 54.72 62.528 44.256 105.76 102.08 129.216 196.768a359.776 359.776 0 0 1-9.536 204.064z m-648.96 21.472l2.72 2.176a77.216 77.216 0 0 1-1.888-1.536l-0.864-0.64z m54.912-33.824a32 32 0 0 1-0.576 29.696C232.512 665.088 224 693.792 224 708.864c0 38.752 18.464 74.496 51.36 107.136 22.592 22.464 45.344 38.048 71.904 52.928 63.168 36.096 266.304 36.096 329.216 0.128 12.576-7.36 16.512-9.696 25.28-15.552 13.088-8.736 25.6-18.24 37.248-28.736C777.728 789.92 800 751.2 800 708.864c0-21.76-5.312-45.92-19.904-73.12a32 32 0 0 1-1.6-26.816c19.36-49.28 28.32-113.6 12.032-178.816-19.52-78.816-53.408-124.16-104.224-160.128-38.336-27.488-70.272-38.592-117.76-45.568a32 32 0 0 1-26.816-25.664c0.32 2.432 0.544 3.008 0.768 3.424a133.984 133.984 0 0 0-8.288-9.28 486.304 486.304 0 0 0-26.976-25.504 124.16 124.16 0 0 1-17.152 41.728 32 32 0 0 1-23.136 14.464c-50.72 6.08-84.608 16.96-124.256 45.28-56.192 41.152-89.184 83.2-108.256 160.224-14.496 58.656-9.248 114.56 6.528 166.656 3.232 2.88 5.728 5.76 8.096 10.56z" fill="#8a8a8a" p-id="2155"></path><path d="M672 512c-35.808 0-64-28.448-64-64s28.192-64 64-64 64 28.448 64 64-29.28 64-64 64z m-256-64c0 35.552-28.192 64-64 64s-64-28.448-64-64 28.192-64 64-64 64 28.448 64 64z" fill="#8a8a8a" p-id="2156"></path></svg></div>
            <div class="product">YULI CLOUD</div>
          </div>
          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default">
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formLogin.username"
                    placeholder="用户名">
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formLogin.password"
                    placeholder="密码">
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input
                    type="text"
                    v-model="formLogin.code"
                    placeholder="验证码">
                    <template slot="append">
                      <img class="login-code" src="./image/login-code.png">
                    </template>
                  </el-input>
                </el-form-item>
                <el-button
                  size="default"
                  @click="submit"
                  type="primary"
                  class="button-login">
                  登录
                </el-button>
              </el-form>
            </el-card>
            <p
              class="page-login--options"
              flex="main:justify cross:center">
              <span><fa-icon name="question-circle"/> 忘记密码</span>
              <span>注册用户</span>
            </p>
            <!-- quick login -->
            <el-button class="page-login--quick" size="default" type="info" @click="dialogVisible = true">
              快速选择用户（测试功能）
            </el-button>
          </div>
        </div>
        <div class="page-login--content-footer">
          <p class="page-login--content-footer-locales"></p>
          <p class="page-login--content-footer-copyright">
            Copyright
            <fa-icon name="copyright"/>
            2018 D2 Projects 开源组织出品
            <a href="https://github.com/FairyEver">
              @FairyEver
            </a>
          </p>
          <p class="page-login--content-footer-options">
            <a href="#">帮助</a>
            <a href="#">隐私</a>
            <a href="#">条款</a>
          </p>
        </div>
      </div>
    </div>
    <el-dialog
      title="快速选择用户"
      :visible.sync="dialogVisible"
      width="400px">
      <el-row :gutter="10" style="margin: -20px 0px -10px 0px;">
        <el-col v-for="(user, index) in users" :key="index" :span="8">
          <div class="page-login--quick-user" @click="handleUserBtnClick(user)">
            <fa-icon name="user-circle-o"/>
            <span>{{user.name}}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: 'Admin',
          username: 'admin',
          password: 'admin'
        },
        {
          name: 'Editor',
          username: 'editor',
          password: 'editor'
        },
        {
          name: 'User1',
          username: 'user1',
          password: 'user1'
        }
      ],
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
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('sys/account', [
      'login'
    ]),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
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

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
  }
  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 280px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 .5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
  .product-info {
    height: 64px;
    display: flex;
    justify-content: center;
    line-height: 64px;
    margin-bottom: 2rem;
    font-size: 2rem;
    flex-direction: row;
    .product {
      margin-left: 1rem;
    }
  }
}
</style>
