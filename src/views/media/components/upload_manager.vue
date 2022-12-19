<!-- 
  @Author: hmf
  @CreateDate: 2022-10-30
  @FilePath: src\views\media\components\upload_manager.vue
  @Describe: 上传管理器
-->
<template>
  <div class="com-upload-manager" :class="{ 'is-minimize': uploadMinimizeStore }">
    <div class="upload-manager">
      <div
        class="upload-status"
        :class="{ iconfont: uploadMinimizeStore }"
        @click="recoveryMaximize"
      >
        <div class="left">
          <span>总进度：{{ form.totalProgress }}%</span>
          <span> 网速：{{ usePublicMethod.bytesConversionToSize(form.speed) }} / S </span>
        </div>
        <div class="right">
          <span class="green">成功：{{ form.successFiles }} </span>
          <span class="red">失败：{{ form.errorFiles }}</span>
        </div>
      </div>
      <div class="upload-title theme-bg">
        <div class="left">
          <span>上传管理器</span>
          <span v-if="form.groupData.length > 0">
            - {{ form.currentSelected.name }}
          </span>
        </div>
        <div class="right">
          <VueUploadComponent
            @input-filter="inputFilter"
            @input-file="inputFile"
            :post-action="form.url"
            :extensions="form.extensions"
            :headers="form.headers"
            :multiple="true"
            :accept="form.accept"
            :thread="3"
            :size="1024 * 1024 * 10"
            name="file"
            ref="uploadRef"
            v-model="form.files"
            :input-id="'upload-group-' + form.currentSelected.id"
            title="选择文件(单首500M以内)"
          >
            <i
              class="iconfont icon-select-file"
              :id="'selected-file-' + form.currentSelected.id"
              v-if="form.groupData.length > 0"
            ></i>
          </VueUploadComponent>
          <i
            class="iconfont icon-delete"
            title="清空列表"
            @click="handleClearList"
            v-if="form.showFilesInfo.length > 0"
          ></i>
          <el-icon
            title="最小化"
            @click.stop="upload.updateUploadManagerIsMinimize(true)"
          >
            <SemiSelect />
          </el-icon>
          <el-icon title="关闭" @click.stop="handleClose"><CloseBold /></el-icon>
        </div>
      </div>
      <div class="upload-list">
        <div class="left">
          <el-scrollbar>
            <ul>
              <li class="no-data" v-if="form.groupData.length < 1">
                <span>暂无数据</span>
              </li>
              <li
                v-for="item in form.groupData"
                :key="item.id"
                @click="handleClick(item)"
                :class="{ 'com-select-bg': form.currentSelected.id == item.id }"
              >
                <i class="iconfont icon-gray-fine"></i>
                <span>{{ item.name }}</span>
                <el-icon class="close" title="移除" @click.stop="handleRemove(item.id)">
                  <Close />
                </el-icon>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="right">
          <el-scrollbar>
            <ul>
              <li class="no-data" v-if="form.showFilesInfo.length < 1">
                <span>暂无数据</span>
              </li>
              <li
                v-for="(item, index) in form.showFilesInfo"
                :key="index"
                :class="{ red: item.error, green: item.success }"
              >
                <div class="list">
                  <p class="txt">{{ item.name }}</p>
                  <el-progress
                    :percentage="Number.parseInt(item.progress)"
                    :stroke-width="3"
                    :show-text="false"
                  />
                </div>
                <el-icon class="close" title="移除" @click.stop="handleRemoveFiles(item)">
                  <Close />
                </el-icon>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import VueUploadComponent from "vue-upload-component";
import type { VueUploadItem } from "vue-upload-component";
import { Md5 } from "ts-md5/dist/md5";
import { MeidaService } from "@/utils/api/media";
import usePublicMethod from "@/utils/global/index";

