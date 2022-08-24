<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\terminal\index.vue
  @Describe: 终端状态
-->
<template>
  <div class="com-index">
    <div class="com-head">
      <div class="com-head-content">
        <div class="com-breadcrumb">
          <i
            class="iconfont icon-set-up"
            @click="setUp"
          ></i>
          <div class="play-table-title">
            <span
              :class="{ theme: $useRoute.name != 'group' }"
              @click="changeRouter('终端')"
            >
              全部终端
            </span>
            <span class="line"> | </span>
            <span
              :class="{ theme: $useRoute.name == 'group' }"
              @click="changeRouter('分组')"
            >
              分组
            </span>
          </div>
          <el-select 
            v-show="$useRoute.name != 'group'" 
            v-model="form.terminal_status" 
            style="margin-left: 10px"
            @change="handleFilter()"
          >
            <el-option
              v-for="(item, keys) in form.terminalStatusOptions"
              :key="keys"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="form.search"
            :placeholder="form.search_placeholder"
          />
          <el-button :icon="Search" @click="handleFilter"></el-button>
        </div>
        <div class="com-button">
          <span>主讲终端</span>
          <el-select v-model="form.speaker_terminal" style="margin-left: 10px">
            <el-option
              v-for="(item, keys) in form.speakerTerminalOptions"
              :key="keys"
              :label="item.EndpointName"
              :value="item.EndpointID"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="com-main com-m-bg">
      <router-view />
    </div>
    <div class="com-footer">
      <div class="footer-button">
        <el-checkbox
          v-model="checked_all"
          label="全选"
          @change="handleCheckedAll"
          v-if="$useRoute.name != 'terminal_list'"
        />
        <el-button type="primary" color="#4900EE"> 全区广播 </el-button>
        <el-button type="primary" color="#467CF7" @click="originateBroadcast">广播</el-button>
        <el-button
          type="primary"
          color="#00A1CC"
          v-if="$useRoute.name != 'group'"
        >
          对讲
        </el-button>
        <el-button
          type="primary"
          color="#06BA7D"
          v-if="$useRoute.name != 'group'"
        >
          监听
        </el-button>
        <el-button type="danger" color="#D34500">报警</el-button>
      </div>
      <div class="footer-volume">
        <i class="iconfont icon-volume1 theme"></i>
        <el-slider v-model="form.volume" />
        <span>{{ form.volume }}</span>
      </div>
    </div>
    <el-dialog
      v-model="set_dialog"
      title="终端状态配置"
      width="450px"
      custom-class="set-dialog"
    >
      <!-- template -->
      <div class="terminal-config-items">
        <el-radio-group v-model="form.view_value" class="view-config">
          <el-radio label="list" size="large">列表视图</el-radio>
          <el-radio label="square" size="large">方块视图</el-radio>
        </el-radio-group>
        <span class="view-number-config">
          <span>每屏终端数量</span>
          <el-select v-model="form.select_terminal" :disabled="form.view_value === 'list'">
            <el-option
              v-for="item in terminal_view_options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmTerminalSet">
            确认
          </el-button>
          <el-button @click="set_dialog = false">
            取消
          </el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { onBeforeRouteLeave } from "vue-router";
import { ElMessage } from 'element-plus'
// const { appContext: { config: { globalProperties: global }}} = getCurrentInstance()
import axios from 'axios'
import { send } from '@/utils/socket'

const form = reactive<any>({
  terminal_status: -1, // 终端状态
  search: "", // 搜索
  search_placeholder: "", // 搜索 placeholder
  speaker_terminal: '', // 主讲终端
  speakerTerminalOptions: [],
  terminalStatusOptions: [
    { value: -1, label: "全部状态" },
    { value: 1, label: "空闲" },
    { value: 2, label: "忙碌" },
    { value: 3, label: "冻结" },
    { value: 4, label: "故障" },
    { value: 0, label: "离线" },
  ],
  volume: 0, // 音量
  view_value: 'list',
  select_terminal: '3x6'
  
});

const terminal_view_options = [
  {
    value: '4x6'
  },
  {
    value: '3x6'
  },
  {
    value: '3x5'
  }
]

// const response_id = ref(0)

const terminal_group_data = ref()

const store = useTerminalStore()

const systemStore = useSystemStore()

const basic_configs = computed(() => {
  return systemStore.basic_configs
})

const terminal_data = computed(() => {
  return store.terminal_data
})

