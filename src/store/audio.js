import { defineStore } from "pinia";

const useAudioStore = defineStore("audios", {
    state: () => {
        return {
            audios: {},
            musicVolume: 0.2,
            effectVolume: 0.6,
            muted: false,
        };
    },
    actions: {
        changeMusicVolume(value) {
            this.musicVolume = parseFloat(value)
            this.audios.theme.volume(value)
            this.audios.musicGame.volume(value)
        },
        changeEffectVolume(value) {
            this.effectVolume = parseFloat(value)
            this.audios.click.volume(value)
            this.audios.newPlayer.volume(value)
            this.audios.attack.volume(value)
        },
        setMute(value) {
            this.audios.theme.mute(value)
            this.audios.musicGame.mute(value)
            this.audios.click.mute(value)
            this.audios.newPlayer.mute(value)
            this.audios.attack.mute(value)

            this.muted = value
        }
    }
});

export default useAudioStore;
