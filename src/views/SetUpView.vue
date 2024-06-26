<template>
  <div class="setup" @mousemove="parallax">
    <div class="back">
      <TheButton link="/" :label="$t('ui.quit')" color="back" />
    </div>

    <div :class="`setup__under ${null !== selected ? 'details-open' : ''}`">
      <div class="background">
        <img class="sky sky_5 bottom full" src="images/setup/sky_5.jpg" />
        <img
          class="sky sky_4 bottom parallax"
          data-parallax="1"
          src="images/setup/sky_4.png"
        />
        <img
          class="sky sky_3 bottom parallax"
          data-parallax="-1"
          src="images/setup/sky_3.png"
        />
        <img
          class="sky sky_2 bottom parallax"
          data-parallax="1"
          src="images/setup/sky_2.png"
        />
        <img
          class="sky sky_1 top parallax"
          data-parallax="1"
          src="images/setup/sky_1.png"
        />
        <img
          class="sea sea_3 bottom parallax"
          data-parallax="-1"
          src="images/setup/sea_3.png"
        />
        <img
          class="sea sea_2 bottom parallax"
          data-parallax="1"
          src="images/setup/sea_2.png"
        />
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
          <div class="boat-container parallax" :data-parallax="`${4 - idx}`">
            <div :class="`boat ${idx === hovered ? 'boat-hover' : ''}`"></div>
          </div>
          <img
            class="wave parallax"
            :data-parallax="`${3 - idx + 0.5}`"
            :src="`images/setup/wave_${idx + 1}.png`"
          />
        </div>
      </div>

      <div class="front">
        <img
          class="sea parallax"
          data-parallax="-4"
          src="images/setup/sea_1.png"
        />
      </div>

      <div class="catch-phrase">
        <p v-if="hovered !== null">
          {{ $t(modes[hovered].shortDescription) }}
        </p>
      </div>
    </div>

    <div class="setup__over">
      <SetUpPlayers />
      <SetUpConnection />
    </div>

    <SetUpModeDetails v-on:set-selected="setSelected" :mode="selected" />

    <transition name="fade">
      <ModalJoin
        v-if="'join' === modalShown"
        :roomId="colyseus.currentRoom.id"
      />
    </transition>

    <transition name="fade">
      <ModalQrCode v-if="'qrcode' === modalShown" />
    </transition>
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
      modes: Modes,
      hovered: null,
      selected: null,
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage(
      "addPlayer",
      ({ playerSessionId: playerId }) => {
        bidello.trigger({ name: "addPlayer" }, { playerId });
      }
    );

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
    parallax(e) {
      document.querySelectorAll(".parallax").forEach((shift) => {
        const position = shift.getAttribute("data-parallax");
        const x = (window.innerWidth - e.pageX * position) / 100;
        const y = (window.innerHeight - e.pageY * position) / 100;
        shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
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
      pointer-events: none;
      transition: 0.3s all ease-in-out;
    }
    &.details-open {
      &:before {
        background-color: rgba($purple, 0.4);
        backdrop-filter: blur(4px);
        transition: 0.3s all ease-in-out;
      }
    }

    .parallax {
      transform-origin: center;
      will-change: transform;
    }

    .background {
      position: absolute;
      top: 0;
      left: -6%;
      right: 0;
      bottom: 0;
      width: 106%;
      height: 100%;
      z-index: 1;
      .sky,
      .sea {
        position: absolute;
        width: 100%;
        &.top {
          bottom: unset;
          top: -3%;
        }
        &.bottom {
          bottom: 0;
          top: unset;
        }
        &.full {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
      .sky {
        &_5 {
          z-index: -1;
        }
        &_4 {
          z-index: 1;
        }
        &_3 {
          z-index: 2;
        }
        &_2 {
          z-index: 3;
        }
        &_1 {
          z-index: 4;
        }
      }
      .sea {
        &_3 {
          z-index: 5;
        }
        &_2 {
          z-index: 6;
        }
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
      align-items: flex-end;
      z-index: 2;
      .mode {
        position: relative;
        margin-bottom: 20%;
        .boat-container {
          position: relative;
          width: 300px;
          height: 546px;
          .boat {
            width: 100%;
            height: 100%;
            transform-origin: center 80%;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            transition: 0.3s background-image ease-in-out;
          }
        }

        .wave {
          position: absolute;
        }
        &:nth-of-type(1) {
          z-index: 5;
          .boat {
            background-image: url("../assets/setup/parallax/boat_1.png");
            animation: boat 5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
            &.boat-hover {
              background-image: url("../assets/setup/parallax/boat_1-hover.png");
              transition: 0.3s background-image ease-in-out;
            }
          }
          .wave {
            right: -30px;
            bottom: -40px;
          }
        }
        &:nth-of-type(2) {
          z-index: 4;
          .boat {
            background-image: url("../assets/setup/parallax/boat_2.png");
            animation: boat 4.8s infinite
              cubic-bezier(0.455, 0.03, 0.515, 0.955) reverse;
          }
          .wave {
            right: -90px;
            bottom: -20px;
          }
        }
        &:nth-of-type(3) {
          z-index: 3;
          .boat {
            background-image: url("../assets/setup/parallax/boat_3.png");
            animation: boat 5.2s infinite
              cubic-bezier(0.455, 0.03, 0.515, 0.955) alternate;
          }
          .wave {
            right: -60px;
            bottom: -20px;
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
      left: -6%;
      right: 0;
      bottom: 0;
      width: 106%;
      z-index: 6;
      .sea {
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    }

    .catch-phrase {
      position: absolute;
      right: 0;
      bottom: 10%;
      width: calc(100% - 420px);
      height: 100px;
      z-index: 8;
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
