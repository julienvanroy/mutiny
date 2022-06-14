<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }}</template>
    <template v-slot:description="{ content }">{{ content }}</template>
  </metainfo>
  <div class="main-container" ref="fullscreenContainer">
    <div v-if="!isMobile" class="fullscreen">
      <button v-if="showFullscreenBtn" @click="setFullscreen()">
        <img :src="`images/icons/fullscreen-${isFullscreen ? 'off' : 'on'}.png`" />
      </button>
    </div>

    <div class="btn-parameters" v-if="!isMobile">
      <button @click="playMusic">
        <img src="images/icons/sound-on.png" />
      </button>
      <button v-show="!isGamePath" @click="() => (modalShown = 'options')">
        <img src="images/icons/parameters.png" />
      </button>
      <button v-show="isGamePath" @click="() => (modalShown = 'pause')">
        <img src="images/icons/pause.png" />
      </button>
    </div>

    <ModalOptions v-if="'options' === modalShown" :setFullscreen="setFullscreen" />

    <ModalPause v-if="'pause' === modalShown" :setFullscreen="setFullscreen" />

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
import TheLoader from "@/components/ui/TheLoader";
import { mapState } from "pinia";
import { mapWritableState } from "pinia";
import useWebglStore from "@/store/webgl";
import ModalOptions from "@/components/modals/ModalOptions";
import ModalPause from "@/components/modals/ModalPause";
import useGlobalStore from "@/store/global";
import useColyseusStore from "./store/colyseus";

export default {
  name: "App",
  components: {
    ModalOptions,
    ModalPause,
    TheLoader,
    WebGl,
  },
  metaInfo() {
    return {
      title: this.$t("meta.title"),
      description: this.$t("meta.description"),
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    };
  },
  setup() {
    const route = useRoute();
    const colyseus = useColyseusStore();

    const path = computed(() => route.path);

    return { path, colyseus };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize, false);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resize, false);
  },
  watch: {
    isLandscape(newValue) {
      this.colyseus.currentRoom && this.colyseus.sendData("orientationChange", { orientationReady: newValue });
    },
  },
  methods: {
    resize() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
    setFullscreen() {
      if (true === this.isFullscreen) {
        document.exitFullscreen();
        this.isFullscreen = false;
      } else {
        this.$refs.fullscreenContainer.requestFullscreen();
        this.isFullscreen = true;
      }
    },
    playMusic() {
      this.music.play();
    },
  },
  computed: {
    ...mapState(useWebglStore, ["audio"]),
    ...mapState(useGlobalStore, ["isMobile", "showFullscreenBtn"]),
    ...mapWritableState(useGlobalStore, ["isFullscreen", "isLandscape", "modalShown"]),
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

  *,
  * * {
    transition: all 0.64s ease;
  }
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

.nipple {
  z-index: 2 !important;
  .back {
    opacity: 0 !important;
  }
  .front {
    background-color: transparent !important;
    background-image: url("assets/gamepad/joystick.png") !important;
    background-size: contain !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    opacity: 1 !important;
    width: 72px !important;
    height: 72px !important;
    margin-left: -36px !important;
    margin-top: -36px !important;
  }
}
</style>
