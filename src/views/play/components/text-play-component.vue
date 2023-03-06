<!-- 
  @Author: yangyq
  @CreateDate: 2022-08-22
  @FilePath: src\views\play\components\text-playback-component.vue
  @Describe: 文本播放组件
-->
<template>
  <div class="com-text-playback-component">
    <div class="com-text-playback-tabs">
      <el-form :label-position="props.labelPosition">
        <el-row :gutter="80">
          <el-col :xs="80" :sm="80" :md="80" :lg="80" :xl="80">
            <el-form-item :label="$t('Text type')">
              <el-radio-group v-model="ruleForm.is_txt" :disabled="!props.isEdit">
                <el-radio :label="true">{{ $t("File") }}</el-radio>
                <el-radio :label="false">{{ $t("Content") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="80" :md="80" :lg="80" :xl="80" v-show="ruleForm.is_txt">
            <el-form-item :label="$t('Text path')">
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                accept=".txt"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :disabled="!props.isEdit"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="uploadChange"
              >
                <template #trigger>
                  <el-button type="primary" :disabled="!props.isEdit">
                    {{ $t("Browse") }}
                  </el-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip">
                    {{ ruleForm.txtpath }}
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :xs="80" :sm="80" :md="80" :lg="80" :xl="80" v-show="!ruleForm.is_txt">
            <el-form-item :label="$t('Text content')">
              <el-input
                v-model="ruleForm.ttscontent"
                :rows="5"
                type="textarea"
                :placeholder="$t('Please enter the text content')"
                show-word-limit
                maxlength="1000"
                :disabled="!props.isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="80" :sm="80" :md="80" :lg="80" :xl="80" v-show="!ruleForm.is_txt">
            <el-form-item>
              <el-checkbox
                v-model="ruleForm.enabledplayfun"
                :disabled="!props.isEdit"
                :label="$t('Enable the play function')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" v-show="!ruleForm.is_txt">
            <el-form-item :label="$t('Display Properties')">
              <el-select v-model="ruleForm.displayattribute" :disabled="!props.isEdit">
                <el-option :label="$t('Nothing')" :value="0" />
                <el-option
                  v-for="item in dispProperOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
          >
            <el-form-item :label="$t('Play voice')">
              <el-select v-model="ruleForm.ttsenginename" :disabled="!props.isEdit">
                <el-option
                  v-for="item in playVoiceOptions"
                  :key="item.EngineIndex"
                  :label="item.EngineName"
                  :value="item.EngineName"
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
          >
            <el-form-item :label="$t('Play speech speed')">
              <el-select
                v-model="ruleForm.ttsspeed"
                class="custom-el-select"
                :disabled="!props.isEdit"
              >
                <el-option
                  v-for="item in playSpeedOption"
                  :key="item"
                  :label="formatterSpeed(item)"
                  :value="item"
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
          >
            <el-form-item :label="$t('Number of broadcasts')">
              <el-input-number
                v-model="ruleForm.repeattime"
                :min="1"
                controls-position="right"
                maxlength="4"
                :disabled="!props.isEdit"
                :value-on-clear="ruleForm.repeattime"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInstance, UploadProps } from "element-plus";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props: any = defineProps({
  tsctFormData: Object,
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
const emit = defineEmits(["update:tsctFormData"]);

const ruleForm: any = reactive({
  ttsenginename: "", //"tts引擎名称"
  is_txt: true, //是否是文本
  ttsspeed: 5, // 播放语速
  repeattime: 1, //播放次数
  txtpath: "", //文本路径
  ttscontent: "", //文本内容
  enabledplayfun: true,
  displayattribute: 0, //显示属性
});
// 显示属性
const dispProperOption = ref<any[]>([]);
// 播放语速
const playSpeedOption = ref<any[]>([]);
const uploadRef = ref<UploadInstance>();
const playVoiceOptions = computed(() => {
  return getStore.usePlayStore().playVoiceData;
});

watch(ruleForm, (newVal) => {
  emit("update:tsctFormData", newVal);
});
watch(playVoiceOptions, (newVal) => {
  console.log(newVal);
});
watch(
  () => props.selectTaskData,
  () => {
    Object.assign(ruleForm, props.selectTaskData.content);
  }
);
// 选中文件时触发
const uploadChange: UploadProps["onChange"] = (uploadFile: any, uploadFiles) => {
  ruleForm.txtpath = uploadFile.raw.path;
};
// 格式化显示播放语速
const formatterSpeed = (row: number) => {
  switch (row) {
    case 1:
      return row + " ( " + proxy.$t("Slowest") + " )";
    case 5:
      return row + " ( " + proxy.$t("Recommended") + " )";
    case 10:
      return row + " ( " + proxy.$t("Fastest") + " )";
    default:
      return row;
  }
};
const getLedDisplay = () => {
  proxy.$http.get("/led-display-cfg/all").then((result: any) => {
    if (result.result === 200) {
      dispProperOption.value = result.data;
    }
  });
};
// mounted 实例挂载完成后被调用
onMounted(() => {
  console.log(playVoiceOptions.value);
  getLedDisplay();
  if (props.selectTaskData) {
    Object.assign(ruleForm, props.selectTaskData.content);
  }
  for (let i = 1; i <= 10; i++) {
    playSpeedOption.value.push(i);
  }
});
</script>

<style lang="scss" scoped>
.com-text-playback-component {
  .el-select {
    width: 100%;
  }

  .el-input-number {
    width: 100%;
  }
}
</style>
