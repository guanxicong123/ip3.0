export interface AppState {
    language: string;
    size: string;
}

const useAppStore = defineStore({
    id: "app",
    state: (): AppState => ({
        // language: getLanguage(),
        language: "zh-cn",
        size: localStorage.get("size") || "default",
    }),
    actions: {
        setSize(size: string) {
            this.size = size;
            localStorage.set("size", size);
        },
        setLanguage(language: string) {
            this.language = language;
            localStorage.set("language", language);
        },
    },
});

export default useAppStore;
