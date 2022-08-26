<!-- 
  @Author: hmf
  @CreateDate: 2022-08-10
  @FilePath: src\components\select_components\select_terminals_groups.vue
  @Describe: 选择终端和分组
-->
<template>
    <div class="com-select-terminals-groups">
        <div class="com-select-left">
        <el-tabs
            type="border-card"
            class="select-left-tabs"
            :class="{ width: !config.isSelectGroups }"
            v-model="form.activeName"
            @tab-click="handleTabClick"
        >
            <el-tab-pane name="first" v-if="config.isSelectTerminals">
                <template #label>
                    <div class="custom-tabs-label">
                    <el-popover
                        :visible="form.searchTerminalsVisible"
                        placement="top-start"
                    >
                        <template #reference>
                        <el-icon @click="handleClickTerminalsVisible">
                            <Search />
                        </el-icon>
                        </template>
                        <div class="custom-popover">
                        <el-input
                            v-model="form.searchTerminals"
                            placeholder="终端名称/终端IP"
                            maxlength="100"
                            clearable
                            @input="handleTerminalsSearch"
                        />
                        <i
                            class="iconfont icon-execution-failed"
                            @click="handleClickClosePopover"
                        ></i>
                        </div>
                    </el-popover>
                    <span>{{ config.terminalsTitle }}</span>
                    </div>
                </template>
                <div class="custom-scroll-bar">
                    <div class="scroll-select">
                    <el-select v-model="form.currentGroupsID">
                        <el-option :key="0" label="所有分组" :value="0" />
                        <el-option
                        v-for="item in form.allGroupsOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        />
                    </el-select>
                    </div>
                    <div class="scroll-bar">
                    <el-scrollbar>
                        <ul class="scroll-ul">
                        <template
                            v-for="item in form.allTerminalsData"
                            :key="item.id"
                        >
                            <li
                            @click="selectTerminal(item)"
                            v-show="
                                !form.searchTerminalsVisible ||
                                item[config.searchColumnName].match(
                                form.searchTerminalsReg
                                ) ||
                                item[config.searchColumnIP].match(
                                form.searchTerminalsReg
                                )
                            "
                            >
                            {{ item.name }}
                            </li>
                        </template>
                        </ul>
                    </el-scrollbar>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane name="second" v-if="config.isSelectGroups">
            <template #label>
                <div class="custom-tabs-label">
                <el-popover
                    :visible="form.searchGroupsVisible"
                    placement="top-start"
                    :width="260"
                >
                    <template #reference>
                    <el-icon @click="handleClickGroupsVisible">
                        <Search />
                    </el-icon>
                    </template>
                    <div class="custom-popover">
                    <el-input
                        v-model="form.searchGroups"
                        placeholder="分组名称"
                        maxlength="100"
                        clearable
                        @input="handleGroupsSearch"
                    />
                    <i
                        class="iconfont icon-execution-failed"
                        @click="handleClickClosePopover"
                    ></i>
                    </div>
                </el-popover>
                <span>{{ config.groupsTitle }}</span>
                </div>
            </template>
            <el-scrollbar>
                <ul class="scroll-ul">
                <template v-for="item in form.allGroupsData" :key="item.id">
                    <li
                    @click="selectGroup(item)"
                    v-show="
                        !form.searchGroupsVisible ||
                        item[config.searchColumnName].match(form.searchGroupsReg)
                    "
                    >
                    {{ item.name }}
                    </li>
                </template>
                </ul>
            </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
        </div>
        <div class="com-select-center">
            <span title="全部右移" @click="selectAll" class="iconfont icon-shift-right">
            </span>
            <span title="全部左移" @click="deselectAll" class="iconfont icon-shift-left">
            </span>
        </div>
        <!-- 已选终端 -->
        <div
            class="com-select-right"
            v-show="form.activeName === 'first'"
            v-if="config.isSelectTerminals"
        >
            <div class="custom-right-title">
                <div
                    v-for="(item, index) in config.showTerminalsColumn"
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
                            form.selectedSearchTerminalsVisible =
                            !form.selectedSearchTerminalsVisible
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
                            placeholder="终端名称/终端IP"
                            maxlength="100"
                            clearable
                            @input="handleSelectedTerminalsSearch"
                        />
                        <i
                            class="iconfont icon-execution-failed delete"
                            @click="handleClickCloSesearchInput"
                        ></i>
                    </span>
                </div>
            </div>
            <div class="custom-right-content">
                <el-scrollbar>
                    <ul class="scroll-ul">
                        <template
                            v-for="(item, index) in form.selectedTerminalsData"
                            :key="item.id"
                        >
                            <li
                                v-show="
                                !form.selectedSearchTerminalsVisible ||
                                item[config.searchColumnName].match(
                                    form.selectedSearchTerminalsReg
                                ) ||
                                item[config.searchColumnIP].match(
                                    form.selectedSearchTerminalsReg
                                )
                                "
                            >
                                <div class="item-terminals">
                                    <el-icon
                                        class="icon-font-arrow theme"
                                        @click="item.isShowAmplifier = !item.isShowAmplifier"
                                        v-if="config.selectAmplifier"
                                    >
                                        <ArrowDown v-if="item.isShowAmplifier" />
                                        <ArrowRight v-else />
                                    </el-icon>
                                    <div
                                        v-for="(row, key) in config.showTerminalsColumn"
                                        :key="key"
                                        :style="row.style"
                                        :title="item[row.column]"
                                    >
                                        <span>
                                        {{ row.column === "key" ? index + 1 : item[row.column] }}
                                        </span>
                                    </div>
                                    <div class="icon-font-delete">
                                        <i
                                            class="iconfont icon-clear delete"
                                            @click="deleteTerminal(item)"
                                        ></i>
                                    </div>
                                </div>
                                <div
                                    class="item-amplifier"
                                    v-if="config.selectAmplifier && item.isShowAmplifier"
                                    >
                                    <div class="amplifier-checkbox">
                                        <span>{{ config.amplifierTitle }}</span>
                                        <el-checkbox
                                            v-model="item.checkAll_amplifier"
                                            :indeterminate="item.isIndeterminate"
                                            @change="handleCheckAllAmplifierChange(item)"
                                        >
                                            全选
                                        </el-checkbox>
                                        <el-checkbox-group
                                            v-model="item[config.amplifierColumnName]"
                                            @change="handleSelectAmplifierChange(item)"
                                        >
                                            <el-checkbox
                                                v-for="row in config.amplifierValue"
                                                :key="row"
                                                :label="row"
                                            >
                                                {{ row }}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <!-- 已选分组 -->
        <div
        class="com-select-right"
        v-show="form.activeName === 'second'"
        v-if="config.isSelectGroups"
        >
        <div class="custom-right-title group">
            <div
            v-for="(item, index) in config.showTerminalsGroupsColumn"
            :key="index"
            :style="item.style"
            >
            <template
                v-if="
                item.column !== config.searchColumnName ||
                !form.selectedSearchGroupsVisible
                "
            >
                <el-icon
                    @click="
                        form.selectedSearchGroupsVisible =
                        !form.selectedSearchGroupsVisible
                    "
                    v-if="item.column === config.searchColumnName"
                    >
                <Search />
                </el-icon>
                <span>{{ item.text }}</span>
            </template>
            <span v-else>
                <el-input
                    class="title-search-input"
                    v-model="form.selectedSearchGroups"
                    placeholder="分组名称"
                    maxlength="100"
                    clearable
                    @input="handleSelectedGroupsSearch"
                />
                <i
                    class="iconfont icon-clear delete"
                    @click="handleClickCloSesearchInput"
                ></i>
            </span>
            </div>
        </div>
        <div class="custom-right-content">
            <el-scrollbar>
            <ul class="scroll-ul">
                <template
                v-for="(item, index) in form.selectedGroupsData"
                :key="item.id"
                >
                <li
                    v-show="
                    !form.selectedSearchGroupsVisible ||
                    item[config.searchColumnName].match(
                        form.selectedSearchGroupsReg
                    )
                    "
                >
                    <div class="item-terminals group">
                    <div
                        v-for="(row, key) in config.showTerminalsGroupsColumn"
                        :key="key"
                        :style="row.style"
                        :title="item[row.column]"
                    >
                        <el-popover placement="bottom" width="448px" trigger="click">
                            <template #reference>
                                <span
                                    :class="{
                                        'iconfont icon-view-terminlas': row.column === 'list'
                                    }"
                                    :title="row.column === 'list' ? '点击查看' : ''"
                                >
                                    {{ row.column === "key" ? index + 1 : item[row.column] }}
                                </span>
                            </template>
                            <el-table :data="item.terminals" style="width: 448px">
                                <el-table-column type="index" label="序号" width="50" />
                                <el-table-column property="name" label="终端名称" />
                                <el-table-column property="ip_address" label="终端IP" />
                                <el-table-column property="call_code" label="呼叫编码" />
                            </el-table>
                        </el-popover>
                    </div>
                    <div class="icon-font-delete">
                        <i
                            class="iconfont icon-execution-failed delete"
                            @click="deleteGroup(item)"
                        ></i>
                    </div>
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
import { TabsPaneContext } from "element-plus";
import { result } from "lodash";
const {appContext: {config: {globalProperties: global}}} = getCurrentInstance()
// 声明触发事件
const emit = defineEmits([
    "requestTerminals", // 更新传递已选择的终端数据，用于父组件进行数据交互
    "requestGroups", // 更新传递已选择的分组数据，用于父组件进行数据交互
    "selectedTerminalsName", // 更新传递已选择的终端数据名称，用于父组件进行数据交互
    "selectedGroupsName", // 更新传递已选择的分组数据名称，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
    "myConfig", // config 配置,将对应覆盖 config
    "responseTerminals", // 编辑界面传递回来的终端数据，用于展示组件的已选择状态
    "responseGroups", // 编辑界面传递回来的分组数据，用于展示组件的已选择状态
    "excludeTerminalsIDS", // 终端id集合 选择终端时可以排除不选这里面的id
    "excludeGroupsIDS", // 分组id集合 选择分组时可以排除不选这里面的id
]);

