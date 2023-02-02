<!-- 
  @Author: yangyq
  @CreateDate: 2023-02-01
  @FilePath: src\views\play\components\list-musoc-component.vue
  @Describe: 音乐列表组件
-->
<template>
    <div class="com-list-musoc-component play-left">
        <h2 class="theme">播放列表 (22)</h2>
        <ul class="left-ul">
            <li>
                <span class="order">序号</span>
                <span class="name">名称</span>
            </li>
        </ul>
        <div class="left-list">
            <el-scrollbar>
                <ul class="left-ul">
                    <li v-for="(item, index) in tableData" :key="item.id">
                        <span class="order">
                            <template v-if="item.name == props.playCenterData.MusicName">
                                <i class="iconfont icon-playing theme"></i>
                            </template>
                            <template v-else>{{ index + 1 }}</template>
                        </span>
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

const props: any = defineProps({
    selectTaskData: Object,
    playCenterData: Object,
});

const tableData: any = ref([])
// 获取选中任务详情信息
const handleSelectionData = (row: any) => {
    return new Promise((resolve: any, reject: any)=> {
        if (row.type < 10) {
            proxy.$http.get("/details/" + row.id, {
                params: {
                    tag: "BroadcastingStudio",
                    withMedias: true,
                    withGroups: true,
                    withFastSound: true,
                    withTerminals: true,
                    withFastTerminal: true,
                },
            }).then((restlu: any) => {
                resolve(restlu.data)
            });
        } else {
            proxy.$http1.get("/task/" + row.id).then((restlu: any) => {
                resolve(restlu.data)
            });
        }
    })
};

// mounted 实例挂载完成后被调用
onMounted(() => {
    handleSelectionData(props.selectTaskData).then((data:any)=> {
        if (data.type === 1) {
            tableData.value = [...data.medias_groups, ...data.medias];
        }
        if (data.type === 10 || data.type === 12 || data.type === 13) {
            tableData.value = data.content;
        }
    })
    console.log(props.selectTaskData, props.playCenterData)
})
</script>

<style lang="scss" scoped>
.com-list-musoc-component {

    h2 {
        padding: 18px 0;
        margin: 0 30px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #e7f1fb;
    }

    .left-ul {
            margin: 0 30px;

            li {
                border-bottom: 1px solid #e7f1fb;

                span {
                    display: inline-block;
                    line-height: 40px;
                    padding: 0 15px;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .order {
                    width: 30%;
                }

                .name {
                    width: 70%;
                }
            }
        }

        .left-list {
            height: calc(100% - 94px);

            .left-ul {
                padding-bottom: 10px;

                li {
                    cursor: pointer;

                    &:hover {
                        background: #e4f0ff;
                    }
                }
            }
        }
}
</style>