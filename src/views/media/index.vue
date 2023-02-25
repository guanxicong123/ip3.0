<!-- 
  @Author: hmf
  @CreateDate: 2022-06-18
  @FilePath: src\views\media\index.vue
  @Describe: 媒体库
-->
<template>
  <div class="com-index tree-index">
    <div class="com-index-left com-il-bg">
      <div class="com-two-index">
        <div class="com-head">
          <div class="com-head-content">
            <div class="com-breadcrumb">
              <el-input
                v-model="form.searchFolder"
                :placeholder="$t('Folder name')"
                clearable
                @clear="handleResetMeidaGroup"
                @keyup.enter="
                  useCommonTable.handleKeyupEnter(
                    form.searchFolder,
                    handleGetAllBellsGroups
                  )
                "
                @change="
                  useCommonTable.handleKeyupDelete(
                    form.searchFolder,
                    handleGetAllBellsGroups
                  )
                "
              />
              <el-button
                :icon="Search"
                :disabled="form.searchFolder == ''"
                @click="handleGetAllBellsGroups"
              ></el-button>
            </div>
            <div class="com-button">
              <i
                class="iconfont icon-refresh theme"
                :title="$t('Refresh')"
                @click="handleGetAllBellsGroups"
              ></i>
              <i
                class="iconfont icon-add"
                :title="$t('Newly build')"
                @click="handleNew"
              ></i>
            </div>
          </div>
        </div>
        <div class="com-main">
          <div
            class="com-two-main"
            v-loading="form.loadingGroups"
            element-loading-text="Loading..."
            element-loading-background="rgba(0, 0, 0, 0.7)"
          >
            <el-scrollbar>
              <ul class="folder-ul">
                <li
                  v-for="item in form.folderData"
                  :key="item.id"
                  @click.stop="handleClickFolder(item)"
                  :class="
                    form.currentFolder.id == item.id
                      ? 'theme com-select-bg'
                      : ''
                  "
                >
                  <div class="nav-one">
                    <i class="iconfont icon-folder"></i>
                    <i
                      class="iconfont"
                      :class="
                        item.is_public > 0
                          ? 'icon-media-public-folder'
                          : 'icon-media-private-folder'
                      "
                      :title="
                        item.is_public > 0
                          ? $t('Public resources')
                          : $t('Private resources')
                      "
                    ></i>
                    <div class="folder-name">
                      <span :title="item.name">{{ item.name }}</span>
                    </div>
                    <span class="num">( {{ item.medias_count }} )</span>
                    <span class="icon-btn" v-if="item.id > 0">
                      <i
                        class="iconfont icon-edit"
                        :title="$t('Edit')"
                        v-if="
                          item.id > 2 && userStore?.user.id == item.users_id
                        "
                        @click.stop="handleEdit(item)"
                      ></i>
                      <i
                        class="iconfont icon-upload"
                        :title="$t('Upload')"
                        v-if="
                          item.is_public < 1
                            ? userStore?.user.id == item.users_id
                            : item.is_public > 0
                        "
                        @click.stop="handleAddUploadGroup(item)"
                      ></i>
                      <i
                        class="iconfont icon-delete"
                        :title="$t('Delete')"
                        v-if="
                          item.id > 2 &&
                          (userStore?.user.type != 0
                            ? userStore?.user.id == item.users_id
                            : userStore?.user.type == 0)
                        "
                        @click.stop="handleDeleteMediaGroup(item)"
                      ></i>
                    </span>
                  </div>
                  <el-tag v-if="item.id > 2">
                    <i
                      :title="$t('Create user')"
                      class="iconfont icon-gray-user"
                    ></i>
                    {{ item.user?.name }}
                  </el-tag>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <div class="com-index-right com-ir-bg">
      <div class="com-index">
        <div class="com-head">
          <div class="com-head-content">
            <div class="com-breadcrumb">
              <span class="title" :title="form.currentFolder.name">
                {{ form.currentFolder.name }}
              </span>
            </div>
            <div class="com-button"></div>
          </div>
          <div class="com-head-content">
            <div class="com-breadcrumb">
              <el-input
                v-model="form.search"
                :placeholder="$t('File name')"
                clearable
                @clear="handleDefaultGet"
                @keyup.enter="
                  useCommonTable.handleKeyupEnter(form.search, handleDefaultGet)
                "
                @change="
                  useCommonTable.handleKeyupDelete(
                    form.search,
                    handleDefaultGet
                  )
                "
              />
              <el-button
                :icon="Search"
                :disabled="form.search == ''"
                @click="handleDefaultGet"
              ></el-button>
              <el-button :disabled="form.search == ''" @click="handleReset">
                {{ $t("Reset") }}
              </el-button>
            </div>
            <div class="com-button">
              <i
                class="iconfont icon-refresh"
                :title="$t('Refresh')"
                @click="handleGetOnePageData"
              ></i>
              <i
                class="iconfont icon-upload"
                :title="$t('Start uploading')"
                v-if="
                  form.currentFolder.is_public < 1
                    ? userStore?.user.id == form.currentFolder.users_id
                    : form.currentFolder.id > 0
                "
                @click.stop="handleAddUploadGroup(form.currentFolder)"
              ></i>
              <i
                class="iconfont icon-download"
                :class="{ 'icon-disabled': multipleSelection.length == 0 }"
                :title="$t('Batch download')"
                @click="handlePackageDownloadFile"
              ></i>
              <i
                class="iconfont icon-delete"
                :title="$t('Batch deletion')"
                :class="{ 'icon-disabled': multipleSelection.length == 0 }"
                @click="handleDelete('batch', 0)"
              ></i>
            </div>
          </div>
        </div>
        <div class="com-main">
          <div class="com-table">
            <el-table
              ref="multipleTableRef"
              :data="form.data"
              border
              height="100%"
              @sort-change="handleSortChange"
              @selection-change="handleSelectionChange"
              :default-sort="{ prop: 'execute_time', order: 'ascending' }"
              v-loading="form.loading"
              element-loading-text="Loading..."
              element-loading-background="rgba(0, 0, 0, 0.7)"
            >
              <el-table-column
                type="index"
                label="No."
                show-overflow-tooltip
                width="60"
                :index="typeIndex"
              />
              <el-table-column
                prop="name"
                :label="$t('File name')"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column
                prop="length"
                :label="$t('File duration')"
                sortable="custom"
              >
                <template #default="scope">
                  {{ usePublicMethod.convertSongDuration(scope.row.length) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="user.name"
                :label="$t('Upload user')"
                show-overflow-tooltip
              />
              <el-table-column :label="$t('Operation')" width="120">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    @click="handleDownloadOneFile(scope.row)"
                  >
                    <template #icon>
                      <i
                        class="iconfont icon-download"
                        :title="$t('Download')"
                      ></i>
                    </template>
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete('single', scope.row)"
                    v-if="
                      userStore?.user.type != 0
                        ? userStore?.user.id == scope.row.users_id
                        : userStore?.user.type == 0
                    "
                  >
                    <template #icon>
                      <i class="iconfont icon-delete" :title="$t('Delete')"></i>
                    </template>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="44" />
            </el-table>
          </div>
        </div>
        <div class="com-footer" v-if="form.data.length > 0">
          <el-pagination
            v-model:currentPage="form.currentPage"
            v-model:page-size="form.pageSize"
            :page-sizes="proxy.$user?.config?.pageRule"
            layout="total, sizes, prev, pager, next, jumper"
            :total="form.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新建-编辑 -->
    <new-edit
      :isShow="form.dialogVisible"
      :editInfor="form.editInfor"
      @show="handleDialogVisible"
      @success="handleSuccessCallback"
    >
    </new-edit>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { MeidaService } from "@/utils/api/media";
import { onBeforeRouteLeave } from "vue-router";
import usePublicMethod from "@/utils/global/index";
import useCommonTable from "@/utils/global/common_table_search";

// defineAsyncComponent 异步组件-懒加载子组件
const newEdit = defineAsyncComponent(() => import("./new_edit_index.vue"));

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

interface User {
  id: number;
  name: string;
}

const user = getStore.useUserStore();
const upload = getStore.useUploadStore();
const systemStore = getStore.useSystemStore();
// 计算属性 computed
const userStore = computed(() => user.user);
const uploadUploadCompletedStore = computed(() => upload.isUploadCompleted);
const systemPageSize = computed(() => {
  return systemStore.pageSize?.Medias_PageSize;
});

const form = reactive<any>({
  search: "",
  searchFolder: "",
  folderData: [],
  data: [],
  currentPage: 1,
  pageSize: systemPageSize.value,
  total: 0,
  orderColumn: "id",
  orderType: "asc",
  loading: false, // 等待加载数据状态
  currentFolder: {
    id: 0,
    name: proxy.$t("All"),
  },
  dialogVisible: false, // 新建-编辑弹窗
  editInfor: {}, // 编辑信息
  firstLoad: true, // 第一次进入界面加载
  downloading: false, // 等待下载状态
  loadingGroups: false, // 等待加载分组状态
  allSongsTotal: 0, // 缓存全部歌曲数目
});
// 处理点击切换文件夹
const handleClickFolder = (item: any) => {
  form.currentPage = 1;
  form.currentFolder = item;
  const folder = {
    id: item.id,
    name: item.name,
  };
  localStorage.set("folder", folder);
  handleGetOnePageData();
};
// 获取refs
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
// 处理删除媒体文件夹
const handleDeleteMediaGroup = (row: any) => {
  ElMessageBox.confirm(proxy.$t("Delete prompt"), proxy.$t("Tips"), {
    confirmButtonText: proxy.$t("Confirm"),
    cancelButtonText: proxy.$t("Cancel"),
    type: "warning",
    draggable: true,
  })
    .then(() => {
      MeidaService.deleteMeidaGroup({
        ids: [row.id],
      })
        .then((result) => {
          if (result.data) {
            form.folderData = form.folderData.filter((item: { id: number }) => {
              return item.id != row.id;
            });
            if (row.id == form.currentFolder.id) {
              form.currentFolder = form.folderData[0];
              handleClickFolder(form.folderData[0]);
            }
            ElMessage({
              type: "success",
              message: proxy.$t("Delete succeeded"),
              grouping: true,
            });
          } else {
            ElMessage({
              type: "error",
              message: result.return_message || proxy.$t("Delete failed"),
              grouping: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(() => {});
};
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理获取一页数据
const handleGetOnePageData = async () => {
  form.loading = true;
  await MeidaService.getOnePageMeida({
    likeName: form.search,
    page: form.currentPage,
    limit: form.pageSize,
    orderColumn: form.orderColumn,
    orderType: form.orderType,
    medias_groups_id: form.currentFolder.id,
    withUser: true,
    check: true,
  })
    .then((result) => {
      if (result.data.data) {
        form.data = result.data.data;
        form.total = result.data.total;
        // 处理其他地方删除文件夹内的曲目时，更新展示文件夹内的歌曲数量
        if (form.currentFolder?.medias_count != form.total) {
          form.folderData.some((item: { id: number; medias_count: number }) => {
            if (item.id == form.currentFolder?.id) {
              form.folderData[0].medias_count -= item.medias_count;
              item.medias_count = form.total;
              form.folderData[0].medias_count += form.total;
              return;
            }
          });
        }
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
// 处理默认获取
const handleDefaultGet = () => {
  form.currentPage = 1;
  handleGetOnePageData();
};
// 处理重置
const handleReset = () => {
  form.search = "";
  form.selectType = "";
  handleDefaultGet();
};
// 处理排序
const handleSortChange = (row: { prop: any; order: string | string[] }) => {
  form.orderColumn = row.prop;
  form.orderType =
    !row.order || row.order?.indexOf("desc") >= 0 ? "desc" : "asc";
  handleDefaultGet();
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  systemStore.updateSystemSize({
    key: "Medias_PageSize",
    val,
  });
  form.pageSize = val;
  handleDefaultGet();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
  handleGetOnePageData();
  multipleTableRef.value?.setScrollTop(0);
};
// 处理删除
const handleDelete = (type: string, row: any) => {
  // batch: 批量删除，single：单个删除
  if (type === "batch" && multipleSelection.value.length == 0) {
    return;
  }
  ElMessageBox.confirm(proxy.$t("Delete prompt"), proxy.$t("Tips"), {
    confirmButtonText: proxy.$t("Confirm"),
    cancelButtonText: proxy.$t("Cancel"),
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let ids = [];
      type === "batch"
        ? multipleSelection.value.map((item) => {
            ids.push(item.id);
          })
        : ids.push(row.id);
      MeidaService.deleteMeida({
        ids: ids,
      })
        .then((result) => {
          if (result.data) {
            // 假如删除完本页数据，form.currentPage减去一页再更新数据
            if (form.data.length <= ids.length && form.currentPage > 1) {
              form.currentPage--;
            }
            handleGetOnePageData();
            if (form.currentFolder.id === 0) {
              handleGetAllBellsGroups();
            } else {
              form.folderData.some(
                (item: { id: number; medias_count: number }) => {
                  if (item.id == form.currentFolder.id) {
                    return (item.medias_count -= ids.length);
                  }
                }
              );
              form.folderData[0].medias_count -= ids.length;
              form.allSongsTotal -= ids.length;
            }
            ElMessage({
              type: "success",
              message: proxy.$t("Delete succeeded"),
              grouping: true,
            });
          } else {
            ElMessage({
              type: "error",
              message: result.return_message || proxy.$t("Delete failed"),
              grouping: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(() => {});
};
// 处理新建
const handleNew = () => {
  form.dialogVisible = true;
  form.editInfor = {};
};
// 处理编辑
const handleEdit = (row: any) => {
  form.dialogVisible = true;
  form.editInfor = row;
};
// 处理新建-编辑弹窗的响应展示/关闭
const handleDialogVisible = (value: boolean) => {
  form.dialogVisible = value;
};
// 处理编辑弹窗的成功回调
const handleSuccessCallback = (data: any) => {
  handleGetAllBellsGroups();
  // 更新当前选中的文件夹展示数据
  if (data.id == form.currentFolder.id) {
    form.currentFolder.name = data.name;
    localStorage.set("folder", data);
  }
};
// 处理重置
const handleResetMeidaGroup = () => {
  form.searchFolder = "";
  handleGetAllBellsGroups();
};
// 处理获取全部媒体文件夹数据
const handleGetAllBellsGroups = async () => {
  form.loadingGroups = true;
  await MeidaService.getAllMeidaGroup({
    likeName: form.searchFolder,
    withCountMedias: true,
    withUser: true,
  })
    .then((result) => {
      if (result.data) {
        let num = 0;
        form.folderData = [
          ...[
            {
              id: 0,
              name: proxy.$t("All"),
              medias_count: 0,
              is_public: 1,
            },
          ],
          ...result.data,
        ];
        // 统计全部媒体文件数量
        for (let index = 0; index < result.data.length; index++) {
          const item = result.data[index];
          num = num + item.medias_count;
        }
        if (result.data.length > 1) {
          form.folderData[0].medias_count = num;
          form.allSongsTotal = num;
        } else {
          form.folderData[0].medias_count = form.allSongsTotal;
        }
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
      form.loadingGroups = false;
    })
    .catch((error) => {
      form.loadingGroups = false;
      console.log(error);
    });
};
// 处理下载一个文件
const handleDownloadOneFile = (item: { id: number; name: string }) => {
  form.downloading = true;
  MeidaService.getDownloadOneMeida(item.id)
    .then((result) => {
      form.downloading = false;
      const isHasURL = Object.prototype.hasOwnProperty.call(
        result?.data,
        "url"
      );
      if (isHasURL) {
        const serverIP = localStorage.get("serverIP");
        const url = "http://" + serverIP + ":81" + result.data.url;
        window.electronAPI.send("download", {
          downloadPath: url, // 下载链接
          fileName: item.name, // 下载文件名，需要包含后缀名
        });
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
    })
    .catch((error) => {
      form.downloading = false;
      console.log(error);
    });
};
// 处理打包下载文件
const handlePackageDownloadFile = () => {
  if (multipleSelection.value.length < 1) {
    return;
  }
  form.downloading = true;
  let ids: number[] = [];
  multipleSelection.value.map((item) => {
    ids.push(item.id);
  });
  MeidaService.postDownloadAllMeida({
    ids: ids,
  })
    .then((result) => {
      form.downloading = false;
      const isHasURL = Object.prototype.hasOwnProperty.call(
        result?.data,
        "url"
      );
      if (isHasURL) {
        const serverIP = localStorage.get("serverIP");
        const url = "http://" + serverIP + ":81" + result.data.url;
        const index = result.data.url.lastIndexOf("/");
        const fileName = result.data.url.substring(index + 1, url.length);
        window.electronAPI.send("download", {
          downloadPath: url, // 下载链接
          fileName: fileName, // 下载文件名，需要包含后缀名
        });
      } else {
        ElMessage({
          type: "error",
          message: result.return_message,
          grouping: true,
        });
      }
    })
    .catch((error) => {
      form.downloading = false;
      console.log(error);
    });
};
// 处理点击添加媒体文件夹到上传管理器
const handleAddUploadGroup = (item: any) => {
  upload.updateShowUploadManager(true);
  upload.addGroupData(item);
  upload.updateCurrentSelected(item);
};

// 监听变化
watch(
  () => [form.folderData, uploadUploadCompletedStore.value],
  ([newFolder, newUploadCompleted]) => {
    // 当第一次进入界面加载，并且获取到全部媒体文件夹数据时
    if (newFolder && form.firstLoad) {
      // 刷新页面时，获取下当前媒体文件夹id
      const currentFolder = localStorage.get("folder") || "";
      if (currentFolder) {
        form.currentFolder = currentFolder;
      }
      form.firstLoad = false;
      handleClickFolder(form.currentFolder);
    }
    if (newUploadCompleted) {
      handleGetAllBellsGroups();
      handleDefaultGet();
      return upload.updateUploadCompleted(false);
    }
  },
  {
    // 初始化立即执行
    immediate: true,
    deep: true,
  }
);

// 当前位置的组件将要离开时触发
onBeforeRouteLeave(() => {
  localStorage.remove("folder");
});

// mounted 实例挂载完成后被调用
onMounted(() => {
  handleGetAllBellsGroups();
  // 下载正在进行中
  window.electronAPI.on("download-progress", (event: any, data: any) => {
    console.log(data);
  });
  // 下载成功
  window.electronAPI.on("download-done", (event: any, data: any) => {
    let message = proxy.$("Download succeeded");
    ElMessage({
      type: "success",
      message: message,
      grouping: true,
    });
    multipleTableRef.value?.clearSelection();
    console.log(data);
  });
  // 下载失败
  window.electronAPI.on("download-failed", (event: any, data: any) => {
    let message = proxy.$("Download failed");
    ElMessage({
      type: "error",
      message: message,
      grouping: true,
    });
    console.log(data);
  });
});
</script>

<style lang="scss" scoped>
.tree-index {
  flex-direction: row;
}
.com-index-right {
  .com-breadcrumb {
    width: 100%;
    box-sizing: border-box;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #6f95c1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.com-two-main {
  .folder-ul {
    padding: 10px 0;
    li {
      width: 100%;
      padding: 0 8px;
      box-sizing: border-box;
      cursor: pointer;
      .nav-one {
        display: flex;
        align-items: center;
        height: 40px;
      }
      i {
        margin: 0 10px;
      }
      .folder-name {
        flex: 1;
        width: calc(100% - 152px);
        line-height: 18px;
        span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .num {
        width: 80px;
        text-align: right;
        margin-right: 5px;
      }
      .icon-btn {
        display: none;
        i {
          margin: 0 5px;
        }
      }
      .el-tag {
        margin-left: 10px;
        margin-bottom: 5px;
        i {
          margin-left: 0;
          margin-right: 5px;
        }
      }
      &:hover {
        background-color: #bbe0ff;
        .icon-btn {
          display: block;
        }
        .num {
          display: none;
        }
      }
    }
    .theme {
      background-color: #bbe0ff;
    }
  }
}
</style>