const form = reactive<any>({
    activeName: "first",
    searchTerminals: "", // 搜索终端
    searchTerminalsReg: /.*/,
    searchGroups: "", // 搜索分组
    searchGroupsReg: /.*/,
    selectedSearchTerminals: "", // 已选择的搜索终端
    selectedSearchTerminalsReg: /.*/,
    selectedSearchGroups: "", // 已选择的搜索分组
    selectedSearchGroupsReg: /.*/,
    searchTerminalsVisible: false, // 是否显示搜索终端popover弹窗
    searchGroupsVisible: false, // 是否显示搜索分组popover弹窗
    selectedSearchTerminalsVisible: false, // 是否显示已选择终端的搜索框
    selectedSearchGroupsVisible: false, // 是否显示已选择分组的搜索框
    currentGroupsID: 0, // 当前选择的分组id
    currentSelectStatus: "first", // 当前选择tab的状态，用于编辑界面时处理数据展示
    allGroupsOptions: [], // 所有分组-选择框
    allTerminalsData: [], // 所有终端数据
    allGroupsData: [], // 所有分组数据
    selectedTerminalsData: [], // 已选择的终端数据
    selectedGroupsData: [], // 已选择的分组数据
    selectedTerminalsID: [], // 已选择的终端ID数组
    selectedGroupsID: [], // 已选择的分组ID数组
});
// 插件配置
let config = reactive<any>({
    terminalsTitle: "终端", // 终端选项开的标题
    groupsTitle: "分组", // 分组选项卡的标题
    showTerminalsColumn: [
        // 要显示的列(终端） column列名 text列的别名 style 列的样式
        {
            column: "key",
            text: "序号",
            style: { width: "15%" },
        },
        {
            column: "name",
            text: "终端名称",
            style: { width: "55%" },
        },
        {
            column: "ip_address",
            text: "终端IP",
            style: { width: "30%" },
        },
    ],
    showTerminalsGroupsColumn: [
        // 要显示的列(分组) column 列名 text 列的别名 style 列的样式
        {
            column: "key",
            text: "序号",
            style: { width: "15%" },
        },
        {
            column: "name",
            text: "分组名称",
            style: { width: "55%" },
        },
        {
            column: "list",
            text: "终端列表",
            style: { width: "30%" },
        },
    ],
    searchColumnName: "name", // 搜索的列名
    searchColumnIP: "ip_address", // 搜索的列名
    terminalsColumnName: "id", // 注入selectedTerminalsData中的终端的列名
    groupsColumnName: "id", // 注入selectedGroupsData中的分组的列名
    amplifierColumnName: "amplifier", // 注入selectedTerminalsData中的终端的 功率分区 列名
    terminalsRequestColumnName: "terminals_id", // requestTerminals中的终端列名 （即是选择后的数据，用于请求）
    groupsRequestColumnName: "terminals_groups_id", // requestGroups中的终端列名 （即是选择后的数据，用于请求）
    amplifierRequestColumnName: "amplifier", // requestTerminals中的终端的 功率分区 列名 （即是选择后的数据，用于请求）
    terminalsOtherData: {}, // 关联终端的其他数据
    groupsOtherData: {}, // 关联分组的其他数据
    amplifierTitle: "功率分区", // 八分区的标题
    amplifierValue: [1, 2, 3, 4, 5, 6, 7, 8], // 功率分区数据
    isSelectTerminals: true, // 是否可以选择终端
    isSelectGroups: true, // 是否可以选择分组
    selectAmplifier: true, // 是否可以选择功率分区
});
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
    if (
        (tab.paneName === "first" && form.searchGroupsVisible) ||
        (tab.paneName === "second" && form.searchTerminalsVisible)
    ) {
        handleClickClosePopover();
    }
};
// 处理点击搜索终端popover弹窗
const handleClickTerminalsVisible = () => {
    form.searchGroups = "";
    form.searchGroupsVisible = false;
    form.searchTerminalsVisible = !form.searchTerminalsVisible;
};
// 处理点击搜索分组popover弹窗
const handleClickGroupsVisible = () => {
    form.searchTerminals = "";
    form.searchTerminalsVisible = false;
    form.searchGroupsVisible = !form.searchGroupsVisible;
};
// 处理点击关闭popover弹窗
const handleClickClosePopover = () => {
    form.searchTerminals = "";
    form.searchTerminalsVisible = false;
    form.searchGroups = "";
    form.searchGroupsVisible = false;
};
// 处理点击关闭已选择终端/分组的搜索框
const handleClickCloSesearchInput = () => {
    form.selectedSearchTerminals = "";
    form.selectedSearchTerminalsVisible = false;
    form.selectedSearchGroups = "";
    form.selectedSearchGroupsVisible = false;
};
// 处理终端搜索
const handleTerminalsSearch = () => {
    let string = useRegex.replaceRegString(form.searchTerminals);
    form.searchTerminalsReg = new RegExp(string, "gmi");
};
// 处理已选终端搜索
const handleSelectedTerminalsSearch = () => {
    let string = useRegex.replaceRegString(form.selectedSearchTerminals);
    form.selectedSearchTerminalsReg = new RegExp(string, "gmi");
};
// 处理终端搜索
const handleGroupsSearch = () => {
    let string = useRegex.replaceRegString(form.searchGroups);
    form.searchGroupsReg = new RegExp(string, "gmi");
};
// 处理已选终端搜索
const handleSelectedGroupsSearch = () => {
    let string = useRegex.replaceRegString(form.selectedSearchGroups);
    form.selectedSearchGroupsReg = new RegExp(string, "gmi");
};
// 处理更新选择分组
const handleUpdateSelectedGroups = () => {
    let requestGroups: any[] = [];
    let selectedName = "";
    form.selectedGroupsID = [];

    form.selectedGroupsData.forEach(
        (item: { [x: string]: any; id: number; name: string }) => {
            let request: any = {};
            form.selectedGroupsID.push(item.id);
            request.name = item.name;
            selectedName += item.name + ",";
            request[config.groupsRequestColumnName] = item[config.groupsColumnName];
            request = Object.assign(request, config.groupsOtherData);
            requestGroups.push(request);
        }
    );

    emit("selectedGroupsName", selectedName);
    emit("requestGroups", requestGroups);
};
// 处理更新选择终端
const handleUpdateSelectedTerminals = () => {
    let requestTerminals: any[] = [];
    let selectedName = "";
    form.selectedTerminalsID = [];

    form.selectedTerminalsData.forEach(
        (item: { [x: string]: any; id: number; name: string }) => {
            let request: any = {};
            form.selectedTerminalsID.push(item.id);
            request.name = item.name;
            selectedName += item.name + ",";
            request[config.terminalsRequestColumnName] =
                item[config.terminalsColumnName];

            if (config.selectAmplifier) {
                request[config.amplifierRequestColumnName] =
                    item[config.amplifierColumnName];
            }

            request = Object.assign(request, config.terminalsOtherData);
            requestTerminals.push(request);
        }
    );
    emit("selectedTerminalsName", selectedName);
    emit("requestTerminals", requestTerminals);
};
// 取消全选
const deselectAll = () => {
    if (form.activeName === "first") {
        let selected: any[] = [];
        let noSelect: any[] = [];
        form.selectedTerminalsData.forEach(
            (item: { [x: string]: string; ip_address: string }) => {
                if (form.selectedSearchTerminals) {
                    item[config.searchColumnName].match(
                        form.selectedSearchTerminalsReg
                    ) || item.ip_address.match(form.selectedSearchTerminalsReg)
                        ? selected.push(item)
                        : noSelect.push(item);
                } else {
                    selected.push(item);
                }
            }
        );
        form.allTerminalsData = Array.from(selected.concat(form.allTerminalsData));
        form.selectedTerminalsData = Array.from(noSelect);
        handleUpdateSelectedTerminals();
    }

    if (form.activeName === "second") {
        let selected: any[] = [];
        let noSelected: any[] = [];
        form.selectedGroupsData.forEach((item: { [x: string]: string }) => {
            if (form.selectedSearchGroups) {
                item[config.searchColumnName].match(form.selectedSearchGroupsReg)
                    ? selected.push(item)
                    : noSelected.push(item);
            } else {
                selected.push(item);
            }
        });
        form.allGroupsData = Array.from(selected.concat(form.allGroupsData));
        form.selectedGroupsData = Array.from(noSelected);
        handleUpdateSelectedGroups();
    }
};
// 全选
const selectAll = () => {
    if (form.activeName === "first") {
        let selected: any[] = [];
        let noSelect: any[] = [];
        form.allTerminalsData.forEach(
            (item: { [x: string]: string; groups_id: any; ip_address: string }) => {
                (form.currentGroupsID <= 0 ||
                    item.groups_id.indexOf(form.currentGroupsID) >= 0) &&
                    (item[config.searchColumnName].match(form.searchTerminalsReg) ||
                        item.ip_address.match(form.searchTerminalsReg))
                    ? selected.push(item)
                    : noSelect.push(item);
            }
        );
        form.selectedTerminalsData = Array.from(
            selected.concat(form.selectedTerminalsData)
        );
        form.allTerminalsData = Array.from(noSelect);
        handleUpdateSelectedTerminals();
    }

    if (form.activeName === "second") {
        let selected: any[] = [];
        let noSelect: any[] = [];
        form.allGroupsData.forEach((item: { [x: string]: string }) => {
            item[config.searchColumnName].match(form.searchGroupsReg)
                ? selected.push(item)
                : noSelect.push(item);
        });
        form.selectedGroupsData = Array.from(
            selected.concat(form.selectedGroupsData)
        );
        form.allGroupsData = Array.from(noSelect);
        handleUpdateSelectedGroups();
    }
};
// 选择终端
const selectTerminal = (row: { id: number }) => {
    if (form.selectedTerminalsID.indexOf(row.id) < 0) {
        form.selectedTerminalsData.push(Object.assign({}, row));
        form.allTerminalsData = form.allTerminalsData.filter(
            (item: { id: number }) => {
                return row.id !== item.id;
            }
        );
        handleUpdateSelectedTerminals();
    }
};
// 删除终端
const deleteTerminal = (row: { id: number }) => {
    if (form.selectedTerminalsID.indexOf(row.id) >= 0) {
        form.allTerminalsData.unshift(Object.assign({}, row));
        form.selectedTerminalsData = form.selectedTerminalsData.filter(
            (item: { id: number }) => {
                return row.id !== item.id;
            }
        );
        handleUpdateSelectedTerminals();
    }
};
// 选择分组
const selectGroup = (row: { id: number }) => {
    if (form.selectedGroupsID.indexOf(row.id) < 0) {
        form.selectedGroupsData.push(Object.assign({}, row));
        form.allGroupsData = form.allGroupsData.filter((item: { id: number }) => {
            return row.id !== item.id;
        });
        handleUpdateSelectedGroups();
    }
};
// 删除分组
const deleteGroup = (row: { id: number }) => {
    if (form.selectedGroupsID.indexOf(row.id) >= 0) {
        form.allGroupsData.unshift(Object.assign({}, row));
        form.selectedGroupsData = form.selectedGroupsData.filter(
            (item: { id: number }) => {
                return row.id !== item.id;
            }
        );
        handleUpdateSelectedGroups();
    }
};
// 全选功率分区
const handleCheckAllAmplifierChange = (item: any) => {
    item[config.amplifierColumnName] =
        item.checkAll_amplifier === true ? config.amplifierValue : [];
    handleUpdateSelectedTerminals();
};
// 单选功率分区
const handleSelectAmplifierChange = (item: any) => {
    const checkedCount = item[config.amplifierColumnName].length;
    item.checkAll_amplifier = checkedCount === config.amplifierValue.length;
    item.isIndeterminate =
        checkedCount > 0 && checkedCount < config.amplifierValue.length;
    handleUpdateSelectedTerminals();
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
    if (config.isSelectGroups && !config.isSelectTerminals) {
        form.activeName = "second";
    } else {
        if (
            parentData.responseTerminals?.length > 0 &&
            config.isSelectGroups &&
            parentData.responseTerminals?.length < 1
        ) {
            form.activeName = "second";
        }
    }
};
// 获取所有分组
const getGroupsAll = () => {
    global.$http.get('terminals-groups/all', {
        params: {
            withTerminals: true
        }
    }).then((result: { result: number; data: any[]; }) => {
        if (result.result === 200) {
            form.allGroupsData = form.allGroupsOptions = result.data.map((item: any)=> {
                return {
                    id: item.id,
                    name: item.name,
                    terminals: item.terminals
                }
            })
        }
    })
}
// 获取所有终端
const getTerminalsAll = () => {
    global.$http.get('/terminals/all', {
        params: {
            withGroups: true
        }
    }).then((result: { result: number; data: any[]; }) => {
        if (result.result === 200) {
            form.allTerminalsData = result.data.map((item: any)=> {
                item.isShowAmplifier = false
                item.checkAll_amplifier = false
                item.isIndeterminate = false
                item.amplifier =  []
                return item
            })
        }
    })
}
// mounted 实例挂载完成后被调用
onMounted(() => {
    getTerminalsAll()
    getGroupsAll()
    config = Object.assign(
        config,
        parentData.myConfig ? parentData.myConfig : {}
    );
    setCurrentTabSelectStatus();
});
</script>

