<!-- 
  @Author: hmf
  @CreateDate: 2022-08-13
  @FilePath: src\components\select_components\select_media_group.vue
  @Describe: 选择媒体和媒体文件夹
-->
<template>
    <div class="com-select-media-group">
        <div class="com-select-left">
            <el-tabs type="border-card" class="select-left-tabs" :class="{ width: !config.isSelectGroups }"
                v-model="form.activeName" @tab-click="handleTabClick">
                <el-tab-pane name="first" v-if="config.isSelectMedia">
                    <template #label>
                        <div class="custom-tabs-label">
                            <el-popover :visible="form.searchMediaVisible" placement="top-start" :width="260">
                                <template #reference>
                                    <el-icon @click="handleClickMediaVisible">
                                        <Search />
                                    </el-icon>
                                </template>
                                <div class="custom-popover">
                                    <el-input v-model="form.searchMedia" placeholder="媒体" maxlength="100" clearable
                                        @input="handleMediaSearch" />
                                    <i class="iconfont icon-clear" @click="handleClickClosePopover"></i>
                                </div>
                            </el-popover>
                            <span>{{ config.mediaTitle }}</span>
                        </div>
                    </template>
                    <div class="custom-scroll-bar">
                        <div class="scroll-select">
                            <el-select v-model="form.currentGroupsID">
                                <el-option :key="0" label="所有文件夹" :value="0" />
                                <el-option v-for="item in form.allGroupsOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </div>
                        <div class="scroll-bar">
                            <el-scrollbar>
                                <ul class="scroll-ul">
                                    <template v-for="item in form.allMediaData" :key="item.id">
                                        <li @click="selectTerminal(item)" v-show="
                                            !form.searchMediaVisible ||
                                            item[config.searchColumnName].match(form.searchMediaReg)
                                        ">
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
                            <el-popover :visible="form.searchGroupsVisible" placement="top-start" :width="260">
                                <template #reference>
                                    <el-icon @click="handleClickGroupsVisible">
                                        <Search />
                                    </el-icon>
                                </template>
                                <div class="custom-popover">
                                    <el-input v-model="form.searchGroups" placeholder="媒体文件夹" maxlength="100" clearable
                                        @input="handleGroupsSearch" />
                                    <i class="iconfont icon-clear" @click="handleClickClosePopover"></i>
                                </div>
                            </el-popover>
                            <span>{{ config.groupsTitle }}</span>
                        </div>
                    </template>
                    <el-scrollbar>
                        <ul class="scroll-ul">
                            <template v-for="item in form.allGroupsData" :key="item.id">
                                <li @click="selectGroup(item)" v-show="
                                    !form.searchGroupsVisible ||
                                    item[config.searchColumnName].match(form.searchGroupsReg)
                                ">
                                    {{ item.name }}
                                </li>
                            </template>
                        </ul>
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="com-select-center">
            <span title="全部右移" @click="selectAll" class="iconfont icon-shift-right"> </span>
            <span title="全部左移" @click="deselectAll" class="iconfont icon-shift-left">
            </span>
        </div>
        <!-- 已选媒体 -->
        <div class="com-select-right" v-show="form.activeName === 'first'" v-if="config.isSelectMedia">
            <div class="custom-right-title">
                <div v-for="(item, index) in config.showMediaColumn" :key="index" :style="item.style">
                    <template v-if="
                        item.column !== config.searchColumnName || !form.selectedSearchMediaVisible
                    ">
                        <el-icon @click="form.selectedSearchMediaVisible = !form.selectedSearchMediaVisible"
                            v-if="item.column === config.searchColumnName">
                            <Search />
                        </el-icon>
                        <span>
                            {{ item.text }}
                        </span>
                    </template>
                    <span v-else>
                        <el-input class="title-search-input" v-model="form.selectedSearchMedia" placeholder="媒体"
                            maxlength="100" clearable @input="handleSelectedMediaSearch" />
                        <i class="iconfont icon-clear delete" @click="handleClickCloSesearchInput"></i>
                    </span>
                </div>
            </div>
            <div class="custom-right-content">
                <el-scrollbar>
                    <ul class="scroll-ul">
                        <template v-for="(item, index) in form.selectedMediaData" :key="item.id">
                            <li v-show="
                                !form.selectedSearchMediaVisible ||
                                item[config.searchColumnName].match(form.selectedSearchMediaReg)
                            " class="drag" draggable="true" @dragstart.stop="handleMediasDragStart($event, item)"
                                @dragover.prevent="handleMediasDragOver($event)"
                                @dragenter="handleMediasDragEnter($event, item)" @dragend="handleMediasDragEnd()">
                                <div class="item-media">
                                    <div v-for="(row, key) in config.showMediaColumn" :key="key" :style="row.style"
                                        :title="item[row.column]">
                                        <span>
                                            {{
                                                    row.column === "key"
                                                        ? index + 1
                                                        : row.column === "length"
                                                            ? formatSecondNo(item[row.column])
                                                            : item[row.column]
                                            }}
                                        </span>
                                    </div>
                                    <div class="icon-font-delete">
                                        <i class="iconfont icon-clear delete" @click="deleteTerminal(item)"></i>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <!-- 已选媒体文件夹 -->
        <div class="com-select-right" v-show="form.activeName === 'second'" v-if="config.isSelectGroups">
            <div class="custom-right-title">
                <div v-for="(item, index) in config.showMediaGroupsColumn" :key="index" :style="item.style">
                    <template v-if="
                        item.column !== config.searchColumnName || !form.selectedSearchGroupsVisible
                    ">
                        <el-icon @click="
                            form.selectedSearchGroupsVisible = !form.selectedSearchGroupsVisible
                        " v-if="item.column === config.searchColumnName">
                            <Search />
                        </el-icon>
                        <span>{{ item.text }}</span>
                    </template>
                    <span v-else>
                        <el-input class="title-search-input" v-model="form.selectedSearchGroups" placeholder="媒体文件夹"
                            maxlength="100" clearable @input="handleSelectedGroupsSearch" />
                        <i class="iconfont icon-clear delete" @click="handleClickCloSesearchInput"></i>
                    </span>
                </div>
            </div>
            <div class="custom-right-content">
                <el-scrollbar>
                    <ul class="scroll-ul">
                        <template v-for="(item, index) in form.selectedGroupsData" :key="item.id">
                            <li v-show="
                                !form.selectedSearchGroupsVisible ||
                                item[config.searchColumnName].match(form.selectedSearchGroupsReg)
                            ">
                                <div class="item-media">
                                    <div v-for="(row, key) in config.showMediaGroupsColumn" :key="key"
                                        :style="row.style" :title="item[row.column]">
                                        <span>
                                            {{
                                                    row.column === "key"
                                                        ? index + 1
                                                        : row.column === "length"
                                                            ? formatSecondNo(Number(item[row.column]))
                                                            : item[row.column]
                                            }}
                                        </span>
                                    </div>
                                    <div class="icon-font-delete">
                                        <i class="iconfont icon-clear delete" @click="deleteGroup(item)"></i>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <p class="com-second-tip">
            播放时长约:
            {{ usePublicMethod.convertSongDuration(form.mediaSecond + form.groupsSecond) }}
        </p>
    </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from "element-plus";
