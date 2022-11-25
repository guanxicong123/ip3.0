<!-- 
  @Author: hmf
  @CreateDate: 2022-09-01
  @FilePath: src\views\audio\sound_recording\components\select_folder.vue
  @Describe: 选择文件夹路径
-->
<template>
    <div class="com-select-folder">
        <div class="select-dir"><span>已选择</span> : {{ form.selected.path }}</div>
        <div class="select-tree">
            <el-scrollbar>
                <el-tree style="width: 100%; height: 100%" :props="props" :load="handleGetPaths"
                    @node-click="handleNodeClick" lazy>
                </el-tree>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type Node from "element-plus/es/components/tree/src/model/node";

// 全局属性
const { proxy } = useCurrentInstance.useCurrentInstance();

// 声明触发事件
const emit = defineEmits(["selectedPath"]);

interface Tree {
    name: string;
    leaf?: boolean;
}

const props = {
    label: "name",
    children: "directories",
    isLeaf: "leaf",
};

const form = reactive({
    selected: {
        path: "",
    },
});
// 处理树形组件点击
const handleNodeClick = (data: any) => {
    form.selected = data;
    emit("selectedPath", form.selected.path);
};
// 处理获取文件夹路径
const handleGetPaths = (node: Node, resolve: (data: Tree[]) => void) => {
    let params = {
        path: node && node.data && node.data.path ? node.data.path : "",
    };
    console.log(node);
    getToolsDir(params).then((data: any) => {
        resolve && resolve(data);
    });
};

const getToolsDir = (params: any) => {
    console.log(params);
    return new Promise((resolve, rejected) => {
        proxy.$http1
            .get("/tools/dir", {
                params: {
                    path: params.path,
                },
            })
            .then((result: any) => {
                console.log(result);
                if (result.result === 200) {
                    if (result.data) {
                        let data = result.data.map((item: any) => {
                            return {
                                name: item,
                                path: item,
                                directories: [],
                            };
                        });
                        resolve(data);
                    } else {
                        resolve([]);
                    }
                } else {
                    rejected([]);
                }
            });
    });
};

// mounted 实例挂载完成后被调用
onMounted(() => { });
</script>

<style lang="scss" scoped>
.com-select-folder {
    border: 1px solid #ddd;

    .select-dir {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .select-tree {
        height: 300px;
    }
}
</style>
