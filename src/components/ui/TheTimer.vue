<template>
  <div class="timer">{{ timer.prettify }}</div>
</template>

<script>
import useTimerStore from "@/store/timer";

export default {
  name: "TheTimer",
  setup() {
    const timer = useTimerStore()
    return {
      timer,
    };
  }
};
</script>

<style lang="scss" scoped>
.timer {
  font-size: $ft-s-medium;
  font-weight: $ft-w-bold;
}
</style>
