import { defineStore } from 'pinia';

const useColyseusStore = defineStore('webgl', {
  state: () => {
    return {
      experience: null,
    };
  },
  getters: {},
  actions: {},
});

export default useColyseusStore;
