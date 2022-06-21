import { defineStore } from "pinia";

const useAudioStore = defineStore("audio", {
    state: () => {
        return {
            musicVolume: 0.5,
            effectVolume: 0.5
        };
    },
});

export default useAudioStore;