import usePublicMethod from "@/utils/global/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const systemStore = getStore.useSystemStore();

// 声明触发事件
const emit = defineEmits([
    "requestMedia", // 更新传递已选择的媒体数据，用于父组件进行数据交互
    "requestGroups", // 更新传递已选择的媒体文件夹数据，用于父组件进行数据交互
    "selectedMediaName", // 更新传递已选择的媒体数据名称，用于父组件进行数据交互
    "selectedGroupsName", // 更新传递已选择的媒体文件夹数据名称，用于父组件进行数据交互
    "totalSecond", // 已选择的媒体总时长-秒
]);
// 声明父组件传值
const parentData = defineProps([
    "myConfig", // config 配置,将对应覆盖 config
    "responseMedia", // 编辑界面传递回来的媒体数据，用于展示组件的已选择状态
    "responseGroups", // 编辑界面传递回来的媒体文件夹数据，用于展示组件的已选择状态
]);

const form = reactive<any>({
    activeName: "first",
    searchMedia: "", // 搜索媒体
    searchMediaReg: /.*/,
    searchGroups: "", // 搜索媒体文件夹
    searchGroupsReg: /.*/,
    selectedSearchMedia: "", // 已选择的搜索媒体
    selectedSearchMediaReg: /.*/,
    selectedSearchGroups: "", // 已选择的搜索媒体文件夹
    selectedSearchGroupsReg: /.*/,
    searchMediaVisible: false, // 是否显示搜索媒体popover弹窗
    searchGroupsVisible: false, // 是否显示搜索媒体文件夹popover弹窗
    selectedSearchMediaVisible: false, // 是否显示已选择媒体的搜索框
    selectedSearchGroupsVisible: false, // 是否显示已选择媒体文件夹的搜索框
    currentGroupsID: 0, // 当前选择的媒体文件夹id
    currentSelectStatus: "first", // 当前选择tab的状态，用于编辑界面时处理数据展示
    allGroupsOptions: [], // 所有媒体文件夹-选择框
    allMediaData: [], // 所有媒体数据
    allGroupsData: [], // 所有媒体文件夹数据
    selectedMediaData: [], // 已选择的媒体数据
    selectedGroupsData: [], // 已选择的媒体文件夹数据
    selectedMediaID: [], // 已选择的媒体ID数组
    selectedGroupsID: [], // 已选择的媒体文件夹ID数组
    dragging: null, // 拖拽中
    mediaSecond: 0, // 媒体统计时长-秒
    groupsSecond: 0, // 媒体文件夹下的媒体统计时长-秒
});
// 插件配置
let config = reactive<any>({
    mediaTitle: "媒体", // 媒体选项开的标题
    groupsTitle: "媒体文件夹", // 媒体文件夹选项卡的标题
    showMediaColumn: [
        // 要显示的列(媒体） column列名 text列的别名 style 列的样式
        {
            column: "key",
            text: "序号",
            style: { width: "15%" },
        },
        {
            column: "name",
            text: "媒体",
            style: { width: "55%" },
        },
        {
            column: "length",
            text: "时长",
            style: { width: "30%" },
        },
    ],
    showMediaGroupsColumn: [
        // 要显示的列(媒体文件夹) column 列名 text 列的别名 style 列的样式
        {
            column: "key",
            text: "序号",
            style: { width: "15%" },
        },
        {
            column: "name",
            text: "媒体文件夹",
            style: { width: "55%" },
        },
        {
            column: "length",
            text: "时长",
            style: { width: "30%" },
        },
    ],
    searchColumnName: "name", // 搜索的列名
    mediaColumnName: "id", // 注入selectedMediaData中的媒体的列名
    groupsColumnName: "id", // 注入selectedGroupsData中的媒体文件夹的列名
    mediaRequestColumnName: "medias_id", // requestMedia中的媒体列名 （即是选择后的数据，用于请求）
    groupsRequestColumnName: "medias_groups_id", // requestGroups中的媒体列名 （即是选择后的数据，用于请求）
    mediaOtherData: {}, // 关联媒体的其他数据
    groupsOtherData: {}, // 关联媒体文件夹的其他数据
    isSelectMedia: true, // 是否可以选择媒体
    isSelectGroups: systemStore.functional_configs.FolderDisplay, // 是否可以选择媒体文件夹
});
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
    if (
        (tab.paneName === "first" && form.searchGroupsVisible) ||
        (tab.paneName === "second" && form.searchMediaVisible)
    ) {
        handleClickClosePopover();
    }
};
// 处理点击搜索媒体popover弹窗
const handleClickMediaVisible = () => {
    form.searchGroups = "";
    form.searchGroupsVisible = false;
    form.searchMediaVisible = !form.searchMediaVisible;
};
// 处理点击搜索媒体文件夹popover弹窗
const handleClickGroupsVisible = () => {
    form.searchMedia = "";
    form.searchMediaVisible = false;
    form.searchGroupsVisible = !form.searchGroupsVisible;
};
// 处理点击关闭popover弹窗
const handleClickClosePopover = () => {
    form.searchMedia = "";
    form.searchMediaVisible = false;
    form.searchGroups = "";
    form.searchGroupsVisible = false;
};
// 处理点击关闭已选择媒体/媒体文件夹的搜索框
const handleClickCloSesearchInput = () => {
    form.selectedSearchMedia = "";
    form.selectedSearchMediaVisible = false;
    form.selectedSearchGroups = "";
    form.selectedSearchGroupsVisible = false;
};
// 处理媒体搜索
const handleMediaSearch = () => {
    let string = useRegex.replaceRegString(form.searchMedia);
    form.searchMediaReg = new RegExp(string, "gmi");
};
// 处理已选媒体搜索
const handleSelectedMediaSearch = () => {
    let string = useRegex.replaceRegString(form.selectedSearchMedia);
    form.selectedSearchMediaReg = new RegExp(string, "gmi");
};
// 处理媒体搜索
const handleGroupsSearch = () => {
    let string = useRegex.replaceRegString(form.searchGroups);
    form.searchGroupsReg = new RegExp(string, "gmi");
};
// 处理已选媒体搜索
const handleSelectedGroupsSearch = () => {
    let string = useRegex.replaceRegString(form.selectedSearchGroups);
    form.selectedSearchGroupsReg = new RegExp(string, "gmi");
};
// 处理更新选择媒体文件夹
const handleUpdateSelectedGroups = () => {
    let requestGroups: any[] = [];
    let selectedName = "";
    form.groupsSecond = 0;
    form.selectedGroupsID = [];

    form.selectedGroupsData.forEach(
        (item: { [x: string]: any; id: number; name: string }) => {
            let request: any = {};
            form.selectedGroupsID.push(item.id);
            form.groupsSecond += Number.parseInt(item.length);

            request.name = item.name;
            selectedName += item.name + ",";
            request[config.groupsRequestColumnName] = item[config.groupsColumnName];
            request.length = Number(item.length);
            request = Object.assign(request, config.groupsOtherData);
            requestGroups.push(request);
        }
    );

    emit("selectedGroupsName", selectedName);
    emit("requestGroups", requestGroups);
    emit("totalSecond", form.mediaSecond + form.groupsSecond);
};
// 处理更新选择媒体
const handleUpdateSelectedMedia = () => {
    let requestMedia: any[] = [];
    let selectedName = "";
    form.mediaSecond = 0;
    form.selectedMediaID = [];

    form.selectedMediaData.forEach(
        (item: { [x: string]: any; id: number; name: string }) => {
            let request: any = {};
            form.selectedMediaID.push(item.id);
            form.mediaSecond += Number.parseInt(item.length) + 2;

            request.name = item.name;
            selectedName += item.name + ",";
            request[config.mediaRequestColumnName] = item[config.mediaColumnName];
            request.length = Number(item.length) + 2;
            request = Object.assign(request, config.mediaOtherData);
            requestMedia.push(request);
        }
    );

    emit("selectedMediaName", selectedName);
    emit("requestMedia", requestMedia);
    emit("totalSecond", form.mediaSecond + form.groupsSecond);
};
// 取消全选
const deselectAll = () => {
    if (form.activeName === "first") {
        let selected: any[] = [];
        let noSelect: any[] = [];
        form.selectedMediaData.forEach(
            (item: { [x: string]: string; ip_address: string }) => {
                if (form.selectedSearchMedia) {
                    item[config.searchColumnName].match(form.selectedSearchMediaReg) ||
                        item.ip_address.match(form.selectedSearchMediaReg)
                        ? selected.push(item)
                        : noSelect.push(item);
                } else {
                    selected.push(item);
                }
            }
        );
        form.allMediaData = Array.from(selected.concat(form.allMediaData));
        form.selectedMediaData = Array.from(noSelect);
        handleUpdateSelectedMedia();
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
        form.allMediaData.forEach(
            (item: { [x: string]: string; groups_id: any; ip_address: string }) => {
                (form.currentGroupsID <= 0 ||
                    item.groups_id.indexOf(form.currentGroupsID) >= 0) &&
                    (item[config.searchColumnName].match(form.searchMediaReg) ||
                        item.ip_address.match(form.searchMediaReg))
                    ? selected.push(item)
                    : noSelect.push(item);
            }
        );
        form.selectedMediaData = Array.from(selected.concat(form.selectedMediaData));
        form.allMediaData = Array.from(noSelect);
        handleUpdateSelectedMedia();
    }

    if (form.activeName === "second") {
        let selected: any[] = [];
        let noSelect: any[] = [];
        form.allGroupsData.forEach((item: { [x: string]: string }) => {
            item[config.searchColumnName].match(form.searchGroupsReg)
                ? selected.push(item)
                : noSelect.push(item);
        });
        form.selectedGroupsData = Array.from(selected.concat(form.selectedGroupsData));
        form.allGroupsData = Array.from(noSelect);
        handleUpdateSelectedGroups();
    }
};
// 选择媒体
const selectTerminal = (row: { id: number }) => {
    if (form.selectedMediaID.indexOf(row.id) < 0) {
        form.selectedMediaData.push(Object.assign({}, row));
        form.allMediaData = form.allMediaData.filter((item: { id: number }) => {
            return row.id !== item.id;
        });
        handleUpdateSelectedMedia();
    }
};
// 删除媒体
const deleteTerminal = (row: { id: number }) => {
    if (form.selectedMediaID.indexOf(row.id) >= 0) {
        form.allMediaData.unshift(Object.assign({}, row));
        form.selectedMediaData = form.selectedMediaData.filter((item: { id: number }) => {
            return row.id !== item.id;
        });
        handleUpdateSelectedMedia();
    }
};
// 选择媒体文件夹
const selectGroup = (row: { id: number }) => {
    if (form.selectedGroupsID.indexOf(row.id) < 0) {
        form.selectedGroupsData.push(Object.assign({}, row));
        form.allGroupsData = form.allGroupsData.filter((item: { id: number }) => {
            return row.id !== item.id;
        });
        handleUpdateSelectedGroups();
    }
};
// 删除媒体文件夹
const deleteGroup = (row: { id: number }) => {
    if (form.selectedGroupsID.indexOf(row.id) >= 0) {
        form.allGroupsData.unshift(Object.assign({}, row));
        form.selectedGroupsData = form.selectedGroupsData.filter((item: { id: number }) => {
            return row.id !== item.id;
        });
        handleUpdateSelectedGroups();
    }
};
// 设置tab当前选择状态
const setCurrentTabSelectStatus = () => {
    if (config.isSelectGroups && !config.isSelectMedia) {
        form.activeName = "second";
    } else {
        if (
            parentData.responseMedia?.length > 0 &&
            config.isSelectGroups &&
            parentData.responseMedia?.length < 1
        ) {
            form.activeName = "second";
        }
    }
};
// 拖拽开始
const handleMediasDragStart = (e: any, item: { id: any }) => {
    form.dragging = item;
    // 如果不设置内容 火狐 拖不了
    e.dataTransfer.setData("Text", item.id);
};
// 拖拽结束
const handleMediasDragEnd = () => {
    form.dragging = null;
};
// 首先把div变成可以放置的元素，即重写dragenter/dragover
const handleMediasDragOver = (e: any) => {
    // 在dragenter中针对放置目标来设置!
    e.dataTransfer.dropEffect = "move";
};
// 拖拽确认
const handleMediasDragEnter = (e: any, item: any) => {
    // 为需要移动的元素设置dragstart事件
    e.dataTransfer.effectAllowed = "move";

    if (item === form.dragging) {
        return;
    }

    const newMedias = [...form.selectedMediaData];
    const src = newMedias.indexOf(form.dragging);
    const dst = newMedias.indexOf(item);

    newMedias.splice(dst, 0, ...newMedias.splice(src, 1));

    form.selectedMediaData = newMedias;
    handleUpdateSelectedMedia();
};
// 时长转换
const formatSecondNo = (seconds: any) => {
    let hour: any =
        Math.floor(seconds / 3600) >= 10
            ? Math.floor(seconds / 3600)
            : "0" + Math.floor(seconds / 3600);
    seconds -= 3600 * hour;
    let min: any =
        Math.floor(seconds / 60) >= 10
            ? Math.floor(seconds / 60)
            : "0" + Math.floor(seconds / 60);
    seconds -= 60 * min;
    let sec = seconds >= 10 ? Math.trunc(seconds) : "0" + Math.trunc(seconds);
    return hour + ":" + min + ":" + sec;
};
const handleGetAllMeida = () => {
    proxy.$http
        .get("/medias/all", {
            params: {
                check: true,
            },
        })
        .then((result: any) => {
            form.allMediaData = result.data.map((item: any) => {
                item.isShowAmplifier = false;
                item.checkAll_amplifier = false;
                item.isIndeterminate = false;
                item.amplifier = [];
                return item;
            });
            handleEditTerminalsData();
        });
};
const handleGetAllGroups = () => {
    proxy.$http
        .get("/medias-groups/all", {
            params: {
                check: true,
            },
        })
        .then((result: any) => {
            form.allGroupsData = result.data;
            handleEditGroupsData();
        });
};
// 设置编辑界面传递回来的ids
const setEditDataIDS = (data: any[]) => {
    let ids = [];
    if (data?.length > 0) {
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            ids.push(item.id);
        }
    }
    return ids;
};
// 处理编辑界面传递回来的已选择媒体数据
const handleEditTerminalsData = () => {
    form.selectedMediaID = setEditDataIDS(parentData.responseMedia);
    let allData = [];
    let selectedData = [];
    for (let index = 0; index < form.allMediaData.length; index++) {
        const item = form.allMediaData[index];
        // 根据编辑界面返回的媒体ids，直接做对应处理
        if (form.selectedMediaID.includes(item.id)) {
            selectedData.push(item);
        } else {
            allData.push(item);
        }
    }
    form.allMediaData = allData;
    form.selectedMediaData = selectedData;
    handleUpdateSelectedMedia();
};
// 处理编辑界面传递回来的已选择分组数据
const handleEditGroupsData = () => {
    form.selectedGroupsID = setEditDataIDS(parentData.responseGroups);
    let allData = [];
    let selectedData = [];
    for (let index = 0; index < form.allGroupsData.length; index++) {
        const item = form.allGroupsData[index];
        // 根据编辑界面返回的分组ids，直接做对应处理
        if (form.selectedGroupsID.includes(item.id)) {
            selectedData.push(item);
        } else {
            allData.push(item);
        }
    }
    form.allGroupsData = allData;
    form.selectedGroupsData = selectedData;
    handleUpdateSelectedGroups();
};
// 监听变化
watch(
    () => parentData,
    (newData) => {
        if (config.isSelectMedia && newData.responseMedia.length > 0) {
            handleEditTerminalsData();
        }
        if (config.isSelectGroups && newData.responseGroups.length > 0) {
            handleEditGroupsData();
        }
    },
    {
        // 设置首次进入执行方法 immediate
        // immediate: true,
        deep: true,
    }
);
// mounted 实例挂载完成后被调用
onMounted(() => {
    config = Object.assign(config, parentData.myConfig ? parentData.myConfig : {});
    config.isSelectMedia && handleGetAllMeida();
    config.isSelectGroups && handleGetAllGroups();
});
</script>

