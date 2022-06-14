<template>
  <div class="homepage">
    <div class="credits">
      <TheButton
        :label="$t('homepage.credits')"
        color="tertiary"
        @click="creditsOpen = true"
      />
    </div>

    <div class="homepage__under">
      <img src="images/background-home.png" />
    </div>
    <div class="homepage__over">
      <img src="images/logo.png" />
      <div class="btn-container">
        <TheButton
          @click="createRoom"
          :label="$t('homepage.createRoom')"
          color="primary"
        />
        <p>
          {{ $t("homepage.homePhraseDesktop") }}
        </p>
        <div class="infos">
          <div>
            <img src="images/icons/players.png" />
            <span>{{ $t("homepage.infosPlayers") }}</span>
          </div>
          <div>
            <img src="images/icons/equipments.png" />
            <span>
              {{ $t("homepage.infosEquipments1") }}
              <br />
              {{ $t("homepage.infosEquipments2") }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CreditsOverlay :isOpen="creditsOpen" />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { mapWritableState } from "pinia";
import useGlobalStore from "@/store/global";
import TheButton from "@/components/ui/TheButton.vue";
import CreditsOverlay from "@/components/CreditsOverlay";

export default {
  name: "HomeViewDesktop",
  components: { TheButton, CreditsOverlay },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      roomId: "",
    };
  },
  mounted() {
    this.colyseus.initLobbyRoom();
  },
  methods: {
    createRoom(doJoinRoom = true) {
      this.colyseus.createRoom("play_room", doJoinRoom);
    },
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["creditsOpen"]),
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
        font-weight: $ft-w-bold;
        text-align: center;
        margin-top: 30px;
      }
      .infos {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 64px;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 30px;
            margin-right: 16px;
          }
          span {
            color: $white;
            font-size: $ft-s-xsmall;
            text-align: center;
          }
          &:first-of-type {
            padding-right: 32px;
          }
          & + div {
            padding-left: 32px;
            border-left: 2px solid $white;
          }
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
}
</style>