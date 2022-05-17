<template>
  <div class="timer">{{ time }}</div>
</template>

<script>
import Timer from "@/webgl/Utils/Timer";
import configs from "@/configs";

export default {
  name: "TheTimer",
  data() {
    return {
      time: "00:00",
      timer: new Timer(configs.game.maxTime),
      isTimeout: false,
    };
  },
  mounted() {
    this.timer.start();

    const timer = setInterval(() => {
      this.time = this.prettify(this.timer._time);

      this.isTimeout = this.timer._time === 0;

      if (this.isTimeout) {
        this.$router.push('/end-game')
        clearInterval(timer)
      }
    }, 1000);
  },
  methods: {
    prettify(time) {
      const sec = parseInt(time, 10);
      const hours = Math.floor(sec / 3600);
      const minutes = Math.floor((sec - hours * 3600) / 60);
      const seconds = sec - hours * 3600 - minutes * 60;

      const toString = (value) => {
        return value < 10 ? `0${value}` : value;
      };

      return `${toString(minutes)}:${toString(seconds)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.timer {
  font-size: 3.2rem;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  z-index: 999;
}
</style>
