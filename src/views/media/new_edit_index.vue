<!-- 
  @Author: hmf
  @CreateDate: 2022-10-30
  @FilePath: src\views\media\new_edit_index.vue
  @Describe: 新建/编辑媒体库文件夹
-->
<template>
  <el-dialog
    v-model="form.dialogVisible"
    width="400px"
    destroy-on-close
    draggable
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
    <div v-loading="form.loading" element-loading-text="Loading...">
      <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        status-icon
        scroll-to-error
      >
        <el-form-item label="属性" prop="is_public" required>
          <el-radio-group v-model="ruleForm.is_public" class="radio-group-inline">
            <el-radio :label="0"> 私有资源 </el-radio>
            <el-radio :label="1"> 公共资源 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入1-100字符"
            maxlength="100"
            show-word-limit
            clearable
          />
        </el-form-item>
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
import { MeidaService } from "@/utils/api/media/index";

// 声明触发事件
const emit = defineEmits(["show", "success"]);
// 声明父组件传值
const parentData = defineProps(["isShow", "editInfor"]);
// 默认表单字段
const defaultForm = reactive<any>({
  is_public: 1, // 文件夹属性 0：私有，1：公共
  name: "", // 文件夹名称
});
const form = reactive({
  title: "",
  dialogVisible: false,
  old_name: "", // 存储编辑时的名称
  loading: false, // 等待加载数据状态
  id: 0, // 路由id
});
// 提交表单字段
const ruleForm = reactive<any>({
  is_public: 1, // 文件夹属性 0：私有，1：公共
  name: "", // 文件夹名称
});
// 表单ref
const ruleFormRef = ref<FormInstance>();
// 验证
const validateName = (rule: any, value: any, callback: any) => {
  ruleForm.name = value = useRegex.replaceEmojiSpaces(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error("请输入"));
  } else if (!useRegex.validateName(value)) {
    return callback(new Error("该名称不符合规则"));
  } else if (form.old_name === value) {
    return callback();
  }
  ValidatorService.postValidator({
    rule: { name: "require|unique:medias_groups" },
    data: { name: value },
  })
    .then((result) => {
      if (result.result?.status) {
        callback();
      } else {
        callback(new Error("名称已存在"));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
// 表单验证规则
const rules = reactive({
  name: [{ validator: validateName, trigger: "blur", required: true }],
});
// 处理提交保存
const handleSubmitFormSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.loading = true;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (form.id > 0) {
        await MeidaService.putMeidaGroup(ruleForm, form.id)
          .then((result) => {
            if (result.result?.id) {
              emit("show", false);
              emit("success");
              ElMessage({
                type: "success",
                message: "编辑成功",
                grouping: true,
              });
            } else {
              ElMessage({
                type: "error",
                message: result.result?.message,
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
        await MeidaService.postMeidaGroup(ruleForm)
          .then((result) => {
            if (result.result?.id) {
              emit("show", false);
              emit("success");
              ElMessage({
                type: "success",
                message: "新建成功",
                grouping: true,
              });
            } else {
              ElMessage({
                type: "error",
                message: result.result?.message,
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
const handleGetEditData = async (data: any) => {
  form.old_name = parentData.editInfor.name;
  Object.keys(ruleForm).forEach((item) => {
    Object.keys(data).forEach((row) => {
      if (item === row) {
        ruleForm[item] = data[row];
      }
    });
  });
  form.loading = false;
};

// 监听变化
watch(
  () => parentData.isShow,
  (newShow) => {
    form.dialogVisible = newShow;
    if (newShow) {
      if (parentData.editInfor?.id > 0) {
        form.id = parentData.editInfor?.id;
        form.loading = true;
        form.title = "编辑";
        handleGetEditData(parentData.editInfor);
      } else {
        form.title = "新建";
      }
    } else {
      // 关闭时，重置表单
      ruleFormRef.value?.resetFields();
      // 框架组件记录初始值，得手动清空
      handleGetEditData(defaultForm);
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
.radio-group-inline {
  flex-flow: column;
  align-items: normal;
  max-width: 100%;
  padding-left: 30px;
  :deep(.el-radio__label) {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>