<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-16
  @FilePath: src\views\play\components\sound-source-component.vue
  @Describe: 快捷音源组件
-->
<template>
  <div class="com-sound-source-component">
    <el-form
      :model="ruleForm"
      :label-position="props.labelPosition"
      class="play-task-form-inline com-sound-source-component"
    >
      <el-row :gutter="80">
        <el-col
          :xs="props.adaption.xs"
          :sm="props.adaption.sm"
          :md="props.adaption.md"
          :lg="props.adaption.lg"
          :xl="props.adaption.xl"
        >
          <el-form-item :label="$t('Fast sound source')">
            <div class="fast-sound-source">
              <el-input v-model="seleQuickMusic.name" disabled />
              <span
                class="iconfont icon-select-file"
                @click="handleShowDialog"
                v-show="props.isEdit"
              ></span>
            </div>
          </el-form-item>
        </el-col>
        <el-col
          :xs="props.adaption.xs"
          :sm="props.adaption.sm"
          :md="props.adaption.md"
          :lg="props.adaption.lg"
          :xl="props.adaption.xl"
          v-if="!isMusicPlay"
        >
          <el-form-item :label="$t('Acquisition sound quality')">
            <el-select v-model="ruleForm.sound_quality" :disabled="!props.isEdit">
              <el-option
                v-for="item in audioQualityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xs="props.adaption.xs"
          :sm="props.adaption.sm"
          :md="props.adaption.md"
          :lg="props.adaption.lg"
          :xl="props.adaption.xl"
          v-if="isMusicPlay"
        >
          <el-form-item :label="$t('Play mode')">
            <el-select v-model="ruleForm.play_model" :disabled="!props.isEdit">
              <el-option
                v-for="item in playmodelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xs="props.adaption.xs"
          :sm="props.adaption.sm"
          :md="props.adaption.md"
          :lg="props.adaption.lg"
          :xl="props.adaption.xl"
          v-if="isMusicPlay && ruleForm.play_model === 0"
        >
          <el-form-item :label="$t('Duration')">
            {{ duration }}
          </el-form-item>
        </el-col>
        <el-col
          :xs="props.adaption.xs"
          :sm="props.adaption.sm"
          :md="props.adaption.md"
          :lg="props.adaption.lg"
          :xl="props.adaption.xl"
          v-if="isMusicPlay && ruleForm.play_model !== 0"
        >
          <el-form-item>
            <el-radio
              :disabled="!props.isEdit"
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
              :disabled="ruleForm.radioVal !== 1 || !props.isEdit"
            />
          </el-form-item>
        </el-col>
        <el-col
          :xs="props.adaption.xs"
          :sm="props.adaption.sm"
          :md="props.adaption.md"
          :lg="props.adaption.lg"
          :xl="props.adaption.xl"
          v-if="isMusicPlay && ruleForm.play_model !== 0"
        >
          <el-form-item>
            <el-radio
              :disabled="!props.isEdit"
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
              :value-on-clear="ruleForm.play_number"
              controls-position="right"
              :disabled="ruleForm.radioVal !== 2 || !props.isEdit"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <quick-music-dialog
      v-model:isShow="isShow"
      @handleSelectedConfigure="handleSelectedConfigure"
      :seleQuickMusic="seleQuickMusic"
    />
  </div>
</template>

<script lang="ts" setup>
import usePublicMethod from "@/utils/global/index";

const props: any = defineProps({
  selectTaskData: Object,
  isEdit: {
    type: Boolean,
    default: true,
  },
  labelPosition: {
    type: String,
    default: "top",
  },
  adaption: {
    type: Object,
    default: {
      xs: 12,
      sm: 8,
      md: 8,
      lg: 8,
      xl: 6,
    },
  },
});
const emit = defineEmits([
  "requestSoundSource", // 更新传递已选择的快捷音源，用于父组件进行数据交互
]);

const ruleForm = reactive({
  id: -1, //快捷音源配置id
  type: 0, //选择的快捷音源类型
  sound_quality: 1, //采集音质
  play_model: 0, //播放模式
  life_time: "00:00:00", //持续时间
  play_number: 1, //播放曲目
  radioVal: 1,
});
const audioQualityOptions = useFormatMap.qualityOption;
const playmodelOptions = useFormatMap.playModelOption;
const duration = ref("00:00:00"); //持续时间
const isShow = ref(false);
const seleQuickMusic: any = ref({
  id: -1,
  name: "",
}); //选中的快捷音源
const isMusicPlay = computed(() => {
  return seleQuickMusic.value?.type === 1;
});

watch(
  () => props.selectTaskData,
  (newVal: any) => {
    Object.assign(ruleForm, newVal.sound_source, {
      id: newVal.fast_sound_id,
    });
    duration.value = ruleForm?.life_time;
    seleQuickMusic.value = newVal?.fast_sound;
    ruleForm.radioVal = props.selectTaskData.sound_source?.life_time ? 1 : 2;
  }
);
watch(seleQuickMusic, (newVal) => {
  ruleForm.id = newVal?.id;
});
watch(ruleForm, (newVal) => {
  let data: any = {
    id: newVal.id,
    type: newVal.type,
    sound_quality: newVal.sound_quality,
    play_model: newVal.play_model,
  };
  if (newVal.play_model !== 0 && ruleForm.radioVal !== 1) {
    data["play_number"] = newVal?.play_number;
  } else {
    if (newVal.play_model === 0 && props.selectTaskData?.mediasIds) {
      let all_data = [
        ...props.selectTaskData?.medias,
        ...props.selectTaskData?.medias_groups,
      ];
      let num = 0;
      all_data.forEach((item: string | any[]) => {
        num += Number(item.length);
      });
      console.log(num);
      data["life_time"] = usePublicMethod.convertSongDuration(num);
      duration.value = usePublicMethod.convertSongDuration(num);
    } else {
      data["life_time"] = newVal?.life_time;
    }
  }
  emit("requestSoundSource", data);
});

const handleShowDialog = () => {
  isShow.value = true;
};
// 处理选中配置
const handleSelectedConfigure = (item: any) => {
  if (item.type === 1 && item.all_data.length > 0) {
    let num = 0;
    item.all_data.forEach((item: string | any[]) => {
      num += Number(item.length);
    });
    duration.value = usePublicMethod.convertSongDuration(num);
    ruleForm.life_time = usePublicMethod.convertSongDuration(num);
  }
  ruleForm.type = item.type;
  seleQuickMusic.value = item;
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  if (props.selectTaskData) {
    Object.assign(ruleForm, props.selectTaskData.sound_source, {
      id: props.selectTaskData.fast_sound_id,
    });
    duration.value = ruleForm.life_time;
    if (props.selectTaskData?.fast_sound) {
      seleQuickMusic.value = props.selectTaskData.fast_sound;
    }
    ruleForm.radioVal = props.selectTaskData.sound_source?.life_time ? 1 : 2;
  }
});
</script>

<style lang="scss" scoped>
.com-sound-source-component {
  .el-input.is-disabled {
    .el-input__inner {
      color: #333;
    }
  }
}
</style>
