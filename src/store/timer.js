import { defineStore } from "pinia";
import configs from "@/configs";
import useColyseusStore from "@/store/colyseus";

const useTimerStore = defineStore("timer", {
    state: () => {
        return {
            isRunning: false,
            timer: null,
            time: 0,
            duration: configs.game.maxTime,
        };
    },
    getters: {
        prettify(state) {
            const sec = parseInt(state.time, 10);
            const hours = Math.floor(sec / 3600);
            const minutes = Math.floor((sec - hours * 3600) / 60);
            const seconds = sec - hours * 3600 - minutes * 60;

            const toString = (value) => {
                return value < 10 ? `0${value}` : value;
            };

            return `${toString(minutes)}'${toString(seconds)}''`;
        },
    },
    actions: {
        start() {
            this.isRunning = true;
            if (!this.timer) {
                this.timer = setInterval(() => {
                    if (this.time > 0) {
                        this.time--;
                    } else {
                        clearInterval(this.timer);
                        useColyseusStore().sendData("endGame");
                    }
                }, 1000);
            }
        },
        stop() {
            this.isRunning = false;
            clearInterval(this.timer);
            this.timer = null;
        },
        reset() {
            this.stop();
            this.setTimeWithDuration();
        },
        setTimeWithDuration() {
            this.time = this.duration;
        }
    },
});

export default useTimerStore;
