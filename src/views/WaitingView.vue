<template>
  <div class="waiting">
    <template v-if="!isLandscape">
      <header>
        <img src="../assets/mobile/header-w-logo.svg" alt="" />
      </header>
      <h2>{{ $t("waiting.portrait.title") }}</h2>
      <ThePlayer v-if="null !== player" :player="player" large dont-update-state hide-points />
      <div class="waiting__instruction">
        <p>{{ $t("waiting.portrait.instruction") }}</p>
        <img src="../assets/mobile/icon-rotate.svg" alt="" />
      </div>
      <footer>
        <img src="../assets/mobile/header.svg" alt="" />
      </footer>
    </template>
    <template v-else>
      <header>
        <img src="../assets/mobile/header-w-logo.svg" alt="" />
      </header>
      <ThePlayer v-if="null !== player" :player="player" dont-update-state hide-points />
      <h2>
        {{ $t("waiting.landscape.titleLeft") }}
        <em>{{ $t("waiting.landscape.titleMiddle") }}</em>
        {{ $t("waiting.landscape.titleRight") }}
      </h2>

      <p>{{ $t("waiting.landscape.instruction") }}</p>
      <footer>
        <img src="../assets/mobile/header.svg" alt="" />
      </footer>
    </template>
  </div>
  <modal-ejected v-if="ejected" />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { mapState } from "pinia";
import useGlobalStore from "@/store/global";
import ThePlayer from "@/components/ui/ThePlayer.vue";
import ModalEjected from "@/components/modals/ModalEjected.vue";

export default {
  components: { ThePlayer, ModalEjected },
  name: "WaitingView",
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      player: null,
      ejected: false,
    };
  },
  computed: {
    ...mapState(useGlobalStore, ["isLandscape"]),
  },
  mounted() {
    this.colyseus.getPlayer(this.colyseus.currentRoom.sessionId);

    this.colyseus.currentRoom.onMessage("startGame", () => this.$router.push("gamepad"));

    this.colyseus.currentRoom.onMessage("updatePlayerTarget", () => {});

    this.colyseus.currentRoom.onMessage("getPlayer", (player) => {
      this.player = player;
    });

    this.colyseus.currentRoom.onMessage("leaveRoom", () => {
      this.colyseus.currentRoom.leave();
      this.ejected = true;
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resize, false);
  },
};
</script>

<style lang="scss" scoped>
.waiting {
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
  text-align: center;

  @media (orientation: landscape) {
    padding-left: 24%;
    padding-right: 24%;
    font-size: 20px;
    line-height: 25px;
    font-weight: $ft-w-bold;

    h2 em {
      color: $blue;
    }

    .btn {
      position: fixed;
      right: 0;
      bottom: 0;
    }
  }

  @media (orientation: portrait) {
    h2 {
      font-weight: $ft-w-bold;
      font-size: 30px;
      text-align: center;
    }

    &__instruction {
      p {
        padding: 0 16%;
        margin-bottom: 32px;
        font-size: 14px;
        letter-spacing: 0.12em;
      }
    }
  }
}
</style>
