<!-- 
  @Author: hmf
  @CreateDate: 2022-06-20
  @FilePath: src\views\login\index.vue
  @Describe: 登陆页面
-->
<template>
  <div class="broadcast-login">
    <div class="broadcast-login-header">
      <div class="login-header-functron">
        <el-icon @click="handleMinimize"><Minus /></el-icon>
        <el-icon @click="register"><FullScreen /></el-icon>
        <el-icon @click="close"><Close /></el-icon>
      </div>
      <div class="login-header-logo">
        <img class="logo-imag" src="@/assets/images/login-logo.png" />
        <h2>IP广播</h2>
      </div>
      <svg viewBox="0 0 120 16">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="1"
              result="blur"
            ></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="goo"
              values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 13 -9"
            ></feColorMatrix>
            <xfeblend in="SourceGraphic" in2="goo"></xfeblend>
          </filter>
          <path
            id="wave"
            d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"
          ></path>
        </defs>
        <use id="wave3" class="wave" xlink:href="#wave" x="0" y="-1"></use>
        <use id="wave2" class="wave" xlink:href="#wave" x="0" y="0"></use>
        <use id="wave1" class="wave" xlink:href="#wave" x="0" y="1"></use>
      </svg>
    </div>
    <div class="broadcast-login-from">
      <div class="login-from-name">
        <el-input
          v-model="modelRef.username"
          placeholder="账号"
          :prefix-icon="Avatar"
        />
      </div>
      <div class="login-from-password">
        <el-input
          v-model="modelRef.password"
          placeholder="密码"
          :prefix-icon="Briefcase"
        />
      </div>
      <div class="login-from-remember_password">
        <el-checkbox v-model="is_checked" label="记住密码" />
      </div>
      <div class="login-from-server">
        <el-input
          v-model="modelRef.server_ip_address"
          placeholder="服务器地址"
          :prefix-icon="Briefcase"
        />
      </div>
    </div>
    <div class="broadcast-login-sign">
      <el-button type="primary" @click="submit">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Avatar, Briefcase } from "@element-plus/icons-vue";

const $useRouter = useRouter();

// 表单值
const modelRef = reactive({
  username: "",
  password: "",
  server_ip_address: "",
});
// 记住密码
const is_checked = ref(false);

// mounted 实例挂载完成后被调用
onMounted(() => {
  window.electronAPI.send("login-window");
});

// 隐藏
const handleMinimize = () => {
  window.electronAPI.send("minimize");
};
const register = () => {
  window.electronAPI.send("register-window");
};
// 关闭
const close = () => {
  window.electronAPI.send("close");
};
// 提交
const submit = () => {
  $useRouter.push("/terminal");
};
</script>

<style lang="scss">
.broadcast-login {
  width: 320px;
  height: 530px;
  background-color: #fff;
  border-radius: 8px;
  .broadcast-login-header {
    position: relative;
    -webkit-app-region: drag;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
  }
  svg {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: visible;
    bottom: 0;
  }
  .wave {
    animation: wave 4s linear;
    animation-iteration-count: infinite;
  }
  #wave1 {
    fill: #fff;
  }
  #wave2 {
    animation-duration: 5s;
    animation-direction: reverse;
    fill: #7dc3fb;
    opacity: 0.6;
  }
  #wave3 {
    animation-duration: 6s;
    fill: #40a3f8;
    opacity: 0.4;
  }
  @keyframes wave {
    to {
      transform: translateX(-100%);
    }
  }
  @keyframes ball {
    to {
      transform: translateY(20%);
    }
  }
  .login-header-functron {
    -webkit-app-region: no-drag;
    width: 80px;
    height: 44px;
    display: flex;
    align-items: center;
    float: right;
    font-size: 16px;
    color: #fff;
    i {
      flex: 1;
    }
  }
  .login-header-logo {
    padding: 60px 0;
    background: linear-gradient(180deg, #2276f3 0%, #2aa0f8 100%);
    h2 {
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
      color: #fff;
    }
  }
  .broadcast-login-from {
    padding-top: 22px;
    text-align: center;
    .el-input {
      padding-top: 8px;
      width: 240px;
      .el-input__wrapper {
        height: 36px;
        border-bottom: 1px solid #dddddd;
        box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color))
          inset;
      }
    }
    .login-from-remember_password {
      margin: 0 auto;
      width: 240px;
      text-align: right;
    }
  }
  .broadcast-login-sign {
    padding-top: 26px;
    .el-button {
      width: 240px;
      height: 36px;
      background-color: #0070ee;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
