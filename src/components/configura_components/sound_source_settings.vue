<!-- 
  @Author: hmf
  @CreateDate: 2022-08-18
  @FilePath: src\components\configura_components\sound_source_settings.vue
  @Describe: 音源设置
-->
<template>
  <div class="com-sound-source-settings">
    <el-tabs v-model="form.activeName" @tab-click="handleTabClick">
      <el-tab-pane label="广播" :name="6" lazy v-if="config.isSelectBroadcast">
        <el-row :gutter="60">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="广播设备">
              <el-input placeholder="应用终端为发起方" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="对讲" :name="7" lazy v-if="config.isSelectIntercom">
        <el-row :gutter="60">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="对讲设备">
              <el-input placeholder="应用终端为发起方" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="监听" :name="8" lazy v-if="config.isSelectMonitor">
        <el-row :gutter="60">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="监听设备">
              <el-input placeholder="应用终端为发起方" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :name="4" lazy v-if="config.isSelectFastSoundSource">
        <template #label>
          <span class="custom-tabs-label"> 快捷音源 </span>
        </template>
        <el-row :gutter="60">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="快捷音源" prop="sound_source.name">
              <div class="com-add-select-components">
                <el-input
                  v-model="form.sound_source.name"
                  placeholder="请选择"
                  disabled
                  @change="handleSelectedConfigure"
                />
                <div class="select-button">
                  <i
                    class="iconfont icon-select-file"
                    title="选择"
                    @click="form.soundSourceDialogVisible = true"
                  ></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <!-- 音乐播放类型 -->
          <template
            v-if="
              config.isSelectMusicPlay &&
              config.musicPlayModel &&
              form.sound_source.type == 1
            "
          >
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="播放模式" prop="play_model">
                <el-select
                  v-model="form.play_model"
                  @change="handleSelectedConfigure"
                >
                  <el-option
                    v-for="(item, keys) in config.setMusicPlayModelOption"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
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
              v-if="form.play_model === 0"
            >
              <el-form-item label="&nbsp;" prop="life_time">
                <span>持续时间 : {{ form.life_time }}</span>
              </el-form-item>
            </el-col>
            <template
              v-if="config.musicPlayModelRandomConfig && form.play_model !== 0"
            >
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-radio
                  v-model="form.selete_time_or_number"
                  :label="0"
                  style="height: 28px"
                  @change="handleSelectedConfigure"
                >
                  持续时间
                </el-radio>
                <el-form-item label="" prop="life_time">
                  <div class="com-add-select-components">
                    <el-time-picker
                      v-model="form.life_time"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                      placeholder="持续时间"
                      :clearable="false"
                      :disabled="form.selete_time_or_number === 1"
                      @change="handleSelectedConfigure"
                    />
                    <!-- <div class="select-button">
                      <i
                        class="iconfont icon-time"
                        title="统计已选音乐时长"
                        @click="handleTotalStatisticalDuration"
                      ></i>
                    </div> -->
                  </div>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-radio
                  v-model="form.selete_time_or_number"
                  :label="1"
                  style="height: 28px"
                  @change="handleSelectedConfigure"
                >
                  播放曲目
                </el-radio>
                <el-form-item label="" prop="play_number">
                  <el-input-number
                    v-model="form.play_number"
                    :min="1"
                    :max="9999"
                    :value-on-clear="form.play_number"
                    controls-position="right"
                    :disabled="form.selete_time_or_number === 0"
                    @change="handleSelectedConfigure"
                  />
                </el-form-item>
              </el-col>
            </template>
          </template>
          <!-- 音源采集 -->
          <template
            v-if="
              config.isSelectSoundSource &&
              (form.sound_source.type == 2 || form.sound_source.type == 3)
            "
          >
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="6"
              v-if="config.soundSourceQuality"
            >
              <el-form-item label="采集音质" prop="sound_quality">
                <el-select
                  v-model="form.sound_quality"
                  @change="handleSelectedConfigure"
                >
                  <el-option
                    v-for="(item, keys) in config.setSoundQualityOption"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
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
              v-if="config.soundSourceEndTime"
            >
              <el-form-item label="结束时间" prop="end_time">
                <el-time-picker
                  v-model="form.end_time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  placeholder="结束时间"
                  :clearable="false"
                  @change="handleSelectedConfigure"
                />
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="6"
              v-if="config.soundSourceAutoCheck && form.sound_source_type === 3"
            >
              <el-form-item label="&nbsp;" prop="reset_auto_check">
                <el-checkbox
                  v-model="form.reset_auto_check"
                  label="自检"
                  :true-label="1"
                  :false-label="0"
                  @change="handleSelectedConfigure"
                />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="音乐播放"
        :name="1"
        lazy
        v-if="config.isSelectMusicPlay && form.view_mode == 1"
      >
        <el-row :gutter="60">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="音乐文件" prop="media.name">
              <div class="com-add-select-components">
                <el-input
                  v-model="form.media.name"
                  placeholder="请选择"
                  disabled
                  @change="handleSelectedConfigure"
                />
                <div class="select-button">
                  <i
                    class="iconfont icon-select-file"
                    title="选择"
                    @click="form.mediaDialogVisible = true"
                  ></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <template v-if="config.musicPlayModel">
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="播放模式" prop="play_model">
                <el-select
                  v-model="form.play_model"
                  @change="handleSelectedConfigure"
                >
                  <el-option
                    v-for="(item, keys) in config.setMusicPlayModelOption"
                    :key="keys"
                    :label="item.label"
                    :value="item.value"
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
              v-if="form.play_model === 0"
            >
              <el-form-item label="&nbsp;" prop="life_time">
                <span>持续时间 : {{ form.life_time }}</span>
              </el-form-item>
            </el-col>
            <template
              v-if="config.musicPlayModelRandomConfig && form.play_model !== 0"
            >
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-radio
                  v-model="form.selete_time_or_number"
                  :label="0"
                  style="height: 28px"
                  @change="handleSelectedConfigure"
                >
                  持续时间
                </el-radio>
                <el-form-item label="" prop="life_time">
                  <div class="com-add-select-components">
                    <el-time-picker
                      v-model="form.life_time"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                      placeholder="持续时间"
                      :clearable="false"
                      :disabled="form.selete_time_or_number === 1"
                      @change="handleSelectedConfigure"
                    />
                    <div class="select-button">
                      <i
                        class="iconfont icon-time"
                        title="统计已选音乐时长"
                        @click="handleTotalStatisticalDuration"
                      ></i>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                <el-radio
                  v-model="form.selete_time_or_number"
                  :label="1"
                  style="height: 28px"
                  @change="handleSelectedConfigure"
                >
                  播放曲目
                </el-radio>
                <el-form-item label="" prop="play_number">
                  <el-input-number
                    v-model="form.play_number"
                    :min="1"
                    :max="9999"
                    :value-on-clear="form.play_number"
                    controls-position="right"
                    :disabled="form.selete_time_or_number === 0"
                    @change="handleSelectedConfigure"
                  />
                </el-form-item>
              </el-col>
            </template>
          </template>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="音源采集"
        :name="23"
        lazy
        v-if="config.isSelectSoundSource && form.view_mode == 1"
      >
        <select-sound-source-collection-radios
          style="height: 380px; margin: 1px 0 26px"
          :myConfig="myConfigCollection"
          @requestSoundSource="handleRequestSoundSource"
          @requestType="handleRequestType"
          :responseSoundSource="form.sound_source_acquisition"
          :responseType="form.old_sound_source_type"
        />
        <el-row :gutter="60">
          <el-col
            :xs="12"
            :sm="8"
            :md="8"
            :lg="8"
            :xl="6"
            v-if="config.soundSourceQuality"
          >
            <el-form-item label="采集音质" prop="sound_quality">
              <el-select
                v-model="form.sound_quality"
                @change="handleSelectedConfigure"
              >
                <el-option
                  v-for="(item, keys) in config.setSoundQualityOption"
                  :key="keys"
                  :label="item.label"
                  :value="item.value"
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
            v-if="config.soundSourceEndTime"
          >
            <el-form-item label="结束时间" prop="end_time">
              <el-time-picker
                v-model="form.end_time"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                placeholder="结束时间"
                :clearable="false"
                @change="handleSelectedConfigure"
              />
            </el-form-item>
          </el-col>
          <el-col
            :xs="12"
            :sm="8"
            :md="8"
            :lg="8"
            :xl="6"
            v-if="config.soundSourceAutoCheck && form.sound_source_type === 3"
          >
            <el-form-item label="&nbsp;" prop="reset_auto_check">
              <el-checkbox
                v-model="form.reset_auto_check"
                label="自检"
                :true-label="1"
                :false-label="0"
                @change="handleSelectedConfigure"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="文本播放"
        :name="5"
        lazy
        v-if="config.isSelectTextPlay"
      >
        <el-row :gutter="60">
          <el-col :span="24">
            <el-form-item label="文本内容" prop="txt" style="width: 100%">
              <el-input
                v-model="form.txt"
                :autosize="{ minRows: 5 }"
                type="textarea"
                placeholder="请输入内容"
                maxlength="1000"
                show-word-limit
                clearable
                @change="handleSelectedConfigure"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="" prop="is_play">
              <el-checkbox
                v-model="form.is_play"
                label="开启播放功能(未启用时，终端默认静音)"
                size="large"
                :true-label="1"
                :false-label="0"
                @change="handleSelectedConfigure"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="显示属性" prop="led_display_cfg_id">
              <el-select
                v-model="form.led_display_cfg_id"
                @change="handleSelectedConfigure"
              >
                <el-option
                  v-for="(item, keys) in ledDisplayOption"
                  :key="keys"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-form-item label="播报次数" prop="broadcast_number">
              <el-input-number
                v-model="form.broadcast_number"
                :min="0"
                :max="9999"
                :value-on-clear="form.broadcast_number"
                controls-position="right"
                @change="handleSelectedConfigure"
              />
              <span class="tip-text tip" v-if="form.broadcast_number > 0">
                预估时间: {{ form.estimated_time }}
              </span>
              <el-tooltip
                effect="dark"
                content="播报次数为0时，为循环播放"
                placement="right-start"
              >
                <i class="iconfont icon-gray-item theme"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <template v-if="form.is_play">
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="播放语音" prop="sound">
                <el-select
                  v-model="form.sound"
                  @change="handleSelectedConfigure"
                >
                  <el-option
                    v-for="(item, keys) in playVoiceOption"
                    :key="keys"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="播放语速" prop="speed">
                <el-select
                  v-model="form.speed"
                  @change="handleSelectedConfigure"
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
          </template>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- 选择快捷音源 -->
    <el-dialog
      v-if="config.isSelectFastSoundSource"
      v-model="form.soundSourceDialogVisible"
      width="1000px"
      destroy-on-close
      draggable
      class="com-default-dialog"
      title="选择快捷音源"
    >
      <select-shortcut-sound-source-radio
        style="height: 380px"
        @requestConfigure="handleRequestConfigure"
        :responseConfigure="form.sound_source"
        :soundType="parentData.soundType"
      />
      <template #footer>
        <div class="com-dialog-footer">
          <el-button plain @click="form.soundSourceDialogVisible = false">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 选择音乐文件 -->
    <el-dialog
      v-if="config.isSelectMusicPlay"
      v-model="form.mediaDialogVisible"
      width="1000px"
      destroy-on-close
      draggable
      class="com-default-dialog"
    >
      <template #header="{ titleId, titleClass }">
        <div class="com-dialog-header">
          <span :id="titleId" :class="titleClass">选择音乐文件</span>
          <span>
            &nbsp;( 已选文件 :
            <span class="theme">
              {{ form.medias.length }}
            </span>
            &nbsp; 已选文件夹 :
            <span class="theme">
              {{ form.medias_groups.length }}
            </span>
            )
          </span>
        </div>
      </template>
      <select-media-group
        style="height: 380px; margin: 1px 0 26px"
        @requestMedia="handleRequestMedia"
        @requestGroups="handleRequestGroups"
        @selectedMediaName="handleSelectedMediaName"
        @selectedGroupsName="handleSelectedGroupsName"
        @totalSecond="handleTotalSecond"
        :responseMedia="parentData.responseMedia"
        :responseGroups="parentData.responseGroups"
      />
      <template #footer>
        <div class="com-dialog-footer">
          <el-button plain @click="form.mediaDialogVisible = false">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from "element-plus";
