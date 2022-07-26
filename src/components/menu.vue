<template>
  <div class="broadcast-sidebar">
    <div class="broadcast-sidebar-ul">
      <img class="logo-imag" src="@/assets/images/logo.png" alt="" />
      <ul class="sidebar-scrollbar-list">
        <li
          v-for="(item, index) in sidebarData"
          :key="index"
          @click.stop="handleClickRouter(item)"
        >
          <div
            class="sidebar-router-child"
            :class="{
              'router-link': $useRoute.path.includes(item.path),
            }"
          >
            <div class="sidebar-router sidebar-router-title">
              <span class="iconfont" :class="item.icon"></span>
              <span class="sidebar-nav-name">{{ item.name }}</span>
            </div>
          </div>
          <div
            class="sidebar-scrollbar-children"
            v-if="item.children.length > 0"
          >
            <ul>
              <li
                v-for="(row, indexTwo) in item.children"
                :key="indexTwo"
                @click.stop="handleClickRouter(row)"
                :class="{ selected: $useRoute.path.includes(row.path) }"
              >
                {{ row.name }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
// const loginImag = require('@/assets/images/Bitmap.png')
const sidebarData: any = [
  {
    name: "终端状态",
    path: "/terminal",
    icon: "icon-terminal-status",
    children: [],
  },
  {
    name: "播放中心",
    path: "/play",
    icon: "icon-playback-center",
    children: [],
  },
  {
    name: "会话状态",
    path: "/session",
    icon: "icon-session-state",
    children: [],
  },
  { name: "定时任务", path: "/timing", icon: "icon-task", children: [] },
  { name: "媒体库", path: "/medium", icon: "icon-meitiku", children: [] },
  {
    name: "系统",
    path: "/system",
    icon: "icon-system",
    children: [
      { name: "系统配置", path: "/system/configure" },
      { name: "日志管理", path: "/system/log" },
    ],
  },
];
// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();

// 处理点击路由跳转
const handleClickRouter = (item: { path: string }) => {
  $useRouter.push(item.path == "/system" ? item.path + "/configure" : item.path);
};
</script>

<style lang="scss">
.broadcast-sidebar {
  -webkit-app-region: drag;
  .logo-imag {
    margin-top: 15px;
  }
  .broadcast-sidebar-ul {
    text-align: center;
    .sidebar-scrollbar-list {
      -webkit-app-region: no-drag;
      margin-top: 20px;
      > li {
        position: relative;
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
        &:hover {
          .sidebar-scrollbar-children {
            visibility: visible;
          }
          .sidebar-router-child {
            background: url("@/assets/images/nav-bg.svg");
          }
        }
      }
      .sidebar-scrollbar-children {
        visibility: hidden;
        z-index: 3001;
        position: absolute;
        right: -220px;
        top: 0;
        width: 220px;
        ul {
          background-color: #2f91ff;
          padding: 20px;
          border-radius: 0 20px 20px 0;
          li {
            padding: 12px 10px;
            margin-bottom: 20px;
            color: $c-fff;
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
    }
  }
}
</style>
