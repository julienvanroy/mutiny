import { defineStore } from "pinia";

const useWebglStore = defineStore("webgl", {
  state: () => {
    return {
      experience: null,
    };
  },
  getters: {},
  actions: {
    addPlayer(playerId) {
      this.experience.world.addPlayer(playerId);
    },
    movePlayer(playerId, vector) {
      this.experience.world.players[playerId].vectorControls = vector
    }
  },
});

export default useWebglStore;
