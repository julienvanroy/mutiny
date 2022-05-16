<template>
  <div class="main-container" ref="fullscreenContainer">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/connection">Connection</router-link> |
      <router-link to="/setup">SetUp</router-link> |
      <router-link to="/game">Game</router-link> |
      <router-link to="/end-game">End Game</router-link> |
    </div> -->

    <div class="fullscreen">
      <button
        v-if="showFullscreenBtn"
        @click="!!isFullscreen ? closeFullscreen() : goFullscreen()"
      >
        <img src="images/icons/fullscreen-on.png" />
      </button>
    </div>

    <div class="btn-parameters">
      <button><img src="images/icons/sound-on.png" /></button>
      <button><img src="images/icons/parameters.png" /></button>
    </div>

    <div id="view">
      <router-view />
      <WebGl v-if="!isMobile" v-show="path === ('/game' || '/game#debug')" />
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
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      showFullscreenBtn: !(
        /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      ),
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
  font-family: "Montserrat";
  color: $black;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: $ft-body;
  font-weight: $ft-regular;
  box-sizing: border-box;
}

.main-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;

  .fullscreen,
  .btn-parameters {
    position: absolute;
    z-index: 10;
    button {
      background: none;
      border: none;
      width: 30px;
      height: 30px;
      padding: 0;
      img {
        width: 100%;
      }
      & + button {
        margin-left: 10px;
      }

      @media (any-hover: hover) {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .fullscreen {
    top: 20px;
    right: 20px;
  }
  .btn-parameters {
    bottom: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
