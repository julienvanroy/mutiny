<template>
  <div class="get-pseudo">
    <div class="under">
      <img src="images/background.jpg" />
    </div>
    <div class="over">
      <input v-model="pseudo" :placeholder="placeholder" />
      <span v-if="pseudoNotValid">Pseudo is already taken</span>
      <TheButton label="Choose random" color="light" @click="chooseRandomPseudo()" />
      <TheButton label="Let's go !" color="dark" :disabled="pseudoNotValid" @click="sendPseudo()" />
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { PiratesNames } from "@/data/pirates-name";
import TheButton from "@/components/TheButton.vue";
import { sample } from "@/utils";

export default {
  name: "GetPseudoView",
  components: { TheButton },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      pseudo: "",
      placeholder: "",
      pseudoNotValid: false,
      players: {},
    };
  },
  mounted() {
    this.placeholder = sample(PiratesNames);

    this.colyseus.currentRoom.onMessage("getAllPlayers", (players) => {
      delete players[this.colyseus.currentRoom.sessionId];
      this.players = players;
    });
    this.colyseus.currentRoom.onMessage("addPlayer", () => {
      this.colyseus.sendData("getAllPlayers");
    });
  },
  watch: {
    pseudo(value) {
      // watch input value, if empty, btn is disabled, else check if value is valid
      if ("" !== value) {
        this.pseudo = value;
        this.checkIsPseudoValid(value);
      }
    },
  },
  methods: {
    checkIsPseudoValid(pseudoToCheck) {
      const isValid = !Object.values(this.players).some((player) => player.name === pseudoToCheck);
      if (!isValid) {
        this.pseudoNotValid = true;
      } else {
        this.pseudoNotValid = false;
      }
      return isValid;
    },
    chooseRandomPseudo() {
      let newPseudo = sample(PiratesNames);
      // if pseudo is already used for another player, try another, else, assign pseudo
      if (!this.checkIsPseudoValid(newPseudo)) {
        this.chooseRandomPseudo();
      } else {
        this.pseudo = newPseudo;
      }
    },
    sendPseudo() {
      if ("" === this.pseudo) this.pseudo = this.placeholder;
      this.colyseus.sendData("addPseudo", {
        playerId: this.colyseus.currentRoom.sessionId,
        playerName: this.pseudo,
      });
      this.colyseus.toCurrentRoom();
    },
  },
};
</script>

<style lang="scss" scoped>
.get-pseudo {
  position: relative;
  width: 100%;
  height: 100vh;
  .over {
    position: absolute;
    z-index: 14;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
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
      inset: 0;
    }
  }
  .credits {
    position: absolute;
    z-index: 20;
    bottom: 20px;
    left: 20px;
    a {
      color: $black;
      font-size: $ft-s-small;
      font-weight: $ft-w-medium;
      letter-spacing: 0.01em;
      text-decoration-line: underline;
    }
  }
}
</style>
