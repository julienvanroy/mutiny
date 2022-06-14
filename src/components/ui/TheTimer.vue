<template>
  <div class="timer">{{ prettify }}</div>
</template>

<script>
import { ref, watch } from "vue";
import configs from "@/configs";
import useColyseusStore from "@/store/colyseus";

export default {
  name: "TheTimer",
  data() {
    return {
      isRunning: false,
      timer: null,
    };
  },
  props: {
    duration: {
      type: Number,
      default: configs.game.maxTime,
    },
  },
  setup(props) {
    const time = ref(0);
    const colyseus = useColyseusStore();

    const setTimeWithDuration = () => {
      time.value = props.duration;
    };

    watch(
      () => props.duration,
      () => {
        setTimeWithDuration();
      }
    );

    return {
      time,
      setTimeWithDuration,
      colyseus,
    };
  },
  computed: {
    prettify() {
      const sec = parseInt(this.time, 10);
      const hours = Math.floor(sec / 3600);
      const minutes = Math.floor((sec - hours * 3600) / 60);
      const seconds = sec - hours * 3600 - minutes * 60;

      const toString = (value) => {
        return value < 10 ? `0${value}` : value;
      };

      return `${toString(minutes)}'${toString(seconds)}''`;
    },
  },
  mounted() {
    this.setTimeWithDuration();
    this.start();
  },
  methods: {
    start() {
      this.isRunning = true;
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.time > 0) {
            this.time--;
          } else {
            clearInterval(this.timer);
            this.colyseus.sendData("endGame");
            this.reset();
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
  },
};
</script>

<style lang="scss" scoped>
.timer {
  font-size: $ft-s-medium;
  font-weight: $ft-w-bold;
}
</style>
