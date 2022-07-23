<template>
  <div class="broadcast-sidebar">
    <div class="broadcast-sidebar-ul">
      <img class="logo-imag" src="@/assets/images/Bitmap.png" alt="" />
      <ul class="sidebar-scrollbar-list">
        <li
          v-for="(item, index) in sidebarData"
          :key="index"
          @click.stop="handleClickRouter(item)"
        >
          <div
            class="sidebar-router-child"
            :class="{
              'router-link-position': $useRoute.path.includes(item.path),
            }"
          >
            <div class="sidebar-router sidebar-router-title">
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
  { name: "终端状态", path: "/terminal", icon: "", children: [] },
  { name: "播放中心", path: "/play", icon: "", children: [] },
  { name: "会话状态", path: "/session", icon: "", children: [] },
  { name: "定时任务", path: "/timing", icon: "", children: [] },
  { name: "媒体库", path: "/medium", icon: "", children: [] },
  {
    name: "系统",
    path: "/system",
    icon: "",
    children: [
      { name: "系统配置", path: "/system/configure" },
      { name: "终端日志", path: "/system/journal" },
    ],
  },
];
// 路由
const $useRouter = useRouter();
const $useRoute = useRoute();

// 处理点击路由跳转
const handleClickRouter = (item: { path: string }) => {
  if (item.path === "/system") return;
  $useRouter.push(item.path);
};
</script>

<style lang="scss">
.broadcast-sidebar {
  -webkit-app-region: drag;
  .logo-imag {
    margin-top: 15px;
  }
  .broadcast-sidebar-ul {
    .sidebar-scrollbar-list {
      -webkit-app-region: no-drag;
      margin-top: 20px;
      > li {
        position: relative;
        .sidebar-router-child {
          width: 128px;
          height: 94px;
          margin-left: 8px;
          color: #ffffff;
          cursor: pointer;
          .sidebar-router-title {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .router-link-position {
          background: url("@/assets/images/NavBar.svg");
        }
        &:hover {
          .sidebar-scrollbar-children {
            display: block;
          }
        }
      }
      .sidebar-scrollbar-children {
        display: none;
        z-index: 3001;
        position: absolute;
        right: -160px;
        top: 0;
        width: 160px;
        ul {
          background-color: #2f91ff;
          padding: 20px;
          border-radius: 0 20px 20px 0;
          li {
            height: 36px;
            line-height: 36px;
            color: #fff;
            cursor: pointer;
            &:hover {
              background-color: #f0f0f0;
              color: blue;
              border-radius: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
