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
                <span class="strong">一键报警配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round @click="changeConfig('alarm')">应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-form class="special-class" label-position="top" :inline="true">
              <div class="com-form-item-custom">
                <el-checkbox
                  v-model="form.one_key_alarm"
                  label="启用一键报警功能"
                />
              </div>
              <el-form-item label="报警曲目">
                <el-select v-model="form.alarm_track">
                  <el-option
                    v-for="(item, keys) in form.alarmTrackOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">默认配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round @click="changeConfig('default')">应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-form label-position="top" :inline="true">
              <el-form-item label="终端状态默认项">
                <el-select v-model="form.default_terminal_status">
                  <el-option
                    v-for="(item, keys) in form.terminalStatusOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="默认展示模块">
                <el-select v-model="form.default_presentation_module">
                  <el-option
                    v-for="(item, keys) in form.presentationModuleOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="终端排序">
                <el-select v-model="form.default_terminal_sort">
                  <el-option
                    v-for="(item, keys) in form.terminalSortOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">提醒配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round @click="changeConfig('remind')">应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-checkbox-group class="check-box-group" v-model="reminder_configuration">
              <el-checkbox label="1">启用火警报警提醒</el-checkbox>
              <el-checkbox label="2">启用人工报警提醒</el-checkbox>
              <el-checkbox label="3">启用终端离线提醒</el-checkbox>
              <el-checkbox label="4">启用终端离线铃声提醒</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">功能配置</span>
              </div>
              <div class="com-button">
                <!-- <el-button type="primary" round>应用</el-button> -->
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-button type="primary" round @click="handleFuncManage">功能管理</el-button>
            <el-button type="primary" round>注册管理</el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      v-model="func_manage_dialog"
      title="功能管理"
      width="720px"
      custom-class="func-manage-dialog"
    >
      <div class="com-head">
        <div class="com-head-content com-alert-bg">
          <div class="com-breadcrumb">
            <span class="strong">功能开关设置<span class="">(修改配置，下次登录生效)</span></span>
          </div>
          <div class="com-button">
          </div>
        </div>
      </div>
      <div class="com-form">
        <el-form class="func-switch-class" label-position="right" :inline="true" label-width="97px">
          <!-- <el-form-item v-for="item in func_switch_data" :key="item.label" :label="item.label">
            <el-switch v-model="item.switch_value"></el-switch>
          </el-form-item> -->
          <el-form-item label="终端状态">
            <el-switch v-model="switch_form.TerminalStateEnabled"></el-switch>
          </el-form-item>
          <el-form-item label="播放中心">
            <el-switch v-model="switch_form.PlayCenterEnabled"></el-switch>
          </el-form-item>
          <el-form-item label="会话状态">
            <el-switch v-model="switch_form.SessionEnabled"></el-switch>
          </el-form-item>
          <el-form-item label="定时任务">
            <el-switch v-model="switch_form.TimingEnabled"></el-switch>
          </el-form-item>
          <el-form-item label="媒体库">
            <el-switch v-model="switch_form.MediasEnabled"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="com-head">
        <div class="com-head-content com-alert-bg">
          <div class="com-breadcrumb">
            <span class="strong">区域选项</span>
          </div>
          <div class="com-button">
          </div>
        </div>
      </div>
      <div class="com-form">
        <el-form class="func-switch-class" label-position="right" :inline="true" label-width="97px">
          <el-form-item label="分组">
            <el-switch v-model="switch_form.GroupDisplay"></el-switch>
          </el-form-item>
          <el-form-item label="显示远程任务">
            <el-switch v-model="switch_form.remoteTaskDisplay"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="com-head">
        <div class="com-head-content com-alert-bg">
          <div class="com-breadcrumb">
            <span class="strong">媒体选项</span>
          </div>
          <div class="com-button">
          </div>
        </div>
      </div>
      <div class="com-form">
        <el-form class="func-switch-class" label-position="right" :inline="true" label-width="97px">
          <el-form-item label="文件夹">
            <el-switch v-model="switch_form.FolderDisplay"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveSet">
            保存并重新登录
          </el-button>
          <el-button @click="func_manage_dialog = false">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, formatter } from "element-plus";

const form = reactive({
  one_key_alarm: false, // 启用一键报警功能
  alarm_track: 1, // 报警曲目
  alarmTrackOptions: [
    { value: 1, label: "报警曲目" },
    { value: 2, label: "报警曲目2" },
  ],
  default_terminal_status: 0, // 终端状态默认项
  terminalStatusOptions: [
    { value: 0, label: "终端" },
    { value: 1, label: "分组" },
  ],
  default_presentation_module: 0, // 默认展示模块
  presentationModuleOptions: [
    { value: 0, label: "终端状态" },
    { value: 1, label: "播放中心" },
    { value: 2, label: "会话状态" },
    { value: 3, label: "定时任务" },
    { value: 4, label: "媒体库" }
  ],
  default_terminal_sort: 0, // 默认终端排序
  terminalSortOptions: [
    { value: 0, label: "终端状态" },
    { value: 1, label: "IP地址" },
    { value: 2, label: "终端名称" },
    { value: 3, label: "呼叫编码" },
  ],
  reminder_configuration: [], // 提醒配置
});