<style lang="scss" scoped>
.com-select-media-group {
    display: flex;
    align-items: center;
    height: 300px;
    border: 1px solid #e7e7e7;

    .com-select-left {
        width: 300px;
        height: 100%;
        border-radius: 2px;
        border-right: 1px solid #e7e7e7;

        :deep(.select-left-tabs) {
            height: 100%;
            border: none;
            background-color: #f4f9ff;
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
                background-color: #f4f9ff;

                >.el-tabs__item {
                    width: 50%;
                    padding: 0 10px;
                    text-align: center;
                    margin-top: 0;
                    color: #5ea2e2;

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
                        border: 1px solid #8fc4ff;
                        border-radius: 6px 0px 0px 6px;
                    }

                    &:last-child {
                        border: 1px solid #8fc4ff;
                        border-radius: 0px 6px 6px 0px;
                    }
                }

                .is-active {
                    background-color: #0070ee;
                    color: #ffffff;
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
            color: #9cbad4;

            &:hover {
                color: #0070ee;
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
        background-color: #f4f9ff;

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
            border-bottom: 1px solid #e2edfb;

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

                    .item-media {
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
                                    color: #0070ee;
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
                background-color: #e4f0ff;
                cursor: pointer;
            }
        }

        .drag {
            cursor: grab;
        }
    }
}

.com-second-tip {
    position: absolute;
    right: 0;
    bottom: -26px;
    line-height: 26px;
    text-align: right;
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
