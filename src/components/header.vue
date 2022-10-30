<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\components\header.vue
  @Describe: 首页头部
-->
<template>
  <div class="broadcast-header">
    <h2>IP网络广播系统</h2>
    <div class="broadcast-header-function">
      <div class="broadcast-header-function-user">
        <el-dropdown @command="handleCommandUser">
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon>
              <ArrowDownBold />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="simplified">修改账号</el-dropdown-item>
              <el-dropdown-item command="character">修改密码</el-dropdown-item>
              <el-dropdown-item command="about">关于</el-dropdown-item>
              <el-dropdown-item command="english">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="broadcast-header-function-window">
        <el-dropdown @command="handleCommand">
          <el-icon>
            <template #default>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-language"></use>
              </svg>
            </template>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="simplified">中文简体</el-dropdown-item>
              <el-dropdown-item command="character">中文繁体</el-dropdown-item>
              <el-dropdown-item command="singGion">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-icon>
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-skin"></use>
            </svg>
          </template>
        </el-icon>
        <el-icon @click="handleMinimize">
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-minimize"></use>
            </svg>
          </template>
        </el-icon>
        <el-icon @click="handleMaxMin">
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-win"></use>
            </svg>
          </template>
        </el-icon>
        <el-icon @click="close">
          <template #default>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close"></use>
            </svg>
          </template>
        </el-icon>
      </div>
    </div>
    <el-dialog
      v-model="dialogUserName"
      title="修改账号"
      width="30%"
      :before-close="handleClose"
      class="com-default-dialog"
    >
      <el-input
        type="text"
        auto-complete="off"
        v-model="name"
        :maxlength="100"
        placeholder="请输入账号"
        clearable
        suffix-icon=""
      >
        <template #prefix>
          <i class="iconfont icon-user"></i>
        </template>
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUserName = false">取消</el-button>
          <el-button type="primary" @click="handleChangeUser">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogUserPass"
      title="修改密码"
      width="30%"
      :before-close="handleClose"
      class="com-default-dialog"
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="userPasswordForm"
        v-loading="loadingUserPass"
        element-loading-text="Loading..."
      >
        <el-form-item prop="old_password">
          <el-input
            type="password"
            v-model.trim="userPasswordForm.old_password"
            :maxlength="20"
            placeholder="请输入旧密码"
            clearable
            show-password
            auto-complete="new-password"
            oncopy="return false"
            onpaste="return false"
            ondragstart="return false"
            onselectstart="return false"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model.trim="userPasswordForm.password"
            :maxlength="20"
            placeholder="输入新密码"
            clearable
            show-password
            auto-complete="new-password"
            oncopy="return false"
            onpaste="return false"
            ondragstart="return false"
            onselectstart="return false"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirm_password">
          <el-input
            type="password"
            v-model.trim="userPasswordForm.confirm_password"
            :maxlength="20"
            placeholder="确认输入新密码"
            clearable
            show-password
            auto-complete="new-password"
            oncopy="return false"
            onpaste="return false"
            ondragstart="return false"
            onselectstart="return false"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUserPass = false">取消</el-button>
          <el-button type="primary" @click="handleChangeUserPass(ruleFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVersionNo"
      title="关于"
      width="30%"
      :before-close="handleClose"
      class="com-default-dialog"
    >
      <div class="com-default-dialog-test">
        <div class="com-default-dialog-content">
          <p>名称：IP网络广播系统分控软件</p>
          <p>软件 版本：2.03（内部版本2.111）</p>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialogLogOut"
      title="警告"
      width="30%"
      :before-close="handleClose"
      class="com-default-dialog"
    >
      <div class="com-default-dialog-test">
        <div class="com-default-dialog-content">
          <p>即将退出登录？</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogLogOut = false">取消</el-button>
          <el-button type="primary" @click="handleLogOut">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from "element-plus";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const $useRouter = useRouter();

const data = reactive({
  isShowMaximize: false,
});
const username = localStorage.get("username");
const name = ref("");
const dialogUserName = ref(false); //修改用户弹框
const dialogUserPass = ref(false); //修改密码弹框
const loadingUserPass = ref(false); //密码提交时加载
const ruleFormRef = ref<FormInstance>();
const userPasswordForm = reactive({
  old_password: "",
  password: "",
  confirm_password: "",
});
const dialogVersionNo = ref(false); //关于弹框
const dialogLogOut = ref(false); //退出登录弹框

