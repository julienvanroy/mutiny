<template>
  <div class="main-container" ref="fullscreenContainer">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/connection">Connection</router-link> |
      <router-link to="/rules">Rules</router-link> |
      <router-link to="/game">Game</router-link> |
      <router-link to="/end-game">End Game</router-link> |
    </div> -->

    <div class="parameters">
      <button class="btn btn-light">son</button>
      <button class="btn btn-light">paramètres</button>
      <button
        class="btn btn-light"
        v-if="showFullscreenBtn"
        @click="!!isFullscreen ? closeFullscreen() : goFullscreen()"
      >
        {{ !!isFullscreen ? "close fullscreen" : "go fullscreen" }}
      </button>
    </div>
    <div id="view">
      <router-view />
      <WebGl v-show="path === ('/game' || '/game#debug')" />
    </div>
  </div>
</template>

<script>
import WebGl from "@/components/WebGl";
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "App",
  components: { WebGl },
  setup() {
    const route = useRoute();

    const path = computed(() => route.path);
    return { path };
  },
  data() {
    return {
      showFullscreenBtn: !(/iPhone|iPad|iPod/i.test(navigator.userAgent) || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)),
      isFullscreen: false,
    };
  },
  methods: {
    goFullscreen() {
      this.$refs.fullscreenContainer.requestFullscreen();
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
  font-family: $ft-body;
  font-weight: $ft-regular;
}

.main-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  .parameters {
    position: absolute;
    z-index: 10;
    top: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn + .btn {
      margin-left: 10px;
    }
  }
}
</style>
