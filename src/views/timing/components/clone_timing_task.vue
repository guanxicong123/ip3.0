<!-- 
  @Author: hmf
  @CreateDate: 2022-10-30
  @FilePath: src\views\timing\components\clone_timing_task.vue
  @Describe: 克隆定时任务
-->
<template>
  <el-dialog
    v-model="form.dialogVisible"
    width="420px"
    destroy-on-close
    draggable
    class="com-default-dialog"
    @close="emit('show', false)"
  >
    <template #header="{ titleId, titleClass }">
      <div class="com-dialog-header">
        <span :id="titleId" :class="titleClass">{{ form.title }}</span>
      </div>
    </template>
    <div
      class="com-clone-task"
      v-loading="form.loading"
      element-loading-text="Loading..."
    >
      <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="form"
        :rules="rules"
        status-icon
        scroll-to-error
      >
        <template v-if="parentData.editInfor?.length === 1">
          <el-form-item :label="$t('Task name')" prop="name">
            <el-input
              v-model="form.name"
              :placeholder="$t('Name placeholder')"
              maxlength="100"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('Execution time')"
            prop="execute_time"
            v-if="parentData.editInfor?.[0].type !== 3"
          >
            <el-time-picker
              class="custom-el-date"
              v-model="form.execute_time"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              :placeholder="$t('Please select')"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item :label="$t('Execution time')" prop="end_time" v-else>
            <el-time-picker
              v-model="form.end_time"
              is-range
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              range-separator="-"
              :start-placeholder="$t('Start time')"
              :end-placeholder="$t('End time')"
              :clearable="false"
            />
          </el-form-item>
        </template>
        <div v-else>{{ $t("Batch cloning prompt") }}</div>
      </el-form>
    </div>
    <template #footer>
      <div class="com-dialog-footer">
        <el-button plain @click="emit('show', false)">{{
          $t("Cancel")
        }}</el-button>
        <el-button type="primary" @click="handleSubmitFormSave(ruleFormRef)">
          {{ $t("Save") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { ValidatorService } from "@/utils/api/validator/index";
import { TasksService } from "@/utils/api/task/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits(["show", "success"]);
// 声明父组件传值
const parentData = defineProps(["isShow", "editInfor"]);

const form = reactive<any>({
  title: proxy.$t("Clone"),
  dialogVisible: false,
  name: "", // 任务名称
  execute_time: "", // 执行时间
  end_time: "", // 结束时间
  loading: false, // 等待加载数据状态
});
// 表单ref
const ruleFormRef = ref<FormInstance>();
// 验证
const validateName = (rule: any, value: any, callback: any) => {
  form.name = value = useRegex.replaceEmojiSpaces(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateName(value)) {
    return callback(
      new Error(proxy.$t("The name does not conform to the rule"))
    );
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
  execute_time: [
    { validator: validateEmpty, trigger: "change", required: true },
  ],
  end_time: [{ validator: validateEmpty, trigger: "blur", required: true }],
});
// 处理提交保存
const handleSubmitFormSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.loading = true;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let start =
        parentData.editInfor?.[0].type !== 3
          ? form.execute_time
          : form.end_time[0];
      let end = parentData.editInfor?.[0].type !== 3 ? "" : form.end_time[1];
      let ids: any[] = [];
      parentData.editInfor.forEach((item: { id: any }) => ids.push(item.id));
      if (parentData.editInfor.length === 1) {
        if (parentData.editInfor?.[0].type === 3) {
          let startFormat = start.replace(/:+/g, "");
          let endFormat = end.replace(/:+/g, "");

          if (Number(startFormat) >= Number(endFormat)) {
            form.loading = false;
            return ElMessage({
              type: "error",
              message: proxy.$t(
                "The end time must be greater than the start time"
              ),
              grouping: true,
            });
          }
        }
      }
      TasksService.putCopyTasks({
        ids: ids,
        name: form.name,
        execute_time: start,
        end_time: end,
      })
        .then((result) => {
          if (result.data) {
            ElMessage({
              type: "success",
              message: proxy.$t("Cloning succeeded"),
              grouping: true,
            });
            emit("show", false);
            emit("success");
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
      form.loading = false;
      console.log("error submit!", fields);
    }
  });
};

// 监听变化
watch(
  () => parentData.isShow,
  (newShow) => {
    form.dialogVisible = newShow;
    // 关闭时
    if (!newShow) {
      // 重置表单
      ruleFormRef.value?.resetFields();
    }
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {});
</script>

<style lang="scss" scoped>
:deep(.custom-el-date) {
  width: 100% !important;
  .el-input__wrapper {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
