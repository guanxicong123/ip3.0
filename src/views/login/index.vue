<!-- 
  @Author: hmf
  @CreateDate: 2022-06-20
  @FilePath: src\views\login\index.vue
  @Describe: 登陆页面
-->
<template>
  <div class="broadcast-login" @keyup.enter="submit">
    <div class="broadcast-login-header">
      <div class="login-header-functron">
        <el-icon @click="handleMinimize">
          <template #default>
            <span class="iconfont icon-minimize"></span>
          </template>
        </el-icon>
        <el-icon>
          <template #default>
            <span class="iconfont icon-set-up"></span>
          </template>
        </el-icon>
        <el-icon @click="close">
          <template #default>
            <span class="iconfont icon-clear"></span>
          </template>
        </el-icon>
      </div>
      <div class="login-header-logo">
        <img class="logo-imag" src="@/assets/images/logo-login.png" alt="logo" />
        <h2>{{ $t("IP network broadcasting") }}</h2>
      </div>
      <svg viewBox="0 0 120 16" class="svg">
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
          auto-complete="off"
          v-model.trim="modelRef.name"
          :disabled="isLogin"
          :maxlength="100"
          :placeholder="$t('Please enter the account number')"
          clearable
          :spellcheck="false"
        >
          <template #prefix>
            <i class="iconfont icon-user"></i>
          </template>
        </el-input>
      </div>
      <div class="login-from-password">
        <el-input
          type="password"
          v-model="modelRef.password"
          :disabled="isLogin"
          :maxlength="20"
          :placeholder="$t('Please input a password')"
          clearable
          show-password
          auto-complete="new-password"
          oncopy="return false"
          ondragstart="return false"
          onselectstart="return false"
          :spellcheck="false"
        >
          <template #prefix>
            <i class="iconfont icon-password"></i>
          </template>
        </el-input>
      </div>
      <div class="login-from-remember_password">
        <el-checkbox v-model="is_checked" :label="$t('Remember password')" />
      </div>
      <div class="login-from-server">
        <el-input
          v-model="modelRef.server_ip_address"
          :placeholder="$t('Server address')"
          :disabled="isLogin"
        >
          <template #prefix>
            <i class="iconfont icon-the-server"></i>
          </template>
        </el-input>
      </div>
    </div>
    <div class="broadcast-login-register">
      <span
        v-if="!registerStatus?.isRegister && registerStatus?.freeTime === 0"
        class="register-no"
      >
        {{ $t("Unregistered") }}
      </span>
      <span
        v-if="!registerStatus?.isRegister && registerStatus?.freeTime > 0"
        class="register-lifespan"
      >
        {{ $t("Term of validity") }} :&nbsp;
        {{ usePublicMethod.specifyDate(registerStatus?.freeTime) }}
      </span>
      <span v-if="registerStatus?.isRegister" class="register-lifespan">
        {{ $t("Term of validity") }} : 0000-00-00
      </span>
    </div>
    <div class="broadcast-login-sign">
      <el-button type="primary" @click="submit" :loading="isLogin">
        {{ $t("Sign in") }}
      </el-button>
    </div>
    <div class="broadcast-login-edition">V3.0.2</div>
  </div>
</template>

<script lang="ts" setup>
import { socketLogin, socket } from "@/utils/socket";
import usePublicMethod from "@/utils/global/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const store = getStore.useAppStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const isWebsocekt = computed(() => {
  return store.is_websocekt;
}); //ws连接状态
const isLogin = computed(() => {
  return store.is_login;
}); //是否登录
const isRegistrationWindow = computed(() => {
  return store.is_registration_window;
}); //是否显示注册窗口


// 表单值
const modelRef = reactive({
  name: localStorage.get("username") || "",
  password: "",
  server_ip_address: localStorage.get("serverIP") || "",
});
// 记住密码
const is_checked = ref(false);
const registerStatus: any = ref({});

watch(
  () => modelRef.name,
  () => {
    modelRef.password = "";
    is_checked.value = false;
  }
);

