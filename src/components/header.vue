<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\components\header.vue
  @Describe: 首页头部
-->
<template>
  <div class="broadcast-header">
    <h2>{{ $t("IP network broadcasting system") }}</h2>
    <div class="broadcast-header-function">
      <div class="broadcast-header-function-user">
        <el-dropdown @command="handleCommandUser">
          <span class="el-dropdown-link">
            {{ form.userName }}
            <el-icon>
              <ArrowDownBold />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="simplified">
                {{ $t("Modify account") }}
              </el-dropdown-item>
              <el-dropdown-item command="character">
                {{ $t("Change password") }}
              </el-dropdown-item>
              <el-dropdown-item command="about">
                {{ $t("About") }}
              </el-dropdown-item>
              <el-dropdown-item command="english">
                {{ $t("Exit") }}
              </el-dropdown-item>
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
        <!-- <el-icon>
          <template #default>
            <span class="iconfont icon-skin"></span>
          </template>
        </el-icon> -->
        <el-icon @click="handleMinimize">
          <template #default>
            <span class="iconfont icon-minimize"></span>
          </template>
        </el-icon>
        <el-icon @click="handleMaxMin">
          <template #default>
            <span
              class="iconfont"
              :class="form.isShowMaximize ? 'icon-enlarge' : 'icon-win'"
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
    <!-- 修改账号名称 -->
    <change-account
      :isShow="form.accountDialogVisible"
      @show="handleAccountDialogVisible"
    />
    <!-- 修改账号密码 -->
    <change-password
      :isShow="form.passwordDialogVisible"
      :isFirstUse="form.isFirstUse"
      @show="handlePasswordDialogVisible"
      @signOut="handleSignOut"
    />
    <!-- 关于 -->
    <el-dialog
      v-model="form.aboutDialogVisible"
      :title="$t('About')"
      width="450px"
      @close="form.aboutDialogVisible = false"
      class="com-default-dialog"
    >
      <div class="com-default-dialog-test">
        <div class="com-default-dialog-content">
          <p>
            {{ $t("Name") }}:
            {{ $t("IP network broadcasting system sub-control software") }}
          </p>
          <p>
            {{ $t("Current version") }} : V3.0 ( {{ $t("Build") }} : V{{ form.version }}
            )
          </p>
        </div>
      </div>
    </el-dialog>
    <!-- 退出登录 -->
    <el-dialog
      v-model="form.signOutDialogVisible"
      :title="$t('Warning')"
      width="450px"
      @close="form.signOutDialogVisible = false"
      class="com-default-dialog"
    >
      <div class="com-default-dialog-test">
        <div class="com-default-dialog-content">
          <p>{{ $t("Are you about to log out") }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="form.signOutDialogVisible = false">
            {{ $t("Cancel") }}
          </el-button>
          <el-button type="primary" @click="handleLogOut">
            {{ $t("Confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { send } from "@/utils/socket";
import { UsersService } from "@/utils/api/users/index";

// defineAsyncComponent 异步组件-懒加载子组件
const changeAccount = defineAsyncComponent(
  () => import("@/components/change_account/account.vue")
);
const changePassword = defineAsyncComponent(
  () => import("@/components/change_account/password.vue")
);

const lang = getStore.useLanguageStore();
// 计算属性 computed
const langStore = computed(() => {
  return lang.language;
});

const form = reactive({
  isShowMaximize: false, // 是否最大化
  version: "3.0.2", // 版本
  languagesList: {}, // 多语言列表
  selectedLang: "zh-cn", // 选中语言
  accountDialogVisible: false, // 编辑账号名称弹窗
  passwordDialogVisible: false, // 编辑账号密码弹窗
  aboutDialogVisible: false, // 关于弹窗
  signOutDialogVisible: false, // 退出登录弹窗
  isFirstUse: false, // 是否第一次使用系统
  userName: "", // 用户名称
});
// 处理下拉框点击事件
const handleCommandUser = (command: string | number | object) => {
  if (command === "simplified") {
    form.accountDialogVisible = true;
  }
  if (command === "character") {
    form.passwordDialogVisible = true;
  }
  if (command === "about") {
    form.aboutDialogVisible = true;
  }
  if (command === "english") {
    form.signOutDialogVisible = true;
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
// 处理编辑账号名称弹窗的响应展示/关闭
const handleAccountDialogVisible = (value: boolean) => {
  form.accountDialogVisible = value;
};
// 处理编辑账号密码弹窗的响应展示/关闭
const handlePasswordDialogVisible = (value: boolean) => {
  form.passwordDialogVisible = value;
};
// 处理账号密码弹窗-退出登录
const handleSignOut = () => {
  handleLogOut();
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
      form.userName = result.data.name;
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
  getStore.useSystemStore().getConfigInfo(); //获取系统配置
  getUserMe(); //获取账号信息
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
