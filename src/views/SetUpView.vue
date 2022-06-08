<template>
  <div class="setup">
    <div class="back">
      <TheButton link="/" :label="$t('ui.quit')" color="back" />
    </div>

    <div :class="`setup__under ${null !== selected ? 'details-open' : ''}`">
      <div class="background">
        <img class="sky" src="images/setup/sky.png" />
        <img class="sea__3" src="images/setup/sea_3.png" />
      </div>

      <div class="modes">
        <div
          v-for="(mode, idx) in modes"
          :key="`mode-${idx}`"
          :class="`mode ${!mode.isAvailable ? 'unavailable' : ''}`"
          @mouseover="() => mouseHover(mode.isAvailable, idx)"
          @mouseleave="() => mouseHover(mode.isAvailable, null)"
          @click="() => setSelected(mode)"
        >
          <div v-if="!!mode.isAvailable" class="content">
            <img class="flag" :src="`images/setup/flag${idx === hovered ? '-hover' : ''}.png`" />
            <p :class="`uptitle ${idx === hovered ? 'hovered' : ''}`">Mode</p>
            <h2>{{ $t(mode.name) }}</h2>
          </div>
          <img :src="`images/setup/boat_${idx + 1}.png`" />
        </div>
      </div>

      <div class="front">
        <img class="sea__2" src="images/setup/sea_2.png" />
        <img class="sea__1" src="images/setup/sea_1.png" />
      </div>

      <div class="catch-phrase">
        <p v-if="hovered !== null" v-html="$t(modes[hovered].shortDescription)" />
      </div>
    </div>

    <div class="setup__over">
      <SetUpPlayers />
      <SetUpConnection />
    </div>

    <SetUpModeDetails v-if="null !== selected" v-on:set-selected="setSelected" :mode="selected" />

    <ModalJoin v-if="'join' === modalShown" :roomId="colyseus.currentRoom.id" />

    <ModalQrCode v-if="'qrcode' === modalShown" />
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import useColyseusStore from "@/store/colyseus";
import useGlobalStore from "@/store/global";
import bidello from "bidello";
import { Modes } from "@/data/modes";
import TheButton from "@/components/ui/TheButton";
import ModalJoin from "@/components/modals/ModalJoin";
import ModalQrCode from "@/components/modals/ModalQrCode";
import SetUpModeDetails from "@/components/SetUpModeDetails";
import SetUpPlayers from "@/components/SetUpPlayers";
import SetUpConnection from "@/components/SetUpConnection";

export default {
  name: "SetUpView",
  components: {
    TheButton,
    ModalJoin,
    ModalQrCode,
    SetUpModeDetails,
    SetUpPlayers,
    SetUpConnection,
  },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      showModalJoin: true,
      showModalQRCode: false,
      modes: Modes,
      hovered: null,
      selected: null,
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("addPlayer", ({ playerSessionId: playerId }) => {
      bidello.trigger({ name: "addPlayer" }, { playerId });
    });

    this.colyseus.currentRoom.onMessage("getAllPlayers", () => {});

    this.colyseus.currentRoom.onMessage("getPlayer", () => {});

    this.modalShown = "join";
  },
  methods: {
    mouseHover(isAvailable, value) {
      if (!isAvailable) return;
      this.hovered = value;
    },
    setSelected(val) {
      this.selected = val;
    },
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["modalShown"]),
  },
};
</script>

<style lang="scss" scoped>
.setup {
  position: relative;
  width: 100%;
  height: 100vh;
  .back {
    position: absolute;
    z-index: 20;
    top: 20px;
    left: 20px;
    a {
      display: flex;
      align-items: center;
    }
  }

  &__over {
    position: absolute;
    z-index: 14;
    top: 0;
    left: 0;
    width: 560px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding-left: 60px;
  }

  &__under {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &.details-open {
      &:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba($purple, 0.4);
        backdrop-filter: blur(4px);
      }
    }
    .background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      img {
        position: absolute;
        width: 100%;
      }
      .sky {
        height: 100%;
        object-fit: cover;
      }
      .sea__3 {
        bottom: 26%;
      }
    }
    .modes {
      position: absolute;
      right: 0;
      bottom: 0;
      width: calc(100% - 560px);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .mode {
        position: relative;
        width: 300px;
        min-height: 400px;
        border-radius: 12px;
        text-align: center;
        padding: 50px 0;
        transform-origin: center 80%;
        &:nth-of-type(1) {
          animation: boat 5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }
        &:nth-of-type(2) {
          animation: boat 4.8s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955) reverse;
        }
        &:nth-of-type(3) {
          animation: boat 5.2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955) alternate;
        }
        img {
          width: 100%;
        }
        .content {
          position: absolute;
          top: 22%;
          left: 0;
          right: 0;
          width: 80%;
          margin: auto;
          .flag {
            width: 80px;
            transition: 0.3s all ease-in-out;
          }
          .uptitle {
            font-style: italic;
            font-size: $ft-s-xsmall;
            color: rgba($purple, 0.4);
            transition: 0.3s all ease-in-out;
            &.hovered {
              color: $purple;
              transition: 0.3s all ease-in-out;
            }
          }
          h2 {
            font-weight: $ft-w-bold;
            font-size: $ft-s-large;
          }
        }

        & + .mode {
          margin-left: 30px;
        }
        &:not(.unavailable) {
          @media (any-hover: hover) {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
    .front {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      img {
        position: absolute;
        width: 100%;
        &.sea__2 {
          bottom: 6%;
        }
        &.sea__1 {
          bottom: 0;
        }
      }
    }

    .catch-phrase {
      position: absolute;
      right: 0;
      bottom: 12%;
      width: calc(100% - 420px);
      height: 100px;
      p {
        max-width: 600px;
        margin: auto;
        font-size: $ft-s-medium;
        color: $white;
        text-align: center;
        text-shadow: $purple 1px 0 10px;
      }
    }
  }
}

@keyframes boat {
  0% {
    -webkit-transform: translate3d(0, 0, 0) rotateZ(0deg);
    -moz-transform: translate3d(0, 0, 0) rotateZ(0deg);
    transform: translate3d(0, 0, 0) rotateZ(0deg);
  }
  25% {
    -webkit-transform: translate3d(3%, 0, 0) rotateZ(3deg);
    -moz-transform: translate3d(3%, 0, 0) rotateZ(3deg);
    transform: translate3d(3%, 0, 0) rotateZ(3deg);
  }
  75% {
    -webkit-transform: translate3d(-53, 0, 0) rotateZ(-3deg);
    -moz-transform: translate3d(-53, 0, 0) rotateZ(-3deg);
    transform: translate3d(-53, 0, 0) rotateZ(-3deg);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0) rotateZ(0deg);
    -moz-transform: translate3d(0, 0, 0) rotateZ(0deg);
    transform: translate3d(0, 0, 0) rotateZ(0deg);
  }
}
</style>
