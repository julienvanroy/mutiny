import { defineStore } from "pinia";

const useAudioStore = defineStore("audio", {
    state: () => {
        return {
            audios: {},
            musicVolume: 0.5,
            effectVolume: 0.5
        };
    },
    actions: {
        changeMusicVolume(value) {
            this.musicVolume = parseFloat(value)
            this.audios.theme.volume(value)
        },
        changeEffectVolume(value) {
            this.effectVolume = parseFloat(value)
            this.audios.click.volume(value)
            this.audios.newPlayer.volume(value)
        }
    }
});

export default useAudioStore;
