<template>
  <div class="setup">
    <div class="back">
      <TheButton link="/" :label="$t('back')" color="back" />
    </div>

    <div class="under">
      <img src="images/background-setup.png" />
    </div>
    <div class="over">
      <div class="container">
        <div class="players">
          <div class="player-list">
            <h1>Secret sailors</h1>
            <ul>
              <li v-for="player in colyseus.players" :key="player.id">
                <div class="player">
                  <img :src="`images/players/${player.color}.png`" />
                  <span>{{ player.name }}</span>
                </div>
                <div class="connection">
                  <img src="images/icons/valid.png" />
                </div>
              </li>
            </ul>
          </div>
          <div class="code">
            <h2>Your vessel</h2>
            <CopyCode :code="colyseus.currentRoom.id" />
            <QrCode @click="() => (showModalQRCode = true)" />
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
              <TheButton label="Tutorial" color="secondary" :disabled="true" />
              <TheButton label="GO !" color="primary" @click="startGame()" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalContainer
    v-if="!!showModalJoin"
    :title="$t('setup.modalJoin.title')"
    btnLabel="Ok"
    :btnAction="() => (showModalJoin = false)"
  >
    <div class="modal-join-content">
      <p v-html="$t('setup.modalJoin.description')"></p>
      <div class="connexion">
        <div class="code-container"><CopyCode :code="colyseus.currentRoom.id" /></div>
        <span>{{ $t("setup.modalJoin.or") }}</span>
        <div class="qrcode-container">
          <div class="qrcode"><QrCode /></div>
        </div>
      </div>
    </div>
  </ModalContainer>

  <ModalContainer
    v-if="!!showModalQRCode"
    :title="$t('setup.modalQRCode.title')"
    :btnAction="() => (showModalQRCode = false)"
  >
    <div class="modal-qrcode-content">
      <div class="qrcode"><QrCode /></div>
    </div>
  </ModalContainer>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/TheButton.vue";
import router from "@/router";
import bidello from "bidello";
import CopyCode from "@/components/CopyCode";
import QrCode from "@/components/QrCode";
import ModalContainer from "@/components/ModalContainer";

export default {
  name: "SetUpView",
  components: { CopyCode, QrCode, TheButton, ModalContainer },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      showControls: false,
      showModalJoin: true,
      showModalQRCode: false,
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage(
      "addPlayer",
      ({ playerSessionId: playerId }) => {
        bidello.trigger({ name: "addPlayer" }, { playerId });
      }
    );

    this.colyseus.currentRoom.onMessage("getAllPlayers", () => {});
  },
  methods: {
    startGame() {
      bidello.trigger({ name: "assignTargets" });
      this.colyseus.sendData("startGame");
      router.push("/game");
    },
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
    z-index: 20;
    top: 20px;
    left: 20px;
    a {
      display: flex;
      align-items: center;
    }
  }

  .over {
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
                  font-weight: $ft-w-bold;
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
              font-size: $ft-s-medium;
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
              font-size: $ft-s-large;
              font-weight: $ft-w-bold;
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
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}

.modal-join-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  p {
    max-width: 560px;
    text-align: center;
    font-size: $ft-s-medium;
    strong {
      font-weight: $ft-w-bold;
    }
  }
  .connexion {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    span {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: $ft-s-small;
      font-weight: $ft-w-bold;
    }
    .code-container,
    .qrcode-container {
      min-width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0px 0px 16px rgba(222, 197, 204, 0.8);
      border-radius: 4px;
      padding: 50px;
    }
    .qrcode {
      width: 100px;
    }
  }
}

.modal-qrcode-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  .qrcode {
    width: 300px;
  }
}
</style>
