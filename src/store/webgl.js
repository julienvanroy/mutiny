import { defineStore } from "pinia";

const useWebglStore = defineStore("webgl", {
  state: () => {
    return {
      experience: null,
    };
  },
  getters: {},
  actions: {},
});

export default useWebglStore;
