<template>
  <div class="get-pseudo">
    <header>
      <img src="../assets/mobile/header-w-logo.svg" alt="" />
    </header>
    <h2>{{ $t("getPseudo.title") }}</h2>
    <div class="get-pseudo__content">
      <TheInput v-model="pseudo" :placeholder="placeholder" :width="236" :height="48" :maxlength="18" center />
      <span v-if="pseudoNotValid">{{ $t("getPseudo.error") }}</span>
      <TheButton
        :label="$t('getPseudo.ctaRandom')"
        icon="images/icons/random.svg"
        color="tertiary"
        @click="chooseRandomPseudo()"
      />
    </div>
    <TheButton :label="$t('getPseudo.cta')" color="primary" :disabled="pseudoNotValid" @click="sendPseudo()" />
    <footer>
      <img src="../assets/mobile/header.svg" alt="" />
    </footer>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { PiratesNames } from "@/data/pirates-name";
import TheButton from "@/components/ui/TheButton.vue";
import { diffArray, sample } from "@/utils";
import router from "@/router";
import TheInput from "@/components/ui/TheInput.vue";

export default {
  name: "GetPseudoView",
  components: { TheButton, TheInput },
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
      router.push(`/waiting`);
    },
  },
};
</script>

<style lang="scss" scoped>
.get-pseudo {
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

  h2 {
    font-weight: $ft-w-bold;
    font-size: 30px;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > span {
      margin-top: -16px;
      font-size: 12px;
    }

    .the-input {
      margin: 32px 0;
    }

    .btn.btn-tertiary {
      width: 192px;
      padding: 10px 5px;
    }
  }

  .btn.btn-primary {
    width: 243px;
    padding: 0 54px;
    span {
      font-size: 20px;
    }
  }

  @media (orientation: landscape) {
    &__content {
      margin-bottom: 16px;

      .the-input {
        margin: 16px 0;
      }
    }
    h2 {
      font-size: 18px;
    }

    footer {
      display: none;
      visibility: hidden;
    }
  }
}
</style>
