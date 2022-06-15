<template>
  <div class="end-game">
    <div class="end-game__under">
      <img src="images/end-desktop/background.jpg" />
    </div>
    <div class="end-game__over">
      <div class="left">
        <div class="winner">
          <h1>1. {{ $t("end.desktop.0") }}</h1>
          <ThePlayer :player="colyseus.rankedPlayers[0]" :large="true" />
        </div>
        <img class="separator" src="images/end-desktop/separator.png" />
        <div class="players-list">
          <ul>
            <li v-for="(player, index) in colyseus.rankedPlayers" :key="index">
              <div v-if="0 !== index">
                <p>
                  <span>{{ index + 1 }}.</span>
                  {{ $t(`end.desktop[${index}]`) }}
                </p>
                <ThePlayer :player="player" />
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
        <TheButton label="Replay" color="primary" link="/setup" />
        <TheButton label="Home" color="secondary" link="/" />
        <TheButton label="Credits" color="secondary" link="/credits" />
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
      width: 65%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      background-image: url("../assets/end-desktop/background.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
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
        width: 80%;
        margin: 32px 0;
      }
      .players-list {
        width: 90%;
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
            width: 50%;
            list-style: none;
            div {
              height: 85px;
              padding: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                font-size: $ft-s-medium;
                font-weight: $ft-w-bold;
                span {
                  font-size: $ft-s-small;
                  opacity: 0.6;
                }
              }
            }

            &:nth-of-type(2),
            &:nth-of-type(3),
            &:nth-of-type(4),
            &:nth-of-type(6),
            &:nth-of-type(7) {
              border-bottom: 1px solid #e2d9dd;
            }

            &:nth-of-type(6),
            &:nth-of-type(7),
            &:nth-of-type(8) {
              margin-left: 20px;
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
      width: 35%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      .btn + .btn {
        margin-top: 20px;
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
