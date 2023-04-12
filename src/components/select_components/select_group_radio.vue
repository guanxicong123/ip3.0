<!-- 
  @Author: hmf
  @CreateDate: 2022-08-30
  @FilePath: src\components\select_components\select_group_radio.vue
  @Describe: 选择分组-单选
-->
<template>
  <div class="com-select-group-radio">
    <div class="com-select-left">
      <div class="custom-title">
        <template v-if="!form.selectedSearchGroupsVisible">
          <el-icon
            @click="form.selectedSearchGroupsVisible = !form.selectedSearchGroupsVisible"
          >
            <Search />
          </el-icon>
          <span>{{ $t("Group") }}</span>
        </template>
        <span v-else :class="{ span: form.selectedSearchGroupsVisible }">
          <el-input
            class="title-search-input"
            v-model="form.selectedSearchGroups"
            :placeholder="$t('Group')"
            maxlength="100"
            clearable
            @input="handleGourpsSearch"
          />
          <i
            class="iconfont icon-execution-failed delete"
            @click="handleClickCloGroupSearch"
          ></i>
        </span>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="item in form.allGroupsData" :key="item.id">
              <li
                @click="handleCurrentClickGroups(item)"
                :class="{ selected: form.currentGroupsID === item.id }"
                v-show="
                  !form.selectedSearchGroupsVisible ||
                  item[config.searchColumnName].match(form.selectedSearchGroupsReg)
                "
              >
                <div class="icon-font-select" v-if="form.currentGroupsID === item.id">
                  <el-icon class="theme"><Select /></el-icon>
                </div>
                {{ item.name }}
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div class="com-select-right">
      <div class="custom-title">
        <div
          v-for="(item, index) in config.showAcquisitionColumn"
          :key="index"
          :style="item.style"
        >
          <template
            v-if="
              item.column !== config.searchColumnName ||
              !form.selectedSearchTerminalsVisible
            "
          >
            <el-icon
              @click="
                form.selectedSearchTerminalsVisible = !form.selectedSearchTerminalsVisible
              "
              v-if="item.column === config.searchColumnName"
            >
              <Search />
            </el-icon>
            <span>
              {{ item.text }}
            </span>
          </template>
          <span v-else>
            <el-input
              class="title-search-input"
              v-model="form.selectedSearchTerminals"
              :placeholder="$t('Terminal name') + '/' + $t('Terminal IP')"
              maxlength="100"
              clearable
              @input="handleSelectedTerminalsSearch"
            />
            <i
              class="iconfont icon-execution-failed delete"
              @click="handleClickCloSearchTerminals"
            ></i>
          </span>
        </div>
      </div>
      <div class="custom-content">
        <el-scrollbar>
          <ul class="scroll-ul">
            <template v-for="(item, index) in form.allTerminalData" :key="item.id">
              <li
                v-show="
                  !form.selectedSearchTerminalsVisible ||
                  item[config.searchColumnName].match(form.selectedSearchTerminalsReg) ||
                  item[config.searchColumnIP].match(form.selectedSearchTerminalsReg)
                "
              >
                <div
                  v-for="(row, key) in config.showAcquisitionColumn"
                  :key="key"
                  :style="row.style"
                  :title="item[row.column]"
                >
                  <span>
                    {{ row.column === "key" ? index + 1 : item[row.column] }}
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { GroupsService } from "@/utils/api/groups/inedx";
import { isArray } from "@/utils/is";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits([
  "requestGroups", // 更新传递已选择的分组数据，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseGroups", // 编辑界面传递回来的分组数据，用于展示组件的已选择状态
]);

