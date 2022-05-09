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
  },
});

export default useWebglStore;