import { ElMessage } from "element-plus";
import usePublicMethod from "@/utils/global/index";
import { DisplayAttributeService } from "@/utils/api/display_attribute/index";

// 声明触发事件
const emit = defineEmits([
  "requestMedia", // 更新传递已选择的媒体数据，用于父组件进行数据交互
  "requestGroups", // 更新传递已选择的媒体文件夹数据，用于父组件进行数据交互
  "requestSoundSource", // 更新传递已选择的音源数据，用于父组件进行数据交互
  "requestType", // 更新传递已选择的音源数据类型，用于父组件进行数据交互
  "requestSoundSourceID", // 更新传递已选择的快捷音源id，用于父组件进行数据交互
]);
// 声明父组件传值
const parentData = defineProps([
  "myConfig", // config 配置,将对应覆盖 config
  "responseMedia", // 编辑界面传递回来的媒体数据，用于展示组件的已选择状态
  "responseGroups", // 编辑界面传递回来的媒体文件夹数据，用于展示组件的已选择状态
  "responseSoundSource", // 编辑界面传递回来的音源数据，用于展示组件的已选择状态
  "responseType", // 编辑界面传递回来的音源类型，用于展示组件的tab状态-activeName
  "responseFastSoundSource", // 编辑界面传递回来的快捷音源数据，用于展示组件的已选择状态
  "responsePlayModel", // 编辑界面传递回来的音源数据，用于设置默认音乐播放-播放模式选项类型
  "responseActiveName", // 编辑界面传递回来的音源数据，用于设置默认activeName
  "soundType", // 获取音源类型数据
]);

