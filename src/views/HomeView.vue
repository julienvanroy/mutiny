<template>
  <div class="homepage">
    <div class="credits">
      <router-link to="/credits">Credits</router-link>
    </div>

    <div class="under">
      <img src="images/background.jpg" />
    </div>
    <div class="over">
      <img src="images/logo.png" />
      <div v-if="!isMobile" class="btn-container">
        <TheButton @click="createRoom" label="Créer une partie" color="dark" />
        <TheButton label="Streamer une partie" color="light" :disabled="true" />
      </div>
      <div v-if="!!isMobile" class="btn-container">
        <TheButton
          v-for="(room, roomIndex) in colyseus.rooms"
          :key="roomIndex"
          @click="joinRoom(room.roomId)"
          :label="`Join room ` + room.roomId"
          color="light"
        />
      </div>
      <div class="how-to-play">
        <p>
          {{
            !!isMobile
              ? "Rejoignez une partie depuis le jeu sur ordinateur."
              : "Un téléphone par moussaillon est requis pour contrôler votre personnage"
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import TheButton from "@/components/TheButton.vue";
import {mapState} from "pinia/dist/pinia.esm-browser";
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
    justify-content: center;
    align-items: center;
    img {
      width: 380px;
      @media #{$mq-small} {
        width: 560px;
      }
    }
    .btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 40px 0;
      .btn + .btn {
        margin-left: 20px;
      }
    }
    .how-to-play {
      max-width: 380px;
      p {
        font-size: $ft-s-small;
        text-align: center;
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
  .credits {
    position: absolute;
    z-index: 20;
    bottom: 20px;
    left: 20px;
    a {
      color: $purple;
      font-size: $ft-s-small;
      font-weight: $ft-w-medium;
      letter-spacing: 0.01em;
      text-decoration-line: underline;
    }
  }
}
</style>
