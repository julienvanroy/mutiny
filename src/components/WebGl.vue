<template>
  <keep-alive>
    <canvas ref="canvas" />
  </keep-alive>
</template>

<script>
import useWebglStore from "@/store/webgl";
import Experience from "../webgl/Experience";

export default {
  name: "WebGl",
  setup() {
    const webgl = useWebglStore();
    return { webgl };
  },
  mounted() {
    this.webgl.xp = new Experience(this.$refs.canvas);
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
