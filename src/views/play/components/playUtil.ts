import { send } from "@/utils/socket";
/**
 * @description 处理执行中的任务的终端改变（对比终端新老数据），并且改变新终端的音量为当前任务音量
 * @param {string} TaskID 任务ID
 * @param {number} volume 该任务的任务音量
 * @param {Array<number>} newVal 该任务新的终端Ids
 * @param {Array<number>} oldVal 该任务旧的终端Ids
 */
export const handleExecuteTaskTerminalsChange = (
  TaskID: string,
  volume: number,
  newVal: Array<number>,
  oldVal: Array<number>
) => {
  // 新增数据
  const addTerminals = newVal.filter((item: any) => {
    return !oldVal.includes(item);
  });
  // 删除数据
  const delTerminals = oldVal.filter((item: any) => {
    return !newVal.includes(item);
  });
  if (addTerminals.length > 0) {
    const data = {
      company: "BL",
      actioncode: "c2ms_add_terminals_to_task",
      token: "",
      data: {
        TaskID: TaskID,
        EndPoints: addTerminals,
      },
      result: 0,
      return_message: "",
    };
    send(data);
    // 重置任务音量，实现把改任务下的所有终端的音量改变
    const changeTaskVolumeData = {
      company: "BL",
      actioncode: "c2ms_set_task_volume",
      data: {
        TaskID: TaskID,
        Volume: volume,
      },
      result: 0,
      return_message: "",
    };
    send(changeTaskVolumeData);
  }
  if (delTerminals.length > 0) {
    const data = {
      company: "BL",
      actioncode: "c2ms_remove_terminals_from_task",
      token: "",
      data: {
        TaskID: TaskID,
        EndPoints: delTerminals,
      },
      result: 0,
      return_message: "",
    };
    send(data);
  }
  return {
    addTerminals,
    delTerminals,
  };
};
