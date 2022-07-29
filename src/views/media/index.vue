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
                v-model="form.search"
                placeholder="文件夹名称"
                clearable
              />
              <el-button :icon="Search"></el-button>
            </div>
            <div class="com-button">
              <i class="iconfont icon-refresh theme" title="刷新"></i>
              <i class="iconfont icon-add" title="新建"></i>
            </div>
          </div>
        </div>
        <div class="com-main">
          <div class="com-two-main">
            <el-scrollbar>
              <ul class="folder-ul">
                <li
                  v-for="item in form.folderData"
                  :key="item.id"
                  @click="handleClickFolder(item)"
                  :class="$useRoute.params.id == item.id ? 'theme' : ''"
                >
                  <div class="nav-one">
                    <i class="iconfont">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-folder"></use>
                      </svg>
                    </i>
                    <i
                      class="iconfont"
                      :class="
                        item.is_public > 0
                          ? 'icon-media-public-folder'
                          : 'icon-media-private-folder'
                      "
                      :title="item.is_public > 0 ? '公共资源' : '私有资源'"
                    ></i>
                    <div class="folder-name">
                      <span>{{ item.name }}</span>
                    </div>
                    <span class="num">( {{ item.medias_count }} )</span>
                    <span class="icon-btn" v-if="item.id > 0">
                      <i
                        class="iconfont icon-edit1"
                        title="编辑"
                        v-if="item.id > 2"
                      ></i>
                      <i class="iconfont icon-upload" title="上传"></i>
                      <i
                        class="iconfont icon-delete red"
                        title="删除"
                        v-if="item.id > 2"
                      ></i>
                    </span>
                  </div>
                  <el-tag v-if="item.id > 2">
                    <i title="创建用户" class="iconfont icon-user"></i>
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
              <span class="title">{{ form.currentFolderTitle }}</span>
            </div>
            <div class="com-button"></div>
          </div>
          <div class="com-head-content">
            <div class="com-breadcrumb">
              <el-input
                v-model="form.search"
                placeholder="文件名称"
                clearable
              />
              <el-button :icon="Search"></el-button>
              <el-button>重置</el-button>
            </div>
            <div class="com-button">
              <i class="iconfont icon-refresh" title="刷新"></i>
              <i
                class="iconfont icon-upload"
                title="开始上传"
                v-if="Number($useRoute.params.id) > 0"
              ></i>
              <i class="iconfont icon-download" title="批量下载"></i>
              <i class="iconfont icon-delete" title="批量删除"></i>
            </div>
          </div>
        </div>
        <div class="com-main">
          <div class="com-table">
            <el-table
              ref="multipleTableRef"
              :data="form.data"
              border
              style="width: 100%"
              height="100%"
              @selection-change="handleSelectionChange"
              :default-sort="{ prop: 'execute_time', order: 'ascending' }"
            >
              <el-table-column
                type="index"
                label="No."
                show-overflow-tooltip
                width="50"
                :index="typeIndex"
              />
              <el-table-column
                prop="name"
                label="文件名称"
                sortable="custom"
                show-overflow-tooltip
              />
              <el-table-column prop="length" label="时长" sortable="custom" />
              <el-table-column prop="user.name" label="上传用户" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button link type="primary" @click="scope.row">
                    <template #icon>
                      <i class="iconfont icon-download" title="下载"></i>
                    </template>
                  </el-button>
                  <el-button link type="danger" @click="scope.row">
                    <template #icon>
                      <i class="iconfont icon-delete" title="删除"></i>
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
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="form.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";
import { Search } from "@element-plus/icons-vue";

interface User {
  date: string;
  name: string;
  address: string;
}
const form = reactive<any>({
  search: "",
  folderData: [
    {
      id: 0,
      name: "全部",
      medias_count: 1,
      is_public: 1,
    },
    {
      id: 1,
      is_public: 1,
      length: "277",
      medias_count: 1,
      name: "默认媒体库",
      user: null,
      users_id: 0,
    },
    {
      id: 2,
      is_public: 1,
      length: "0",
      medias_count: 0,
      name: "终端点播",
      user: null,
      users_id: 0,
    },
    {
      id: 9,
      is_public: 0,
      length: "0",
      medias_count: 0,
      name: "sdfds",
      user: {
        name: "admin",
      },
      users_id: 0,
    },
  ],
  data: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  currentFolderTitle: "全部",
});
// 路由
let $useRouter = useRouter();
let $useRoute = useRoute();
// 处理点击切换文件夹
const handleClickFolder = (val: any) => {
  form.currentFolderTitle = val.name;
  $useRouter.push("/media/" + val.id);
};
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
// 当前已选择表格数据
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
// 序号
const typeIndex = (index: number) => {
  return index + (form.currentPage - 1) * form.pageSize + 1;
};
// 处理XXX条/页更改
const handleSizeChange = (val: number) => {
  form.pageSize = val;
  form.currentPage = 1;
};
// 处理当前页更改
const handleCurrentChange = (val: number) => {
  form.currentPage = val;
};

// mounted 实例挂载完成后被调用
onMounted(() => {
  for (let i = 0; i < 20; i++) {
    form.data.push({
      status: i,
      disable: i,
      task: {
        type: i,
        name: "Tom",
      },
      address: "No. 189, Grove St, Los Angeles",
    });
  }
  form.total = form.data.length;
  if (!$useRoute.params.id) {
    $useRouter.push("/media/0");
  }
});
</script>

<style lang="scss" scoped>
.tree-index {
  flex-direction: row;
}
.com-index-right {
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #6f95c1;
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