const $useRouter = useRouter()

const systemStore = useSystemStore()

const system_configs = computed(() => {
  return systemStore.system_configs
})

const basic_configs = computed(() => {
  return systemStore.basic_configs
})

watch(()=> system_configs.value, (newVal)=> {
  formatData()
},{
  deep: true
})

const functional_configs = computed(() => {
  return systemStore.functional_configs
})

const func_manage_dialog = ref(false)

const reminder_configuration: any = ref([])

const func_switch_data = ref([
  {
    label: '终端状态',
    switch_value: false
  },
  {
    label: '播放中心',
    switch_value: false
  },
  {
    label: '会话状态',
    switch_value: false
  },
  {
    label: '定时任务',
    switch_value: false
  },
  {
    label: '媒体库',
    switch_value: false
  },
])

const change_config_map = ref(new Map([
  ['alarm', 
    [
      {
        EnabledAlarm: form.one_key_alarm,
        AlarmID: form.alarm_track
      }
    ]
  ]
]))

// 功能管理开关数据
const switch_form = ref()

// const 
//
const formatData = () => {
  console.log('format data', system_configs.value)
  form.one_key_alarm = system_configs.value.EnabledAlarm
  form.alarm_track = system_configs.value.AlarmID
  form.default_terminal_status = system_configs.value.TerminalStateDefaultType
  form.default_presentation_module = system_configs.value.DefaultDisplayView
  form.default_terminal_sort = system_configs.value.TerminalOrderbyType
  system_configs.value.EnabledFireAlert ? reminder_configuration.value.push('1') : ''
  system_configs.value.EnabledPersonAlert ? reminder_configuration.value.push('2') : '' 
  system_configs.value.EnabledTerminalOffAlert ? reminder_configuration.value.push('3') : '' 
  system_configs.value.EnabledTerminalOffRingfAlert ? reminder_configuration.value.push('4') : ''
}

const saveSet = () => {
  console.log('保存设置', switch_form.value)
  axios.put('http://172.16.21.25:9999/api/v1/config/' + basic_configs.value.ID, switch_form.value).then((result) => {
    if (result.status === 200) {
      // ElMessage.success('配置成功')
      $useRouter.push('/')
    }
  })
}

const handleFuncManage = () => {
  func_manage_dialog.value = true
  switch_form.value = JSON.parse(JSON.stringify(functional_configs.value))
  console.log('functional_configs.value', functional_configs.value, switch_form.value)
}

const updateConfigData = (model: string) => {
  let data = {}
  if (model === 'alarm') {
    data = {
      EnabledAlarm: form.one_key_alarm,
      AlarmID: form.alarm_track
    }
  } else if (model === 'default') {
    data = {
      TerminalStateDefaultType: form.default_terminal_status,
      DefaultDisplayView: form.default_presentation_module,
      TerminalOrderbyType: form.default_terminal_sort
    }
  } else {
    data = {
      EnabledFireAlert: reminder_configuration.value.includes('1'),
      EnabledPersonAlert: reminder_configuration.value.includes('2'),
      EnabledTerminalOffAlert: reminder_configuration.value.includes('3'),
      EnabledTerminalOffRingfAlert: reminder_configuration.value.includes('4')
    }
  }
  return data
}

// 更改模块配置
const changeConfig = (model: string) => {
  let send_data = updateConfigData(model)
  axios.put('http://172.16.21.25:9999/api/v1/config/' + basic_configs.value.ID, send_data).then((result) => {
    if (result.status === 200) {
      ElMessage.success('配置成功')
      systemStore.updateSystemConfig(send_data)
    }
  })
}

// mounted 实例挂载完成后被调用
onMounted(() => {
  console.log('系统配置界面')
  formatData()
  switch_form.value = JSON.parse(JSON.stringify(functional_configs.value))
});
</script>

<style lang="scss" scoped>
  :deep(.func-manage-dialog) {
    .el-dialog__header {
      height: 40px;
      padding: 10px 20px;
      margin: 0;
      background: #0070EE;
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5000);
      box-sizing: border-box;

      .el-dialog__title {
        color: #FFFFFF;
        font-size: 14px;
      }

      .el-dialog__headerbtn {
        height: 40px;
        line-height: 40px;

        .el-dialog__close {
          color: #FFFFFF;
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
  
  .com-head {
    .strong {
      font-size: 14px;
    }
  }

  .com-button {
    .el-button {
      width: 70px;
      height: 30px;
      background: #E7F1FB;
      border-radius: 4px;
      color: #75A8D5;
      border: none;

    }
  }

  .com-form {
    .el-form {
      display: flex;
      justify-content: space-between;

      .el-form-item:last-child {
        margin-right: 0;
      }
    }

    .special-class {
      display: flex;
      justify-content: flex-start;
    }

    .check-box-group {
      display: flex;
      justify-content: space-between;
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
      width: 98px;
      height: 30px;
      margin-right: 84px;
      background: #0070EE;
      border-radius: 4px;
    }
  }
</style>
