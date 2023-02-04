<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-03
  @FilePath: src\views\play\add-edit-component\add-edit-play-task.vue
  @Describe: 新建/编辑播放任务
-->
<template>
    <div class="com-add-edit-play-task">
        <el-scrollbar>
            <div class="play-task-basics configure-level">
                <div class="from-alert">
                    <span>基础配置</span>
                </div>
                <div class="play-task-basics-content configure-level-content">
                    <el-form
                            ref="ruleFormRef"
                            :model="ruleForm"
                            label-position="top"
                            :rules="rules"
                            class="play-task-form-inline">
                        <el-row :gutter="80">
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="任务名称" prop="name">
                                    <el-input
                                        v-model="ruleForm.name"
                                        placeholder="请输入1-100字符"
                                        maxlength="100"
                                        show-word-limit
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="任务音量">
                                    <el-input-number
                                        v-model="ruleForm.volume"
                                        :min="0"
                                        :max="100"
                                        :value-on-clear="ruleForm.volume"
                                        controls-position="right"
                                    />
                                    <el-tooltip
                                        effect="dark"
                                        content="音量为0时，使用终端的默认音量"
                                        placement="right-start"
                                    >
                                        <i class="iconfont icon-tips theme"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item
                                    label="优先级"
                                    class="custom-form-input"
                                >
                                    <div class="custom-number red" title="任务优先级-音乐播放">
                                        <span class="red">[{{ priorityData.get(ruleForm.type) }}]</span>
                                    </div>
                                    <el-input-number
                                        v-model="ruleForm.priority"
                                        :min="1"
                                        :max="100"
                                        :value-on-clear="ruleForm.priority"
                                        controls-position="right"
                                    />
                                    <el-tooltip
                                        effect="dark"
                                        content="自定义优先级数值越高,同类任务中优先级越高"
                                        placement="right-start"
                                    >
                                        <i class="iconfont icon-tips theme"></i>
                                    </el-tooltip>
                            </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                <el-form-item label="音源类型">
                                    <el-select v-model="ruleForm.type">
                                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="play-task-configure configure-level">
                <div class="from-alert">
                    <span>播放配置</span>
                    <div class="play-task-configure-music" v-if="ruleForm.type === 10">
                        <span class="iconfont icon-delete" @click="deteleSelectMusic"></span>
                        <el-upload v-model:file-list="fileList" ref="uploadRef" class="upload-demo" accept=".mp3"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :multiple="true"
                            :auto-upload="false" :show-file-list="false" :on-change="uploadChange">
                            <template #trigger>
                                <span class="iconfont icon-add"></span>
                            </template>
                        </el-upload>
                    </div>
                </div>
                <div class="play-task-configure-content configure-level-content">
                    <sound-source-component v-if="ruleForm.type === 4" v-model:ruleForm="ruleForm"
                        @requestSoundSource="requestSoundSource" :selectTaskData="taskDataDetailed">
                    </sound-source-component>
                    <music-play-component
                        v-if="ruleForm.type === 10"
                        v-model:fileList="ruleForm.content"
                        v-model:musicSelect="musicSelect" :requestConfig="requestMusicConfig"
                        @requestDispose="requestDispose"
                        @deteleOneMusic="deteleOneMusic">
                    </music-play-component>
                    <remote-play-component
                        v-if="ruleForm.type === 1"
                        v-model:medias="ruleForm.medias"
                        v-model:medias_groups="ruleForm.medias_groups"
                        :soundSource="ruleForm.sound_source"
                        :responseMedia="responseMedia"
                        :responseGroups="responseeMediaGroups" @requestDispose="requestRemotePlay">
                    </remote-play-component>
                    <text-play-component v-if="ruleForm.type === 11" v-model:tsctFormData="tsctFormData"
                        :selectTaskData="requestTaskConfig">
                    </text-play-component>
                    <source-acquisition-component v-if="ruleForm.type === 12" @requestDispose="requestSourceAcquisition"
                        :selectTaskData="requestTaskConfig">
                    </source-acquisition-component>
                </div>
            </div>
            <div class="play-task-region configure-level">
                <div class="from-alert">
                    <span>执行区域</span>
                </div>
                <div class="play-task-region-content configure-level-content">
                    <el-tabs v-model="executionregiontype" class="demo-tabs">
                        <el-tab-pane label="快捷终端" :name="0">
                            <el-row :gutter="80">
                                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                                    <p class="selection-title">快捷终端</p>
                                    <div class="quick-terminal-selection">
                                        <el-input v-model="quickTerminaName" disabled />
                                        <span class="iconfont icon-select-file" @click="dialogVisible = true"></span>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="终端选择" :name="1">
                            <div class="com-data-select-compute">
                                <span>选择终端/分组</span>
                                <span>
                                    <span class="head-add-color">*</span> 已选终端:
                                    <span class="head-add-color">{{terminals.length}}</span>
                                </span>
                                <span>
                                    已选分组:
                                    <span class="head-add-color">{{terminals_groups.length}}</span>
                                </span>
                            </div>
                            <terminals-select-components
                                :responseTerminals="responseTerminals"
                                :responseGroups="responseGroups"
                                @requestTerminals="requestTerminals"
                                @requestGroups="requestGroups">
                            </terminals-select-components>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-scrollbar>
        <div class="add-edit-bottom-button">
            <div class="button button-cancel" @click="$useRouter.push('/play')">返回</div>
            <div class="button button-submit" @click="submitTask">保存</div>
            <div class="button button-submit" @click="submitTaskPlay">保存并播放</div>
        </div>
        <quick-terminal-dialog v-model:dialogVisible="dialogVisible" @handleSelectedConfigure="handleSelectedConfigure">
        </quick-terminal-dialog>
    </div>
