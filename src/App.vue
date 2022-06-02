<template>
  <div class="main-container" ref="fullscreenContainer">
    <div class="fullscreen">
      <button
        v-if="showFullscreenBtn"
        @click="!!isFullscreen ? closeFullscreen() : goFullscreen()"
      >
        <img src="images/icons/fullscreen-on.png" />
      </button>
    </div>

    <div class="btn-parameters">
      <button @click="playMusic">
        <img src="images/icons/sound-on.png" />
      </button>
      <button>
        <img src="images/icons/parameters.png" />
      </button>
      <button v-show="isGamePath"><img src="images/icons/pause.png" /></button>
    </div>

    <ModalLandscape />

    <div id="view">
      <router-view />
      <WebGl v-if="!isMobile" v-show="isGamePath" />
    </div>

    <TheLoader v-if="!isMobile" />
  </div>
</template>

<script>
import WebGl from "@/components/WebGl";
import { useRoute } from "vue-router";
import { computed } from "vue";
import TheLoader from "@/components/TheLoader";
import { mapState } from "pinia";
import { mapWritableState } from 'pinia'
import useWebglStore from "@/store/webgl";
import ModalLandscape from "@/components/ModalLandscape";
import useGlobalStore from "@/store/global";

export default {
  name: "App",
  components: {ModalLandscape, TheLoader, WebGl },
  setup() {
    const route = useRoute();

    const path = computed(() => route.path);
    return { path };
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize, false);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize, false);
  },
  methods: {
    resize() {
      this.isLandscape = window.innerWidth > window.innerHeight
    },
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
    ...mapState(useGlobalStore, ["isMobile", "showFullscreenBtn"]),
    ...mapWritableState(useGlobalStore, ["isFullscreen", "isLandscape"]),
    music() {
      return this.audio.musicGame;
    },
    isGamePath() {
      return this.path === "/game" || this.path === "/debug";
    },
  },
};
</script>

<style lang="scss">
#app {
  color: $purple;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: $font;
  font-weight: $ft-w-regular;
  line-height: 1.5;
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
}
</style>
