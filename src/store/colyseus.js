import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js";
import router from "@/router";

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
    toCurrentRoom() {
      if (this.currentRoom) router.push(`/room/${this.currentRoom.id}`);
    },
    async getRooms(roomName) {
      try {
        this.rooms = await this.client.getAvailableRooms(roomName);
      } catch (e) {
        console.error("get error", e);
      }
    },
    async createRoom(roomName, doJoinRoom = true) {
      try {
        this.currentRoom = await this.client.create(roomName, {
          autoDispose: doJoinRoom,
        });
        this.getRooms(roomName);

        if (doJoinRoom) {
          this.toCurrentRoom();
        } else {
          this.currentRoom.leave();
          this.currentRoom = null;
        }
      } catch (e) {
        console.error("join error", e);
      }
    },
    async joinRoom(roomId) {
      try {
        const room = await this.client.joinById(roomId);

        this.currentRoom = room;
        this.toCurrentRoom();
      } catch (e) {
        console.error("join error", e);
      }
    },
  },
});

export default useColyseusStore;
