<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/game">Game</router-link>
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
  }
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