const terminal_group = computed(() => {
  return store.terminal_group
})

watch(()=> terminal_data.value, (newVal)=> {
  getGroupList()
  cleanOnLineTerminal()
},{
  deep: true
})

watch(()=> terminal_group.value, (newVal)=> {
  getGroupList()
})

watch(()=> basic_configs.value, (newVal)=> {
  form.select_terminal = basic_configs.value.ListDisplaySize === 0 ? '3x5' : basic_configs.value.ListDisplaySize === 1 ? '3x6' : '4x6'
  form.view_value = basic_configs.value.DisplayType === 1 ? 'list' : 'square'
},{
  deep: true
})

// 生成随机字符串
const dec2hex = (dec: any) => {
    return dec.toString(16).padStart(2, "0")
}
  
const generateId = (len: any) => {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();
const set_dialog = ref(false)

const select_terminal = ref('3x6')
// 全选
const checked_all = ref(false);
// 是否点击了全选按钮-给子组件做判断处理事件
const is_checked_all = ref(false);
// 处理全选
const handleCheckedAll = (value: any) => {
  is_checked_all.value = true;
};
// 处理是否全选
const handleIsCheckedAll = (value: boolean) => {
  is_checked_all.value = value;
};
// 处理更新全选
const handleUpdateCheckedAll = (value: boolean) => {
  checked_all.value = value;
};

//定义已勾选的终端数据
const checked_terminals = ref([])

// 更新已勾选终端数据
const updateCheckedTerminals = (data: any) => {
  checked_terminals.value = data
}

const setUp = () => {
  set_dialog.value = true
}

// 终端 <-> 分组切换
const changeRouter = (name: string) => {
  if (name === '分组') {
    $useRouter.push('/terminal/group')
    form.search_placeholder = '分组名称'
    store.changeFilterStatus(false)
  } else {
    $useRouter.push('/terminal/terminal_list')
    form.search_placeholder = '终端名称'
    store.changeFilterStatus(true)
  }
}

// 切换终端状态或者点击搜索
const handleFilter = () => {
  let conditions = {
    status: form.terminal_status,
    search: form.search
  }
  store.updateFiltrateCondition(conditions)
}

// 过滤在线设备组成主讲终端可选项
const cleanOnLineTerminal = () => {
  form.speakerTerminalOptions = terminal_data.value.filter((item: { status: number}) => {
    return item.status === 1 || item.status === 2
  })
  // 设置默认主讲终端
  let online_ids = form.speakerTerminalOptions.map((item: any) => {
    return item.EndpointID
  })
  if (online_ids.includes(basic_configs.value.MainEndpointID)) {
    form.speaker_terminal = basic_configs.value.MainEndpointID
  } else {
    form.speaker_terminal = form.speakerTerminalOptions.length > 0 ? form.speakerTerminalOptions[0].EndpointID : ''
  }
}

// 确认终端视图模式
const confirmTerminalSet = () => {
  axios.put(
    'http://172.16.21.25:9999/api/v1/config/' + basic_configs.value.ID,
    {
      DisplayType: form.view_value === 'list' ? 1 : 0,
      ListDisplaySize: form.select_terminal === '3x5' ? 0 : form.select_terminal === '3x6' ? 1 : 2
    }
  ).then((result: any) => {
    if (result.status === 200) {
      select_terminal.value = form.select_terminal
      let data = {
        DisplayType: form.view_value === 'list' ? 1 : 0,
        ListDisplaySize: form.select_terminal === '3x5' ? 0 : form.select_terminal === '3x6' ? 1 : 2
      }
      systemStore.updateTerminalStatusConfig(data)
      if (form.view_value === 'list') {
        $useRouter.push('/terminal/terminal_list')
      } else {
        $useRouter.push({
          path: '/terminal/terminal_block',
          query: {
            layoutArrange: select_terminal.value
          }
        })
      }
      set_dialog.value = false
      store.changeFilterStatus(true)
    }
  })
}

// 已勾选终端筛选出在线终端数据
const filterCheckedTerminals = () => {
  let checked_online_terminals: any = []
  checked_terminals.value.forEach((item: any) => {
    let index = form.speakerTerminalOptions.findIndex((add: any) => {
      return add.EndpointID === item
    })
    if (index > -1) {
      checked_online_terminals.push(item)
    }
  })
  return checked_online_terminals
}

// 发起广播任务
const originateBroadcast = () => {
  if (!form.speaker_terminal) {
    return ElMessage.error('未选择主讲终端或主讲终端未在线')
  }
  let filter_initiator_terminals = filterCheckedTerminals().filter((item: number) => {
    return item !== form.speaker_terminal
  })
  if (filter_initiator_terminals.length < 1) {
    return ElMessage.error('请选择接收终端')
  }
  let send_data = {
    company: "BL",
    actioncode: "c2ms_broadcast_task",
    token: "",
    data: {
      EndPointsAdditionalProp: {},
      IniatorID: form.speaker_terminal,
      EndPointList: filter_initiator_terminals,
      TaskID: generateId(30),
      TaskPriority: 80,
      Volume: form.volume
    },
    result: 0,
    return_message: ""
  }
  console.log('发起广播任务数据', send_data)
  send(send_data)
}

// 发起对讲
const initiatedTalkTask = () => {
  if (!form.speaker_terminal) {
    return ElMessage.error('未选择主讲终端或主讲终端未在线')
  }
  let filter_initiator_terminals = filterCheckedTerminals().filter((item: number) => {
    return item !== form.speaker_terminal
  })
  if (filter_initiator_terminals.length < 1) {
    return ElMessage.error('请选择接收终端')
  }
  if (filter_initiator_terminals.length > 1) {
    return ElMessage.error('对讲接收终端只能选一个')
  }
  let send_data = {
    company: "BL",
    actioncode: "c2ms_talk_task",
    token: "",
    data: {
      EndPointsAdditionalProp: {},
      IniatorID: form.speaker_terminal,
      EndPointList: filter_initiator_terminals,
      TaskID: generateId(30),
      TaskPriority: 80,
      Volume: form.volume
    },
    result: 0,
    return_message: ""
  }
  console.log('发起对讲任务数据', send_data)
  send(send_data)
}

const getGroupList = () => {
  store.updateTerminalGroup()
  terminal_group_data.value = terminal_group.value
}

// 供给数据
provide("checkedAll", {
  checked_all,
  is_checked_all,
  handleUpdateCheckedAll,
  handleIsCheckedAll,
  checked_terminals,
  updateCheckedTerminals
});

// 传给方块视图页面
provide('select_terminal', {
  select_terminal
})

// 终端分组数据
provide('terminal_group', {
  terminal_group_data
})

// mounted 实例挂载完成后被调用
onMounted(() => {
  getGroupList()
  $useRouter.push("/terminal/terminal_list");
  form.search_placeholder = '终端名称'
  cleanOnLineTerminal()
  form.select_terminal = basic_configs.value.ListDisplaySize === 0 ? '3x5' : basic_configs.value.ListDisplaySize === 1 ? '3x6' : '4x6'
  form.view_value = basic_configs.value.DisplayType === 1 ? 'list' : 'square'
});
</script>

<style lang="scss" scoped>
.com-head-content {
  .el-input,
  .el-select {
    width: 160px;
  }
  .icon-set-up {
    margin-left: 10px;
    margin-right: 20px;
    cursor: pointer;
  }
  .play-table-title {
    margin-left: 10px;
    margin-right: 14px;
    span {
      cursor: pointer;
    }
    .line {
      margin: 0 15px;
      color: $c-999;
      cursor: default;
    }
    .theme {
      font-weight: bold;
    }
  }
}
.com-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: unset;
  padding: 25px 0;
  .footer-button {
    display: flex;
    align-items: center;
    padding-left: 30px;
    .el-checkbox {
      margin-right: 50px;
    }
  }
  .footer-volume {
    display: flex;
    align-items: center;
    justify-content: right;
    flex: 1;
    padding-right: 60px;
    .el-slider {
      width: 140px;
      margin-left: 20px;
      margin-right: 12px;
    }
  }
}

.set-dialog {
  .view-number-config {
    span {
      margin-right: 30px;
    }
  }
}

:deep(.set-dialog) {
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
    padding: 21px 40px 14px;

    .el-radio-group {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: flex-start;

      .el-radio__inner {
        width: 16px;
        height: 16px;
        background: #FFFFFF;
        border: 1px solid #C1C1C1;
      }

      .el-radio__inner::after {
        width: 12px;
        height: 12px;
        background: #0070EE;
        // box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5000)
      }

      .el-radio__label {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #000000;
      }
    }
  }

  .el-dialog__footer {
    padding-bottom: 40px;
    text-align: center;
  }
}
</style>
