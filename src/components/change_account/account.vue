<!-- 
  @Author: hmf
  @CreateDate: 2022-10-31
  @FilePath: src\components\change_account\account.vue
  @Describe: 修改账号名称
-->
<template>
  <el-dialog
    v-model="form.dialogVisible"
    width="450px"
    destroy-on-close
    :title="$t('Modify account')"
    @close="emit('show', false)"
    class="com-default-dialog"
  >
    <div class="com-account" v-loading="form.loading" element-loading-text="Loading...">
      <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="form"
        :rules="rules"
        status-icon
        scroll-to-error
        @submit.prevent
      >
        <el-form-item :label="$t('User account')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="$t('Name placeholder')"
            maxlength="100"
            show-word-limit
            clearable
          >
            <template #prefix>
              <i class="iconfont icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="com-dialog-footer">
        <el-button plain @click="emit('show', false)">
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
import { ValidatorService } from "@/utils/api/validator/index";
import { MeService } from "@/utils/api/me/index";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits(["show"]);
// 声明父组件传值
const parentData = defineProps(["isShow"]);

const form = reactive<any>({
  dialogVisible: false,
  name: "", // 名称
  loading: false, // 等待加载数据状态
  oldName: "", // 当前登录的账号名称
});
// 表单ref
const ruleFormRef = ref<FormInstance>();
// 验证
const validateName = (rule: any, value: any, callback: any) => {
  form.name = value = useRegex.replaceEmojiSpaces(value);

  if (!useRegex.validateEmpty(value)) {
    return callback(new Error(proxy.$t("Please enter")));
  } else if (!useRegex.validateName(value)) {
    return callback(new Error(proxy.$t("The name does not conform to the rule")));
  } else if (form.oldName === value) {
    return callback();
  }
  ValidatorService.postValidator({
    rule: { name: "require|unique:users" },
    data: { name: value },
  })
    .then((result) => {
      if (result.result?.status) {
        callback();
      } else {
        callback(new Error(proxy.$t("Name already exists")));
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
      if (form.oldName === form.name) {
        form.loading = false;
        return ElMessage({
          type: "warning",
          message: proxy.$t("No modification"),
          grouping: true,
        });
      }
      await MeService.putUsersMe({
        name: form.name,
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
      form.oldName = form.name = localStorage.get("username") || "";
    } else {
      // 关闭时，重置表单
      ruleFormRef.value?.resetFields();
      // 框架组件记录初始值，得手动清空
      form.name = "";
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