<style lang="scss" scoped>
.com-select-terminals-groups {
    display: flex;
    align-items: center;
    height: 300px;
    border: 1px solid #E7E7E7;
    .com-select-left {
        width: 300px;
        height: 100%;
        border-radius: 2px;
        border-right: 1px solid #E7E7E7;

        :deep(.select-left-tabs) {
            height: 100%;
            border: none;
            background-color: #F4F9FF;
            padding: 0 30px;

            .el-tabs__header {
                padding: 10px 0;
            }
            .el-tabs__content {
                height: calc(100% - 60px);
                padding: 0;

                .el-tab-pane {
                    height: 100%;
                }
            }
           
            .el-tabs__nav {
                width: 100%;
                background-color: #F4F9FF;
                >.el-tabs__item {
                    width: 50%;
                    padding: 0 10px;
                    text-align: center;
                    margin-top: 0;
                    color: #5EA2E2;

                    .custom-tabs-label {
                        height: 100%;

                        i {
                            height: 100%;
                            font-size: 16px;
                            margin-right: 5px;
                            vertical-align: top;
                        }

                        span {
                            display: inline-block;
                            max-width: 80%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            vertical-align: top;
                        }
                    }

                    &:first-child {
                        margin-left: 0;
                        border: 1px solid #8FC4FF;
                        border-radius: 6px 0px 0px 6px;
                    }

                    &:last-child {
                        border: 1px solid #8FC4FF;
                        border-radius: 0px 6px 6px 0px;
                    }
                }

                .is-active {
                    background-color: #0070EE;
                    color: #FFFFFF;
                }
            }

            .custom-scroll-bar {
                display: flex;
                flex-direction: column;
                height: 100%;

                .scroll-select {
                    .el-select {
                        width: 100%;
                        // margin-bottom: 18px;

                        .el-input__wrapper {
                            box-shadow: none !important;
                        }
                    }
                }

                .scroll-bar {
                    flex: 1;
                    height: calc(100% - 50px);
                }
            }
        }

        :deep(.width) {
            .el-tabs__nav {
                >.el-tabs__item {
                    width: 100%;
                }
            }
        }
    }

    .com-select-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 60px;
        height: 100%;
        text-align: center;

        >span {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 36px;
            margin: 2vh 0;
            cursor: pointer;
            color: #9CBAD4;

            &:hover {
                color: #0070EE;
            }
        }
    }

    .com-select-right {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: calc(100% - 336px);
        height: 100%;
        border-radius: 2px;
        border-left: 1px solid #ddd;
        background-color: #F4F9FF;
        .com-right-content {
            width: 100%;
            height: 100%;
        }

        .custom-right-title {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 20px;
            box-sizing: border-box;
            border-bottom: 1px solid #E2EDFB;

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

        .custom-right-content {
            flex: 1;
            height: calc(100% - 40px);

            .scroll-ul {
                li {
                    padding: 0;

                    .item-terminals {
                        position: relative;
                        display: flex;
                        align-items: center;
                        padding: 0 20px;
                        box-sizing: border-box;

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
                            .delete {
                                font-size: 10px;
                                padding: 10px;
                                &:hover {
                                    color: #0070EE;
                                }
                            }
                        }
                    }

                    .item-amplifier {
                        width: 100%;
                        background: #f0f0f0;

                        .amplifier-checkbox {
                            display: flex;
                            align-items: center;
                            line-height: 22px;
                            margin-left: 45px;

                            .el-checkbox {
                                height: 22px;
                            }

                            >label {
                                margin: 0 30px;
                            }

                            .el-checkbox-group {
                                white-space: normal;
                            }

                            >span {
                                padding-left: 10px;
                                margin: 9px 0;
                                border-left: 2px solid $c-theme;
                            }
                        }
                    }
                }
            }
        }

        .icon-font-arrow {
            position: absolute;
            top: 0;
            left: 12px;
            height: 100%;
            font-size: 16px;
        }

        .icon-font-delete {
            position: absolute;
            top: 0;
            right: 15px;
        }

        .group {
            padding: 0 40px 0 20px !important;
        }
    }

    .scroll-ul {
        li {
            line-height: 40px;
            padding: 0 15px;
            box-sizing: border-box;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            &:hover {
                background-color: #E4F0FF;
                cursor: pointer;
            }
        }
    }
}

.custom-popover {
    .el-input {
        width: 200px;
        margin-right: 10px;
    }

    .iconfont {
        cursor: pointer;
    }
}
</style>