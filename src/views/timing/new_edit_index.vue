<!-- 
  @Author: hmf
  @CreateDate: 2022-10-30
  @FilePath: src\views\timing\new_edit_index.vue
  @Describe: 新建/编辑定时任务
-->
<template>
  <div class="com-index">
    <div class="com-main" v-loading="form.loading" element-loading-text="Loading...">
      <div class="com-table">
        <el-scrollbar>
          <el-form
            ref="ruleFormRef"
            label-position="top"
            :model="ruleForm"
            :rules="rules"
            status-icon
            scroll-to-error
          >
            <div class="com-head">
              <div class="com-head-content com-alert-bg">
                <div class="com-breadcrumb">
                  <span class="strong">{{ $t("Basic configuration") }}</span>
                </div>
                <div class="com-button"></div>
              </div>
            </div>
            <div class="com-form">
              <el-row :gutter="60">
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item :label="$t('Task name')" prop="name">
                    <el-input
                      v-model="ruleForm.name"
                      :placeholder="$t('Name placeholder')"
                      maxlength="100"
                      show-word-limit
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item :label="$t('Start date')" prop="start_date">
                    <el-date-picker
                      v-model="ruleForm.start_date"
                      type="date"
                      value-format="YYYY-MM-DD"
                      :placeholder="$t('Please select a date')"
                      :editable="false"
                      :disabled-date="disabledStartDate"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item :label="$t('End date')" prop="end_date">
                    <el-date-picker
                      v-model="ruleForm.end_date"
                      type="date"
                      value-format="YYYY-MM-DD"
                      :placeholder="$t('Please select a date')"
                      :editable="false"
                      :disabled-date="disabledEndDate"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item :label="$t('Task volume')" prop="volume">
                    <el-input-number
                      v-model="ruleForm.volume"
                      :min="0"
                      :max="100"
                      :value-on-clear="ruleForm.volume"
                      controls-position="right"
                    />
                    <el-tooltip
                      effect="dark"
                      :content="$t('Volume prompt description')"
                      placement="right-start"
                    >
                      <i class="iconfont icon-tips theme"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item
                    :label="$t('Priority')"
                    prop="priority"
                    class="custom-form-input"
                  >
                    <div
                      class="custom-number red"
                      :title="$t('Task priority') + '-' + $t('Timing task')"
                    >
                      {{ form.maxPriority }}
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
                      :content="$t('Priority prompt description')"
                      placement="right-start"
                    >
                      <i class="iconfont icon-tips theme"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item
                    :label="$t('Light configuration')"
                    prop="terminals_light_id"
                  >
                    <el-select
                      v-model="ruleForm.terminals_light_id"
                      :placeholder="$t('Please select')"
                    >
                      <el-option
                        v-for="(item, keys) in form.lightData"
                        :key="keys"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item :label="$t('LED configuration')" prop="led_config_id">
                    <el-select
                      v-model="ruleForm.led_config_id"
                      :placeholder="$t('Please select')"
                    >
                      <el-option
                        v-for="(item, keys) in form.ledData"
                        :key="keys"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :xs="12"
                  :sm="8"
                  :md="8"
                  :lg="8"
                  :xl="6"
                  v-if="
                    (form.fast_sound_type != 1 && form.type == 4) ||
                    (form.type > 1 && form.type < 4)
                  "
                >
                  <el-form-item :label="$t('Execution time')" prop="execute_time">
                    <el-time-picker
                      v-model="ruleForm.execute_time"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                      :placeholder="$t('Any point in time')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                :gutter="60"
                v-if="form.type === 1 || (form.type === 4 && form.fast_sound_type === 1)"
              >
                <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                  <el-form-item
                    :label="$t('Execution time')"
                    prop="multiple_execute_time"
                  >
                    <div class="com-add-select-components">
                      <el-time-picker
                        v-model="form.multiple_execute_time"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        :placeholder="$t('Multi-choice execution time')"
                        @change="handleMultiSelectExecutionTime"
                        :clearable="false"
                      />
                      <div class="select-button">
                        <i
                          class="iconfont icon-execution-failed"
                          :title="$t('Clear all execution time')"
                          @click="handleClearAllExecutionTime"
                        ></i>
                      </div>
                    </div>
                    <el-popover
                      placement="bottom-start"
                      :width="400"
                      :visible="form.isShowAdvancedVisible"
                    >
                      <template #reference>
                        <el-button
                          type="primary"
                          text
                          @click="
                            form.isShowAdvancedVisible = !form.isShowAdvancedVisible
                          "
                        >
                          {{ $t("Senior") }}>>
                        </el-button>
                      </template>
                      <div class="com-form custom-execute-time-range">
                        <p style="margin-bottom: 10px">
                          {{ $t("Increase execution time at fixed intervals") }}
                          :
                        </p>
                        <el-form label-position="top" :model="form">
                          <el-form-item
                            :label="$t('Execution time point range')"
                            prop="execute_time_range"
                          >
                            <el-time-picker
                              is-range
                              v-model="form.execute_time_range"
                              format="HH:mm:ss"
                              value-format="HH:mm:ss"
                              :range-separator="$t('To')"
                              :start-placeholder="$t('Start time')"
                              :end-placeholder="$t('End time')"
                            />
                          </el-form-item>
                          <el-form-item
                            :label="$t('Interval time') + '(' + $t('Minute') + ')'"
                            prop="interval_time"
                          >
                            <el-input-number
                              v-model="form.interval_time"
                              :min="1"
                              :max="1440"
                              :value-on-clear="form.interval_time"
                              controls-position="right"
                            />
                          </el-form-item>
                        </el-form>
                        <p class="custom-button">
                          <el-button
                            plain
                            @click="
                              form.isShowAdvancedVisible = !form.isShowAdvancedVisible
                            "
                          >
                            {{ $t("Close") }}
                          </el-button>
                          <el-button
                            type="primary"
                            :disabled="
                              form.execute_time_range?.length < 1 ||
                              form.execute_time_range == null
                            "
                            @click="batchAddExecutionTime"
                          >
                            {{ $t("Add") }}
                          </el-button>
                        </p>
                      </div>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="16" :md="16" :lg="16" :xl="18">
                  <div class="com-ir-bg custom-execute-time">
                    <el-scrollbar>
                      <ul>
                        <li v-for="(item, index) in form.executionTimeData" :key="index">
                          <el-time-picker
                            v-model="item.value"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :placeholder="$t('Any point in time')"
                            @change="filterExecutionTimeData()"
                            :clearable="false"
                          />
                          <span
                            class="delete-time"
                            @click="handleDeleteExecutionTime(index)"
                          >
                            <i class="iconfont icon-delete" :title="$t('Delete')"></i>
                          </span>
                        </li>
                      </ul>
                    </el-scrollbar>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="com-head">
              <div class="com-head-content com-alert-bg">
                <div class="com-breadcrumb">
                  <span class="strong">{{ $t("Sound source setting") }}</span>
                  <span class="red">*&nbsp;</span>
                  <span class="tips">( {{ $t("Audio source saving prompt") }} )</span>
                </div>
                <div class="com-button"></div>
              </div>
            </div>
            <div class="com-form">
              <sound-source-settings
                @requestType="handleRequestSoundType"
                @requestSoundSource="handleRequestSoundSource"
                @requestMedia="handleRequestSoundMedia"
                @requestGroups="handleRequestSoundMediaGroups"
                @requestSoundSourceID="handleRequestSoundSourceID"
                @requestSoundSourceType="handleRequestSoundSourceType"
                :responseType="ruleForm.type"
                :responseSoundSource="ruleForm.sound_source"
                :responseFastSoundSource="ruleForm.fast_sound"
                :responseMedia="ruleForm.medias"
                :responseGroups="ruleForm.medias_groups"
              />
            </div>
            <div class="com-head">
              <div class="com-head-content com-alert-bg">
                <div class="com-breadcrumb">
                  <span class="strong">{{ $t("Date setting") }}</span>
                  <span class="red">*&nbsp;</span>
                  <span class="tips">( {{ $t("Audio source saving prompt") }} )</span>
                </div>
                <div class="com-button"></div>
              </div>
            </div>
            <div class="com-form">
              <date-settings
                :myConfig="myConfig"
                :minDay="ruleForm.start_date"
                :maxDay="ruleForm.end_date"
                @requestType="handleRequestDateType"
                @requestWeekData="handleRequestWeekData"
                @requestDayData="handleRequestDayData"
                :responseType="ruleForm.time_type"
                :responseWeekData="ruleForm.repeat_weeks"
                :responseDayData="ruleForm.assign_dates"
              />
            </div>
            <div class="com-head">
              <div class="com-head-content com-alert-bg">
                <div class="com-breadcrumb">
                  <span class="strong">{{ $t("Terminal selection") }}</span>
                  <span class="red">*&nbsp;</span>
                  <span class="tips">
                    ( <span>{{ $t("Audio source saving prompt") }}</span>
                    <template v-if="form.terminalSettingsType === 2">
                      &nbsp;&nbsp;{{ $t("Selected terminal") }} :
                      <span class="theme">{{ form.terminals.length }}</span>
                      <template v-if="systemStore.functional_configs.GroupDisplay">
                        &nbsp;&nbsp;{{ $t("Selected groups") }} :
                        <span class="theme">
                          {{ form.terminals_groups.length }}
                        </span>
                      </template>
                    </template>
                    )
                  </span>
                </div>
                <div class="com-button"></div>
              </div>
            </div>
            <div class="com-form com-add-bottom">
              <terminal-settings
                @requestOpenVolume="handleRequestOpenVolume"
                @requestType="handleRequestType"
                @requestTerminals="handleRequestTerminals"
                @requestGroups="handleRequestTerminalsGroups"
                @requestQuickTerminals="handleRequestQuickTerminals"
                :responseTerminals="ruleForm.terminals"
                :responseGroups="ruleForm.terminals_groups"
                :responseQuickTerminals="form.quick_terminal"
                :changeTerminalsVolume="ruleForm.volume"
                :responseOpenVolume="ruleForm.is_open"
                style="margin-bottom: 15px"
              />
            </div>
          </el-form>
          <div class="com-form-button">
            <el-button plain @click="usePublicMethod.clickBack()">
              {{ $t("Cancel") }}
            </el-button>
            <el-button type="primary" @click="handleSubmitFormSave(ruleFormRef)">
              {{ $t("Save") }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import usePublicMethod from "@/utils/global/index";
import { ValidatorService } from "@/utils/api/validator/index";
import { TasksService } from "@/utils/api/task/index";
import { TerminalsLightService } from "@/utils/api/light_config";
import { LEDService } from "@/utils/api/led_config";
import { PriorityService } from "@/utils/api/priority_config";
import { onBeforeRouteLeave } from "vue-router";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const systemStore = getStore.useSystemStore();

const form = reactive<any>({
  title: "",
  execute_time_range: [], // 执行时间范围
  executionTimeData: [], // 多选执行时间数据
  interval_time: 1, // 间隔时间
  isShowAdvancedVisible: false, // 是否展示高级配置弹窗
  terminalSettingsType: 1, // 终端选择tab类型
  old_name: "", // 存储编辑时的名称
  loading: false, // 等待加载数据状态
  multiple_execute_time: "", // 多选执行时间
  type: 4, // 音源设置tab类型
  terminals: [], // 终端
  terminals_groups: [], // 终端分组
  medias: [], // 媒体
  medias_groups: [], // 媒体文件夹
  request_weeks: [], // 周
  request_assign_dates: [], // 日
  quick_terminal: { id: 0, name: "" }, // 快捷终端
  id: 0, // 路由id
  sound_source: {}, // 音源设置
  maxPriority: 0, // 最大优先级
  lightData: [], // 灯光配置数据
  ledData: [], // LED配置数据
  fast_sound_type: 0, // 快捷音源类型
});
// 提交表单字段
const ruleForm = reactive<any>({
  name: "", // 任务名称
  start_date: "", // 开始日期
  end_date: "", // 结束日期
  volume: 70, // 任务音量
  priority: 60, // 优先级
  terminals_light_id: 0, // 灯光配置
  led_config_id: 0, // LED配置
  execute_time: "", // 执行时间
  time_type: 0, // 日期设置-类型
  type: 4, // 音源设置tab类型
  repeat_weeks: [], // 周
  assign_dates: [], // 日
  fast_terminals_id: 0, // 快捷终端id
  fast_sound_id: 0, // 快捷音源id
  fast_sound: {}, // 快捷音源
  terminals: [], // 终端
  terminals_groups: [], // 终端分组
  medias: [], // 媒体
  medias_groups: [], // 媒体文件夹
  sound_source: {}, // 音源设置
  is_open: 0, // 是否开启终端音量  0:关闭, 1:开启
});
// 禁用选择日期
const disabledStartDate = (time: { getTime: () => number }) => {
  let beginStartDate = ruleForm.end_date;
  if (beginStartDate) {
    return (
      time.getTime() < Date.now() - 8.64e7 ||
      time.getTime() > usePublicMethod.dateConversionToTimestamp(beginStartDate)
    );
  } else {
    return time.getTime() < Date.now() - 8.64e7;
  }
};
const disabledEndDate = (time: { getTime: () => number }) => {
  let beginEndDate = ruleForm.start_date;
  if (beginEndDate) {
    return time.getTime() < usePublicMethod.dateConversionToTimestamp(beginEndDate);
  }
};
// 路由
const $useRoute = useRoute();
// 表单ref
const ruleFormRef = ref<FormInstance>();
// 验证
const validateName = (rule: any, value: any, callback: any) => {
  ruleForm.name = value = useRegex.replaceEmojiSpaces(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateName(value)) {
    return callback(new Error(proxy.$t("The name does not conform to the rule")));
  } else if (form.old_name === value) {
    return callback();
  }
  ValidatorService.postValidator({
    rule: { name: "require|unique:timing_tasks" },
    data: { name: value },
  })
    .then((result) => {
      if (result.data?.status) {
        callback();
      } else {
        callback(new Error(proxy.$t("Name already exists")));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const validateEmpty = (rule: any, value: any, callback: any) => {
  if (!useRegex.validateEmpty(value) || value.length < 1) {
    return callback(new Error(proxy.$t("Please select")));
  } else {
    callback();
  }
};
// 表单验证规则
const rules = reactive({
  name: [{ validator: validateName, trigger: "blur", required: true }],
  start_date: [{ validator: validateEmpty, trigger: "blur", required: true }],
  execute_time: [{ validator: validateEmpty, trigger: "change", required: true }],
});
// 处理音源设置返回的数据
const handleRequestSoundType = (data: number) => {
  ruleForm.type = form.type = data;
};
const handleRequestSoundSourceID = (data: number) => {
  ruleForm.fast_sound_id = data;
};
const handleRequestSoundSourceType = (data: number) => {
  form.fast_sound_type = data;
};
const handleRequestSoundSource = (data: any) => {
  form.sound_source = data;
};
const handleRequestSoundMedia = (data: any) => {
  form.medias = data;
};
const handleRequestSoundMediaGroups = (data: any) => {
  form.medias_groups = data;
};
// 选择重复日期组件插件配置
const myConfig = {
  showMonth: false, //是否显示月期
};
// 处理日期设置返回的数据
const handleRequestDateType = (data: number) => {
  ruleForm.time_type = data;
};
const handleRequestWeekData = (data: any) => {
  form.request_weeks = data;
};
const handleRequestDayData = (data: any) => {
  form.request_assign_dates = data;
};
// 处理终端选择组件的tab类型
const handleRequestType = (data: any) => {
  form.terminalSettingsType = data;
};
// 处理选择终端/分组组件的数据
const handleRequestOpenVolume = (data: boolean) => {
  ruleForm.is_open = data ? 1 : 0;
};
const handleRequestTerminals = (data: any) => {
  form.terminals = data;
};
const handleRequestTerminalsGroups = (data: any) => {
  form.terminals_groups = data;
};
const handleRequestQuickTerminals = (data: any) => {
  ruleForm.fast_terminals_id = data;
};
// 处理清除全部执行时间
const handleClearAllExecutionTime = () => {
  form.executionTimeData = [];
  form.multiple_execute_time = "";
};
// 处理添加多选执行时间
const handleMultiSelectExecutionTime = () => {
  let num = 0;
  if (form.multiple_execute_time !== "") {
    if (form.executionTimeData.length > 0) {
      form.executionTimeData.forEach((item: { value: any }) => {
        // 当选有重复执行时间给提示
        if (item.value === form.multiple_execute_time) {
          num = num + 1;
          ElMessage({
            message: proxy.$t("Upload filter repeat time prompt"),
            type: "warning",
            grouping: true,
          });
        }
      });
      // 当没有重复执行时间给添加进数组
      if (num < 1) {
        form.executionTimeData.push({
          value: form.multiple_execute_time,
        });
      }
    } else {
      form.executionTimeData.push({
        value: form.multiple_execute_time,
      });
    }
  }
  form.multiple_execute_time = "";
};
// 过滤去重
const filterExecutionTimeData = () => {
  const length = form.executionTimeData.length;
  form.executionTimeData = handleUnique(form.executionTimeData);
  if (length !== form.executionTimeData.length) {
    ElMessage({
      message: proxy.$t("Upload filter repeat time prompt"),
      type: "warning",
      grouping: true,
    });
  }
};
// 数组对象去重
const handleUnique = (arr: any[]) => {
  // 根据唯一标识value来对数组进行过滤
  const res = new Map(); //定义常量 res,值为一个Map对象实例
  //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
  return arr.filter((a) => !res.has(a.value) && res.set(a.value, 1));
};
// 处理删除多选执行时间
const handleDeleteExecutionTime = (row: number) => {
  form.executionTimeData = form.executionTimeData.filter((val: any, key: number) => {
    return row !== key;
  });
  form.multiple_execute_time =
    form.executionTimeData.length > 0 ? form.executionTimeData[0].value : "";
};
// 批量增加执行时间
const batchAddExecutionTime = () => {
  let start = new Date(
    new Date().toDateString() + " " + form.execute_time_range[0]
  ).getTime();
  let end = new Date(
    new Date().toDateString() + " " + form.execute_time_range[1]
  ).getTime();
  let interval = form.interval_time * 60 * 1000;
  let num = (end - start) / interval;
  for (let i = 0; i <= num; i++) {
    let d = new Date(start + interval * i);
    let hour = d.getHours() < 10 ? "0" + d.getHours() : "" + d.getHours();
    let minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();
    let seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : "" + d.getSeconds();
    let time = hour + ":" + minutes + ":" + seconds;
    form.executionTimeData.push({
      value: time,
    });
  }
  form.executionTimeData = handleUnique(form.executionTimeData);
};
// 处理输出提示错误
const handleReturnError = (data: string) => {
  form.loading = false;
  ElMessage({
    type: "error",
    message: data,
    grouping: true,
  });
};
// 处理提交保存
const handleSubmitFormSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.loading = true;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 执行时间
      if (
        (form.type === 1 || (form.type === 4 && form.fast_sound_type === 1)) &&
        form.executionTimeData.length < 1
      ) {
        return handleReturnError(proxy.$t("Please select the execution time"));
      }
      // 音源设置 - 快捷音源
      let isQuick = form.type == 4 && ruleForm.fast_sound_id == 0;
      // 音源设置 - 音乐播放
      let isMusic =
        form.type === 1 && form.medias.length < 1 && form.medias_groups.length < 1;
      // 音源设置 - 音源采集
      let isSound =
        (form.type === 2 && form.sound_source.sound_card == "") ||
        (form.type === 3 && form.sound_source.terminals_name == "");

      if (isQuick || isMusic || isSound) {
        return handleReturnError(proxy.$t("Please select a sound source"));
      }
      // 重复日期
      if (form.request_weeks.length < 1 && form.request_assign_dates.length < 1) {
        return handleReturnError(proxy.$t("Please select a duplicate date"));
      }
      // 终端或分组
      if (form.terminalSettingsType === 2) {
        if (form.terminals.length < 1 && form.terminals_groups.length < 1) {
          return handleReturnError(proxy.$t("Please select a terminal or group"));
        }
      } else {
        // 快捷终端
        if (ruleForm.fast_terminals_id < 1) {
          return handleReturnError(proxy.$t("Please select a shortcut terminal"));
        }
      }
      // 音源采集时，判断结束时间是否大于执行时间
      if (
        form.type === 2 ||
        form.type === 3 ||
        (form.type === 4 && (form.sound_source.type == 2 || form.sound_source.type == 3))
      ) {
        const start_time = ruleForm.execute_time.replace(/:/g, "");
        const end_time = form.sound_source.end_time.replace(/:/g, "");
        if (Number(start_time) > Number(end_time)) {
          return handleReturnError(
            proxy.$t("The end time must be greater than the execution time")
          );
        }
      }
      // 音乐播放
      if (form.type === 1 || (form.type === 4 && form.fast_sound_type === 1)) {
        const time: any[] = [];
        form.executionTimeData.forEach((item: { value: any }) => {
          time.push(item.value);
        });
        ruleForm.execute_time = time.toString();
      }

      if (form.id > 0) {
        TasksService.putTasks(
          Object.assign(ruleForm, {
            type: form.type,
            fast_type: form.terminalSettingsType,
            terminals: form.terminals,
            terminals_groups: form.terminals_groups,
            repeat_weeks: form.request_weeks,
            assign_dates: form.request_assign_dates,
            sound_source: form.sound_source,
            medias: form.medias,
            medias_groups: form.medias_groups,
          }),
          form.id
        )
          .then((result) => {
            if (result.data?.id) {
              ElMessage({
                type: "success",
                message: proxy.$t("Edit succeeded"),
                grouping: true,
              });
              usePublicMethod.clickBack();
            } else {
              ElMessage({
                type: "error",
                message: result.return_message,
                grouping: true,
              });
            }
            form.loading = false;
          })
          .catch((error) => {
            form.loading = false;
            console.log(error);
          });
      } else {
        TasksService.postTasks(
          Object.assign(ruleForm, {
            type: form.type,
            fast_type: form.terminalSettingsType,
            terminals: form.terminals,
            terminals_groups: form.terminals_groups,
            repeat_weeks: form.request_weeks,
            assign_dates: form.request_assign_dates,
            sound_source: form.sound_source,
            medias: form.medias,
            medias_groups: form.medias_groups,
          })
        )
          .then((result) => {
            if (result.data?.id) {
              ElMessage({
                type: "success",
                message: proxy.$t("New succeeded"),
                grouping: true,
              });
              usePublicMethod.clickBack();
            } else {
              ElMessage({
                type: "error",
                message: result.return_message,
                grouping: true,
              });
            }
            form.loading = false;
          })
          .catch((error) => {
            form.loading = false;
            console.log(error);
          });
      }
    } else {
      form.loading = false;
      console.log("error submit!", fields);
    }
  });
};
// 处理获取编辑数据
const handleGetEditData = async () => {
  form.loading = true;
  await TasksService.getOneTasks(
    {
      withTerminals: true,
      withMedias: true,
      withStrategies: true,
      withFastTerminal: true,
      withFastSound: true,
    },
    form.id
  )
    .then((result) => {
      if (result.data) {
        form.old_name = result.data.name;
        Object.keys(ruleForm).forEach((item) => {
          Object.keys(result.data).forEach((row) => {
            if (item === row) {
              ruleForm[item] = result.data[row];
            }
          });
        });
        if (result.data.type === 1) {
          const executionTimeData = result.data.execute_time.split(",");
          executionTimeData.forEach((item: any) => {
            form.executionTimeData.push({
              value: item,
            });
          });
        }
        if (result.data.type === 4) {
          form.fast_sound_type = result.data.sound_source.type;
        }
        if (result.data.end_date === "0000-00-00") {
          ruleForm.end_date = "";
        }
        if (result.data.fast_terminals_id > 0) {
          form.quick_terminal = {
            id: result.data.fast_terminal?.id,
            name: result.data.fast_terminal?.name,
          };
        }
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
      form.loading = false;
    })
    .catch((error) => {
      form.loading = false;
      console.log(error);
    });
};
// 获取所有灯光配置
const getAllTerminalsLight = async () => {
  await TerminalsLightService.getAllTerminalsLight({})
    .then((result) => {
      if (result.data) {
        form.lightData = result.data;
        if (result.data?.length > 0) {
          ruleForm.terminals_light_id = result.data?.[0].id;
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
};
// 获取所有LED配置
const getAllLED = async () => {
  await LEDService.getAllLED({})
    .then((result) => {
      if (result.data) {
        form.ledData = [...[{ id: 0, name: proxy.$t("Please select") }], ...result.data];
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
};
// 处理获取优先级配置
const handleGetOnePriority = async () => {
  await PriorityService.getOnePriority(7)
    .then((result) => {
      if (result.data?.id) {
        form.maxPriority = Number.parseInt(result.data.priority);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  getAllTerminalsLight();
  getAllLED();
  handleGetOnePriority();
  form.id = Number($useRoute.params?.id);
  form.title = form.id > 0 ? proxy.$t("Edit") : proxy.$t("Newly build");
  if (form.id > 0) {
    handleGetEditData();
  } else {
    ruleForm.start_date = usePublicMethod.formatDate(
      new Date().toLocaleString(),
      "YYYY-MM-DD"
    );
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (to.path === "/timing" || to.path === "/") {
    next();
  } else {
    ElMessageBox.confirm(proxy.$t("Exit page prompt"), proxy.$t("Tips"), {
      confirmButtonText: proxy.$t("Determine"),
      cancelButtonText: proxy.$t("Cancel"),
      type: "warning",
    }).then(() => {
      next();
    });
  }
});
</script>

<style lang="scss" scoped>
.custom-execute-time-range {
  padding: 0;
  .custom-button {
    text-align: center;
  }
}
.custom-execute-time {
  height: 100%;
  min-height: 100px;
  max-height: 300px;
  margin-bottom: 22px;
  ul {
    padding: 16px 16px 0;
    li {
      display: inline-flex;
      align-items: center;
      padding-bottom: 16px;
      padding-right: 12px;
      :deep(.el-date-editor) {
        width: 100px;
      }
      .delete-time {
        padding: 0 12px;
      }
    }
  }
}
</style>
