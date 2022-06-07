<template>
  <div class="homepage">
    <template v-if="!isMobile">
      <div class="credits">
        <TheButton link="/credits" :label="$t('homepage.credits')" color="tertiary" />
      </div>

      <div class="homepage__under">
        <img src="images/background-home.png" />
      </div>
      <div class="homepage__over">
        <img src="images/logo.png" />
        <div v-if="!isMobile" class="btn-container">
          <TheButton @click="createRoom" :label="$t('homepage.createRoom')" color="primary" />
          <p>
            {{ $t("homepage.homePhraseDesktop") }}
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <header class="homepage__header">
        <img src="../assets/mobile/header.svg" alt="" />
      </header>
      <div class="homepage__content">
        <h1 class="homepage__content__logo">
          <img src="../assets/mobile/logo.svg" alt="Logo Mutiny" />
        </h1>
        <div class="content-container">
          <h2>{{ $t("homepage.content.shipName") }}</h2>
          <the-input
            :placeholder="$t('homepage.content.inputPlaceholder')"
            :width="236"
            :height="48"
            v-model="roomId"
            center
          />
          <p>
            {{ $t("homepage.content.instruction") }}
          </p>
        </div>
        <div class="btn-container">
          <TheButton
            :disabled="!roomId"
            :label="$t('homepage.content.cta')"
            color="primary"
            @click="joinRoom(roomId)"
          />
          <TheButton
            v-for="(room, roomIndex) in colyseus.rooms"
            :key="roomIndex"
            @click="joinRoom(room.roomId)"
            :label="`Join room ` + room.roomId"
            color="primary"
          />
        </div>
      </div>
      <footer class="homepage__footer">
        <div class="homepage__footer__left">
          <img src="../assets/mobile/icon-players.svg" />
          <p>
            {{ $t("homepage.footer.players-count") }}
            <br />
            {{ $t("homepage.footer.players-unit") }}
          </p>
        </div>
        <div class="homepage__footer__right">
          <img src="../assets/mobile/icon-matos.svg" />
          <p>
            {{ $t("homepage.footer.materials-1") }}
            <br />
            {{ $t("homepage.footer.materials-2") }}
          </p>
        </div>
      </footer>
    </template>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/ui/TheButton.vue";
import { mapState } from "pinia/dist/pinia.esm-browser";
import useGlobalStore from "@/store/global";
import TheInput from "@/components/ui/TheInput.vue";

export default {
  name: "App",
  components: { TheButton, TheInput },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      roomId: "",
    };
  },
  computed: {
    ...mapState(useGlobalStore, ["isMobile"]),
  },
  mounted() {
    this.colyseus.initLobbyRoom();
  },
  methods: {
    createRoom(doJoinRoom = true) {
      this.colyseus.createRoom("play_room", doJoinRoom);
    },
    joinRoom(roomId) {
      this.colyseus.joinRoom(roomId);
    },
    joinRandomRoom() {
      this.colyseus.joinRoom();
    },
  },
};
</script>

<style lang="scss" scoped>
.homepage {
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
    justify-content: space-evenly;
    align-items: center;
    img {
      width: 380px;
      @media #{$mq-small} {
        width: 560px;
      }
    }
    .btn-container {
      max-width: 460px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      .btn + .btn {
        margin-left: 20px;
      }
      p {
        color: $white;
        font-size: $ft-s-small;
        text-align: center;
        margin-top: 30px;
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
  }
  .credits {
    position: absolute;
    z-index: 20;
    bottom: 20px;
    left: 20px;
    a {
      color: $purple;
      font-size: $ft-s-small;
      font-weight: $ft-w-regular;
      letter-spacing: 0.01em;
      text-decoration-line: underline;
    }
  }

  @media #{$mq-mobile} {
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

    &__header {
      text-align: center;
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 64px 0;
      text-align: center;

      .content-container {
        h2 {
          font-weight: $ft-w-bold;
          font-size: 18px;
        }

        .the-input {
          margin: 16px auto 32px auto;
        }

        p {
          padding: 0 32px;
        }
      }

      .btn-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        * {
          margin: 8px 0;
        }
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      div {
        display: flex;

        img {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
