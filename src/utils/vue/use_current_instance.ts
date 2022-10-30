import { ComponentInternalInstance } from "vue";

const useCurrentInstance = {
  useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance;
    const proxy = appContext.config.globalProperties;
    return {
      proxy,
    };
  },
};

export default useCurrentInstance;
