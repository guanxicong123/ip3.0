<!-- 
  @Author: hmf
  @CreateDate: 2022-08-18
  @FilePath: src\components\configura_components\date_setting.vue
  @Describe: 日期设置
-->
<template>
  <div class="com-date-setting">
    <el-tabs v-model="form.activeName" @tab-click="handleTabClick">
      <el-tab-pane label="周" :name="0" v-if="config.showWeeks">
        <el-checkbox
          v-model="form.weekCheckAll"
          :indeterminate="form.weekIndeterminate"
          @change="handleCheckAllWeekChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="form.weekData"
          @change="handleCheckedWeekChange"
          style="width: 100%"
        >
          <el-checkbox v-for="item in weekOptions" :key="item" :label="item">
            {{ formatterWeeksType(item) }}
          </el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
      <el-tab-pane label="月" :name="1" v-if="config.showMonth">
        <el-checkbox
          v-model="form.monthCheckAll"
          :indeterminate="form.monthIndeterminate"
          @change="handleCheckAllMonthChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="form.monthData"
          class="repeat-month"
          @change="handleCheckedMonthChange"
        >
          <el-checkbox-button
            v-for="item in form.monthOptions"
            :key="item"
            :label="item"
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-tab-pane>
      <el-tab-pane label="日期" :name="3" v-if="config.showDay">
        <div class="repeat-day">
          <el-date-picker
            class="curstom-date-day"
            v-model="form.dayData"
            type="date"
            value-format="YYYY-MM-DD"
            popper-class="curstom-popper-day"
            :teleported="false"
            :disabled-date="disabledDate"
          />
          <div class="curstom-date-day-right">
            <div class="right-title">
              <span>已选日期 :</span>
              <span class="icon-font" v-if="form.dayOptions.length > 0">
                <i
                  class="iconfont icon-delete"
                  title="清空"
                  @click="handleClearAssignDay"
                ></i>
              </span>
            </div>
            <div class="right-content">
              <el-scrollbar>
                <ul>
                  <li v-for="(item, key) in form.dayOptions" :key="item.name">
                    <div class="day-left">
                      <div class="icon-txt">
                        <el-popover
                          v-if="config.showCloneDay"
                          :ref="'cloneDayRef' + key"
                          :visible="item.cloneDayVisible"
                          placement="left"
                          trigger="click"
                          popper-class="curstom-el-popper"
                        >
                          <template #reference>
                            <i
                              class="iconfont icon-clone"
                              title="克隆"
                              @click="handleOpenClonePopover(item)"
                            ></i>
                          </template>
                          <div class="clone-day-popover">
                            <el-date-picker
                              v-model="form.clone_day"
                              type="month"
                              value-format="YYYY-MM"
                              placeholder="请选择"
                              :teleported="false"
                              :disabled-date="disabledCloneDate"
                            />

                            <el-button
                              type="primary"
                              @click.stop="handleCloneDay(item)"
                            >
                              确认
                            </el-button>
                            <el-button
                              plain
                              @click.stop="
                                item.cloneDayVisible = !item.cloneDayVisible
                              "
                            >
                              关闭
                            </el-button>
                          </div>
                        </el-popover>
                        <span class="day">
                          <i
                            class="iconfont icon-delete"
                            title="删除"
                            @click="handleDeleteSingleAssignDay(item)"
                          ></i>
                          <span>{{ item.name }} :</span>
                        </span>
                      </div>
                    </div>
                    <div class="day-right">
                      <span class="day" v-for="row in item.days" :key="row">
                        <i
                          class="iconfont icon-delete"
                          title="删除"
                          @click="handleDeleteAssignDay(item, row)"
                        ></i>
                        <span>{{ row }}</span>
                      </span>
                    </div>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from "element-plus";

// 声明触发事件
const emit = defineEmits([
  "requestWeekData", // 更新传递已选择的周期数据，用于父组件进行数据交互
  "requestMonthData", // 更新传递已选择的月期数据，用于父组件进行数据交互
  "requestDayData", // 更新传递已选择的日期数据，用于父组件进行数据交互
  "requestType", // 更新传递已选择的数据类型，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseWeekData", // 编辑界面传递回来的周期数据，用于展示组件的已选择状态
  "responseMonthData", // 编辑界面传递回来的月期数据，用于展示组件的已选择状态
  "responseDayData", // 编辑界面传递回来的日期数据，用于展示组件的已选择状态
  "responseType", // 编辑界面传递回来的数据类型，用于展示组件的已选择状态
  "minDay", // 最小日期
  "maxDay", // 最大日期
]);

