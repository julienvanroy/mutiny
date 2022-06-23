<template>
  <transition name="fade">
    <div :class="`player__inner ${!!isEmpty ? 'empty' : ''}`">
      <div class="player__infos" v-if="!isEmpty">
        <TheBottle
          class="bottle"
          :background="player.color.bottle"
          :details="player.color.bottleDetails"
        />
        <span>{{ player.name }}</span>
      </div>
      <div class="player__infos" v-if="!!isEmpty">
        <TheBottle class="bottle" :isEmpty="true" />
        <span>{{ $t("setup.vacancy") }}</span>
      </div>
      <div class="player__state" v-if="!isEmpty">
        <div class="state">
          {{ !!player.orientationReady ? $t("setup.ready") : "" }}
          <div v-if="!player.orientationReady" class="dots">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
        </div>
        <div class="remove" @click="ejectedPlayer(player.id)">
          <img src="images/icons/remove-player.png" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "pinia";
import TheBottle from "@/components/svg/TheBottle";
import useAudioStore from "@/store/audio";
import useColyseusStore from "@/store/colyseus";

export default {
  name: "PlayerAdded",
  components: { TheBottle },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  props: {
    player: {},
    isEmpty: {
      default: true,
    },
  },
  mounted() {
    if (!this.isEmpty) {
      this.audios?.newPlayer?.play();
    }
  },
  watch: {
    isEmpty(newValue, oldValue) {
      if (oldValue === true && newValue === false) {
        this.audios?.newPlayer?.play();
      }
    },
  },
  computed: {
    ...mapState(useAudioStore, ["audios"]),
  },
  methods: {
    ejectedPlayer(playerId) {
      this.colyseus.sendData("ejectPlayer", playerId);
    },
  }
};
</script>

<style lang="scss" scoped>
.player {
  &__inner {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0 10px 12px;
    &.empty {
      color: #91a2c9;
    }
    &:not(.empty) {
      @media (any-hover: hover) {
        &:hover {
          background-color: $white;
          transition: 0.3s all ease-in-out;
          .player__state .remove {
            opacity: 1;
            pointer-events: auto;
            transition: 0.3s all ease-in-out;
          }
        }
      }
    }
  }
  &__infos {
    width: 70%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .bottle {
      width: 36px;
      transform: rotate(-5deg);
    }
    span {
      width: calc(100% - 36px);
      margin: 0 8px 0 10px;
    }
  }
  &__state {
    position: relative;
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .state {
      font-size: $ft-s-xsmall;
      font-weight: $ft-w-bold;
      color: $blue;
      .dots {
        display: flex;
        justify-content: center;
        align-items: center;
        .dot {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: $ft-s-large;
          transform-origin: center 150%;
          animation: pulse 1.6s infinite linear;
          width: 10px;
          height: 10px;
          transform: translateY(-10px);
          &:nth-child(2) {
            animation-delay: 0.3s;
          }
          &:nth-child(3) {
            animation-delay: 0.6s;
          }
        }
      }

      @keyframes pulse {
        0% {
          transform: translateY(-10px) scale(0);
        }
        30% {
          transform: translateY(-10px) scale(1);
        }
        60%,
        100% {
          transform: translateY(-10px) scale(0);
        }
      }
    }
    .remove {
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      transition: 0.3s all ease-in-out;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 35px 36px 35px 0;
        border-color: transparent #fff0eb transparent transparent;
      }
      img {
        width: 20px;
        position: absolute;
        right: 0px;
      }
      @media (any-hover: hover) {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