const upload = getStore.useUploadStore();
// 计算属性 computed
const uploadGroupStore = computed(() => upload.groupData);
const uploadSelectedStore = computed(() => upload.currentSelected);
const uploadMinimizeStore = computed(() => upload.isMinimize);
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const form = reactive<any>({
  groupData: [], // 分组数据
  currentSelected: {}, // 当前选中分组
  showFilesInfo: [], // 缓存目前的文件内容(用于显示)
  // 上传插件
  url: "/",
  files: [], // 上传文件数据
  md5Finish: 0,
  accept:
    "audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/aac,audio/flac,audio/amr,audio/opus", // 表单的accept属性, MIME type
  extensions: "mpeg,mp3,ogg,wav,aac,flac,amr,opus", // 允许上传的文件后缀
  hasUploadError: false,
  headers: {
    authorization: localStorage.get("userToken"),
  },
  // 状态
  successFiles: 0, // 成功文件
  totalFilesLength: 0, // 文件数量
  errorFiles: 0, // 失败文件
  totalProgress: 0, // 总进度
  speed: 0, // 网速
  // 过滤提示
  isFileLarge: false, // 文件是否过大500M
  isDuplicateName: false, // 名称是否重复
});
// 上传插件refs
const uploadRef = ref();
// 处理点击
const handleClick = (item: any) => {
  form.currentSelected = item;
  form.url = "/api/v29+/medias/upload/" + form.currentSelected.id;
  form.showFilesInfo = form.files.filter((row: { postAction: string | string[] }) => {
    let folderId = row.postAction.slice(row.postAction.lastIndexOf("/") + 1);
    if (folderId == item.id) {
      return true;
    }
  });
};
// 处理关闭弹窗
const handleClose = () => {
  form.groupData = [];
  form.showFilesInfo = [];
  form.files = [];
  form.currentSelected = {};
  upload.updateShowUploadManager(false);
  upload.clearGroupData();
};
// 处理移除文件
const handleRemove = (id: number) => {
  if (form.groupData.length > 0 && form.currentSelected?.id == id) {
    upload.updateCurrentSelected(form.groupData[0]);
  }
  if (form.currentSelected?.id == id) {
    form.currentSelected = {};
  }
  upload.removeGroupData(id);
  clearFiles(id.toString());
};
// 恢复最大化
const recoveryMaximize = () => {
  if (uploadMinimizeStore.value) {
    upload.updateUploadManagerIsMinimize(false);
  }
};
// 处理移除上传文件
const handleRemoveFiles = (item: any) => {
  form.showFilesInfo = form.showFilesInfo.filter((row: { name: any }) => {
    return item.name != row.name;
  });
  form.files = form.files.filter((row: { name: any }) => {
    return item.name != row.name;
  });
};
// 初始化上传文件的状态参数值
const handleInitializationParameters = () => {
  form.speed = 0;
  form.errorFiles = 0;
  form.successFiles = 0;
  form.totalFilesLength = 0;
  form.totalProgress = 0;
};
// 清空列表
const handleClearList = () => {
  form.showFilesInfo = [];
  handleInitializationParameters();
  clearFiles(form.currentSelected.id.toString());
};
// 清除上传文件队列数据
const clearFiles = (id: string) => {
  form.files = form.files.filter((row: { postAction: string | string[] }) => {
    let folderId = row.postAction.slice(row.postAction.lastIndexOf("/") + 1);
    return folderId != id;
  });
};
// Add, update, remove pre-filter 选择文件后触发事件
// https://lian-yue.github.io/vue-upload-component/#/zh-cn/documents#%E9%80%89%E9%A1%B9-%E4%BA%8B%E4%BB%B6-input-filter
const inputFilter = (
  newFile: VueUploadItem | undefined,
  oldFile: VueUploadItem | undefined,
  prevent: (prevent?: boolean) => boolean
) => {
  if (newFile && !oldFile) {
    const size = newFile.size || 0;
    // 自定义当前文件 body 或 query 附加内容
    newFile.data = {
      type: newFile.type,
    };
    // 去掉大于500M文件
    if (size > 500 * 1024 * 1024) {
      form.isFileLarge = true;
    }
    // 去掉重名文件
    form.files.forEach((file: { name: string | undefined }) => {
      if (file.name === newFile.name) {
        form.isDuplicateName = true;
      }
    });
    // 过滤不符合要求的文件（大于500MB和非 form.accept 包含的格式）
    if (form.isFileLarge || form.accept.split(",").indexOf(newFile.type) < 0) {
      ElMessage({
        type: "error",
        message: "已自动过滤不符合要求的文件（大于500MB/非mp3/ogg/wav格式）",
        grouping: true,
      });
      form.isFileLarge = false;
      return prevent();
    }
    // 过滤重名文件
    if (form.isDuplicateName) {
      ElMessage({
        type: "error",
        message: "已自动过滤重名的文件",
        grouping: true,
      });
      form.isDuplicateName = false;
      return prevent();
    }
    // Filter system files or hide files
    // 过滤系统文件 和隐藏文件
    if (newFile.name && /(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
      return prevent();
    }
    // Filter php html js file
    // 过滤 php html js 文件
    if (newFile.name && /\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
      return prevent();
    }
  }
};
// 添加，更新，移除 后触发事件
// https://lian-yue.github.io/vue-upload-component/#/zh-cn/documents#%E9%80%89%E9%A1%B9-%E4%BA%8B%E4%BB%B6-input-file
const inputFile = (
  newFile: VueUploadItem | undefined,
  oldFile: VueUploadItem | undefined
) => {
  if (newFile && !oldFile) {
    // add
    console.log("add", newFile);
  }
  if (newFile && oldFile) {
    // update
    console.log("update", newFile);
    if (form.files.length) {
      /* 如果之前该文件夹有东西, 那么就更新它 */
      const newFile = form.files.filter((item: { postAction: string | string[] }) => {
        let folderId = item.postAction.slice(item.postAction.lastIndexOf("/") + 1);
        if (folderId == form.currentSelected.id) {
          return true;
        }
      });
      if (form.files.length) {
        form.showFilesInfo = newFile;
      } else {
        /* 否则这个文件夹之前没有东西, 那么就添加新的 */
        form.showFilesInfo = form.files;
      }
    } else {
      form.showFilesInfo = form.files;
    }
    // 进度状态
    handleInitializationParameters();
    if (form.files.length) {
      form.files.forEach((file: { speed: any; error: any; success: any }) => {
        form.totalFilesLength = form.files.length;
        if (file.speed) {
          form.speed = file.speed;
        }
        if (file.error) {
          form.errorFiles += 1;
        }
        if (file.success) {
          form.successFiles += 1;
        }
      });
    }
    const num = (form.successFiles / form.totalFilesLength) * 100;
    // num.toFixed(2)四舍五入, 不四舍五入 Math.floor(num)
    form.totalProgress = num.toFixed(2);
    if (Number.isNaN(form.totalProgress)) {
      form.totalProgress = 0;
    }
    // 是否上传完成
    if (
      form.errorFiles + form.successFiles == form.showFilesInfo.length &&
      form.totalProgress > 0
    ) {
      upload.updateUploadCompleted(true);
    }
  }
  if (!newFile && oldFile) {
    // remove-更新状态
    form.totalFilesLength -= 1;
    if (oldFile.error && form.errorFiles > 0) {
      form.errorFiles -= 1;
    }
    if (oldFile.success && form.successFiles > 0) {
      form.successFiles -= 1;
    }
    if (form.errorFiles == 0 && form.successFiles == 0) {
      form.speed = 0;
      form.totalProgress = 0;
    }
    console.log("remove", oldFile);
  }
  // 自动上传
  if (Boolean(newFile) !== Boolean(oldFile) || oldFile?.error !== newFile?.error) {
    if (newFile !== undefined && !newFile.md5_hash) {
      try {
        const size = newFile.file?.size || 0;
        let blobSlice = File.prototype.slice,
          chunkSize = 2097152,
          // Fread in chunks of 2MB
          chunks = Math.ceil(size / chunkSize),
          currentChunk = 0,
          spark = new Md5(),
          fileReader = new FileReader();
        let md5Next = () => {
          let start = currentChunk * chunkSize,
            end = start + chunkSize >= size ? size : start + chunkSize;
          fileReader.readAsBinaryString(blobSlice.call(newFile.file, start, end));
        };
        fileReader.onload = (e: any) => {
          spark.appendAsciiStr(e.target?.result);
          // append binary string
          currentChunk++;

          if (currentChunk < chunks) {
            md5Next();
          } else {
            MeidaService.postMeidaUpload(
              {
                file_name: newFile.name,
                md5_hash: spark.end(),
              },
              form.currentSelected.id
            )
              .then((result) => {
                // 另外的文件夹里已存在文件，自行造数据显示上传成功状态
                if (result.data?.id) {
                  newFile.success = true;
                  newFile.progress = "100";
                  newFile.response = result;
                  form.successFiles += 1;
                  form.totalFilesLength += 1;
                  const num = (form.successFiles / form.totalFilesLength) * 100;
                  // num.toFixed(2)四舍五入, 不四舍五入 Math.floor(num)
                  form.totalProgress = num.toFixed(2);
                  form.showFilesInfo.push(newFile);
                  form.speed = 4194304;
                  upload.updateUploadCompleted(true);
                }
                // 文件夹内已存在文件，则提示，否则上传
                if (result.data == true) {
                  ElMessage({
                    type: "error",
                    message: newFile.name + "-文件已存在",
                    grouping: true,
                  });
                  handleRemoveFiles(newFile);
                  return;
                } else {
                  form.md5Finish++;
                  autoUpload();
                }
              })
              .catch((error) => {
                console.log(error, "error");
              });
          }
        };
        md5Next();
      } catch (e) {
        form.md5Finish++;
        autoUpload();
      }
    } else {
      autoUpload();
    }
  }
};
// 自动上传
const autoUpload = () => {
  if (!uploadRef.value?.active && form.md5Finish >= form.files.length) {
    uploadRef.value.active = true;
  }
};

// 监听变化
watch(
  () => [uploadGroupStore.value, uploadSelectedStore.value],
  ([newGroup, newSelected]) => {
    if (newGroup) {
      form.groupData = newGroup;
    }
    // 当没有选中的媒体文件夹并且只有一个文件夹数据时，默认选中第一个
    if (
      !Object.prototype.hasOwnProperty.call(form.currentSelected, "id") &&
      form.groupData.length == 1
    ) {
      handleClick(form.groupData[0]);
    } else {
      handleClick(newSelected);
    }
  },
  {
    // 设置首次进入执行方法 immediate
    immediate: true,
    deep: true,
  }
);

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleClick(form.groupData[0]);
});
</script>