const form = reactive<any>({
  activeName: 0,
  weekData: [], // 周期
  weekCheckAll: false, // 周期-全选
  weekIndeterminate: false, // 周期-全选不确定状态
  monthData: [], // 月期
  monthCheckAll: false, // 月期-全选
  monthIndeterminate: false, // 月期-全选不确定状态
  monthOptions: [], // 月期数组
  dayData: "", // 日期
  dayOptions: [], // 日期数组
  clone_day: "", // 克隆日期-月份
});
let config = reactive<any>({
  showMonth: true, //是否显示月期
  showWeeks: true, //是否显示周期
  showDay: true, //是否显示日期
  showCloneDay: true, // 是否显示克隆日期
});
// 格式化重复周期类型
const formatterWeeksType = (row: number) => {
  return useFormatMap.weeksTypeMap.get(row);
};
// 周期
const weekOptions = [1, 2, 3, 4, 5, 6, 7];
// 选择日期禁用范围
const disabledDate = (time: { getTime: () => number }) => {
  let beginStartDate = parentData.minDay;
  let beginEndDate = parentData.maxDay;
  if (beginStartDate) {
    return (
      time.getTime() <
        usePublicMethod.dateConversionToTimestamp(beginStartDate) ||
      (beginEndDate &&
        time.getTime() >
          usePublicMethod.dateConversionToTimestamp(beginEndDate))
    );
  }
  if (!beginStartDate && !beginEndDate) {
    return time.getTime() < Date.now() - 8.64e7;
  }
};
// 克隆日期禁用范围
const disabledCloneDate = (time: { getTime: () => number }) => {
  let beginStartDate = parentData.minDay;
  let beginEndDate = parentData.maxDay;

  if (
    beginStartDate &&
    time.getTime() < usePublicMethod.dateConversionToTimestamp(beginStartDate)
  ) {
    return true;
  }

  if (
    beginEndDate &&
    time.getTime() > usePublicMethod.dateConversionToTimestamp(beginEndDate)
  ) {
    return true;
  }

  return time.getTime() < Date.now();
};
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
  emit("requestType", tab.paneName);
};
// 处理周期全选
const handleCheckAllWeekChange = () => {
  form.weekData = form.weekCheckAll ? weekOptions : [];
  let checkedCount = form.weekData.length;
  form.weekIndeterminate =
    checkedCount > 0 && checkedCount < weekOptions.length;
  emit("requestWeekData", form.weekData);
};
// 处理周期单选
const handleCheckedWeekChange = () => {
  let checkedCount = form.weekData.length;
  form.weekIndeterminate =
    checkedCount > 0 && checkedCount < weekOptions.length;
  form.weekCheckAll = checkedCount === weekOptions.length;
  emit("requestWeekData", form.weekData);
};
// 处理月期全选
const handleCheckAllMonthChange = () => {
  form.monthData = form.monthCheckAll ? form.monthOptions : [];
  let checkedCount = form.monthData.length;
  form.monthIndeterminate =
    checkedCount > 0 && checkedCount < form.monthOptions.length;
  emit("requestMonthData", form.monthData);
};
// 处理月期单选
const handleCheckedMonthChange = () => {
  let checkedCount = form.monthData.length;
  form.monthIndeterminate =
    checkedCount > 0 && checkedCount < form.monthOptions.length;
  form.monthCheckAll = checkedCount === form.monthOptions.length;
  emit("requestMonthData", form.monthData);
};
// 处理点击选择日期
const handleSelectedDate = (data: string) => {
  const name = data?.split("-")[0] + "-" + data?.split("-")[1];
  const day = Number(data?.split("-")[2]);
  setAssignDates(name, day);
};
// 处理打开克隆弹窗
const handleOpenClonePopover = (item: {
  name: string;
  cloneDayVisible: boolean;
}) => {
  item.cloneDayVisible = !item.cloneDayVisible;
  form.dayOptions.forEach((row: { name: string; cloneDayVisible: boolean }) => {
    if (row.name !== item.name) {
      row.cloneDayVisible = false;
    }
  });
};
// 设置重复日期
const setAssignDates = (name: string, day: number) => {
  let hasKey = false;
  form.dayOptions.some((item: { name: string }) => {
    if (item.name === name) {
      return (hasKey = true);
    }
  });

  if (!hasKey) {
    form.dayOptions.push({
      name: name,
      days: [],
      cloneDayVisible: false, // 是否显示克隆日期弹窗
    });
  }
  form.dayOptions.forEach((item: { name: string; days: number[] }) => {
    if (item.name === name && !item.days.includes(day)) {
      item.days.push(day);
      item.days.sort((a, b) => {
        return a - b;
      });
    }
  });
  handleUpdateRequestDayData();
};
// 处理更新已选择的日期
const handleUpdateRequestDayData = () => {
  let assignDates: string[] = [];

  if (form.dayOptions.length > 0) {
    form.dayOptions.forEach((row: { days: number[]; name: string }) => {
      row.days.forEach((day: number) => {
        if (day.toString().length === 1) {
          day = 0 + day;
        }
        assignDates.push(row.name + "-" + day);
      });
    });
  }
  emit("requestDayData", assignDates);
};
// 处理删除单个日期
const handleDeleteAssignDay = (
  item: { days: number[]; name: string },
  row: number
) => {
  item.days = item.days.filter((d: number) => {
    return d !== row;
  });

  if (!item.days.length) {
    form.dayOptions = form.dayOptions.filter((date: { name: string }) => {
      return date.name !== item.name;
    });

    return null;
  }
  handleUpdateRequestDayData();
};
// 处理删除单行日期
const handleDeleteSingleAssignDay = (item: { name: string }) => {
  form.dayOptions = form.dayOptions.filter((row: { name: string }) => {
    return row.name !== item.name;
  });
  handleUpdateRequestDayData();
};
// 处理清空日期
const handleClearAssignDay = () => {
  form.dayOptions = [];
  handleUpdateRequestDayData();
};
// 处理克隆日期
const handleCloneDay = (item: { days: any[] }) => {
  if (!form.clone_day) {
    return;
  }
  item.days.forEach((day) => {
    setAssignDates(form.clone_day, day);
  });
};
// 处理过滤不在范围内的日期
const handleFilterDate = () => {
  form.dayOptions = form.dayOptions.filter(
    (item: { name: any; days: any[] }) => {
      let prefix = item.name;
      item.days = item.days.filter((day: string) => {
        if (parentData.minDay && parentData.maxDay) {
          return (
            usePublicMethod.dateConversionToTimestamp(prefix + "-" + day) >=
              usePublicMethod.dateConversionToTimestamp(parentData.minDay) &&
            usePublicMethod.dateConversionToTimestamp(prefix + "-" + day) <=
              usePublicMethod.dateConversionToTimestamp(parentData.maxDay)
          );
        }

        if (parentData.minDay && !parentData.maxDay) {
          return (
            usePublicMethod.dateConversionToTimestamp(prefix + "-" + day) >=
            usePublicMethod.dateConversionToTimestamp(parentData.minDay)
          );
        }

        if (!parentData.minDay && parentData.maxDay) {
          return (
            usePublicMethod.dateConversionToTimestamp(prefix + "-" + day) <=
            usePublicMethod.dateConversionToTimestamp(parentData.maxDay)
          );
        }
        return !parentData.minDay && !parentData.maxDay;
      });

      return item.days.length > 0;
    }
  );
  handleUpdateRequestDayData();
};
// 处理编辑界面传递回来的数据
const handleEditWeekData = () => {
  form.weekData = [];
  parentData?.responseWeekData.forEach((item: { repeat_weeks: number }) => {
    form.weekData.push(item.repeat_weeks);
  });
  form.weekCheckAll = form.weekData.length == weekOptions.length;
  form.weekIndeterminate = form.weekData.length < weekOptions.length;
  emit("requestWeekData", form.weekData);
};
const handleEditMonthData = () => {
  form.monthData = [];
  parentData?.responseMonthData.forEach((item: { repeat_days: number }) => {
    form.monthData.push(item.repeat_days);
  });
  form.monthCheckAll = form.monthData.length == form.monthOptions.length;
  form.monthIndeterminate = form.monthData.length < form.monthOptions.length;
  emit("requestMonthData", form.monthData);
};
const handleEditDayData = async () => {
  await parentData?.responseDayData.forEach((item: { dates: string }) => {
    if (item.dates) {
      handleSelectedDate(item.dates);
    }
  });
  handleUpdateRequestDayData();
};
// 处理设置编辑数据
const handleSetEditData = (data: any) => {
  if (data?.responseType) {
    form.activeName = parentData?.responseType;
  }
  if (data?.responseWeekData?.length > 0) {
    handleEditWeekData();
  }
  if (data?.responseMonthData?.length > 0) {
    handleEditMonthData();
  }
  if (data?.responseDayData?.length > 0) {
    handleEditDayData();
  }
};

