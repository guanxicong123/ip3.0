<!-- 
  @Author: hmf
  @CreateDate: 2022-06-22
  @FilePath: src\views\system\index.vue
  @Describe: 系统配置
-->
<template>
  <div class="com-index">
    <div class="com-main set-padding">
      <div class="com-table">
        <el-scrollbar>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">
                  {{ $t("One-button alarm configuration") }}
                </span>
              </div>
              <div class="com-button">
                <el-button type="primary" round @click="changeConfig('alarm')">
                  {{ $t("Apply") }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-form label-position="top">
              <el-row :gutter="60">
                <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-checkbox
                    v-model="form.one_key_alarm"
                    :label="$t('Enable one-button alarm function')"
                    style="margin-top: 30px"
                  />
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item :label="$t('Alarm track')">
                    <el-select v-model="form.alarm_track">
                      <el-option
                        v-for="item in form.alarmTrackOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">{{ $t("Default configuration") }}</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round @click="changeConfig('default')">
                  {{ $t("Apply") }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-form label-position="top">
              <el-row :gutter="60">
                <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item :label="$t('Device status default')">
                    <el-select v-model="form.default_terminal_status">
                      <el-option
                        v-for="(item, keys) in form.terminalStatusOptions"
                        :key="keys"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item :label="$t('Default display module')">
                    <el-select v-model="form.default_presentation_module">
                      <el-option
                        v-for="(item, keys) in form.presentationModuleOptions"
                        :key="keys"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item :label="$t('Terminal sequencing')">
                    <el-select v-model="form.default_terminal_sort">
                      <el-option
                        v-for="(item, keys) in form.terminalSortOptions"
                        :key="keys"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">{{ $t("Reminder configuration") }}</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round @click="changeConfig('remind')">
                  {{ $t("Apply") }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-checkbox-group class="check-box-group" v-model="reminder_configuration">
              <el-checkbox label="1">
                {{ $t("Enable fire alarm reminder") }}
              </el-checkbox>
              <el-checkbox label="2">
                {{ $t("Enable manual alarm reminder") }}
              </el-checkbox>
              <el-checkbox label="3">
                {{ $t("Enable terminal offline reminder") }}
              </el-checkbox>
              <el-checkbox label="4">
                {{ $t("Enable terminal offline ringtone reminder") }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">{{ $t("Function configuration") }}</span>
              </div>
              <div class="com-button">
                <!-- <el-button type="primary" round>{{ $t("Apply") }}</el-button> -->
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-button type="primary" round @click="handleFuncManage">
              {{ $t("Function management") }}
            </el-button>
            <el-button type="primary" round @click="registerManage">
              {{ $t("Registration management") }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      v-model="func_manage_dialog"
      :title="$t('Function management')"
      width="720px"
      class="func-manage-dialog"
    >
      <div class="com-head">
        <div class="com-head-content com-alert-bg">
          <div class="com-breadcrumb">
            <span class="strong">
              {{ $t("Function switch setting") }}
              <span class="">({{ $t("Modify configuration prompt") }})</span>
            </span>
          </div>
          <div class="com-button"></div>
        </div>
      </div>
      <div class="com-form">
        <el-form
          class="func-switch-class"
          label-position="right"
          :inline="true"
          label-width="97px"
        >
          <el-form-item :label="$t('Equipment status')">
            <el-switch v-model="switch_form.TerminalStateEnabled"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('Play center')">
            <el-switch v-model="switch_form.PlayCenterEnabled"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('Session status')">
            <el-switch v-model="switch_form.SessionEnabled"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('Timing task')">
            <el-switch v-model="switch_form.TimingEnabled"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('Media library')">
            <el-switch v-model="switch_form.MediasEnabled"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="com-head">
        <div class="com-head-content com-alert-bg">
          <div class="com-breadcrumb">
            <span class="strong">{{ $t("Regional options") }}</span>
          </div>
          <div class="com-button"></div>
        </div>
      </div>
      <div class="com-form">
        <el-form
          class="func-switch-class"
          label-position="right"
          :inline="true"
          label-width="97px"
        >
          <el-form-item :label="$t('Group')">
            <el-switch v-model="switch_form.GroupDisplay"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('Show remote tasks')">
            <el-switch v-model="switch_form.remoteTaskDisplay"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="com-head">
        <div class="com-head-content com-alert-bg">
          <div class="com-breadcrumb">
            <span class="strong">{{ $t("Media options") }}</span>
          </div>
          <div class="com-button"></div>
        </div>
      </div>
      <div class="com-form">
        <el-form
          class="func-switch-class"
          label-position="right"
          :inline="true"
          label-width="97px"
        >
          <el-form-item :label="$t('Media folder')">
            <el-switch v-model="switch_form.FolderDisplay"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveSet">
            {{ $t("Save and login again") }}
          </el-button>
          <el-button @click="func_manage_dialog = false">
            {{ $t("Cancel") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="register_manage_dialog"
      title=""
      width="450px"
      class="register-manage-dialog"
    >
      <div class="register-logo">
        <img class="logo-image" src="@/assets/images/logo.png" alt="logo" />
        <h2>{{ $t("Software registration") }}</h2>
      </div>
      <div class="register-content">
        <el-form class="register-form-class" label-position="left">
          <el-form-item :label="$t('Machine code')">
            <span>{{ form.ProductKey }}</span>
          </el-form-item>
          <el-form-item :label="$t('Registration code')">
            <el-input
              type="text"
              auto-complete="off"
              v-model="form.code"
              :disabled="form.codeIsDisable"
              :placeholder="$t('Please enter')"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="register_manage_dialog = false">
            {{ $t("Cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click="confirmRegister"
            :disabled="form.code.length < 1"
          >
            {{ $t("Determine") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const systemStore = getStore.useSystemStore();
const appStoreStore = getStore.useAppStore();
// 计算属性 computed
const system_configs = computed(() => {
  return systemStore.system_configs;
});
const basic_configs = computed(() => {
  return systemStore.basic_configs;
});
const functional_configs = computed(() => {
  return systemStore.functional_configs;
});

const form = reactive({
  one_key_alarm: false, // 启用一键报警功能
  alarm_track: "", // 报警曲目
  alarmTrackOptions: [
    {
      name: "",
      id: "",
    },
  ],
  default_terminal_status: 0, // 终端状态默认项
  terminalStatusOptions: [
    { value: 0, label: proxy.$t("Terminal") },
    { value: 1, label: proxy.$t("Group") },
  ],
  default_presentation_module: 0, // 默认展示模块
  presentationModuleOptions: [
    { value: 0, label: proxy.$t("Equipment status") },
    { value: 1, label: proxy.$t("Play center") },
    { value: 2, label: proxy.$t("Session status") },
    { value: 3, label: proxy.$t("Timing task") },
    { value: 4, label: proxy.$t("Media library") },
  ],
  default_terminal_sort: 0, // 默认终端排序
  terminalSortOptions: [
    { value: 0, label: proxy.$t("Equipment status") },
    { value: 1, label: proxy.$t("IP address") },
    { value: 2, label: proxy.$t("Terminal name") },
    { value: 3, label: proxy.$t("Call code") },
  ],
  reminder_configuration: [], // 提醒配置
  ProductKey: "",
  code: "",
  codeIsDisable:false
});

const func_manage_dialog = ref(false);
const register_manage_dialog = ref(false);
const reminder_configuration: any = ref([]);
// 功能管理开关数据
const switch_form = ref();
// 获取全部一键报警曲目
const getAlarmTask = () => {
  proxy.$http.get("/one-button-alarm/all").then((result: any) => {
    if (result.result === 200) {
      form.alarmTrackOptions = result.data;
    }
  });
};
// 数据填充
const formatData = () => {
  form.one_key_alarm = system_configs.value.EnabledAlarm;
  form.alarm_track =
    system_configs.value.AlarmID === 0 ? "" : system_configs.value.AlarmID;
  form.default_terminal_status = system_configs.value.TerminalStateDefaultType;
  form.default_presentation_module = system_configs.value.DefaultDisplayView;
  form.default_terminal_sort = system_configs.value.TerminalOrderbyType;
  system_configs.value.EnabledFireAlert ? reminder_configuration.value.push("1") : "";
  system_configs.value.EnabledPersonAlert ? reminder_configuration.value.push("2") : "";
  system_configs.value.EnabledTerminalOffAlert
    ? reminder_configuration.value.push("3")
    : "";
  system_configs.value.EnabledTerminalOffRingfAlert
    ? reminder_configuration.value.push("4")
    : "";
};
// 功能管理配置
const saveSet = () => {
  proxy.$http1
    .put("/config/" + basic_configs.value.ID, switch_form.value)
    .then((result: any) => {
      if (result.result === 200) {
        usePublicMethod.signOut();
      }
    });
};
// 功能管理弹窗
const handleFuncManage = () => {
  func_manage_dialog.value = true;
  switch_form.value = JSON.parse(JSON.stringify(functional_configs.value));
};
// 注册弹窗
const registerManage = () => {
  register_manage_dialog.value = true;
  // 若是永久用户，注册码自动填充且无法编辑
  if(appStoreStore.register_detail.freeTime < 0){
    form.code = appStoreStore.register_detail.RegisterCode;
    form.codeIsDisable = true;
  }else {
    form.code = '';
    form.codeIsDisable = false;
  }
};
// 注册操作
const confirmRegister = () => {
  proxy.$http1
    .post("/register", {
      code: form.code,
    })
    .then((result: any) => {
      if (result.result === 200) {
        if (result.data.code === 200) {
          ElMessage({
            type: "success",
            message: proxy.$t("Register succeeded"),
            grouping: true,
          });
          register_manage_dialog.value = false;
        } else {
          ElMessage({
            type: "error",
            message: result.data.message,
            grouping: true,
          });
        }
      }
    });
};
// 系统配置各模块配置数据处理
const updateConfigData = (model: string) => {
  let data = {};
  if (model === "alarm") {
    data = {
      EnabledAlarm: form.one_key_alarm,
      AlarmID: form.alarm_track,
    };
  } else if (model === "default") {
    data = {
      TerminalStateDefaultType: form.default_terminal_status,
      DefaultDisplayView: form.default_presentation_module,
      TerminalOrderbyType: form.default_terminal_sort,
    };
  } else {
    data = {
      EnabledFireAlert: reminder_configuration.value.includes("1"),
      EnabledPersonAlert: reminder_configuration.value.includes("2"),
      EnabledTerminalOffAlert: reminder_configuration.value.includes("3"),
      EnabledTerminalOffRingfAlert: reminder_configuration.value.includes("4"),
    };
  }
  return data;
};
// 更改模块配置
const changeConfig = (model: string) => {
  if (model === "alarm" && form.alarm_track === "") {
    return ElMessage({
      type: "error",
      message: proxy.$t("Please select alarm track"),
      grouping: true,
    });
  }
  let send_data = updateConfigData(model);
  proxy.$http1.put("/config/" + basic_configs.value.ID, send_data).then((result: any) => {
    if (result.result === 200) {
      ElMessage({
        type: "success",
        message: proxy.$t("Application succeeded"),
        grouping: true,
      });
      systemStore.updateSystemConfig(send_data);
    }
  });
};

watch(
  () => system_configs.value,
  () => {
    formatData();
  },
  {
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  formatData();
  switch_form.value = JSON.parse(JSON.stringify(functional_configs.value));
  systemStore.getProductKey().then((opcodes:any)=>{
    form.ProductKey = opcodes
  })
  getAlarmTask();
});
</script>

<style lang="scss" scoped>
:deep(.func-manage-dialog) {
  .el-dialog__header {
    height: 40px;
    padding: 10px 20px;
    margin: 0;
    background: #0070ee;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;

    .el-dialog__title {
      color: #ffffff;
      font-size: 14px;
    }

    .el-dialog__headerbtn {
      height: 40px;
      line-height: 40px;

      .el-dialog__close {
        color: #ffffff;
      }
    }
  }

  .el-dialog__body {
    padding: 10px 18px;

    .com-form {
      padding: 10px 30px 0;
    }
  }

  .el-dialog__footer {
    text-align: center;
  }
}

:deep(.register-manage-dialog) {
  .el-dialog__header {
    height: 40px;
    padding: 10px 20px;
    margin: 0;

    .el-dialog__headerbtn {
      height: 40px;
      line-height: 40px;
    }
  }

  .el-dialog__body {
    padding: 30px 54px !important;

    .register-logo {
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-top: -82px;
      align-items: center;

      .logo-image {
        width: 76px;
        height: 76px;
      }

      h2 {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #000000;
      }
    }

    .register-content {
      margin-top: 20px;
    }
  }

  .el-dialog__footer {
    text-align: center;
  }
}

.com-head {
  .strong {
    font-size: 14px;
  }
}

.com-button {
  .el-button {
    min-width: 70px;
    height: 30px;
    background: #e7f1fb;
    border-radius: 4px;
    color: #75a8d5;
    border: none;
  }
}

.com-form {
  .check-box-group {
    label {
      min-width: 24%;
      margin-right: 1%;
    }
  }
  .func-switch-class {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .el-form-item {
      width: 130px !important;
      margin-right: 117px;

      :deep(.el-form-item__label) {
        font-family: MicrosoftYaHei;
        color: #000000;
      }
    }

    .el-form-item:nth-child(3n) {
      margin-right: 0;
    }
  }

  .el-button {
    min-width: 98px;
    height: 30px;
    margin-right: 84px;
    background: #0070ee;
    border-radius: 4px;
  }
}
</style>
