const useCommonTable = {
  // 处理回车搜索
  handleKeyupEnter(search: string, fun: () => void) {
    if (search != "") {
      fun();
    }
  },
  // 处理删除搜索
  handleKeyupDelete(search: string, fun: () => void) {
    if (search == "") {
      fun();
    }
  },
};

export default useCommonTable;
