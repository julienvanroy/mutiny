<template>
  <div class="waiting">
    <template v-if="!isLandscape">
      <header>
        <img src="../assets/mobile/header-w-logo.svg" alt="" />
      </header>
      <h2>{{ $t("waiting.portrait.title") }}</h2>
      <player-card :name="colyseus.playerName" :color="colyseus.playerColor" large :showPoints="false" />
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
        <img src="../assets/mobile/header.svg" alt="" />
      </header>
      <h2>
        {{ $t("waiting.landscape.titleLeft") }}
        <em>{{ $t("waiting.landscape.titleMiddle") }}</em>
        {{ $t("waiting.landscape.titleRight") }}
      </h2>
      <p>{{ $t("waiting.landscape.instruction") }}</p>
      <the-button @click="$router.push('/gamepad')" />
      <footer>
        <img src="../assets/mobile/header.svg" alt="" />
      </footer>
    </template>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { mapWritableState } from "pinia";
import useGlobalStore from "@/store/global";
import PlayerCard from "@/components/ui/PlayerCard.vue";
import TheButton from "@/components/ui/TheButton.vue";

export default {
  components: { PlayerCard, TheButton },
  name: "WaitingView",
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["isLandscape"]),
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize, false);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resize, false);
  },
  methods: {
    resize() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.waiting {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: $mobile-bg-white;
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
