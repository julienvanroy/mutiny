<template>
  <div class="end-game">
    <div class="end-game__under">
      <img src="images/background-home.png" />
    </div>
    <div class="end-game__over">
      <h1>The End</h1>
      <div class="end-container">
        <ul>
          <li v-for="(player, index) in colyseus.rankedPlayers" :key="index">
            <div class="points">
              <!-- <img :src="`/images/players/${player.color}.png`" /> -->
              <span>{{ player.points }}</span>
            </div>
            <span class="name">{{ player.name }}</span>
          </li>
        </ul>
        <div class="links">
          <TheButton label="Replay" color="primary" link="/setup" />
          <TheButton label="Home" color="secondary" link="/" />
          <TheButton label="Credits" color="secondary" link="/credits" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheButton from "@/components/ui/TheButton.vue";
import useColyseusStore from "@/store/colyseus";

export default {
  name: "EndGameView",
  components: { TheButton },
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
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: $ft-s-xlarge;
    }
    .end-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 680px;
      ul {
        li {
          list-style: none;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .points {
            position: relative;

            img {
              width: 60px;
              margin: 0 30px;
            }
            span {
              font-weight: $ft-w-bold;
              font-size: $ft-s-medium;
              color: $white;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -60%);
            }
          }
          .name {
            font-weight: $ft-w-bold;
            margin-left: 10px;
            font-size: $ft-s-medium;
          }
          &:first-of-type {
            img {
              width: 100px;
              margin: 0;
            }
            span {
              font-size: $ft-s-large;
            }
          }
          & + li {
            margin-top: 20px;
          }
          &:first-child {
            .name {
              margin-left: 30px;
            }
          }
        }
      }

      .links {
        .btn + .btn {
          margin-top: 20px;
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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &:after {
      content: "";
      display: block;
      background-color: rgba($white, 0.6);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
