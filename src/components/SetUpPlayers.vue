<template>
  <div class="players">
    <h1>{{ $t("setup.playersTitle") }}</h1>
    <div class="placeholder" v-if="!colyseus.players.length">
      <p class="placeholder">
        {{ $t("setup.playersPlaceholder1") }}
        <br />
        {{ $t("setup.playersPlaceholder2") }}
      </p>
      <p class="infos">
        {{ $t("setup.infos1") }}
        <strong>{{ $t("setup.infos2") }}</strong>
        {{ $t("setup.infos3") }}
        <strong>{{ $t("setup.infos4") }}</strong>
      </p>
    </div>
    <ul v-if="0 < colyseus.players.length" class="players-list">
      <li class="player" v-for="(n, index) in 8" :key="index">
        <div class="player__inner" v-if="!!colyseus.players[index]">
          <div class="player__infos">
            <TheBottle
              class="bottle"
              :background="colyseus.players[index].color.bottle"
              :details="colyseus.players[index].color.bottleDetails"
            />
            <span>{{ colyseus.players[index].name }}</span>
          </div>
          <div class="player__state">
            <div class="state">
              {{
                !!colyseus.players[index].orientationReady
                  ? $t("setup.ready")
                  : ""
              }}
              <div
                v-if="!colyseus.players[index].orientationReady"
                class="dots"
              >
                <span class="dot">.</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
              </div>
            </div>
            <!-- TODO: onclick eject player from room -->
            <div
              class="remove"
              @click="
                this.colyseus.sendData(
                  'ejectPlayer',
                  colyseus.players[index].id
                )
              "
            >
              <img src="images/icons/remove-player.png" />
            </div>
          </div>
        </div>

        <div class="player__inner empty" v-if="!colyseus.players[index]">
          <div class="player__infos">
            <TheBottle class="bottle" :isEmpty="true" />
            <span>{{ $t("setup.vacancy") }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheBottle from "@/components/svg/TheBottle";

export default {
  name: "SetUpPlayers",
  components: { TheBottle },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
};
</script>

<style lang="scss" scoped>
.players {
  width: 100%;
  background-image: url("../assets/setup/player-board.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 70px 84px 80px 90px;

  h1 {
    margin: 0;
    text-align: center;
    font-weight: $ft-w-bold;
  }
  .placeholder {
    min-height: 280px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: $ft-s-small;
    .placeholder {
      color: rgba($purple, 0.4);
    }
    .infos {
      border-top: 2px solid $purple;
      padding-top: 32px;
    }
  }
  &-list {
    height: 320px;
    margin: 30px 0 0 0;
    overflow-y: scroll;
    .player {
      width: 100%;
      list-style: none;
      transition: 0.3s all ease-in-out;
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

      & + .player {
        border-top: 1px solid #dedcea;
      }
    }
  }
}
</style>
