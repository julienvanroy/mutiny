<template>
  <canvas ref="canvas" />
  <the-timer @levelTimeout="onLevelTimeout" />
</template>

<script>
import Experience from "../webgl/Experience";
import TheTimer from "./TheTimer/TheTimer.vue";

export default {
  name: "WebGl",
  components: { TheTimer },
  mounted() {
    new Experience(this.$refs.canvas);
  },
  methods: {
    onLevelTimeout() {
      this.$emit("levelTimeout");
    },
  },
};
</script>

<style lang="scss" scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
  z-index: -1;
}
</style>
