<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/game">Game</router-link>
  </div>
  <div id="view">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import bidello from "bidello";

export default {
  name: "App",
  watch: {
    // Display Tweakpane on #debug
    $route(to) {
      if (!to.hash.includes("#debug"))
        document.querySelectorAll(".tp-dfwv").forEach((el) => el.remove());
      else bidello.trigger({ name: "debug" }, { debugActive: true });
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
