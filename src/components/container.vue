<!-- 
  @Author: hmf
  @CreateDate: 2022-07-26
  @FilePath: src\components\container.vue
  @Describe: 主体容器
-->
<template>
    <el-container class="broadcast-home-container">
        <div class="broadcast-home-aside">
            <Menu></Menu>
        </div>
        <el-container>
        <el-header class="broadcast-home-header">
            <Header></Header>
        </el-header>
        <el-main class="broadcast-home-main">
            <router-view />
            <!-- 上传管理器 -->
            <upload-manager v-if="showUploadManager" />
        </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { registerWebSocket } from "@/utils/socket";
import { send } from "@/utils/socket";

// defineAsyncComponent 异步组件-懒加载子组件
const uploadManager = defineAsyncComponent(
    () => import("@/views/media/components/upload_manager.vue")
);

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();
const upload = getStore.useUploadStore();
const store = getStore.useAppStore();

const timeToken: any = ref(null)
const timeoutToken: any = ref(null)
// 是否展示上传管理器
const showUploadManager = ref(false);

// 计算属性 computed
const uploadStore = computed(() => upload.showUploadManager);
const isWebsocekt = computed(() => {
    return store.is_websocekt;
});

// 监听变化
watch(
    () => uploadStore.value,
    (newData) => {
        showUploadManager.value = newData;
    },
    {
        // 设置首次进入执行方法 immediate
        immediate: true,
        deep: true,
    }
);

const refreshToken = () => {
    timeoutToken.value = null
    proxy.$http.get('/auth/refresh').then((result: any)=> {
        if (result.result === 200) {
            localStorage.set("userToken", result.token)
        }else {
            timeoutToken.value = setTimeout(refreshToken, 60000)
        }
    }).catch(()=> {
        timeoutToken.value = setTimeout(refreshToken, 60000)
    })
}

// mounted 实例挂载完成后被调用
onMounted(() => {
    window.electronAPI.send("main-window", "");
    if (!isWebsocekt.value) {
        registerWebSocket();
    }
    getStore.useSystemStore().getConfigInfo()
    timeToken.value = setInterval(refreshToken, 90*60*1000)
});

onBeforeUnmount(()=> {
    clearInterval(timeToken.value)
})
</script>

<style lang="scss">
.broadcast-home-container {
    height: 100%;
    background-color: $c-fff;

    .broadcast-home-aside {
        background-color: #0070ee;
        border-radius: 0px 16px 16px 0px;
        font-size: 12px;
    }

    .broadcast-home-header {
        height: 44px;
        line-height: 44px;
        padding: 0 12px;
        box-shadow: inset 0px -1px 0px 0px #f5f5f5;
    }

    .el-container {
        border: 1px solid #f5f5f5;
        border-left: none;
    }
}
</style>
