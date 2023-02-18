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
        v-if="registerStatus?.freeTime > 0 && !isRegister"
      >
        <p>
          请联系厂商注册，软件剩余体验
          <span>{{ registerStatus?.freeTime }}</span>
          天
        </p>
      </div>
      <div class="broadcast-register-from" v-else>
        <h3>软件注册</h3>
        <div class="broadcast-register-machine-code">
          <span>机器码</span>
          <span>{{ registerStatus?.ProductKey }}</span>
        </div>
        <div class="broadcast-register-registration-code">
          <span>注册码</span>
          <el-input v-model="code" placeholder="请输入注册码" />
        </div>
      </div>
      <div class="broadcast-register-button">
        <span class="button-cancel" v-if="!isRegister" @click="close"
          >试用</span
        >
        <span
          class="button-submit"
          v-if="!isRegister"
          @click="isRegister = true"
          >注册</span
        >
        <span class="button-cancel" v-if="isRegister" @click="close">取消</span>
        <span class="button-submit" v-if="isRegister" @click="submit"
          >确定</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const registerStatus: any = ref({});
const isRegister = ref(false);
const code = ref("");

// 获取注册状态
const gitRegisterStatus = () => {
  proxy.$http1.get("/register").then((result: any) => {
    if (result.result === 200) {
      registerStatus.value = result.data;
      if (registerStatus.value?.freeTime === 0) {
        isRegister.value = true;
      }
    }
  });
};
// 提交
const submit = () => {
  // window.electronAPI.send("register-success")
  if (code.value === "") {
    return proxy.$message.warning("请输入注册码");
  }
  proxy.$http1
    .post("/register", {
      code: code.value,
    })
    .then((result: any) => {
      if (result.result === 200) {
        close();
      }
    });
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
  height: 100%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5),
    0px 2px 14px 0px rgba(120, 120, 120, 0.5);
  border-radius: 4px;
  background-color: $c-fff;
  text-align: center;
  //   -webkit-app-region: drag;
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
    > span {
      display: inline-block;
      width: 70px;
      height: 30px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 30px;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    .button-cancel {
      color: #7992d5;
      background-color: #e1eafd;
      margin-right: 10px;
    }
    .button-submit {
      color: #ffffff;
      background-color: #0070ee;
    }
  }
}
</style>