const user = getStore.useUserStore();
// 计算属性 computed
const userStore = computed(() => user.user);

const form = reactive<any>({
  activeName: 4,
  view_mode: 1, // 1:经典模式，2:简约模式
  soundSourceDialogVisible: false, // 选择快捷音源弹窗
  mediaDialogVisible: false, // 选择音乐文件弹窗
  sound_source: {
    id: 0,
    name: "",
    type: 0,
  }, // 快捷音源
  media: {
    name: "",
  }, // 音乐文件
  play_model: 0, // 播放模式
  life_time: "00:00:00", // 持续时间
  play_number: 1, // 播放曲目
  end_time: "00:00:00", // 结束时间
  sound_quality: 1, // 采集音质
  reset_auto_check: 0, // 自检
  selete_time_or_number: 0, // 0持续时间 1播放曲目
  sound_source_type: 2, // 音源采集类型
  old_sound_source_type: 2, // 音源采集类型
  sound_source_acquisition: {}, // 音源采集
  txt: "", // 文本内容
  is_play: 1, // 开启播放功能
  led_display_cfg_id: 1, // 显示属性
  broadcast_number: 1, // 播报次数
  sound: "", // 播放语音
  speed: 5, // 播放语速
  estimated_time: "00:00:00", // 预估时间
  medias: [], // 已选媒体
  medias_groups: [], // 已选媒体文件
  selectedMediaName: "", // 已选媒体名称
  selectedGroupsName: "", // 已选媒体文件夹名称
  totalSecond: 0, // 选择媒体的总时长
});
// 插件配置
let config = reactive<any>({
  isSelectBroadcast: false, // 是否可以选择广播
  isSelectIntercom: false, // 是否可以选择对讲
  isSelectMonitor: false, // 是否可以选择监听
  isSelectFastSoundSource: true, // 是否可以选择快捷音源
  isSelectMusicPlay: true, // 是否可以选择音乐播放
  isSelectSoundSource: true, // 是否可以选择音源采集
  isSelectTextPlay: false, // 是否可以选择文本播放
  musicPlayModel: true, // 是否可以选择音乐播放-播放模式
  musicPlayModelRandomConfig: true, // 是否可以选择音乐播放-播放模式-随机模式配置
  soundSourceQuality: true, // 是否可以选择音源采集-采集音质
  soundSourceEndTime: true, // 是否可以选择音源采集-结束时间
  soundSourceAutoCheck: true, // 是否可以选择音源采集-自检
  soundSourceSoundCard: true, // 是否可以选择音源采集-声卡
  setMusicPlayModelOption: useFormatMap.playModelOption, // 设置音乐播放-播放模式选项类型
  setSoundQualityOption: useFormatMap.qualityOption, // 采集音质选项
});

