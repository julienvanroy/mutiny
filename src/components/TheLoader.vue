<template>
  <transition name="fade">
    <div :class="`loading ${ended ? 'ended' : ''}`" v-if="show">
      <div class="loading-bar" :style="{transform : !ended ? `scaleX(${progress})` : ''}"/>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'pinia'
import useWebglStore from "@/store/webgl";

export default {
  name: "TheLoader",
  data() {
    return {
      show: true
    }
  },
  computed: {
    ...mapState(useWebglStore, {progress: 'progressLoading'}),
    ended() {
      return this.progress === 1
    }
  },
  watch: {
    ended(newValue) {
      if(newValue) {
        setTimeout(() => {
          this.show = false
        }, 1000)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 20;
  opacity: 1;
  transition: 0.5s opacity ease;

  &-bar {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background: $white;
    transform: scaleX(0);
    transform-origin: top left;
    transition: transform 0.5s ease;
  }

  &.ended {
    opacity: 0;

    .loading-bar {
      transform: scaleX(0);
      transform-origin: 100% 0;
      transition: transform 1.5s ease-in-out;
    }
  }
}
</style>
