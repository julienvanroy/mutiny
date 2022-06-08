<template>
  <div class="player" :class="{ '--large': large }">
    <div class="points">
      <TheBottle :background="player.color.bottle" :lines="player.color.bottleDetails" />
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
    }
  }
  .name {
    font-weight: $ft-w-bold;
    font-size: $ft-s-xxsmall;
    margin-left: 5px;
    text-align: left;
  }
  &.--large {
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
}
</style>
