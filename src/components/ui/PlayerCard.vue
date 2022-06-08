<template>
  <div class="player-card" :class="{ '--large': large }">
    <img :src="img" alt="" />
    <p v-if="showPoints" class="points">{{ points }}</p>
    <p class="name">{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "PlayerCard",
  props: {
    color: {
      type: String,
      required: true,
      //add validator
    },
    name: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    large: {
      type: Boolean,
      default: false,
    },
    showPoints: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    img() {
      switch (this.color) {
        default:
          return "/images/playerCard/purple.png";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.player-card {
  position: relative;
  background-image: url("../../assets/playerCard/background.png");
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: 12px 12px;
  overflow: visible;
  text-align: left;
  width: 164px;
  height: 76px;
  font-weight: $ft-w-bold;

  img {
    height: 74px;
    width: auto;
  }

  .name {
    position: absolute;
    top: 50%;
    right: 18%;
    padding-left: 32%;
    transform: translateY(-50%);
    font-size: 11px;
  }

  .points {
    position: absolute;
    top: 50%;
    left: 9%;
    transform: translateY(-50%) rotate(-10deg);
    font-size: 28px;
    color: $white-beige;
    text-shadow: 3.37778px 2.53333px 1.68889px rgba(77, 8, 28, 0.2);
  }

  &.--large {
    background-size: 90%;
    width: 240px;
    height: 111px;

    img {
      width: 74px;
      height: auto;
    }

    .name {
      font-size: 16px;
    }

    .points {
      left: 10%;
    }
  }
}
</style>
