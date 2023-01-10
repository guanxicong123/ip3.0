<!-- 
  @Author: hmf
  @CreateDate: 2022-07-26
  @FilePath: src\components\menu.vue
  @Describe: 导航菜单
-->
<template>
    <div class="broadcast-sidebar">
        <div class="broadcast-sidebar-ul">
            <div class="logo-image">
                <img src="@/assets/images/logo.png" alt="logo" />
            </div>
            <div class="sidebar-scrollbar-list">
                <el-scrollbar>
                    <ul>
                        <li v-for="(item, index) in sidebarData" :key="index" @click.stop="handleClickRouter(item)">
                            <el-popover placement="right-start" trigger="hover" :disabled="item.children.length < 1"
                                :show-arrow="false" :offset="0" popper-class="sidebar-popper">
                                <div class="sidebar-scrollbar-children" @mouseenter.stop="item.hover = true"
                                    @mouseleave.stop="handleMouseleave(item)">
                                    <ul>
                                        <li v-for="(row, indexTwo) in item.children" :key="indexTwo"
                                            @click.stop="handleClickRouter(row)"
                                            :class="{ selected: $useRoute.path.includes(row.path) }">
                                            {{ row.name }}
                                        </li>
                                    </ul>
                                </div>
                                <template #reference>
                                    <div class="sidebar-router-child" :class="{
                                        'router-link': $useRoute.path.includes(item.path) || item.hover,
                                    }">
                                        <div class="sidebar-router sidebar-router-title">
                                            <span class="iconfont" :class="item.icon"></span>
                                            <span class="sidebar-nav-name">{{ item.name }}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const sidebarData = ref([
    {
        name: "终端状态",
        path: "/terminal",
        icon: "icon-terminal-status",
        hover: false,
        children: [],
    },
    {
        name: "播放中心",
        path: "/play",
        icon: "icon-playback-center",
        hover: false,
        children: [],
    },
    {
        name: "会话状态",
        path: "/session",
        icon: "icon-session-state",
        hover: false,
        children: [],
    },
    {
        name: "定时任务",
        path: "/timing",
        icon: "icon-task",
        hover: false,
        children: [],
    },
    {
        name: "媒体库",
        path: "/media",
        icon: "icon-meitiku",
        hover: false,
        children: [],
    },
    {
        name: "系统",
        path: "/system",
        icon: "icon-system",
        hover: false,
        children: [
            { name: "系统配置", path: "/system/configure" },
            { name: "日志管理", path: "/system/log" },
        ],
    },
]);
// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();

const systemStore = getStore.useSystemStore();

const router_data = computed(() => {
  return systemStore.router_data;
});

watch(
    () => router_data.value,
    (value) => {
        sidebarData.value = value.filter((item: any) => {
        return item.permission !== false;
        });
    },
    {
        deep: true,
    }
);

// 处理点击路由跳转
const handleClickRouter = (item: { path: string }) => {
    if ($useRoute.fullPath.indexOf(item.path) !== -1) return;
    $useRouter.push(item.path == "/system" ? item.path + "/configure" : item.path);
};
// 处理
const handleMouseleave = (item: { hover: boolean }) => {
    setTimeout(() => {
        item.hover = false;
    }, 300);
};

onMounted(() => {
    // sidebarData.value = router_data.value.filter((item: any) => {
    //   return item.permission !== false;
    // });
});
</script>

<style lang="scss">
.broadcast-sidebar {
    height: 100%;
    -webkit-app-region: drag;

    .logo-image {
        margin: 15px 0 20px;
    }

    .broadcast-sidebar-ul {
        display: flex;
        flex-direction: column;
        height: 100%;
        text-align: center;

        .sidebar-scrollbar-list {
            display: flex;
            flex: 1;
            overflow: hidden;

            ul {
                margin-bottom: 10px;

                >li {
                    -webkit-app-region: no-drag;

                    .sidebar-router-child {
                        width: 128px;
                        height: 94px;
                        margin-left: 8px;
                        color: $c-fff;
                        cursor: pointer;

                        .sidebar-router-title {
                            height: 100%;
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;

                            .iconfont,
                            .icon {
                                font-size: 26px;
                                margin-bottom: 6px;
                            }
                        }

                        &:hover {
                            background: url("@/assets/images/nav-bg.svg");
                        }
                    }

                    .router-link {
                        background: url("@/assets/images/nav-bg.svg");
                    }
                }
            }
        }
    }
}

.el-popover.el-popper.sidebar-popper {
    padding: 0;
    background: none;
    border-radius: 0 20px 20px 0;
    border: none;
    box-shadow: none;
}

.sidebar-scrollbar-children {
    background-color: #2f91ff;
    border-radius: 0 20px 20px 0;

    ul {
        padding: 20px;

        li {
            min-width: 96px;
            padding: 6px 10px;
            margin-bottom: 16px;
            color: $c-fff;
            text-align: center;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;

            &:last-child {
                margin-bottom: 0;
            }
        }

        li:hover,
        .selected {
            background-color: #f0f0f0;
            color: #0070ee;
            border-radius: 18px;
        }
    }
}
</style>
