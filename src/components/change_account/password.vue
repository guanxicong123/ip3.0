<!-- 
  @Author: hmf
  @CreateDate: 2022-10-31
  @FilePath: src\components\change_account\password.vue
  @Describe: 修改账号密码
-->
<template>
  <el-dialog
    v-model="form.dialogVisible"
    width="450px"
    destroy-on-close
    :show-close="!parentData.isFirstUse"
    :close-on-click-modal="!parentData.isFirstUse"
    :close-on-press-escape="!parentData.isFirstUse"
    :title="form.title"
    @close="emit('show', false)"
    class="com-default-dialog"
  >
    <div
      class="com-password"
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
        <!-- 禁止谷歌浏览器自动填充表单 -->
        <input name="oldPassword" type="password" class="hide-input" />
        <el-form-item :label="$t('Original password')" prop="old_password">
          <el-input
            type="password"
            v-model="form.old_password"
            :placeholder="$t('Original password placeholder')"
            maxlength="20"
            show-word-limit
            show-password
            clearable
            auto-complete="old-password"
            oncopy="return false"
            onpaste="return false"
            ondragstart="return false"
            onselectstart="return false"
          >
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('New password')" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            :placeholder="$t('User password placeholder')"
            maxlength="20"
            show-word-limit
            show-password
            clearable
            auto-complete="new-password"
            oncopy="return false"
            onpaste="return false"
            ondragstart="return false"
            onselectstart="return false"
          >
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Confirm password')" prop="confirm_password">
          <el-input
            type="password"
            v-model="form.confirm_password"
            :placeholder="$t('Confirmation password placeholder')"
            maxlength="20"
            show-word-limit
            show-password
            clearable
            auto-complete="off"
            oncopy="return false"
            onpaste="return false"
            ondragstart="return false"
            onselectstart="return false"
          >
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="com-dialog-footer">
        <el-button plain @click="emit('signOut')" v-if="parentData.isFirstUse">
          {{ $t("Exit") }}
        </el-button>
        <el-button plain @click="emit('show', false)" v-else>
          {{ $t("Cancel") }}
        </el-button>
        <el-button type="primary" @click="handleSubmitFormSave(ruleFormRef)">
          {{ $t("Confirm") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { MeService } from "@/utils/api/me/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits(["show", "signOut"]);
// 声明父组件传值
const parentData = defineProps(["isShow", "isFirstUse"]);

const form = reactive<any>({
  title: "", // 标题
  dialogVisible: false,
  old_password: "", // 原密码
  password: "", // 新密码
  confirm_password: "", // 确认密码
  loading: false, // 等待加载数据状态
});
// 表单ref
const ruleFormRef = ref<FormInstance>();
// 验证
const validateOldPassword = (rule: any, value: any, callback: any) => {
  form.old_password = value = useRegex.replacePassword(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateStrongPassword(value)) {
    return callback(new Error(proxy.$t("User password placeholder")));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: any, callback: any) => {
  form.password = value = useRegex.replacePassword(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateStrongPassword(value)) {
    return callback(new Error(proxy.$t("User password placeholder")));
  } else if (value == form.old_password) {
    return callback(new Error(proxy.$t("New password verification prompt")));
  } else {
    if (value.length >= 8 && value === form.confirm_password) {
      ruleFormRef.value?.validateField("confirm_password");
    }
    callback();
  }
};
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  form.confirm_password = value = useRegex.replacePassword(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateStrongPassword(value)) {
    return callback(new Error(proxy.$t("User password placeholder")));
  } else if (value !== form.password) {
    return callback(
      new Error(proxy.$t("The confirmation password does not match the new password"))
    );
  } else {
    callback();
  }
};
// 表单验证规则
const rules = reactive({
  old_password: [
    { validator: validateOldPassword, trigger: "blur", required: true },
  ],
  password: [{ validator: validatePassword, trigger: "blur", required: true }],
  confirm_password: [
    { validator: validateConfirmPassword, trigger: "blur", required: true },
  ],
});
// 处理提交保存
const handleSubmitFormSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.loading = true;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await MeService.putUsersPassword({
        old_password: form.old_password,
        password: form.password,
        confirm_password: form.confirm_password,
      })
        .then((result) => {
          if (result.result?.id) {
            emit("show", false);
            ElMessage({
              type: "success",
              message: proxy.$t("Modification succeeded"),
              grouping: true,
            });
            usePublicMethod.signOut();
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
    if (newShow) {
      form.title = !parentData.isFirstUse
        ? proxy.$t("Change password")
        : proxy.$t("Change password for first login");
    } else {
      // 关闭时，重置表单
      ruleFormRef.value?.resetFields();
      // 框架组件记录初始值，得手动清空
      form.sip_password = "";
    }
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  form.dialogVisible = parentData.isShow;
});
</script>

<style lang="scss" scoped></style>
