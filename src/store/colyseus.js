import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

const useColyseusStore = defineStore("colyseus", {
  state: () => {
    return {
      client: new Colyseus.Client("ws://localhost:2567"),
      rooms: [],
      currentRoom: null,
    };
  },
  getters: {},
  actions: {
    async getRooms(roomName) {
      try {
        this.rooms = await this.client.getAvailableRooms(roomName);
      } catch (e) {
        console.error("get error", e);
      }
    },
    async createRoom(roomName) {
      try {
        const room = await this.client.create(roomName);
        this.currentRoom = room;
        this.getRooms(roomName);
        console.log("joined successfully", room);
      } catch (e) {
        console.error("join error", e);
      }
    },
    async joinRoom(roomId) {
      try {
        const room = await this.client.joinById(roomId);
        this.currentRoom = room;
        console.log("joined successfully", room);
      } catch (e) {
        console.error("join error", e);
      }
    },
  },
});

export default useColyseusStore;
