<template>
  <div class="end-game">
    <div class="end-game__under">
      <img src="images/end-desktop/background.jpg" />
    </div>
    <div class="end-game__over">
      <div :class="`left ${!!isMounted ? 'appear' : ''}`">
        <div class="winner">
          <h1>1. {{ $t("end.desktop.0") }}</h1>
          <the-player
            v-for="(playerWinner, index) in winners"
            :key="index"
            :player="playerWinner"
            large
            show-medal
            dont-update-state
          />
        </div>
        <img class="separator" src="images/end-desktop/separator.png" />
        <div class="players-list">
          <ul>
            <li v-for="(player, index) in losers" :key="index">
              <div class="player-container">
                <p>
                  <span class="index">{{ index + 2 }}.</span>
                  <span class="status">{{ $t(`end.desktop[${player.isLast ? 7 : index}]`) }}</span>
                </p>
                <the-player :player="player" dont-update-state />
              </div>
            </li>
          </ul>
        </div>

        <div class="footer">
          <img src="images/end-desktop/footer-left.png" />
          <img src="images/end-desktop/footer-right.png" />
        </div>
      </div>
      <div class="right">
        <!-- TODO: replay btn -->
        <TheButton :label="$t('ui.replay')" color="primary" link="/" />
        <TheButton :label="$t('ui.changeMode')" color="secondary" link="/setup" />
        <TheButton :label="$t('ui.quitVessel')" color="secondary" link="/" />
      </div>
    </div>
  </div>
</template>

<script>
import TheButton from "@/components/ui/TheButton.vue";
import ThePlayer from "@/components/ui/ThePlayer.vue";
import useColyseusStore from "@/store/colyseus";

export default {
  name: "EndViewDesktop",
  components: { TheButton, ThePlayer },
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      isMounted: false,
    };
  },
  computed: {
    winners() {
      return this.colyseus.rankedPlayers.filter(({ isFirst }) => isFirst);
    },
    losers() {
      return this.colyseus.rankedPlayers.filter(({ isFirst }) => !isFirst);
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss" scoped>
.end-game {
  position: relative;
  width: 100%;
  height: 100vh;

  &__over {
    position: absolute;
    z-index: 14;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: stretch;
    .left {
      position: relative;
      width: 70%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      background-image: url("../assets/end-desktop/background.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      transform: translateX(-100%);
      transition: 0.6s all ease-in-out;
      &.appear {
        transform: translateX(0);
        transition: 0.6s all ease-in-out;
      }
      .winner {
        display: flex;
        justify-content: center;
        align-items: center;
        h1 {
          font-size: $ft-s-xlarge;
          font-weight: $ft-w-bold;
          margin-right: 50px;
        }
      }
      .separator {
        width: 70%;
        margin: 32px 0;
      }
      .players-list {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ul {
          width: 100%;
          height: calc(106 * 4px);
          display: flex;
          flex-flow: column wrap;
          justify-content: flex-start;
          align-items: flex-start;
          li {
            position: relative;
            width: 50%;
            list-style: none;
            .player-container {
              height: 85px;
              padding: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                max-width: calc(100% - 170px);
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                font-weight: $ft-w-bold;
                .index {
                  display: block;
                  font-size: $ft-s-small;
                  opacity: 0.6;
                  padding-top: 6px;
                }
                .status {
                  display: block;
                  font-size: 1.2rem; //$ft-s-medium;
                  margin-left: 8px;
                }
              }
            }

            &:nth-of-type(2),
            &:nth-of-type(3),
            &:nth-of-type(4),
            &:nth-of-type(6),
            &:nth-of-type(7) {
              border-bottom: 1px solid #e2d9dd;
              &:before,
              &:after {
                content: "";
                background-image: url("../assets/end-desktop/skull.png");
                background-size: 100% 100%;
                position: absolute;
                bottom: 0;
                transform: translateY(50%);
              }
              &:before {
                left: -12px;
                width: 23px;
                height: 26px;
              }
              &:after {
                right: -6px;
                width: 13px;
                height: 15px;
              }
            }

            &:nth-of-type(6),
            &:nth-of-type(7),
            &:nth-of-type(8) {
              margin-left: 54px;
            }

            & + li {
              margin-top: 20px;
            }
          }
        }
      }

      .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 150px;
        }
      }
    }

    .right {
      width: 30%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      .btn + .btn {
        margin-top: 32px;
      }
    }
  }

  &__under {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: auto;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      filter: blur(4px);
    }
    &:after {
      content: "";
      display: block;
      background-color: rgba(#2e2684, 0.8);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
