<template>
  <div class="homepage">
    <div class="credits">
      <TheButton link="/credits" :label="$t('homepage.credits')" color="tertiary" />
    </div>

    <div class="under">
      <img src="images/background-home.png" />
    </div>
    <div class="over">
      <img src="images/logo.png" />
      <div v-if="!isMobile" class="btn-container">
        <TheButton
          @click="createRoom"
          :label="$t('homepage.createRoom')"
          color="primary"
        />
        <p>
          {{ $t("homepage.homePhraseDesktop") }}
        </p>
      </div>
      <div v-if="!!isMobile" class="btn-container">
        <TheButton
          v-for="(room, roomIndex) in colyseus.rooms"
          :key="roomIndex"
          @click="joinRoom(room.roomId)"
          :label="`Join room ` + room.roomId"
          color="primary"
        />
        <p>
          {{ $t("homepage.homePhraseMobile") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/TheButton.vue";
import { mapState } from "pinia/dist/pinia.esm-browser";
import useGlobalStore from "@/store/global";

export default {
  name: "App",
  components: { TheButton },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
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
