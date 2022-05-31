<template>
  <canvas ref="canvas" />
</template>

<script>
import Experience from "../webgl/Experience";

export default {
  name: "WebGl",
  mounted() {
    new Experience(this.$refs.canvas);
  }
};
</script>

<style lang="scss" scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
  z-index: 0;
}
</style>