<style lang="scss" scoped>
.com-upload-manager {
  position: fixed;
  bottom: 0;
  width: 600px;
  height: 600px;
  z-index: 2000;
  right: 0;
  background-color: $c-fff;
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 2px 13px 0px rgba(230, 230, 230, 0.5);
  .upload-manager {
    height: 100%;
    .upload-status,
    .upload-title,
    .upload-list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 40px;
      .right {
        flex: 1;
        text-align: right;
      }
    }
    .upload-status {
      .left {
        padding-left: 10px;
      }
      .right {
        padding-right: 10px;
      }
      .left,
      .right {
        span:first-child {
          padding-right: 15px;
        }
      }
    }
    .upload-title {
      color: $c-fff;
      .left {
        padding-left: 20px;
      }
      .right {
        i {
          color: $c-fff;
          vertical-align: middle;
          margin-right: 20px;
        }
        .file-uploads {
          vertical-align: middle;
          :deep(label) {
            cursor: pointer;
          }
        }
        .el-icon {
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
    .upload-list {
      height: calc(100% - 80px);
      .left {
        width: 30%;
        height: 100%;
        border-right: 1px solid #ddd;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 40px;
          margin: 8px;
          border-left: 2px solid $c-fff;
          cursor: pointer;
          i {
            padding: 0 10px;
          }
          span {
            width: calc(100% - 70px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .close {
            font-size: 16px;
            visibility: hidden;
          }
          &:hover {
            border-color: $c-theme;
            background: #dfebff;
            .close {
              visibility: visible;
            }
          }
        }
        .com-select-bg {
          border-color: $c-theme;
        }
        .no-data {
          cursor: default;
          span {
            padding: 0 10px;
          }
        }
      }
      .right {
        width: 70%;
        height: 100%;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: calc(100% - 16px);
          height: 40px;
          margin: 8px;
          .list {
            width: calc(100% - 26px);
            text-align: left;
            padding-right: 10px;
            .txt {
              width: 92%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 10px;
            }
          }
          .close {
            padding-right: 12px;
            font-size: 16px;
            color: $c-333;
            cursor: pointer;
          }
        }
      }
    }

    .green {
      color: #74c300;
      :deep(.el-progress-bar__inner) {
        background-color: #74c300;
      }
    }
    .red {
      color: red;
      :deep(.el-progress-bar__inner) {
        background-color: red;
      }
    }
  }
}
.is-minimize {
  bottom: -560px;
}
</style>