// 隐藏
const handleMinimize = () => {
  window.electronAPI.send("minimize");
};
// 关闭
const close = () => {
  window.electronAPI.send("close");
};
// 注册触发事件
window.electronAPI.handleRegisterRefresh((event: any, value: any) => {
  gitRegisterStatus();
});
// 获取注册状态
const gitRegisterStatus = () => {
  return new Promise<void>((resolve, reject) => {
      proxy.$http1.get("/register").then((result: any) => {
        if (result.result === 200) {
          registerStatus.value = result.data;
          if (!registerStatus.value.isRegister) {
            resolve();
          }
        }
      });
  });
};
// 提交
const submit = () => {
  if (!registerStatus.value?.isRegister && registerStatus.value?.freeTime === 0)
    return proxy.$message.warning(proxy.$t("Unregistered"));
  if (!modelRef.name)
    return proxy.$message.warning(proxy.$t("Please enter the account number"));
  if (!modelRef.password)
    return proxy.$message.warning(proxy.$t("Please input a password"));
  if (!modelRef.server_ip_address)
    return proxy.$message.warning(proxy.$t("Please enter the server address"));
  let data = {
    company: "BL",
    actioncode: "c2ms_user_login",
    token: "",
    data: {
      UserName: modelRef.name,
      Password: modelRef.password,
      Platform: "PC",
      HostIP: modelRef.server_ip_address,
      ForceLogin: false,
      server: modelRef.server_ip_address + ":51330",
    },
    result: 0,
    return_message: "",
  };
  store.changeLoginStatus(true);
  socketLogin(data);
  localStorage.set("serverIP", modelRef.server_ip_address);
  localStorage.set("username", modelRef.name);
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  gitRegisterStatus().then(() => {
    if (isRegistrationWindow.value) {
      window.electronAPI.send("register-window");
      store.changeRegistrationWindow(false)
    }
  });
  if (socket) {
    socket.close();
  }
  window.electronAPI.send("login-window");
  if (localStorage.get("password")) {
    modelRef.password = localStorage.get("password");
    is_checked.value = true;
  }
  // 获取机器码
  systemStore.getProductKey();
});

onBeforeUnmount(() => {
  if (isWebsocekt) {
    localStorage.set("serverIP", modelRef.server_ip_address);
  }
  if (is_checked.value) {
    localStorage.set("password", modelRef.password);
  } else {
    localStorage.remove("password");
  }
});
</script>

<style lang="scss">
.broadcast-login {
  width: 100%;
  height: 100%;
  background-color: $c-fff;
  border-radius: 8px;

  .broadcast-login-header {
    position: relative;
    -webkit-app-region: drag;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
  }

  .svg {
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
    fill: $c-fff;
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
    position: absolute;
    top: 0;
    right: 10px;
    -webkit-app-region: no-drag;
    display: flex;
    align-items: center;
    width: 80px;
    height: 44px;
    font-size: 16px;
    color: $c-fff;

    i {
      flex: 1;
    }
  }

  .login-header-logo {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(180deg, #2276f3 0%, #2aa0f8 100%);

    .logo-imag {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: #fff;
    }

    h2 {
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
      color: $c-fff;
    }
  }

  .broadcast-login-from {
    padding-top: 22px;
    text-align: center;

    .el-input {
      padding-top: 8px;
      width: 240px;

      .el-input__wrapper {
        height: 28px;
        border-bottom: 1px solid #ddd;
        border-radius: 0;
        box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
      }
    }

    .login-from-remember_password {
      margin: 0 auto;
      width: 240px;
      text-align: right;
    }

    .iconfont {
      color: #9dc7f3;
    }

    .icon-the-server {
      font-size: 12px;
    }
  }

  .broadcast-login-register {
    width: 240px;
    margin: 0 auto;
    padding: 9px 0;
    text-align: right;
    font-size: 12px;
    .register-no {
      color: #ce6245;
    }
    .register-lifespan {
      color: #018cee;
    }
  }

  .broadcast-login-sign {
    text-align: center;
    padding-top: 12px;

    .el-button {
      width: 240px;
      height: 36px;
      background-color: #0070ee;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .broadcast-login-edition {
    padding-top: 14px;
    text-align: center;
    color: #999999;
  }
}
</style>
