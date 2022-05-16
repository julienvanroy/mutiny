<template>
  <div class="homepage">
    <div class="credits">
      <router-link to="/credits">Credits</router-link>
    </div>

    <div class="under">
      <img src="images/homepage/homepage-back.jpg" />
    </div>
    <div class="over">
      <div class="container">
        <h1 class="logo">Titre provisoire</h1>
        <div class="btn-container">
          <TheButton
            @click="createRoom"
            label="Créer une partie"
            color="dark"
          />
          <TheButton
            label="Streamer une partie"
            color="light"
            :disabled="true"
          />
        </div>
        <div class="how-to-play">
          <p>
            Un téléphone par moussaillon est requis pour contrôler votre
            personnage
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { PiratesNames } from "@/data/pirates-name";
import TheButton from "@/components/TheButton.vue";

export default {
  name: "App",
  components: { TheButton },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  mounted() {
    this.colyseus.initLobbyRoom();
  },
  methods: {
    createRoom(doJoinRoom = true) {
      this.colyseus.createRoom("play_room", doJoinRoom);
    },
    joinRoom(roomId) {
      // TODO in the futur : get user pseudo from input (if not, set random pseudo)
      // TODO check if random pseudo is already used for another player
      const playerName =
        PiratesNames[Math.floor(Math.random() * PiratesNames.length)];
      this.colyseus.joinRoom(roomId, playerName);
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
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      color: $white;
      text-align: center;
    }
    .btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 80px 0;
      .btn + .btn {
        margin-left: 20px;
      }
    }
    .how-to-play {
      max-width: 380px;
      margin: auto;
      p {
        font-size: 18px;
        text-align: center;
      }
    }
  }
  .under {
    position: relative;
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
      inset: 0;
    }
  }
  .credits {
    position: absolute;
    z-index: 10;
    bottom: 20px;
    left: 20px;
    a {
      color: $black;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.01em;
      text-decoration-line: underline;
    }
  }
}
</style>
