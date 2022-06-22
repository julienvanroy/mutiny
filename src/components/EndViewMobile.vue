<template>
  <div class="end-game">
    <div class="end-game__under">
      <div class="--winner" v-if="isWinner">
        <img class="left" src="/images/end/decor-LR-winner.svg" alt="" />
        <img class="right" src="/images/end/decor-LR-winner.svg" alt="" />
        <img class="bottom" src="/images/end/decor-bottom-winner.svg" alt="" />
      </div>
      <div class="--loser" v-else>
        <img class="left" src="/images/end/decor-LR-loser.svg" alt="" />
        <img class="right" src="/images/end/decor-LR-loser.svg" alt="" />
        <img class="top" src="/images/end/decor-bottom-loser.svg" alt="" />
        <img class="bottom" src="/images/end/decor-bottom-loser.svg" alt="" />
      </div>
    </div>
    <div class="end-game__over">
      <h1>{{ $t(`end.mobile.title.${isWinner ? "win" : "lose"}`) }}</h1>
      <p>{{ $t(`end.mobile.description[${isWinner ? 0 : isLast ? 7 : rank}]`) }}</p>
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";

export default {
  name: "EndViewMobile",

  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  computed: {
    isWinner() {
      return this.colyseus.playerRanking.isWinner;
    },
    isLast() {
      return this.colyseus.playerRanking.isLast;
    },
    rank() {
      return this.colyseus.playerRanking.rank;
    },
  },
};
</script>

<style lang="scss" scoped>
.end-game {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: $white-beige;
  background-image: url("../assets/mobile/background.png");
  background-size: contain;
  background-position: center;
  background-repeat: repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 32px;

  &__over {
    position: absolute;
    z-index: 14;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 6.4%;
    padding-left: 16%;
    padding-right: 16%;
    text-align: center;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 20px;
      font-weight: $ft-w-regular;
      margin-bottom: 24px;
    }
    p {
      font-size: 30px;
      font-weight: $ft-w-bold;
    }
  }

  &__under {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .--winner {
      .left,
      .right {
        width: 1px;
        height: 123px;
      }
      .top,
      .bottom {
        width: 250px;
        height: 101px;
      }
    }

    .--loser {
      .left,
      .right {
        width: 24px;
        height: 182px;
      }
      .top,
      .bottom {
        width: 250px;
        height: 54px;
      }
    }

    img {
      position: absolute;
      object-fit: cover;

      &.left {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }

      &.right {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }

      &.bottom {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      &.top {
        top: 0;
        left: 50%;
        transform: translateX(-50%) scaleY(-1);
      }
    }
  }
}
</style>