</template>

<script lang="ts" setup>
import type {
    UploadInstance,
    UploadUserFile,
    UploadProps,
    FormInstance,
} from "element-plus";
import soundSourceComponent from "../components/sound-source-component.vue";
import musicPlayComponent from "../components/music-play-component.vue";
import remotePlayComponent from "../components/remote-play-component.vue";
import textPlayComponent from "../components/text-play-component.vue";
import sourceAcquisitionComponent from "../components/source-acquisition-component.vue";
import quickTerminalDialog from "@/components/quick-terminal-dialog.vue";
import { onBeforeRouteLeave } from 'vue-router';

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
const $useRouter = useRouter();
const $useRoute: any = useRoute();

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>();
const musicSelect: any = ref([]); //播放配置选中的音频文件
const priorityData = ref(new Map()); //优先级
const ruleForm: any = reactive({
    type: 4, //任务类型；快捷音源&远程播放走非本地http协议；其余本地http协议。
    name: "", //任务名称
    serverIP: localStorage.get("serverIP"), //服务器IP
    userID: localStorage.get("LoginUserID"), //用户ID
    priority: 50, //任务优先级
    volume: 70, //任务音量
    fast_sound_id: 0, //快捷音源id
    content: [], //音乐路径集合
    medias: [], //已选择的媒体文件
    medias_groups: [], //已选择的媒体媒体文件夹
    sound_source: {}, 
});
const fast_terminals_id = ref(); //快捷终端id
const terminals = ref([]); //终端id集合
const terminals_groups = ref([]); //终端分组id集合
const executionregiontype = ref(0); //执行区域类型 0：快捷终端 1：普通终端
const tsctFormData = ref({
    enabledplayfun: false,
    is_txt: true,
    repeattime: 1,
    ttscontent: "",
    ttsenginename: "",
    ttsspeed: 5,
    txtpath: "",
}); //文本播放表单数据
const quickTerminaName = ref("请选择快捷终端");
const soundSourceForm = ref({}); //快捷音源表单数据
const musicPlayForm: any = ref({}); //音乐播放表单数据
const remotePlayForm: any = ref({}); //远程播放表单数据
const sourAcquisiFrom: any = ref({}); //音源采集表单数据
const responseTerminals = ref([]); //已选择的终端数据
const responseGroups = ref([]); //已选择的终端数组
const responseMedia = ref([]); //已选择的媒体文件
const responseeMediaGroups = ref([]); //已选择的媒体媒体文件夹
const requestMusicConfig = ref({}); //音乐播放配置
const requestTaskConfig = ref({}); //文本播放配置
const taskDataDetailed = ref({})
const dialogVisible = ref(false);
const typeOptions = [
    { label: "快捷音源", value: 4 },
    { label: "音乐播放", value: 10 },
    { label: "远程播放", value: 1 },
    { label: "文本播放", value: 11 },
    { label: "音源采集", value: 12 },
];
const ruleFormRef = ref<FormInstance>()
// 验证
const validateName = (rule: any, value: any, callback: any) => {
    ruleForm.name = value = useRegex.replaceEmojiSpaces(value);

    if (!useRegex.validateEmpty(value)) {
        return callback(new Error("请输入"));
    } else if (!useRegex.validateName(value)) {
        return callback(new Error("该名称不符合规则"));
    }
    return callback()
};
const rules = reactive({
    name: [{ validator: validateName, trigger: 'blur' }],
})

