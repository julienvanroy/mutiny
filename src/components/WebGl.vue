<template>
  <canvas ref="canvas" />
</template>

<script>
import useWebglStore from '@/store/webgl';
import Experience from '../webgl/Experience';

export default {
  name: 'WebGl',
  setup() {
    const webgl = new useWebglStore();
    return { webgl };
  },
  mounted() {
    this.webgl.experience = new Experience(this.$refs.canvas);
  },
  unmounted() {},
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
