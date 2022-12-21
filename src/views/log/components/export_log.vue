<!-- 
  @Author: hmf
  @CreateDate: 2022-09-01
  @FilePath: src\views\system\system_manage\log\components\export_log.vue
  @Describe: 导出日志
-->
<template>
  <el-dialog
    v-model="form.dialogVisible"
    width="420px"
    destroy-on-close
    append-to-body
    :show-close="false"
    @close="emit('show', false)"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="com-dialog-header">
        <span :id="titleId" :class="titleClass">{{ form.title }}</span>
        <span class="dialog-icon">
          <el-icon @click="close"><Close /></el-icon>
        </span>
      </div>
    </template>
    <div class="com-export-log">
      <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="form"
        :rules="rules"
        status-icon
        scroll-to-error
      >
        <el-form-item label="日期" prop="log_date">
          <el-date-picker
            v-model="form.log_date"
            type="datetimerange"
            unlink-panels
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期 "
            end-placeholder="结束日期 "
            :editable="false"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
            :shortcuts="form.shortcuts"
          />
        </el-form-item>
        <el-form-item label="类型" prop="log_type" class="log-type">
          <el-checkbox
            v-model="form.checkAll"
            :indeterminate="form.indeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group v-model="form.log_type" @change="handleCheckedChange">
            <el-checkbox
              v-for="item in logTypeOptions"
              :key="item.label"
              :label="item.label"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="com-dialog-footer">
        <el-button plain @click="emit('show', false)"> 取消 </el-button>
        <el-button type="primary" @click="handleExportLog(ruleFormRef)"> 导出 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance } from "element-plus";
import { ExportLogService } from "@/utils/api/log";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits(["show"]);
// 声明父组件传值
const parentData = defineProps(["isShow"]);

const form = reactive<any>({
  title: "导出日志",
  dialogVisible: false,
  log_date: "", // 导出日期
  checkAll: false, // 全选
  indeterminate: false, // 全选不确定状态
  log_type: [], // 导出类型
  shortcuts: [
    {
      text: "今天",
      value: () => {
        const end = new Date();
        const start = new Date(new Date().toLocaleDateString()); //获取当前时间戳（精确到秒）
        start.setTime(start.getTime());
        return [start, end];
      },
    },
    {
      text: "最近一天",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        return [start, end];
      },
    },
    {
      text: "最近三天",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
        return [start, end];
      },
    },
    {
      text: "最近一周",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: "最近一月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
    },
    {
      text: "最近三月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      },
    },
  ],
  loading: false, // 等待加载数据状态
});
const logTypeOptions = [
  { label: "system-logs", name: "系统日志" },
  { label: "terminals-logs", name: "终端日志" },
  { label: "tasks-logs", name: "任务日志" },
  { label: "call-logs", name: "广播日志" },
  { label: "talk-back-logs", name: "对讲日志" },
  { label: "tts-log", name: "tts日志" },
];
// 表单ref
const ruleFormRef = ref<FormInstance>();
// 验证
const validateEmpty = (rule: any, value: any, callback: any) => {
  if (!useRegex.validateEmpty(value) || value.length < 1) {
    return callback(new Error("请选择"));
  } else {
    callback();
  }
};
// 表单验证规则
const rules = reactive({
  log_date: [{ validator: validateEmpty, trigger: "change", required: true }],
  log_type: [{ validator: validateEmpty, trigger: "change", required: true }],
});
// 处理日志类型全选
const handleCheckAllChange = () => {
  let data: string[] = [];
  logTypeOptions.forEach((item) => {
    data.push(item.label);
  });
  form.log_type = form.checkAll ? data : [];
  let checkedCount = form.log_type.length;
  form.indeterminate = checkedCount > 0 && checkedCount < logTypeOptions.length;
};
// 处理日志类型单选
const handleCheckedChange = () => {
  let checkedCount = form.log_type.length;
  form.indeterminate = checkedCount > 0 && checkedCount < logTypeOptions.length;
  form.checkAll = checkedCount === logTypeOptions.length;
};
// 处理导出
const handleExportLog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.loading = true;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let logs_type = "";
      form.log_type.forEach((item: string) => {
        logs_type += item + ",";
      });
      let params = {
        end_date: form.log_date[1],
        start: form.log_date[0],
        logs_type: logs_type,
      };
      ExportLogService.exprtLog(params)
        .then((result) => {
          const isHasURL = Object.prototype.hasOwnProperty.call(result.data, "url");
          if (isHasURL) {
            let src = result.data.url;
            emit("show", false, src);
            ElMessage({
              type: "success",
              message: "导出成功",
              grouping: true,
            });
          } else {
            ElMessage({
              type: "error",
              message: result.data?.message || "导出失败",
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
    if (!newShow) {
      // 关闭时，重置表单
      ruleFormRef.value?.resetFields();
      form.checkAll = false;
      form.indeterminate = false;
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
:deep(.log-type) {
  .el-form-item__content,
  .el-checkbox-group {
    flex-flow: column;
    align-items: normal;
  }
  .el-form-item__content > label,
  .el-checkbox-group label {
    display: flex;
    width: max-content;
    margin-right: 0;
  }
}
</style>