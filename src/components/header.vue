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
              <span class="iconfont icon-language"></span>
            </template>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="(item, index) in form.languagesList" :key="item">
                <el-dropdown-item
                  :command="index"
                  :class="{ theme: form.selectedLang == index }"
                >
                  {{ item }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-icon>
          <template #default>
            <span class="iconfont icon-skin"></span>
          </template>
        </el-icon>
        <el-icon @click="handleMinimize">
          <template #default>
            <span class="iconfont icon-minimize"></span>
          </template>
        </el-icon>
        <el-icon @click="handleMaxMin">
          <template #default>
            <span
              class="iconfont"
              :class="form.isShowMaximize ? 'icon-win' : 'icon-enlarge'"
            ></span>
          </template>
        </el-icon>
        <el-icon @click="close">
          <template #default>
            <span class="iconfont icon-close"></span>
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
      <el-form
        ref="ruleFormNameRef"
        :rules="rulesName"
        :model="userNameForm"
        v-loading="loadingUserPass"
        element-loading-text="Loading..."
      >
        <el-form-item prop="name">
          <el-input
            type="text"
            auto-complete="off"
            v-model="userNameForm.name"
            :maxlength="100"
            placeholder="请输入 1-100 字母/数字/_组合"
            clearable
            suffix-icon=""
            :spellcheck="false"
          >
            <template #prefix>
              <i class="iconfont icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              dialogUserName = false;
              userNameForm.name = '';
            "
          >
            {{ $t("Cancel") }}
          </el-button>
          <el-button type="primary" @click="handleChangeUser(ruleFormNameRef)">
            {{ $t("Confirm") }}
          </el-button>
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
          <el-button @click="dialogUserPass = false">{{ $t("Cancel") }}</el-button>
          <el-button type="primary" @click="handleChangeUserPass(ruleFormRef)">
            {{ $t("Confirm") }}
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
          <p>
            {{ $t("Current version") }} : V3.0 ( {{ $t("Build") }} : V{{ form.version }}
            )
          </p>
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
          <el-button @click="dialogLogOut = false">{{ $t("Cancel") }}</el-button>
          <el-button type="primary" @click="handleLogOut">{{ $t("Confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from "element-plus";
import { send } from "@/utils/socket";
import { UsersService } from "@/utils/api/users/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const lang = getStore.useLanguageStore();
// 计算属性 computed
const langStore = computed(() => {
  return lang.language;
});

const $useRouter = useRouter();

const form = reactive({
  isShowMaximize: false, // 是否最大化
  version: "3.0.2", // 版本
  languagesList: {}, // 多语言列表
  selectedLang: "zh-cn", // 选中语言
});
const username = localStorage.get("username");
const dialogUserName = ref(false); //修改用户弹框
const dialogUserPass = ref(false); //修改密码弹框
const loadingUserPass = ref(false); //密码提交时加载
const ruleFormRef = ref<FormInstance>();
const userPasswordForm = reactive({
  old_password: "",
  password: "",
  confirm_password: "",
});
const ruleFormNameRef: any = ref<FormInstance>();
const userNameForm = reactive({
  name: "",
});
const dialogVersionNo = ref(false); //关于弹框
const dialogLogOut = ref(false); //退出登录弹框

watch(dialogUserName, (newVal) => {
  if (!newVal) {
    ruleFormNameRef.value?.resetFields();
  }
});
watch(dialogUserPass, (newVal) => {
  if (!newVal) {
    ruleFormRef.value?.resetFields();
  }
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
const handleCommand = (command: string) => {
  console.log(form.selectedLang, command);
  if (form.selectedLang != command) {
    form.selectedLang = command;
    localStorage.set("lang", command);
    getStore.useLanguageStore().updateLanguage(command);
    window.location.reload();
  }
};
// 隐藏
const handleMinimize = () => {
  window.electronAPI.send("minimize");
};
// 最大化、最小化
const handleMaxMin = () => {
  if (form.isShowMaximize) {
    window.electronAPI.send("unmaximize");
    form.isShowMaximize = false;
  } else {
    window.electronAPI.send("maximize");
    form.isShowMaximize = true;
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
const handleChangeUser = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      proxy.$http
        .put("/me", {
          name: userNameForm.name,
        })
        .then((result: any) => {
          if (result.result === 200) {
            proxy.$message.success("修改用户名成功,跳转至登录页面");
            setTimeout(() => {
              usePublicMethod.signOut();
            }, 1000);
          }
        });
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
            usePublicMethod.signOut();
          }, 3000);
        }
      });
    }
  });
};
// 退出登录
const handleLogOut = () => {
  let data = {
    company: "BL",
    actioncode: "c2ms_user_logout",
    token: "",
    data: {},
    result: 0,
    return_message: "",
  };
  send(data);
  usePublicMethod.signOut();
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
const validateUserName = (rule: any, value: any, callback: any) => {
  const validate = /^[A-Za-z0-9_]{1,100}$/;
  if (!value) {
    return callback(new Error("请输入账号"));
  } else if (!validate.test(value)) {
    return callback(new Error("请输入 1-100 字母/数字/_组合"));
  }
  callback();
};
const rules = reactive<FormRules>({
  old_password: [{ validator: validateOldPassword, trigger: "blur", required: true }],
  password: [{ validator: validatePassword, trigger: "blur", required: true }],
  confirm_password: [
    { validator: validateConfirmPassword, trigger: "blur", required: true },
  ],
});
const rulesName = reactive<FormRules>({
  name: [{ validator: validateUserName, trigger: "blur", required: true }],
});
// 获取账号信息
const getUserMe = () => {
  UsersService.getUsersMe({
    withRoles: true,
    withUsersConfig: true,
  })
    .then((result) => {
      const user = {
        user: result.data,
      };
      getStore.useUserStore().updateUser(user);
    })
    .catch(() => {});
};

// 监听变化
watch(
  [langStore],
  ([newLang], [oldLang]) => {
    if (newLang != oldLang) {
      form.languagesList = newLang.languagesMap;
      form.selectedLang = newLang.language;
      form.version = newLang.version;
    }
  },
  {
    // 初始化立即执行
    immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  getUserMe();
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
