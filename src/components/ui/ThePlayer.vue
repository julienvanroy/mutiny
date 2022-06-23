<template>
  <div
    :class="`player
    ${!!large ? 'large' : ''}
    ${!dontUpdateState && !!player.targetChanged && !player.isKilled ? 'changed' : ''}
    ${!dontUpdateState && !!player.isKilled ? 'killed' : ''}
    ${!player.connected ? 'disconnected' : ''}
    `"
  >
    <div class="points">
      <TheBottle
        class="bottle"
        :background="
          !dontUpdateState && (!!player.isKilled || !!player.targetChanged || !player.connected)
            ? '#FFF6F4'
            : player.color.bottle
        "
        :details="
          !dontUpdateState && !!player.isKilled
            ? '#903238'
            : !dontUpdateState && !!player.targetChanged
            ? '#622B75'
            : !player.connected
            ? '#6B6587'
            : player.color.bottleDetails
        "
      />
      <span v-if="!hidePoints">{{ !player.connected ? "!" : player.points }}</span>
      <TheMedal
        v-if="!!showMedal"
        class="medal"
        :background="player.color.medal"
      />
    </div>
    <span class="name">{{ player.name }}</span>
    <ThePins
      v-if="!dontUpdateState"
      class="pin"
      :state="
        !!player.isKilled
          ? 'killed'
          : !!player.targetChanged
          ? 'switched'
          : !player.connected
          ? 'disconnected'
          : ''
      "
    />
  </div>
</template>

<script>
import TheBottle from "@/components/svg/TheBottle";
import ThePins from "@/components/svg/ThePins";
import TheMedal from "@/components/svg/TheMedal";

export default {
  name: "ThePlayer",
  components: { TheBottle, ThePins, TheMedal },
  props: {
    player: {
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
    dontUpdateState: {
      type: Boolean,
      default: false,
    },
    hidePoints: {
      type: Boolean,
      default: false,
    },
    showMedal: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 12px 12px 40px;
  margin-left: 10px;
  background-image: url("../../assets/player/background.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 160px;
  height: 60px;
  transition: 0.3s all ease-in-out;
  .points {
    position: absolute;
    top: 45%;
    left: -10px;
    height: 70px;
    transform: translateY(-50%) rotate(-5deg);
    .bottle {
      height: 100%;
    }
    span {
      font-weight: $ft-w-bold;
      font-size: $ft-s-large;
      color: $white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: 0.3s all ease-in-out;
      text-shadow: 4px 3px 2px rgba(77, 8, 28, 0.2);
    }
    .medal {
      position: absolute;
      width: 40px;
      top: 8px;
      right: -14px;
    }
  }
  .name {
    font-weight: $ft-w-bold;
    font-size: $ft-s-xxsmall;
    margin-left: 5px;
    text-align: left;
    transition: 0.3s all ease-in-out;
  }
  .pin {
    position: absolute;
    width: 26px;
    top: -6px;
    right: -4px;
  }
  &.large {
    width: 240px;
    height: 100px;
    padding: 12px 12px 12px 70px;
    .points {
      height: 110px;
      span {
        font-size: $ft-s-xlarge;
      }
    }
    .name {
      font-size: $ft-s-xsmall;
    }
  }
  &.killed {
    background-image: url("../../assets/player/background-killed.png");
    transition: 0.3s all ease-in-out;
    .points {
      span {
        color: $red-dead;
        transition: 0.3s all ease-in-out;
      }
    }
    .name {
      color: $white-beige;
      transition: 0.3s all ease-in-out;
    }
  }
  &.changed {
    background-image: url("../../assets/player/background-changed.png");
    transition: 0.3s all ease-in-out;
    .points {
      span {
        color: $violet-target;
        transition: 0.3s all ease-in-out;
      }
    }
    .name {
      color: $white-beige;
      transition: 0.3s all ease-in-out;
    }
  }
  &.disconnected {
    background-image: url("../../assets/player/background-disconnected.png");
    transition: 0.3s all ease-in-out;
    .points {
      span {
        color: $violet-clue;
        transition: 0.3s all ease-in-out;
      }
    }
    .name {
      color: $white-beige;
      transition: 0.3s all ease-in-out;
    }
  }
}
</style>
