<template>
  <div
    :class="`player
    ${!!large ? 'large' : ''}
    ${!!player.targetChanged ? 'changed' : ''}
    ${!!player.isKilled ? 'killed' : ''}
    ${!player.connected ? 'disconnected' : ''}
    disconnected
    `"
  >
    <div class="points">
      <TheBottle
        :background="
          !!player.isKilled || !!player.targetChanged || !player.connected
            ? '#FFF6F4'
            : player.color.bottle
        "
        :lines="
          !!player.isKilled
            ? '#903238'
            : !!player.targetChanged
            ? '#622B75'
            : !player.connected
            ? '#6B6587'
            : player.color.bottleDetails
        "
      />
      <span>{{ player.points }}</span>
    </div>
    <span class="name">{{ player.name }}</span>
  </div>
</template>

<script>
import TheBottle from "@/components/svg/TheBottle";

export default {
  name: "ThePlayer",
  components: { TheBottle },
  props: {
    player: {
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    console.log(this.player);
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
    svg {
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
    }
  }
  .name {
    font-weight: $ft-w-bold;
    font-size: $ft-s-xxsmall;
    margin-left: 5px;
    text-align: left;
    transition: 0.3s all ease-in-out;
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
