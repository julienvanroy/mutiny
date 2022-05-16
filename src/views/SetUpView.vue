<template>
  <div class="setup">
    <div class="back">
      <router-link to="/"
        ><img src="images/icons/arrow-back.png" />Home</router-link
      >
    </div>

    <div class="container">
      <div class="players">
        <div class="player-list">
          <h1>Secret sailors</h1>
          <ul>
            <li v-for="player in this.players" :key="player.id">
              <div class="player">
                <img :src="`images/players/${player.color}.png`" />
                <span>{{ player.name }}</span>
              </div>
              <div class="connection"><img src="images/icons/valid.png" /></div>
            </li>
          </ul>
        </div>
        <div class="code">
          <h2>Your vessel</h2>
          <p>{{ colyseus.currentRoom.id }}</p>
        </div>
      </div>
      <div class="else">
        <div v-if="!showControls" class="game-mode">
          <div class="modes">
            <div class="mode">
              <div class="content">
                <button @click="() => (showControls = true)">
                  <img src="images/icons/play.png" />
                </button>
              </div>
              <h2>Traqueurs traqués</h2>
            </div>
            <div class="mode unavailable">
              <div class="content">
                <img src="images/icons/locked.png" />
              </div>
              <h2>Game mode 2</h2>
            </div>
            <div class="mode unavailable">
              <div class="content">
                <img src="images/icons/locked.png" />
              </div>
              <h2>Game mode 3</h2>
            </div>
          </div>
          <div class="catch">
            <p>Sneak your way to becoming captain !</p>
          </div>
        </div>
        <div v-if="showControls" class="controls">
          <div class="controls-inner">
            <div class="back" @click="() => (showControls = false)">
              <img src="images/icons/arrow-back.png" />Back
            </div>
            <h3>Traqueurs traqués</h3>
            <p class="subtitle">Find those in your way**</p>
            <div class="parameters">
              <div class="left">
                <img src="images/parameters/difficulty.png" />
                <img src="images/parameters/time.png" />
              </div>
              <div class="right">
                <img src="images/parameters/controls.png" />
              </div>
            </div>
          </div>

          <div class="actions">
            <TheButton label="Tutorial" color="light" :disabled="true" />
            <TheButton label="GO !" color="dark" link="/game" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/TheButton.vue";

export default {
  name: "SetUpView",
  components: { TheButton },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      players: [],
      showControls: false,
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("addPlayer", () => {
      this.colyseus.getAllPlayers();
    });

    this.colyseus.currentRoom.onMessage("getAllPlayers", (players) => {
      delete players[this.colyseus.currentRoom.sessionId];
      this.players = players;
    });
  },
};
</script>

<style lang="scss" scoped>
.setup {
  position: relative;
  width: 100%;
  height: 100vh;
  .back {
    position: absolute;
    z-index: 10;
    top: 20px;
    left: 20px;
    a {
      display: flex;
      align-items: center;
    }
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .players {
      width: 100%;
      max-width: 300px;
      .player-list {
        background-color: $grey-3;
        border-radius: 8px;
        min-height: 400px;
        h1 {
          height: 80px;
          padding: 0 30px;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        ul {
          height: 320px;
          padding: 0;
          margin: 0;
          overflow: scroll;
          li {
            width: 100%;
            list-style: none;
            height: 50px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            &:nth-child(odd) {
              background-color: $grey-2;
            }
            .player {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              span {
                font-weight: $ft-bold;
                margin-left: 8px;
              }
            }
            .connection {
              img {
                width: 30px;
              }
            }
          }
        }
      }
      .code {
        background-color: $grey-3;
        border-radius: 8px;
        padding: 10px 30px;
        margin-top: 20px;
        height: 150px;
      }
    }

    .else {
      width: 100%;
      max-width: 940px;
      margin-left: 30px;
      .game-mode {
        .modes {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          .mode {
            background-color: $grey-3;
            width: 300px;
            min-height: 400px;
            border-radius: 12px;
            .content {
              width: 100%;
              height: 300px;
              border-radius: 12px;
              background-color: $grey-1;
              display: flex;
              justify-content: center;
              align-items: center;
              button {
                border: none;
                background-color: none;
                @media (any-hover: hover) {
                  &:hover {
                    cursor: pointer;
                  }
                }
              }
            }
            &.unavailable {
              background-color: $grey-5;
              .content {
                background-color: $grey-4;
              }
              h2 {
                color: $grey-2;
              }
            }
            h2 {
              height: 100px;
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            & + .mode {
              margin-left: 20px;
            }
          }
        }
        .catch {
          p {
            margin-top: 20px;
            height: 150px;
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .controls {
        position: relative;
        &-inner {
          position: relative;
          background-color: $grey-1;
          border-radius: 12px;
          min-height: 430px;
          padding: 30px 40px;
          .back {
            position: absolute;
            z-index: 10;
            top: 20px;
            left: 20px;
            display: flex;
            align-items: center;
            @media (any-hover: hover) {
              &:hover {
                cursor: pointer;
              }
            }
          }
          h3 {
            margin: 0;
            font-size: 30px;
            font-weight: $ft-bold;
            text-align: center;
          }
          .subtitle {
            text-align: center;
            margin: 20px 0;
          }
          .parameters {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            .left {
              display: flex;
              flex-flow: column nowrap;
              justify-content: space-between;
              align-items: center;
              img {
                width: 360px;
              }
            }
            .right {
              margin-left: 20px;
              img {
                width: 480px;
              }
            }
          }
        }
        .actions {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          .btn + .btn {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
