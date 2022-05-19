<template>
  <div class="end-game">
    <div class="under">
      <img src="images/background.jpg" />
    </div>
    <div class="over">
      <h1>The End</h1>
      <div class="end-container">
        <ul>
          <li v-for="(player, index) in rankedPlayers" :key="index">
            <div class="points">
              <img :src="`/images/players/${player.color}.png`" />
              <span>{{ player.points }}</span>
            </div>
            <span class="name">{{ player.name }}</span>
          </li>
        </ul>
        <div class="links">
          <TheButton label="Replay" color="dark" link="/setup" />
          <TheButton label="Home" color="light" link="/" />
          <TheButton label="Credits" color="light" link="/credits" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheButton from "@/components/TheButton.vue";
import useColyseusStore from "@/store/colyseus";

export default {
  name: "EndGameView",
  components: { TheButton },
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },

  computed: {
    rankedPlayers() {
      const _ = [...this.colyseus.players];
      return _.sort((a, b) => (a.points < b.points ? 1 : -1));
    },
  },
  methods: {
    compare(a, b) {
      console.log(a);
      if (a.points > b.points) {
        return -1;
      }
      if (a.points < b.points) {
        return 1;
      }
      return 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.end-game {
  position: relative;
  width: 100%;
  height: 100vh;

  .over {
    position: absolute;
    z-index: 14;
    inset: 0;
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

  .under {
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
      inset: 0;
    }
  }
}
</style>
