<template>
  <web-gl :class="{ hidden: hidden }" />
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/game">Game</router-link>
  </div>
  <div id="view">
    <router-view />
  </div>
</template>

<script>
import bidello from 'bidello';
import WebGl from '@/components/WebGl.vue';
import useColyseusStore from '@/store/colyseus';
import useWebglStore from '@/store/webgl';

export default {
  name: 'App',
  components: { WebGl },
  data() {
    return { hidden: true };
  },
  setup() {
    const colyseus = useColyseusStore();
    const webgl = useWebglStore();
    return { colyseus, webgl };
  },
  watch: {
    $route(to) {
      if (to.path.includes('/game')) this.hidden = false;
      else this.hidden = true;

      if (this.webgl.experience) {
        if (to.hash.includes('#debug')) {
          bidello.trigger({ name: 'debugEnable' });
        } else {
          bidello.trigger({ name: 'debugDisabled' });
        }
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  .hidden {
    visibility: hidden;
  }
}
</style>
