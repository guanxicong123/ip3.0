<!-- 
  @Author: hmf
  @CreateDate: 2022-08-16
  @FilePath: src\components\select_components\select_shortcut_terminal_radio.vue
  @Describe: 选择快捷终端
-->
<template>
    <div class="com-select-shortcut-terminal-radio">
        <div class="com-select-left">
            <div class="custom-title">
                <template v-if="!form.searchConfigureVisible">
                    <el-icon @click="form.searchConfigureVisible = !form.searchConfigureVisible">
                        <Search />
                    </el-icon>
                    <span> 配置名称 </span>
                </template>
                <span v-else :class="{ span: form.searchConfigureVisible }">
                    <el-input class="title-search-input" v-model="form.searchConfigure" placeholder="配置名称"
                        maxlength="100" clearable @input="handleConfigureSearch" />
                    <i class="iconfont icon-clear delete" @click="handleClickCloSesearchInput"></i>
                </span>
            </div>
            <div class="custom-content">
                <el-scrollbar>
                    <ul class="scroll-ul">
                        <template v-for="item in form.allConfigureData" :key="item.id">
                            <li @click="handleSelectedConfigure(item)"
                                :class="{ selected: form.selectedConfigureData.id === item.id }" v-show="
                                    !form.searchConfigureVisible ||
                                    item[config.searchColumnName].match(form.searchConfigureReg)
                                ">
                                {{ item.name }}
                                <div class="icon-font-select" v-if="form.selectedConfigureData.id === item.id">
                                    <el-icon class="theme"><Select /></el-icon>
                                </div>
                            </li>
                        </template>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <div class="com-select-right">
            <div class="custom-title">
                <div v-for="(item, index) in config.showMediaColumn" :key="index" :style="item.style">
                    <template v-if="
                        item.column !== config.searchColumnName ||
                        !form.selectedSearchConfigureVisible
                    ">
                        <el-icon @click="
                            form.selectedSearchConfigureVisible =
                            !form.selectedSearchConfigureVisible
                        " v-if="item.column === config.searchColumnName">
                            <Search />
                        </el-icon>
                        <span>{{ item.text }}</span>
                    </template>
                    <span v-else>
                        <el-input class="title-search-input" v-model="form.selectedSearchConfigure" placeholder="终端/分组"
                            maxlength="100" clearable @input="handleSelectedConfigureSearch" />
                        <i class="iconfont icon-clear delete" @click="handleClickCloSelectedSesearch"></i>
                    </span>
                </div>
            </div>
            <div class="custom-content">
                <el-scrollbar>
                    <ul class="scroll-ul"
                        <template v-for="(item, index) in form.selectedConfigureData?.all_data" :key="item.id">
                            <li v-show="
                                !form.selectedSearchConfigureVisible ||
                                item[config.searchColumnName].match(
                                    form.selectedSearchConfigureReg
                                )
                            ">
                                <div v-for="(row, key) in config.showMediaColumn" :key="key" :style="row.style"
                                    :title="item[row.column]">
                                    <span :class="{
                                        'iconfont icon-terminals1':
                                            row.column === 'list' &&
                                            !item.hasOwnProperty('ip_address'),
                                    }" :title="
                                        row.column === 'list' &&
                                            !item.hasOwnProperty('ip_address')
                                            ? '点击查看'
                                            : ''
                                    ">
                                        {{
                                            row.column === "key" // 序号
                                                ? index + 1
                                                : row.column === "list" &&
                                                    item.hasOwnProperty("ip_address") // 终端列表
                                                    ? "-"
                                                    : row.column === "ip_address" &&
                                                        !item.hasOwnProperty("ip_address") // IP地址
                                                        ? "-"
                                                        : item[row.column]
                                        }}
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
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
// 声明触发事件
const emit = defineEmits([
    "requestConfigure", // 更新传递已选择的配置数据，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
    "myConfig", // config 配置,将对应覆盖 config
    "responseConfigure", // 编辑界面传递回来的配置数据，用于展示组件的已选择状态
]);

