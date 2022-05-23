import { defineStore } from "pinia";

const useWebglStore = defineStore("webgl", {
    state: () => {
        return {
            progressLoading: 0,
            audio: {}
        };
    },
});

export default useWebglStore;
