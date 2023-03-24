<!-- 
  @Author: hmf
  @CreateDate: 2022-06-22
  @FilePath: src\components\register.vue
  @Describe: 注册
-->
<template>
  <div class="broadcast-register">
    <div class="broadcast-register-header">
      <el-icon @click="close">
        <template #default>
          <span class="iconfont icon-clear"></span>
        </template>
      </el-icon>
      <img class="logo-imag" src="@/assets/images/login-logo.png" />
      <div
        class="broadcast-register-meagess"
        v-if="!isShowRegister"
      >
        <p>
          {{ $t("Trial Expiration Prompt") }}
          <span>{{ registerStatus?.freeTime }}</span>
          {{ $t("Day") }}
        </p>
      </div>
      <div class="broadcast-register-from" v-else>
        <h3>{{ $t("Software registration") }}</h3>
        <div class="broadcast-register-machine-code">
          <span>{{ $t("Machine code") }}</span>
          <span>{{ registerStatus?.ProductKey }}</span>
        </div>
        <div class="broadcast-register-registration-code">
          <span>{{ $t("Registration code") }}</span>
          <el-input v-model="code" :placeholder="$t('Please enter')" />
        </div>
      </div>
      <div class="broadcast-register-button">
        <template v-if="!isShowRegister">
          <el-button class="button-cancel" @click="close">
            {{ $t("On trial") }}
          </el-button>
          <el-button type="primary" @click="isShowRegister = true">
            {{ $t("Register") }}
          </el-button>
        </template>
        <template v-else>
          <el-button class="button-cancel" @click="close">
            {{ $t("Cancel") }}
          </el-button>
          <el-button type="primary" @click="submit" :disabled="code === ''">
            {{ $t("Determine") }}
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
const registerStatus: any = ref({})

// 当前是否呈现注册页面
const isShowRegister = ref(false)
const code = ref("");

// 获取注册状态
const gitRegisterStatus = () => {
  proxy.$http1.get("/register").then((result: any) => {
    if (result.result === 200) {
      registerStatus.value = result.data;
      if (registerStatus.value?.freeTime === 0) {
        isShowRegister.value = true;
      }
    }
  });
};
// 提交
const submit = () => {
  proxy.$http1
    .post("/register", {
      code: code.value,
    })
    .then((result: any) => {
      if (result.result === 200) {
        window.electronAPI.send("register-success");
        close()
      }
    })
};
// 关闭
const close = () => {
  window.electronAPI.send("register-close");
  if (registerStatus.value?.freeTime === 0) {
    //未注册，使用时长为0，关闭时连带关闭主窗口
    window.electronAPI.send("close");
  }
};
onMounted(() => {
  gitRegisterStatus();
});
</script>

<style lang="scss" scoped>
.broadcast-register {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  margin: 2px;
  border-radius: 4px;
  background-color: $c-fff;
  text-align: center;
  // -webkit-app-region: drag;
  box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.05),
    1px 2px 7px 0px rgba(120, 120, 120, 0.1);
  .el-icon {
    position: absolute;
    top: 12px;
    right: 20px;
    font-size: 20px;
    color: $c-000;
  }
  .logo-imag {
    padding-top: 10px;
    -webkit-app-region: drag;
  }
  .broadcast-register-meagess {
    padding: 20px 0;
    p {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      line-height: 21px;
      color: #000000;
      // text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
    }
  }
  .broadcast-register-from {
    width: 390px;
    margin: 0 auto;
    h3 {
      padding: 8px 0;
      color: #000000;
      line-height: 19px;
      font-size: 14px;
    }
    > div {
      padding: 11px 0;
      text-align: left;
    }
    .broadcast-register-machine-code {
      font-size: 14px;
      color: #000000;
      span {
        &:nth-child(1) {
          padding-right: 28px;
        }
        &:nth-child(2) {
          font-size: 12px;
        }
      }
    }
    .broadcast-register-registration-code {
      font-size: 14px;
      color: #000000;
      span {
        &:nth-child(1) {
          padding-right: 17px;
        }
      }
      .el-input {
        width: 300px;
        height: 30px;
      }
    }
  }
  .broadcast-register-button {
    position: absolute;
    bottom: 24px;
    width: 99%;
    text-align: center;
    .button-cancel {
      color: #7992d5;
      background-color: #e1eafd;
      border-color: #e1eafd;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
  }
}
</style>
