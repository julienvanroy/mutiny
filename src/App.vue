<template>
  <div class="main-container" ref="fullscreenContainer">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/connection">Connection</router-link> |
      <router-link to="/setup">SetUp</router-link> |
      <router-link to="/game">Game</router-link> |
      <router-link to="/end-game">End Game</router-link> |
    </div> -->

    <LocaleChanger />

    <div class="fullscreen">
      <button
        v-if="showFullscreenBtn"
        @click="!!isFullscreen ? closeFullscreen() : goFullscreen()"
      >
        <img src="images/icons/fullscreen-on.png" />
      </button>
    </div>

    <div class="btn-parameters">
      <button v-show="!isGamePath" @click="playMusic">
        <img src="images/icons/sound-on.png" />
      </button>
      <button v-show="!isGamePath">
        <img src="images/icons/parameters.png" />
      </button>
      <button v-show="isGamePath">
        <img src="images/icons/sound-game-on.png" />
      </button>
      <button v-show="isGamePath"><img src="images/icons/pause.png" /></button>
    </div>

    <div v-if="isMobile" class="modal-landscape">
      Turn your phone to landscape view !!!
    </div>

    <div id="view">
      <router-view />
      <WebGl v-if="!isMobile" v-show="path === ('/game' || '/game#debug')" />
    </div>

    <TheLoader v-if="!isMobile" />
  </div>
</template>

<script>
import WebGl from "@/components/WebGl";
import { useRoute } from "vue-router";
import { computed } from "vue";
import TheLoader from "@/components/TheLoader";
import { mapState } from "pinia/dist/pinia.esm-browser";
import useWebglStore from "@/store/webgl";
import LocaleChanger from "@/components/LocaleChanger";

export default {
  name: "App",
  components: { LocaleChanger, TheLoader, WebGl },
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
    playMusic() {
      this.music.play();
    },
  },
  computed: {
    ...mapState(useWebglStore, ["audio"]),
    music() {
      return this.audio.musicGame;
    },
    isGamePath() {
      return this.path === ("/game" || "/game#debug");
    },
  },
};
</script>

<style lang="scss">
#app {
  color: $black;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: $ft-body;
  font-weight: $ft-w-regular;
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
    z-index: 20;
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
  .modal-landscape {
    position: absolute;
    z-index: 16;
    inset: 0;
    background-color: $black;
    color: $white;
    font-weight: $ft-w-bold;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (orientation: landscape) {
      z-index: -1;
    }
  }
}
</style>