// 显示属性
const ledDisplayOption = ref<any[]>([]);
// 播放语音
const playVoiceOption = ref<any[]>([]);
// 播放语速
const playSpeedOption = ref<any[]>([]);
// 格式化显示播放语速
const formatterSpeed = (row: number) => {
  switch (row) {
    case 1:
      return row + " ( 最快 )";
    case 5:
      return row + " ( 推荐 )";
    case 8:
      return row + " ( 最慢 )";
    default:
      return row;
  }
};
// 处理tab点击
const handleTabClick = (tab: TabsPaneContext) => {
  // 23:音源采集
  if (tab.paneName === 23) {
    emit("requestType", form.sound_source_type);
    form.sound_source.type = form.sound_source_type;
  } else {
    emit("requestType", tab.paneName);
    form.sound_source.type = Number(tab.paneName);
  }
  handleSelectedConfigure();
};
// 处理已选媒体名称
const handleSelectedMediaName = (data: string) => {
  form.selectedMediaName = data;
  form.media.name = data + form.selectedGroupsName;
};
// 处理已选媒体文件夹名称
const handleSelectedGroupsName = (data: string) => {
  form.selectedGroupsName = data;
  form.media.name = form.selectedMediaName + data;
};
// 处理已选择媒体文件
const handleRequestMedia = (data: any) => {
  form.medias = data;
  emit("requestMedia", data);
  handleSelectedConfigure();
};
// 处理已选择媒体文件夹
const handleRequestGroups = (data: any) => {
  form.medias_groups = data;
  emit("requestGroups", data);
  handleSelectedConfigure();
};
// 处理已选择媒体的统计时长
const handleTotalSecond = (data: any) => {
  form.totalSecond = data;
  form.life_time = usePublicMethod.convertSongDuration(data);
};
// 处理统计已选音乐时长
const handleTotalStatisticalDuration = () => {
  form.life_time = usePublicMethod.convertSongDuration(form.totalSecond);
};
// 处理已选择音源采集
const handleRequestSoundSource = (data: any) => {
  // 任务类型 1:音乐播放 2:声卡采集 3:终端采集
  form.sound_source.id = data.id;
  form.sound_source.name = data.name;
  form.sound_source.type = data.type ? data.type : 2;
  emit("requestSoundSourceID", form.sound_source.id);
  handleSelectedConfigure();
};
// 处理已选择音源采集的类型
const handleRequestType = (data: number) => {
  form.sound_source_type = data;
  const notData = {
    id: 0,
    name: "",
    type: data,
  };
  form.sound_source = notData;
  emit("requestType", data);
  handleSelectedConfigure();
};
// 处理选择快捷音源组件的数据
const handleRequestConfigure = (data: any) => {
  form.sound_source.id = data.id;
  form.sound_source.name = data.name;
  form.sound_source.type = data.type;
  emit("requestSoundSourceID", form.sound_source.id);
  handleSelectedConfigure();
};
// 音源选择插件配置
const myConfigCollection = ref({ soundSourceSoundCard: true });
// 处理已选择的配置数据
const handleSelectedConfigure = () => {
  let sound_source: any = {};
  // 音乐播放
  if (form.sound_source.type === 1) {
    sound_source = {
      play_model: form.play_model,
      life_time: !form.selete_time_or_number ? form.life_time : "",
      play_number: form.selete_time_or_number ? form.play_number : 0,
      type: form.sound_source.type,
    };
    if (!config.musicPlayModelRandomConfig) {
      delete sound_source.life_time;
      delete sound_source.play_number;
    }
  }
  // 声卡采集
  if (form.sound_source.type === 2) {
    sound_source = {
      sound_quality: form.sound_quality,
      sound_card: form.sound_source.name,
      end_time: form.end_time,
      type: form.sound_source.type,
    };
  }
  // 采集终端
  if (form.sound_source.type === 3) {
    sound_source = {
      terminals_id: form.sound_source.id,
      terminals_name: form.sound_source.name,
      sound_quality: form.sound_quality,
      end_time: form.end_time,
      reset_auto_check: form.reset_auto_check,
      type: form.sound_source.type,
    };
  }
  // 文本播放
  if (form.sound_source.type === 5) {
    sound_source = {
      is_play: form.is_play,
      sound: form.sound,
      speed: form.speed,
      play_number: form.play_number,
      txt: form.txt,
      led_display_cfg_id: form.led_display_cfg_id,
      type: form.sound_source.type,
    };
  }
  emit("requestSoundSource", sound_source);
};
// 获取所有显示属性
const getAllDisplayAttribute = async () => {
  form.loading = true;
  await DisplayAttributeService.getAllDisplayAttribute({})
    .then((result) => {
      if (result.result) {
        ledDisplayOption.value = result.result;
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

// 监听变化
watch(
  () => [parentData, userStore.value?.user.users_config],
  ([newData, newMode]) => {
    // 编辑回传的音源类型
    if (newData.responseType) {
      form.activeName =
        newData.responseType == 2 || newData.responseType == 3
          ? 23
          : newData.responseType;
      emit("requestType", newData.responseType);
    }
    // 编辑回传的音乐播放数据
    if (
      parentData.responseMedia.length > 0 ||
      parentData.responseGroups.length > 0
    ) {
      let media_name = "";
      let group_name = "";
      for (let index = 0; index < parentData.responseMedia.length; index++) {
        const media = parentData.responseMedia[index];
        media_name += media.name + ",";
      }
      for (let index = 0; index < parentData.responseGroups.length; index++) {
        const group = parentData.responseGroups[index];
        group_name += group.name + ",";
      }
      form.media.name = media_name + group_name;
      emit("requestMedia", parentData.responseMedia);
      emit("requestGroups", parentData.responseGroups);
    }
    // 编辑回传的音源
    if (newData.responseSoundSource) {
      form.sound_source.type =
        newData.responseSoundSource.type || newData.responseType;
      Object.keys(form).forEach((item) => {
        Object.keys(newData.responseSoundSource).forEach((row) => {
          if (item === row) {
            form[item] = newData.responseSoundSource[row];
          }
        });
      });
      // 音乐播放
      if (form.life_time != "") {
        form.selete_time_or_number = 0;
        form.play_number = 1;
      } else {
        form.selete_time_or_number = 1;
        form.life_time = "00:00:00";
      }
      // 声卡采集
      if (
        Object.prototype.hasOwnProperty.call(
          newData.responseSoundSource,
          "sound_card"
        )
      ) {
        form.old_sound_source_type = 2;
        form.sound_source_acquisition = {
          sound_card: newData.responseSoundSource.sound_card,
        };
      } else {
        // 终端采集
        form.old_sound_source_type = 3;
        form.sound_source_acquisition = {
          terminals_id: newData.responseSoundSource.terminals_id,
          terminals_name: newData.responseSoundSource.terminals_name,
        };
      }
    }
    // 编辑回传的快捷音源
    if (newData.responseFastSoundSource) {
      form.sound_source.id = newData.responseFastSoundSource.id;
      form.sound_source.name = newData.responseFastSoundSource.name;
      form.sound_source.type = newData.responseFastSoundSource.type;
    }
    // 界面模式
    if (newMode) {
      form.view_mode = newMode.view_mode;
      if (newMode.view_mode == 2) {
        emit("requestSoundSourceID", 0);
        if (form.activeName == 1 || form.activeName == 23) {
          form.activeName = 4;
          form.sound_source.type = form.activeName;
          emit("requestType", form.activeName);
        }
      }
    }
    handleSelectedConfigure();
  },
  {
    // 设置首次进入执行方法 immediate
    // immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  // 更新插件配置
  config = Object.assign(
    config,
    parentData.myConfig ? parentData.myConfig : {}
  );
  // 设置默认activeName
  if (parentData.responseActiveName) {
    form.activeName = parentData.responseActiveName;
  }
  // 是否可以选择音源采集-声卡
  if (!parentData.myConfig?.soundSourceSoundCard) {
    myConfigCollection.value.soundSourceSoundCard = config.soundSourceSoundCard;
  }
  // 设置音乐播放模式-默认显示
  if (parentData.responsePlayModel) {
    form.play_model = parentData.responsePlayModel;
  }
  // 播放语速
  for (let i = 1; i < 9; i++) {
    playSpeedOption.value.push(i);
  }
  getAllDisplayAttribute();
  form.view_mode = userStore.value?.user.users_config.view_mode;
});
</script>

<style lang="scss" scoped>
.com-sound-source-settings {
  .custom-tabs-label {
    i {
      font-size: 12px;
      margin-right: 5px;
    }
    i,
    span {
      vertical-align: middle;
    }
  }
}
</style>
