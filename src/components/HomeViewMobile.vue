<template>
  <div class="homepage">
    <header class="homepage__header">
      <img src="../assets/mobile/header.svg" alt="" />
    </header>
    <div class="homepage__content">
      <h1 class="homepage__content__logo">
        <img src="../assets/mobile/logo.svg" alt="Logo Mutiny" />
      </h1>
      <div class="content-container">
        <h2>{{ $t("homepage.content.shipName") }}</h2>
        <TheInput
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
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/ui/TheButton.vue";
import TheInput from "@/components/ui/TheInput.vue";

export default {
  name: "HomeViewMobile",
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
  methods: {
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
</style>