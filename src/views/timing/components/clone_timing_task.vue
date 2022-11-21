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
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入1-100字符"
              maxlength="100"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item
            label="执行时间"
            prop="execute_time"
            v-if="parentData.editInfor?.[0].type !== 3"
          >
            <el-time-picker
              class="custom-el-date"
              v-model="form.execute_time"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              placeholder="请选择"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="执行时间" prop="end_time" v-else>
            <el-time-picker
              v-model="form.end_time"
              is-range
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :clearable="false"
            />
          </el-form-item>
        </template>
        <div v-else>即将批量克隆当前选中任务，是否继续？</div>
      </el-form>
    </div>
    <template #footer>
      <div class="com-dialog-footer">
        <el-button plain @click="emit('show', false)">取消</el-button>
        <el-button type="primary" @click="handleSubmitFormSave(ruleFormRef)">
          保存
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

// 声明触发事件
const emit = defineEmits(["show", "success"]);
// 声明父组件传值
const parentData = defineProps(["isShow", "editInfor"]);

const form = reactive<any>({
  title: "克隆",
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
    return callback(new Error("请输入"));
  } else if (!useRegex.validateName(value)) {
    return callback(new Error("该名称不符合规则"));
  } else {
    callback();
  }
  ValidatorService.postValidator({
    rule: { name: "require|unique:timing_tasks" },
    data: { name: value },
  })
    .then((result) => {
      if (result.data?.status) {
        callback();
      } else {
        callback(new Error("名称已存在"));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const validateEmpty = (rule: any, value: any, callback: any) => {
  if (!useRegex.validateEmpty(value) || value.length < 1) {
    return callback(new Error("请选择"));
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
              message: "结束时间必须大于开始时间",
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
          if (result.result) {
            ElMessage({
              type: "success",
              message: "克隆成功",
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

<style lang="scss" scoped></style>
