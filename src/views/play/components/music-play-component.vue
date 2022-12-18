<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-15
  @FilePath: src\views\play\components\music-play-component.vue
  @Describe: 音乐播放组件（选择本地音频）
-->
<template>
    <div class="com-music-play-component">
        <div class="com-main">
            <div class="com-table">
                <el-table :data="tableData" style="width: 100%" height="250" ref="multipleTableRef"
                    @selection-change="handleSelectionChange"
                    row-class-name="com-table-list">
                    <el-table-column type="index" width="60" label="序号"/>
                    <el-table-column prop="name" label="文件名称" show-overflow-tooltip/>
                    <el-table-column prop="time" label="时长">
                        <template #default="scope">
                            {{ formatSecondNo(scope.row.time) }}
                        </template>
                    </el-table-column>
                    <el-table-column  width="55">
                        <template #default="scope">
                            <div class="com-table-list-del">
                                <span class="iconfont icon-close" @click="handleDelData(scope.row)"></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="55" />
                </el-table>
            </div>
        </div>
        <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
            <el-row :gutter="80">
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <el-form-item label="播放模式">
                        <el-select v-model="ruleForm.play_model">
                            <el-option v-for="item in playmodelOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model === 0">
                    <el-form-item label="持续时间">
                        {{ duration }}
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model !== 0">
                    <el-form-item>
                        <el-radio v-model="ruleForm.type" :label="1"
                            style="height: 22px; margin-bottom: 8px">持续时间</el-radio>
                        <el-time-picker v-model="ruleForm.life_time" format="HH:mm:ss" value-format="HH:mm:ss"
                            :disabled="ruleForm.type !== 1" />
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model !== 0">
                    <el-form-item>
                        <el-radio v-model="ruleForm.type" :label="2"
                            style="height: 22px; margin-bottom: 8px">播放曲目</el-radio>
                        <el-input v-model="ruleForm.play_number" :disabled="ruleForm.type !== 2" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const props = defineProps({
    fileList: Array,
    requestConfig: Object,
});
const emit = defineEmits(["update:musicSelect", "requestDispose", 'deteleOneMusic']);
const ruleForm = reactive({
    play_model: 0, //播放模式
    life_time: "00:00:00", //持续时间
    play_number: 1, //播放曲目
    type: 1, //选中类型（次数或时间）
});

const duration = ref(""); //持续时间
const playmodelOptions = [
    { label: "列表播放", value: 0 },
    { label: "循环播放", value: 1 },
    { label: "随机播放", value: 2 },
];
const tableData = computed(() => {
    return props.fileList;
});

watch(tableData, (newVal) => {
    let timeDuration = 0;
    newVal?.forEach((item: any) => {
        timeDuration += Number(item.time);
    });
    duration.value = formatSecondNo(timeDuration);
});
watch([ruleForm, duration], () => {
    let data;
    if (ruleForm.play_model !== 0 && ruleForm.type !== 1) {
        data = {
            play_model: ruleForm.play_model,
            play_number: ruleForm.play_number,
        };
    } else {
        data = {
            play_model: ruleForm.play_model,
            life_time: ruleForm.play_model === 0 ? duration.value : ruleForm.life_time,
        };
    }
    emit("requestDispose", data);
});

const handleSelectionChange = (val: any) => {
    val.forEach((item: { name: any }) => {
        return item.name;
    });
    emit("update:musicSelect", val);
};
//删除数据
const handleDelData = (row: any) => {
    emit('deteleOneMusic', row)
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

// mounted 实例挂载完成后被调用
onMounted(() => {
    if (props.requestConfig) {
        const hasLifeTime = Object.prototype.hasOwnProperty.call(
            props.requestConfig,
            "life_time"
        );
        const hasPlayNumber = Object.prototype.hasOwnProperty.call(
            props.requestConfig,
            "play_number"
        );

        ruleForm.play_model = props.requestConfig.play_model || 0;
        ruleForm.life_time = hasLifeTime ? props.requestConfig.life_time : "00:00:00";
        ruleForm.play_number = hasPlayNumber ? props.requestConfig.play_number : 1;
        duration.value = hasLifeTime ? props.requestConfig.life_time : "00:00:00";

        if (ruleForm.play_model > 0) {
            ruleForm.type = hasLifeTime ? 1 : 2;
        }
    }
    emit("requestDispose", ruleForm);
});
</script>

<style lang="scss" scoped>
    .com-music-play-component {
        .com-table-list {
            .com-table-list-del {
                display: none;
            }
            &:hover {
                .com-table-list-del {
                    display: inline-block;
                }
            }
        }
    }
</style>