// mounted 实例挂载完成后被调用
onMounted(() => {
  console.log(data);
});
const handleCommandUser = (command: string | number | object) => {
  if (command === "simplified") {
    dialogUserName.value = true;
  }
  if (command === "character") {
    dialogUserPass.value = true;
  }
  if (command === "about") {
    dialogVersionNo.value = true;
  }
  if (command === "english") {
    dialogLogOut.value = true;
  }
};
// 切换语言文本
const handleCommand = (command: string | number | object) => {
  console.log(command);
};
// 隐藏
const handleMinimize = () => {
  window.electronAPI.send("minimize");
};
// 最大化、最小化
const handleMaxMin = () => {
  if (data.isShowMaximize) {
    window.electronAPI.send("unmaximize");
    data.isShowMaximize = false;
  } else {
    window.electronAPI.send("maximize");
    data.isShowMaximize = true;
  }
};
// 关闭
const close = () => {
  window.electronAPI.send("close");
};
const handleClose = () => {
  dialogUserName.value = false;
  dialogUserPass.value = false;
  dialogVersionNo.value = false;
  dialogLogOut.value = false;
};
const handleChangeUser = () => {
  if (name.value === "") {
    return proxy.$message.error("请输入账号");
  }
  proxy.$http
    .put("/me", {
      name: name.value,
    })
    .then((result: any) => {
      if (result.result === 200) {
        proxy.$message.success("修改用户名成功,跳转至登录页面");
        setTimeout(() => {
          $useRouter.push("/");
        }, 1000);
      }
    });
};
// 修改用户密码
const handleChangeUserPass = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (loadingUserPass.value) return;
      loadingUserPass.value = true;
      proxy.$http.put("/me/password", userPasswordForm).then((result: any) => {
        if (result.result === 200) {
          proxy.$message.success("修改密码成功,将跳转至登录页面");
          loadingUserPass.value = false;
          setTimeout(() => {
            $useRouter.push("/");
          }, 3000);
        }
      });
    }
  });
};
// 退出登录
const handleLogOut = () => {
  $useRouter.push("/");
};
// 验证
const validateOldPassword = (rule: any, value: any, callback: any) => {
  userPasswordForm.old_password = value = useRegex.replacePassword(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error("请输入"));
  } else if (value.length < 6) {
    return callback(new Error("请输入 6-20 字母/数字/符号组合"));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: any, callback: any) => {
  userPasswordForm.password = value = useRegex.replacePassword(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error("请输入"));
  } else if (value.length < 6) {
    return callback(new Error("请输入 6-20 字母/数字/符号组合"));
  } else {
    if (value.length >= 6 && value === userPasswordForm.confirm_password) {
      ruleFormRef.value?.validateField("confirm_password");
    }
    callback();
  }
};
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  userPasswordForm.confirm_password = value = useRegex.replacePassword(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error("请输入"));
  } else if (value.length < 6) {
    return callback(new Error("请输入 6-20 字母/数字/符号组合"));
  } else if (value !== userPasswordForm.password) {
    return callback(new Error("确认密码与登录密码不一致"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  old_password: [{ validator: validateOldPassword, trigger: "blur", required: true }],
  password: [{ validator: validatePassword, trigger: "blur", required: true }],
  confirm_password: [
    { validator: validateConfirmPassword, trigger: "blur", required: true },
  ],
});
</script>

<style lang="scss" scoped>
.broadcast-header {
  height: 100%;
  -webkit-app-region: drag;

  h2 {
    float: left;
    color: $c-666;
    font-size: 18px;
    line-height: 44px;
    font-weight: bold;
  }

  .broadcast-header-function {
    -webkit-app-region: no-drag;
    float: right;
    display: flex;
    align-items: center;

    .broadcast-header-function-window {
      width: 155px;
      height: 100%;
      display: flex;
      align-items: center;
      border-left: 2px solid $c-999;

      > div {
        flex: 1;
      }

      i {
        flex: 1;
        margin-left: 15px;
        font-size: 16px;
        color: $c-666;
        cursor: pointer;
      }
    }

    .broadcast-header-function-user {
      display: inline-block;
      margin-right: 15px;

      .el-dropdown-link {
        line-height: 44px;
        font-size: 12px;
      }
    }
  }
}
</style>
