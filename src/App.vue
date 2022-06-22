<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }}</template>
    <template v-slot:description="{ content }">{{ content }}</template>
  </metainfo>
  <div class="main-container" ref="fullscreenContainer">
    <div v-if="!isMobile && !is404" class="fullscreen">
      <button v-if="showFullscreenBtn" @click="setFullscreen()">
        <img
          :src="`images/icons/fullscreen-${isFullscreen ? 'off' : 'on'}.png`"
        />
      </button>
    </div>

    <div class="btn-parameters" v-if="!isMobile && !is404">
      <button @click="audios.setMute(!this.muted)">
        <img :src="`images/icons/sound-${!this.muted ? 'on' : 'off'}.png`" />
      </button>
      <button v-show="!isGamePath" @click="() => (modalShown = 'options')">
        <img src="images/icons/parameters.png" />
      </button>
      <button v-show="isGamePath" @click="() => (modalShown = 'pause')">
        <img src="images/icons/pause.png" />
      </button>
    </div>

    <transition name="fade">
      <ModalOptions
        v-if="'options' === modalShown"
        :setFullscreen="setFullscreen"
      />
    </transition>

    <transition name="fade">
      <ModalPause
        v-if="'pause' === modalShown"
        :setFullscreen="setFullscreen"
      />
    </transition>

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
import useAudioStore from "@/store/audio";
import ModalOptions from "@/components/modals/ModalOptions";
import ModalPause from "@/components/modals/ModalPause";
import useGlobalStore from "@/store/global";
import useTimerStore from "@/store/timer";
import useColyseusStore from "./store/colyseus";
import bidello from "bidello";

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
    const timer = useTimerStore();
    const audios = useAudioStore();

    const path = computed(() => route.path);

    return { path, colyseus, timer, audios };
  },
  data() {
    return {
      musicHasStarted: false,
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize, false);
    window.addEventListener(
      "click",
      () => {
        if (!this.musicHasStarted) {
          this.audios.audios?.theme.play();
          this.audios.muted = false
          this.musicHasStarted = true;
        }
        this.audios.audios?.click?.play();
      },
      false
    );
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resize, false);
    window.removeEventListener(
      "click",
      () => {
        if (!this.musicHasStarted) {
          this.audios.audios.theme.play();
          this.audios.muted = false
          this.musicHasStarted = true;
        }
        this.audios.audios?.click?.play();
      },
      false
    );
  },
  watch: {
    isLandscape(newValue) {
      if (this.colyseus.currentRoom && this.isMobile) {
        this.colyseus.sendData("orientationChange", {
          orientationReady: newValue,
        });
      }
    },
    modalShown(newValue, oldValue) {
      if (newValue === "pause") {
        bidello.trigger({ name: "pause" });
        this.timer.stop();
      } else if (oldValue === "pause" && newValue !== "pause") {
        bidello.trigger({ name: "start" });
        this.timer.start();
      }
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
  },
  computed: {
    ...mapState(useAudioStore, ["audios", "muted"]),
    ...mapState(useGlobalStore, ["isMobile", "showFullscreenBtn"]),
    ...mapWritableState(useGlobalStore, [
      "isFullscreen",
      "isLandscape",
      "modalShown",
    ]),
    isGamePath() {
      return this.path === "/game" || this.path === "/debug";
    },
    is404() {
      return this.path === "/404";
    },
  },
};
</script>

<style lang="scss">
#app {
  background-color: $white-beige;
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
