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

/**
 * @description 获取音频文件的时长
 * @param {{time: number, raw: any}} 音频文件本地选中后的回调
 * @param {function} 回调
 * @return {file} 把入参的file返回出去
 * @author gxc
 */
export const getAudioFileTime = (
  file: { time: number; raw: any },
  callback?: any
) => {
  // 使用new Audio解析音频文件，会比较快，但是对aac格式的文件解析不准确，相差还挺大
  // 使用new AudioContext解析音频文件，速度比较慢，但是对aac格式的文件解析准确。

  // 速度对比：
  // 一次解析1首MP3文件：Audio：5ms、AudioContext：1000ms
  // 一次解析3首MP3文件：Audio：50ms、AudioContext：1600ms
  // 一次解析10首MP3文件：Audio：1000ms、AudioContext：3500ms
  // 一次解析50首MP3文件：Audio：3800ms、AudioContext：15000ms
  const content: any = file.raw;
  file["time"] = 0;
  // 解析.aac文件
  if (content.type === "audio/vnd.dlna.adts") {
    // 这种方式慢，但是可以对所有文件都能准确获取音频时长
    const audioCtx = new AudioContext();
    let reader: any = new FileReader();
    let arrBuffer: any;
    reader.onload = function (event: any) {
      arrBuffer = event.target.result;
      // arrBuffer就是包含音频数据的ArrayBuffer对象
      audioCtx.decodeAudioData(arrBuffer, function (audioBuffer) {
        // audioBuffer就是AudioBuffer
        const data = audioBuffer.duration;
        file["time"] = Math.ceil(parseFloat(data.toString()));
        callback?.();
        reader = null;
      });
    };
    reader.readAsArrayBuffer(content);
  } else {
    //经测试，发现audio也可获取视频的时长,这种方式比较快，但是无法准确解析出 aac 格式的时长
    const url = URL.createObjectURL(content);
    const audioElement: any = new Audio(url);
    audioElement.addEventListener("durationchange", () => {
      const data = audioElement.duration;
      file["time"] = Math.ceil(parseFloat(data.toString()));
      callback?.();
    });
  }
  return file;
};
