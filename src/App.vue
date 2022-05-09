<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/game">Game</router-link> |
    <button @click="!!isFullscreen ? closeFullscreen() : goFullscreen()">
      {{ !!isFullscreen ? "close fullscreen" : "go fullscreen" }}
    </button>
  </div>
  <div id="view">
    <router-view/>
    <WebGl v-show="path === '/game'"/>
  </div>
</template>

<script>
import WebGl from "@/components/WebGl";
import {useRoute} from "vue-router";
import {computed} from "vue";
export default {
  name: "App",
  components: {WebGl},
  setup(){
    const route=useRoute();

    const path = computed(() =>route.path)
    return {path}
  },
  data() {
    return {
      isFullscreen: false,
      isFullscreenEnabled: false,
    };
  },
  methods: {
    goFullscreen() {
      let container = document.getElementById("app");
      container.requestFullscreen();
      this.isFullscreen = true;
    },
    closeFullscreen() {
      document.exitFullscreen();
      this.isFullscreen = false;
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
}
</style>
