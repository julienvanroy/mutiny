<template>
  <div class="setup">
    <div class="back">
      <TheButton link="/" :label="$t('back')" color="back" />
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
            <p class="uptitle">Mode</p>
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
        <p v-if="hovered !== null">
          {{ $t(modes[hovered].shortDescription) }}
        </p>
      </div>
    </div>

    <div class="setup__over">
      <div class="players">
        <h1>{{ $t("setup.playersTitle") }}</h1>
        <div class="placeholder" v-if="!colyseus.players.length">
          <p v-html="$t('setup.playersPlaceholder')" />
        </div>
        <ul v-if="0 < colyseus.players.length">
          <li
            class="player"
            v-for="player in colyseus.players"
            :key="player.id"
          >
            <div class="player__infos">
              <img :src="`images/players/${player.color}.png`" />
              <span>{{ player.name }}</span>
            </div>
            <div class="player__state">
              <img src="images/icons/valid.png" />
            </div>
          </li>
        </ul>
      </div>
      <div class="connection">
        <h2>{{ $t("setup.codeTitle") }}</h2>
        <div class="connection__inner">
          <div class="code"><CopyCode :code="colyseus.currentRoom.id" /></div>
          <div class="qrcode" @click="setShowModalQRCode(true)">
            <QrCode />
          </div>
        </div>
      </div>
    </div>

    <ModeDetails
      v-if="null !== selected"
      v-on:set-selected="setSelected"
      :mode="selected"
    />

    <ModalJoin
      v-if="!!showModalJoin"
      :roomId="colyseus.currentRoom.id"
      :setShowModalJoin="setShowModalJoin"
    />

    <ModalQrCode
      v-if="!!showModalQRCode"
      :setShowModalQRCode="setShowModalQRCode"
    />
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import bidello from "bidello";
import { Modes } from "@/data/modes";
import TheButton from "@/components/ui/TheButton.vue";
import CopyCode from "@/components/ui/CopyCode";
import QrCode from "@/components/ui/QrCode";
import ModalJoin from "@/components/modals/ModalJoin";
import ModalQrCode from "@/components/modals/ModalQrCode";
import ModeDetails from "@/components/ModeDetails.vue";

export default {
  name: "SetUpView",
  components: {
    TheButton,
    CopyCode,
    QrCode,
    ModalJoin,
    ModalQrCode,
    ModeDetails,
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
    this.colyseus.currentRoom.onMessage(
      "addPlayer",
      ({ playerSessionId: playerId }) => {
        bidello.trigger({ name: "addPlayer" }, { playerId });
      }
    );

    this.colyseus.currentRoom.onMessage("getAllPlayers", () => {});
  },
  methods: {
    mouseHover(isAvailable, value) {
      if (!isAvailable) return;
      this.hovered = value;
    },
    setSelected(val) {
      this.selected = val;
    },
    setShowModalJoin(val) {
      this.showModalJoin = val;
    },
    setShowModalQRCode(val) {
      this.showModalQRCode = val;
    },
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
    width: 480px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding-left: 60px;

    .players {
      width: 100%;
      background-image: url("../assets/setup/player-board.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 70px;
      h1 {
        margin: 0;
        text-align: center;
        font-weight: $ft-w-bold;
      }
      .placeholder {
        min-height: 320px;
        display: flex;
        justify-content: center;
        align-items: center;
        p {
          text-align: center;
          font-size: $ft-s-small;
        }
      }
      ul {
        height: 320px;
        padding: 0;
        margin: 0;
        overflow-y: scroll;
        .player {
          width: 100%;
          list-style: none;
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          &__infos {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            img {
              width: 30px;
            }
            span {
              font-weight: $ft-w-bold;
              margin-left: 16px;
            }
          }
          &__state {
            img {
              width: 30px;
            }
          }
        }
      }
    }
    .connection {
      background-image: url("../assets/setup/connection.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 20px 30px;
      height: 160px;
      width: 100%;
      max-width: 380px;
      margin: 20px auto 0;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: center;
      h2 {
        font-size: $ft-s-small;
        font-weight: $ft-w-bold;
        color: $white;
        text-align: center;
      }
      &__inner {
        display: flex;
        justify-content: center;
        align-items: center;
        .code {
          padding-right: 20px;
        }
        .qrcode {
          display: flex;
          justify-content: center;
          align-items: center;
          border-left: 2px solid $salmon;
          padding-left: 20px;
          img {
            width: 60px;
          }
          @media (any-hover: hover) {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
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
      width: calc(100% - 480px);
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
          animation: boat 4.8s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955)
            reverse;
        }
        &:nth-of-type(3) {
          animation: boat 5.2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955)
            alternate;
        }
        img {
          width: 100%;
        }
        .content {
          position: absolute;
          top: 27%;
          left: 0;
          right: 0;
          width: 80%;
          margin: auto;
          .uptitle {
            font-style: italic;
            font-size: $ft-s-xsmall;
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