const form = reactive<any>({
    allConfigureData: [], // 所有配置名称
    searchConfigure: "", // 搜索配置名称
    searchConfigureReg: /.*/,
    searchConfigureVisible: false, // 是否显示配置名称的搜索框
    selectedSearchConfigure: "", // 已选择配置名称-终端/分组搜索
    selectedSearchConfigureReg: /.*/,
    selectedSearchConfigureVisible: false, // 是否显示已选择配置名称-终端/分组的搜索框
    selectedConfigureData: {
        id: 1,
        terminals: [],
        terminals_groups: [],
    }, // 已选择的配置数据
});
// 插件配置
let config = reactive<any>({
    showMediaColumn: [
        // 要显示的列(终端/终端分组) column 列名 text 列的别名 style 列的样式
        {
            column: "key",
            text: "No.",
            style: { width: "15%" },
        },
        {
            column: "name",
            text: "终端/分组",
            style: { width: "40%" },
        },
        {
            column: "ip_address",
            text: "IP地址",
            style: { width: "30%" },
        },
        {
            column: "list",
            text: "终端列表",
            style: { width: "20%" },
        },
    ],
    searchColumnName: "name", // 搜索的列名
});
// 处理已选择的配置数据
const handleSelectedConfigure = (item: any) => {
    form.selectedConfigureData = item;
    emit("requestConfigure", item);
};
// 处理配置名称搜索
const handleConfigureSearch = () => {
    let string = useRegex.replaceRegString(form.searchConfigure);
    form.searchConfigureReg = new RegExp(string, "gmi");
};
// 处理已选择配置名称-终端/分组搜索
const handleSelectedConfigureSearch = () => {
    let string = useRegex.replaceRegString(form.selectedSearchConfigure);
    form.selectedSearchConfigureReg = new RegExp(string, "gmi");
};
// 处理点击关闭已选择终端的搜索框
const handleClickCloSesearchInput = () => {
    // form.searchConfigure = "";
    form.searchConfigureVisible = false;
};
// 处理点击关闭已选择配置名称-终端/分组的搜索框
const handleClickCloSelectedSesearch = () => {
    // form.selectedSearchConfigure = "";
    form.selectedSearchConfigureVisible = false;
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = (data: any) => {
    if (!data || data.id == 0) {
        return handleSelectedConfigure(form.allConfigureData?.[0]);
    }
    form.allConfigureData.some((item: { id: number }) => {
        if (item.id == data.id) {
            return handleSelectedConfigure(item);
        }
    });
};
// 获取快捷终端
const getFastTerminals = (current: number, page: number) => {
    proxy.$http.get("/fast-terminals/all", {
        params: {
            withTerminals: true,
        },
    }).then((result: { result: number; data: any }) => {
        if (result.result === 200) {
            form.allConfigureData = result.data.map((item: any) => {
                item["all_data"] = [...item.terminals, ...item.terminals_groups];
                return item;
            });
            setCurrentTabSelectStatus(parentData.responseConfigure);
        }
    });
};
// mounted 实例挂载完成后被调用
onMounted(() => {
    config = Object.assign(
        config,
        parentData.myConfig ? parentData.myConfig : {}
    );
    getFastTerminals(1, 30);
});
</script>

<style lang="scss" scoped>
.com-select-shortcut-terminal-radio {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;

    .com-select-left {
        width: 260px;
        height: 100%;
        border-radius: 2px;
        border: 1px solid #ddd;
        background-color: #f4f9ff;

        .custom-title {
            height: 40px;
            margin: 10px 30px;
            padding: 0;
            justify-content: center;
            background-color: #0070ee;
            border-radius: 6px;
            color: #ffffff;
        }

        .custom-content {
            .scroll-ul {
                li {
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 0 20px 0 40px;

                    >div {
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

                    .icon-font-select {
                        position: absolute;
                        top: 0;
                        left: 12px;
                    }
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
        background-color: #f4f9ff;

        .custom-content {
            .scroll-ul {
                li {
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 0 20px 0 40px;

                    >div {
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

                    .icon-font-select {
                        position: absolute;
                        top: 0;
                        left: 12px;
                    }
                }
            }
        }
    }

    .custom-title {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 20px 0 40px;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;

        >div {
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
                line-height: 40px;
                padding: 0 30px;
                box-sizing: border-box;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                &:hover {
                    background-color: #e4f0ff;
                    cursor: pointer;
                }
            }
        }

        .selected {
            background-color: #e4f0ff;
        }
    }
}
</style>