watch(fileList, (newVal: any) => {
    setTimeout(() => {
        let dataPatch: any[] = ruleForm.content.map((item: any) => {
            return item.path;
        });
        newVal.forEach((item: any) => {
            if (!dataPatch.includes(item.raw.path)) {
                ruleForm.content.push({
                    name: item.name,
                    path: item.raw.path,
                    time: item.time,
                })
            }
        });
    }, 300);
});
// 删除选中音频
const deteleSelectMusic = () => {
    let dataPatch: any[] = musicSelect.value.map((item: any) => {
        return item.path;
    });
    ruleForm.content = ruleForm.content.filter((item: any) => {
        return dataPatch.includes(item.path) === false;
    });
    fileList.value = fileList.value?.filter((item: any) => {
        return dataPatch.includes(item.raw.path) === false;
    });
};
// 删除单个音频
const deteleOneMusic = (row: any) => {
    ruleForm.content = ruleForm.content?.filter((item: any) => {
        return item.path !== row.path
    })
    fileList.value = fileList.value?.filter((item: any) => {
        return item.raw.path !== row.path
    });
};
// 选中文件时触发
const uploadChange: UploadProps["onChange"] = (uploadFile: any) => {
    getTimes(uploadFile);
};
// 获取文件时长
const getTimes = (file: any) => {
    var content = file.raw;
    //获取录音时长
    var url = URL.createObjectURL(content);
    //经测试，发现audio也可获取视频的时长
    var audioElement = new Audio(url);
    file["time"] = 0;
    audioElement.addEventListener("loadedmetadata", () => {
        let data = audioElement.duration;
        file["time"] = parseInt(data);
    });
};
// 选择的快捷音源配置
const requestSoundSource = (data: any) => {
    soundSourceForm.value = data;
    ruleForm.fast_sound_id = data.id;
    delete soundSourceForm.value.id;
};
// 选择的音乐播放配置
const requestDispose = (data: any) => {
    musicPlayForm.value = data;
};
// 选择的远程播放表单配置
const requestRemotePlay = (data: any) => {
    remotePlayForm.value = data;
};
// 选择音源采集配置
const requestSourceAcquisition = (data: any) => {
    sourAcquisiFrom.value = data;
};
// 选中的快捷终端
const handleSelectedConfigure = (data: any) => {
    fast_terminals_id.value = data.id;
    quickTerminaName.value = data.name;
};
// 选择的终端
const requestTerminals = (data: any) => {
    terminals.value = data;
};
// 选择的终端分组
const requestGroups = (data: any) => {
    terminals_groups.value = data;
};
// 提交任务并播放
const submitTaskPlay = () => {

}
// 提交任务
const submitTask = () => {
    if (!executionregiontype.value && !fast_terminals_id.value)
        return proxy.$message.warning("请选择快捷终端");
    if (executionregiontype.value &&
        terminals.value.length === 0 &&
        terminals_groups.value.length === 0
    ) {
        return proxy.$message.warning("请选择终端或分组");
    }

    let data = Object.assign(ruleForm, {
        fast_terminals_id: executionregiontype.value !== 0 ? 0 : fast_terminals_id.value,
        terminals: executionregiontype.value ? terminals.value : [],
        terminals_groups: executionregiontype.value ? terminals_groups.value : [],
    });

    if (ruleForm.type === 10) {
        createLocalAudio(data);
    } else if (ruleForm.type === 11) {
        createTxstPlay(data);
    } else if (ruleForm.type === 1) {
        createRemteTask(data);
    } else if (ruleForm.type === 12) {
        createSoundSourceCollection(data);
    } else {
        createQuickSou(data);
    }
};
// 快捷音源任务
const createQuickSou = (data: any) => {
    if (!ruleForm.fast_sound_id) return proxy.$message.warning("请选择快捷音源");
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
        proxy.$http.put("/broadcasting/" + $useRoute.query.id,
            Object.assign(data, {
                sound_source: soundSourceForm.value,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        });
    }else {
        proxy.$http.post("/broadcasting",
            Object.assign(data, {
                sound_source: soundSourceForm.value,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        });
    }
};
// 音乐播放任务
const createLocalAudio = (data: any) => {
    if (ruleForm.content.length === 0)
        return proxy.$message.warning("请添加音频文件");
    if (musicPlayForm.value?.play_model !== 0 && musicPlayForm.value?.life_time === "00:00:00")
        return proxy.$message.warning("请选择持续时间");
    if (musicPlayForm.value?.play_model !== 0 && !musicPlayForm.value?.play_number)
        return proxy.$message.warning("请输入正确播放曲目");
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
        proxy.$http1.put("/task", 
            Object.assign(data, musicPlayForm.value, {
                id: Number($useRoute.query.id)
            })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        })
    } else {
        proxy.$http1.post("/task",
            Object.assign(data, musicPlayForm.value)
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        })
    }
};
// 远程播放
const createRemteTask = (data: any) => {
    if (ruleForm.medias.length === 0 && ruleForm.medias_groups.length === 0)
        return proxy.$message.warning("请添加媒体文件或媒体文件夹");
    if (remotePlayForm.value?.play_model !== 0 && remotePlayForm.value?.life_time === "00:00:00")
        return proxy.$message.warning("请选择持续时间");
    if (remotePlayForm.value?.play_model !== 0 && !remotePlayForm.value?.play_number)
        return proxy.$message.warning("请输入正确播放曲目");

    if ($useRoute.query.id && $useRoute.query.id !== "0") {
        proxy.$http.put("/broadcasting/" + $useRoute.query.id, 
            Object.assign(data, {
                sound_source: remotePlayForm.value,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        })
    } else {
        proxy.$http.post("/broadcasting",
            Object.assign(data, {
                sound_source: remotePlayForm.value,
            })
        )
        .then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        });
    }
};
// 文本播放
const createTxstPlay = (data: any) => {
    if (tsctFormData.value.is_txt && tsctFormData.value.txtpath === "")
        return proxy.$message.warning("请选择文本路径");
    if (!tsctFormData.value.is_txt && tsctFormData.value.ttscontent === "")
        return proxy.$message.warning("请输入文本内容");
    if (!tsctFormData.value.ttsenginename)
        return proxy.$message.warning("请选择播放语音");
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
        proxy.$http1.put("/task",
            Object.assign(data, {
                content: tsctFormData.value,
                id: Number($useRoute.query.id),
            })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        });
    } else {
        proxy.$http1.post(
            "/task",
            Object.assign(data, {
                content: tsctFormData.value,
            })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        });
    }
};
// 音源采集
const createSoundSourceCollection = (data: any) => {
    let fromData: any = {
        audioQuality: sourAcquisiFrom.value.audioQuality,
    };

    if (sourAcquisiFrom.value.type === 1) {
        if (sourAcquisiFrom.value.selectVal === "" || sourAcquisiFrom.value.selectVal.id || JSON.stringify(sourAcquisiFrom.value.selectVal) === '{}')
            return proxy.$message.warning("请选择声卡");
        if (sourAcquisiFrom.value.record && sourAcquisiFrom.value.recordpath === "")
            return proxy.$message.warning("请选择录音存放路径");
        fromData["soundcard"] = sourAcquisiFrom.value.selectVal;
        fromData["record"] = sourAcquisiFrom.value.record;
        fromData["recordpath"] = sourAcquisiFrom.value.recordpath;
    } else {
        if (sourAcquisiFrom.value.selectVal === "" || !sourAcquisiFrom.value.selectVal.id)
            return proxy.$message.warning("请选择采集终端");
        fromData["terminalID"] = sourAcquisiFrom.value.selectVal.id;
    }

    let submitFrom = Object.assign(
        {},
        data,
        {
            content: fromData,
        },
        {
            type: sourAcquisiFrom.value.type === 1 ? 12 : 13,
        }
    );
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
        proxy.$http1.put("/task",Object.assign(submitFrom, {
            id: Number($useRoute.query.id)
        })
        ).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        })
    } else {
        proxy.$http1.post("/task", submitFrom).then((result: any) => {
            if (result.result === 200) {
                $useRouter.push("/play");
            }
        });
    }
};
// 请求本地任务
const getLocalTask = (row: any) => {
    proxy.$http1.get("/task/" + row).then((result: any) => {
        requestTaskConfig.value = result.data;
        ruleForm.type = result.data.type;
        ruleForm.name = result.data.name;
        ruleForm.volume = result.data.volume;
        ruleForm.priority = result.data.priority;
        if (ruleForm.type === 13) {
            ruleForm.type = 12;
        }
        if (ruleForm.type === 10) {
            ruleForm.content = result.data.content;
            requestMusicConfig.value = {
                life_time: result.data.life_time,
                play_model: result.data.play_model,
            };
        }
        if (result.data.fast_terminals_id === 0) {
            executionregiontype.value = 1;
        }else {
            quickTerminaName.value = result.data.fast_terminals?.name;
        }
        if (result.data.terminals && result.data.fast_terminals_id === 0) {
            responseTerminals.value = result.data.terminals
        }
        if (result.data.terminals_groups && result.data.fast_terminals_id === 0) {
            responseGroups.value = result.data.terminals_groups
        }
    });
};
// 请求服务器任务
const getServeTask = (row: any) => {
    proxy.$http.get("/broadcasting/" + row, {
        params: {
            withMedias: true,
            withGroups: true,
            withFastSound: true,
            withTerminals: true,
            withFastTerminal: true,
        },
    }).then((result: any) => {
        taskDataDetailed.value = result.data
        ruleForm.type = result.data.type;
        ruleForm.name = result.data.name;
        ruleForm.volume = result.data.volume;
        ruleForm.priority = result.data.priority;
        ruleForm.sound_source = result.data.sound_source;
        if (result.data.fast_terminals_id === 0) {
            executionregiontype.value = 1;
        } else {
            quickTerminaName.value = result.data.fast_terminals.name;
        }
        if (ruleForm.type === 1) {
            responseMedia.value = result.data.medias;
            responseeMediaGroups.value = result.data.medias_groups;
        }
        responseTerminals.value = result.data.terminals
        responseGroups.value = result.data.terminals_groups
    });
};
// 获取所有系统优先级
const getPrioritySetting = () => {
    return new Promise((resolve, reject) => {
        proxy.$http.get("/priority-setting").then((restlu: any) => {
            restlu.data.forEach((item: { task_type: any; priority: any }) => {
                priorityData.value.set(item.task_type, item.priority);
            });
            resolve(restlu.data)
        });
    })
};
// mounted 实例挂载完成后被调用
onMounted(() => {
    getPrioritySetting()
    if ($useRoute.query.id && $useRoute.query.id !== "0") {
        if ($useRoute.query.type < 10) {
            getServeTask($useRoute.query.id);
        } else {
            getLocalTask($useRoute.query.id);
        }
    }
});
onBeforeRouteLeave((to, from, next)=> {
    if (to.path === '/play' || to.path === '/') {
        next()
    }else {
        ElMessageBox.confirm(
            '本次修改尚未保存，即将退出页面，是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            next()
        })
    }
})
</script>

