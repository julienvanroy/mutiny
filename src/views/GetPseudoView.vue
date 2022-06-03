<template>
  <div class="get-pseudo">
    <div class="get-pseudo__under">
      <img src="images/background-home.png" />
    </div>
    <div class="get-pseudo__over">
      <input v-model="pseudo" :placeholder="placeholder" />
      <span v-if="pseudoNotValid">Pseudo is already taken</span>
      <TheButton label="Choose random" color="tertiary" @click="chooseRandomPseudo()" />
      <TheButton label="Let's go !" color="primary" :disabled="pseudoNotValid" @click="sendPseudo()" />
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { PiratesNames } from "@/data/pirates-name";
import TheButton from "@/components/ui/TheButton.vue";
import { diffArray, sample } from "@/utils";
import router from "@/router";

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
    this.colyseus.sendData("getAllPlayers");

    this.colyseus.currentRoom.onMessage("getAllPlayers", (players) => {
      delete players[this.colyseus.currentRoom.sessionId];
      this.players = players;

      this.placeholder = sample(
        diffArray(
          PiratesNames,
          Object.values(this.players).map(({ name }) => name)
        )
      );
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
      this.colyseus.addPseudo(this.pseudo);
      this.colyseus.addPlayer();
      router.push(`/gamepad`);
    },
  },
};
</script>

<style lang="scss" scoped>
.get-pseudo {
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
    justify-content: center;
    align-items: center;
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
}
</style>