// 监听变化
watch(
  () => [form.dayData, parentData],
  ([newData, newParent]) => {
    if (newData) {
      handleSelectedDate(newData);
    }
    if (newParent?.minDay || newParent?.maxDay) {
      handleFilterDate();
    }
    handleSetEditData(newParent);
  },
  {
    // 设置首次进入执行方法 immediate
    immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  config = Object.assign(
    config,
    parentData.myConfig ? parentData.myConfig : {}
  );
  for (let index = 1; index < 32; index++) {
    form.monthOptions.push(index);
  }
  // 该组件的内容数据由内部生成展示，处理弹窗的编辑界面返回的数据（不用请求接口）时
  handleSetEditData(parentData);
});
</script>

<style lang="scss" scoped>
.com-date-setting {
  .repeat-month {
    :deep(.el-checkbox-button__inner) {
      width: 40px;
      height: 40px;
      line-height: 40px;
      padding: 0;
      margin: 5px 18px 5px 1px;
      border-radius: 0 !important;
      border-left: 1px solid #dcdfe6;
    }
    :deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
      border-left-color: $c-theme;
    }
  }
  .curstom-date-day-right {
    display: flex;
    flex-flow: column;
    height: 343px;
    margin-left: 360px;
    border-radius: 5px;
    border: 1px solid #ddd;
    .right-title {
      display: inline-flex;
      align-items: center;
      height: 57px;
      padding: 0 12px;
      border-bottom: 1px solid #ebeef5;
      .icon-font {
        flex: 1;
        text-align: right;
      }
    }
    .right-content {
      height: calc(100% - 58px);
      ul {
        li {
          display: flex;
          // align-items: center;
          padding-top: 6px;
          width: 100%;
          .day-left {
            .icon-txt {
              height: 32px;
              line-height: 32px;
              margin: 6px 0 6px 12px;
              > i {
                margin-right: 12px;
              }
              .day {
                position: relative;
                margin-right: 12px;
                cursor: default;
                i {
                  display: none;
                  position: absolute;
                  top: -22px;
                  right: -8px;
                }
                &:hover i {
                  display: block;
                  background-color: $c-fff;
                }
              }
            }
          }
          .day-right {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            flex: 1;
            width: calc(100% - 168px);
            .day {
              position: relative;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              margin: 6px;
              border: 1px solid #ddd;
              i {
                display: none;
                position: absolute;
                top: -8px;
                right: -8px;
              }
              &:hover i {
                display: block;
                background-color: $c-fff;
              }
            }
          }
        }
      }
    }
  }
}
:deep(.curstom-date-day) {
  width: 0 !important;
  height: 0 !important;
  visibility: hidden;
}
:deep(.curstom-popper-day) {
  display: block !important;
  left: 4px !important;
  top: 14px !important;
  box-shadow: none !important;
  .el-picker-panel__footer,
  .el-popper__arrow {
    display: none;
  }
  .el-picker-panel__content {
    border-top: 1px solid #ebeef5;
  }
}
.clone-day-popover {
  :deep(.el-date-editor.el-input) {
    width: auto;
    vertical-align: middle;
    margin-right: 6px;
  }
}
</style>
