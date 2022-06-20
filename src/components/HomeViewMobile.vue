<template>
  <div class="homepage">
    <header class="homepage__header">
      <img src="../assets/mobile/header-w-logo.svg" alt="" />
    </header>
    <div class="homepage__content">
      <h1 class="homepage__content__logo">
        <img src="../assets/mobile/logo.svg" alt="Logo Mutiny" />
      </h1>
      <div class="content-container">
        <h2>{{ $t("homepage.mobileContent.shipName") }}</h2>
        <TheInput
          :placeholder="$t('homepage.mobileContent.inputPlaceholder')"
          :width="236"
          :height="48"
          :maxlength="9"
          v-model="roomId"
          center
        />
        <p>
          {{ $t("homepage.mobileContent.instruction") }}
        </p>
      </div>
      <div class="btn-container">
        <TheButton
          :label="$t('homepage.mobileContent.cta')"
          :disabled="!roomId"
          color="primary"
          @click="joinRoom(roomId)"
        />
      </div>
    </div>
    <footer class="homepage__footer">
      <div class="homepage__footer__left">
        <IconPlayers color="#3C365A" />
        <span>{{ $t("homepage.infosPlayers") }}</span>
      </div>
      <div class="homepage__footer__right">
        <IconEquipment color="#3C365A" />
        <span>
          {{ $t("homepage.infosEquipments1") }}
          <br />
          {{ $t("homepage.infosEquipments2") }}
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/ui/TheButton";
import TheInput from "@/components/ui/TheInput";
import IconPlayers from "@/components/svg/IconPlayers";
import IconEquipment from "@/components/svg/IconEquipment";

export default {
  name: "HomeViewMobile",
  components: { TheButton, TheInput, IconPlayers, IconEquipment },
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
      margin-bottom: 56px;
      * {
        margin: 8px 0;
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 0 32px 20px 32px;
    text-align: left;

    &__left,
    &__right {
      display: flex;
      align-items: center;
      svg {
        margin-right: 8px;
      }
    }
    &__left {
      svg {
        width: 36px;
      }
    }
    &__right {
      svg {
        width: 30px;
      }
    }
  }

  @media (orientation: landscape) {
    &__content {
      padding: 16px 0;

      &__logo {
        display: none;
        visibility: hidden;
      }

      .content-container {
        p {
          padding: 0 16%;
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
