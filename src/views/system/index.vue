<!-- 
  @Author: hmf
  @CreateDate: 2022-06-22
  @FilePath: src\views\system\index.vue
  @Describe: 系统配置
-->
<template>
  <div class="com-index">
    <div class="com-main set-padding">
      <div class="com-table">
        <el-scrollbar>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">一键报警配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round>应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-form label-position="top" :inline="true">
              <div class="com-form-item-custom">
                <el-checkbox
                  v-model="form.one_key_alarm"
                  label="启用一键报警功能"
                />
              </div>
              <el-form-item label="报警曲目">
                <el-select v-model="form.alarm_track">
                  <el-option
                    v-for="(item, keys) in form.alarmTrackOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">默认配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round>应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-form label-position="top" :inline="true">
              <el-form-item label="终端状态默认项">
                <el-select v-model="form.default_terminal_status">
                  <el-option
                    v-for="(item, keys) in form.terminalStatusOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="默认展示模块">
                <el-select v-model="form.default_presentation_module">
                  <el-option
                    v-for="(item, keys) in form.presentationModuleOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="终端排序">
                <el-select v-model="form.default_terminal_sort">
                  <el-option
                    v-for="(item, keys) in form.terminalSortOptions"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">提醒配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round>应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-checkbox-group v-model="form.reminder_configuration">
              <el-checkbox label="1">启用火警报警提醒</el-checkbox>
              <el-checkbox label="2">启用人工报警提醒</el-checkbox>
              <el-checkbox label="3">启用终端离线提醒</el-checkbox>
              <el-checkbox label="4">启用终端离线铃声提醒</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="com-head">
            <div class="com-head-content com-alert-bg">
              <div class="com-breadcrumb">
                <span class="strong">功能配置</span>
              </div>
              <div class="com-button">
                <el-button type="primary" round>应用</el-button>
              </div>
            </div>
          </div>
          <div class="com-form">
            <el-button type="primary" round>功能管理</el-button>
            <el-button type="primary" round>注册管理</el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const form = reactive({
  one_key_alarm: false, // 启用一键报警功能
  alarm_track: 1, // 报警曲目
  alarmTrackOptions: [
    { value: 1, label: "报警曲目" },
    { value: 2, label: "报警曲目2" },
  ],
  default_terminal_status: 1, // 终端状态默认项
  terminalStatusOptions: [
    { value: 1, label: "终端" },
    { value: 2, label: "分组" },
  ],
  default_presentation_module: 1, // 默认展示模块
  presentationModuleOptions: [
    { value: 1, label: "报警曲目" },
    { value: 2, label: "报警曲目2" },
    { value: 3, label: "报警曲目3" },
    { value: 4, label: "报警曲目4" },
  ],
  default_terminal_sort: 1, // 默认终端排序
  terminalSortOptions: [
    { value: 1, label: "终端状态" },
    { value: 2, label: "IP地址" },
    { value: 3, label: "终端名称" },
    { value: 4, label: "呼叫编码" },
  ],
  reminder_configuration: [], // 提醒配置
});

// mounted 实例挂载完成后被调用
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
