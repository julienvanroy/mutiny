import { defineStore } from "pinia";

const useWebglStore = defineStore("webgl", {
  state: () => {
    return {
      xp: null,
    };
  },
  getters: {},
  actions: {},
});

export default useWebglStore;