const form = reactive<any>({
  allGroupsData: [], // 所有分组数据
  currentGroupsID: 0, // 当前选择的分组id
  selectedSearchGroups: "", // 搜索分组
  selectedSearchGroupsReg: /.*/,
  selectedSearchGroupsVisible: false, // 是否显示已选择分组的搜索框
  selectedSearchTerminals: "", // 搜索终端
  selectedSearchTerminalsReg: /.*/,
  selectedSearchTerminalsVisible: false, // 是否显示已选择终端的搜索框
  allTerminalData: [], // 所有终端数据
  selectedGroupsData: {}, // 已选择的分组数据
});
// 插件配置
let config = reactive<any>({
  showAcquisitionColumn: [
    // 要显示的列(终端) column 列名 text 列的别名 style 列的样式
    {
      column: "key",
      text: "No.",
      style: { width: "15%" },
    },
    {
      column: "name",
      text: proxy.$t("Terminal name"),
      style: { width: "55%" },
    },
    {
      column: "ip_address",
      text: proxy.$t("Terminal IP"),
      style: { width: "30%" },
    },
  ],
  searchColumnName: "name", // 搜索的列名
  searchColumnIP: "ip_address", // 搜索的列名
});
// 处理当前点击选择分组
const handleCurrentClickGroups = (item: { id: number; terminals: any[] }) => {
  form.currentGroupsID = item.id;
  form.selectedGroupsData = item;
  form.allTerminalData = item.terminals;
  emit("requestGroups", item);
};
// 处理分组名称搜索
const handleGourpsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchGroups);
  form.selectedSearchGroupsReg = new RegExp(string, "gmi");
};
// 处理点击关闭分组的搜索框
const handleClickCloGroupSearch = () => {
  // form.selectedSearchGroups = "";
  form.selectedSearchGroupsVisible = false;
};
// 处理已选终端搜索
const handleSelectedTerminalsSearch = () => {
  let string = useRegex.replaceRegString(form.selectedSearchTerminals);
  form.selectedSearchTerminalsReg = new RegExp(string, "gmi");
};
// 处理点击关闭已选择终端的搜索框
const handleClickCloSearchTerminals = () => {
  // form.selectedSearchTerminals = "";
  form.selectedSearchTerminalsVisible = false;
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
  if (!parentData.responseGroups) {
    return;
  }
  form.allGroupsData.forEach((item: any) => {
    if (item.id == parentData.responseGroups?.id) {
      handleCurrentClickGroups(item);
    }
  });
};
// 处理获取全部分组
const handleGetAllGroups = async () => {
  await GroupsService.getAllGroups({
    withTerminals: true,
  })
    .then((result) => {
      if (result.data) {
        // 组装数据结构
        if (isArray(result.data)) {
          form.allGroupsData = result.data;
          if (parentData.responseGroups?.id < 1) {
            form.currentGroupsID = result.data?.[0].id;
            handleCurrentClickGroups(result.data?.[0]);
          }
        }
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  setCurrentTabSelectStatus();
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  config = Object.assign(config, parentData.myConfig ? parentData.myConfig : {});
  handleGetAllGroups();
});
</script>

<style lang="scss" scoped>
.com-select-group-radio {
  position: relative;
  display: flex;
  align-items: center;
  height: 380px;
  .com-select-left {
    width: 300px;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    .custom-title {
      justify-content: center;
      .title-search-input {
        width: 90%;
      }
      .el-icon {
        margin-right: 5px;
      }
      .span {
        width: 100%;
      }
    }
    .scroll-ul {
      li {
        cursor: pointer;
        .icon-font-select {
          position: absolute;
          top: 0;
          right: 15px;
        }
      }
    }
  }
  .com-select-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: calc(100% - 312px);
    height: 100%;
    margin-left: 12px;
    border-radius: 2px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    .custom-content {
      .scroll-ul {
        li {
          display: flex;
          align-items: center;
          padding: 0 20px;
          > div {
            overflow: hidden;
            span {
              display: block;
              width: 100%;
              padding: 0 5px;
              box-sizing: border-box;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
  .custom-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    > div {
      span {
        display: inline-block;
        width: 90%;
        padding: 0 5px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    i {
      font-size: 16px;
      cursor: pointer;
    }
    .el-icon:hover {
      color: $c-theme;
    }
    .title-search-input {
      width: 80%;
      margin-right: 10px;
    }
  }
  .custom-content {
    flex: 1;
    height: calc(100% - 40px);
    .scroll-ul {
      li {
        position: relative;
        line-height: 40px;
        padding: 0 40px 0 15px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          background-color: #eee;
        }
      }
    }
    .selected {
      background-color: #eee;
    }
  }
}
</style>
