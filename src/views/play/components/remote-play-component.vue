<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-15
  @FilePath: src\views\play\components\remote-play-component.vue
  @Describe: 媒体选择
-->
<template>
  <div class="com-remote-play-component">
    <div class="com-data-select-compute">
      <span>
        {{ $t("Select media") }}
        <template v-if="systemStore.functional_configs.GroupDisplay">
          /{{ $t("Media folder") }}
        </template>
      </span>
      <span>
        <span class="head-add-color">*</span> {{ $t("Selected media") }}:
        <span class="head-add-color">{{ mediaNum }}</span>
      </span>
      <span v-if="systemStore.functional_configs.GroupDisplay">
        {{ $t("Selected folder") }}:
        <span class="head-add-color">{{ mediaGroupsNum }}</span>
      </span>
    </div>
    <select-media-group
      :responseMedia="props.responseMedia"
      :responseGroups="props.responseGroups"
      @requestMedia="requestMedia"
      @requestGroups="requestMediaGroups"
      @totalSecond="totalSecond"
    >
    </select-media-group>
    <el-form :model="ruleForm" label-position="top" class="play-task-form-inline">
      <el-row :gutter="80">
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
          <el-form-item :label="$t('Play mode')">
            <el-select v-model="ruleForm.play_model">
              <el-option
                v-for="item in playmodelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model === 0">
          <el-form-item :label="$t('Duration')">
            {{ usePublicMethod.convertSongDuration(duration) }}
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model !== 0">
          <el-form-item>
            <el-radio
              v-model="ruleForm.radioVal"
              :label="1"
              style="height: 22px; margin-bottom: 8px"
            >
              {{ $t("Duration") }}
            </el-radio>
            <el-time-picker
              v-model="ruleForm.life_time"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              :clearable="false"
              :disabled="ruleForm.radioVal !== 1"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-if="ruleForm.play_model !== 0">
          <el-form-item>
            <el-radio
              v-model="ruleForm.radioVal"
              :label="2"
              style="height: 22px; margin-bottom: 8px"
            >
              {{ $t("Play track") }}
            </el-radio>
            <el-input-number
              v-model="ruleForm.play_number"
              :min="1"
              :max="9999"
              :value-on-clear="1"
              controls-position="right"
              :disabled="ruleForm.radioVal !== 2"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import selectMediaGroup from "@/components/select_media_group.vue";
import usePublicMethod from "@/utils/global/index";

const props = defineProps({
  responseMedia: Array,
  responseGroups: Array,
  soundSource: Object,
});
const emit = defineEmits(["requestDispose", "update:medias", "update:medias_groups"]);

const systemStore = getStore.useSystemStore();

const ruleForm = reactive({
  play_model: 0, //播放模式
  life_time: "00:00:00", //持续时间
  play_number: 1, //播放曲目
  radioVal: 1,
});

const mediaNum = ref(0); //已选媒体数量
const mediaGroupsNum = ref(0); //以选媒体文件夹数量
const duration = ref(0); //持续时间
const playmodelOptions = useFormatMap.playModelOption;

watch([ruleForm, duration], ([,],[,oldDuration]) => {
  let data: any = {
    play_model: ruleForm.play_model,
  };
  if (ruleForm.play_model !== 0 && ruleForm.radioVal !== 1) {
    data["play_number"] = ruleForm.play_number;
  } else {
    data["life_time"] =
    ruleForm.play_model === 0
        ? usePublicMethod.convertSongDuration(duration.value)
        : ruleForm.life_time;
    // 判断当前显示时间是否与上一次媒体选中的时间一致，或者 是否是第一次进入添加任务界面。
    if(ruleForm.life_time === usePublicMethod.convertSongDuration(oldDuration)){
      ruleForm.life_time = usePublicMethod.convertSongDuration(duration.value)
    }
  }
  emit("requestDispose", data);
});
watch(
  () => props.soundSource,
  () => {
    Object.assign(ruleForm, props.soundSource);
    props.soundSource?.play_number ? (ruleForm.radioVal = 2) : (ruleForm.radioVal = 1);
  }
);

// 选择的媒体文件
const requestMedia = (data: any) => {
  mediaNum.value = data?.length;
  emit("update:medias", data);
};
// 选择的媒体文件夹
const requestMediaGroups = (data: any) => {
  mediaGroupsNum.value = data?.length;
  emit("update:medias_groups", data);
};
const totalSecond = (length: number) => {
  console.log(length);
  duration.value = length;
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  let data;
  if (ruleForm.play_model !== 0 && ruleForm.radioVal !== 1) {
    data = {
      play_model: ruleForm.play_model,
      play_number: ruleForm.play_number,
    };
  } else {
    data = {
      play_model: ruleForm.play_model,
      life_time:
      ruleForm.play_model === 0
          ? usePublicMethod.convertSongDuration(duration.value)
          : ruleForm.life_time,
    };
  }
  emit("requestDispose", data);
  if (props.soundSource) {
    Object.assign(ruleForm, props.soundSource);
    props.soundSource?.play_number ? (ruleForm.radioVal = 2) : (ruleForm.radioVal = 1);
  }
});
</script>

<style lang="scss" scoped>
.com-remote-play-component {
  .play-task-form-inline {
    padding-top: 10px;
  }
}
</style>