<style lang="scss">
.com-add-edit-play-task {
    height: calc(100% - 68px);

    .from-alert {
        padding: 14px 0;
        border-bottom: 1px solid #e0e2e3;

        span {
            font-size: 14px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #6f95c1;
        }
    }

    .configure-level {
        padding: 8px 40px 20px 40px;

        .configure-level-content {
            padding-top: 22px;
        }

        .el-tabs__nav-wrap::after {
            height: 0;
        }

        .selection-title {
            padding: 8px 0;
            color: #666666;
        }

        .quick-terminal-selection {
            position: relative;

            .el-input {
                width: 100%;
            }

            .el-input.is-disabled .el-input__wrapper {
                background-color: #fff;
            }

            .iconfont {
                position: absolute;
                right: -20px;
                color: #0070ee;
                line-height: 32px;
                cursor: pointer;
            }
        }
    }

    .play-task-form-inline {
        overflow: hidden;

        .el-form-item {
            .el-form-item__content {
                .el-select, .el-input-number {
                    width: 100%;
                }
            }
        }
        .custom-form-input {
            .el-input-number {
                width: calc(100% - 50px) !important;
            }
        }
        
        .fast-sound-source {
            width: 100%;
            position: relative;

            .el-input.is-disabled .el-input__wrapper {
                background-color: #fff;
            }

            .iconfont {
                position: absolute;
                right: -20px;
                color: #0070ee;
                cursor: pointer;
            }
        }

        .icon-tips {
            position: absolute;
            top: -35px;
            left: -20px;
        }
    }

    .play-task-configure-music {
        float: right;

        span {
            font-size: 20px;
            color: #9cbad4;
            margin-left: 22px;
            cursor: pointer;

            &:hover {
                color: #0070ee;
            }
        }

        .upload-demo {
            display: inline-block;
        }
    }

    .add-edit-bottom-button {
        position: fixed;
        bottom: 0;
        left: 136px;
        width: calc(100% - 136px);
        height: 68px;
        border-top: 1px solid #e0e2e3;
        text-align: right;

        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 6px 20px;
            border-radius: 4px;
            margin-right: 10px;
            color: #ffffff;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            cursor: pointer;

            &:last-child {
                margin-right: 40px;
            }
        }

        .button-cancel {
            color: #7992d5;
            background-color: #e1eafd;
        }

        .button-submit {
            background-color: #0070ee;
        }
    }
}
</style>
