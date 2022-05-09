import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js";
import router from "@/router";
import { sample } from "@/utils";

const useColyseusStore = defineStore("colyseus", {
  state: () => {
    return {
      client: new Colyseus.Client("ws://localhost:2567"),
      rooms: [],
      currentRoom: null,
      lobbyRoom: null,
    };
  },
  getters: {},
  actions: {
    async initLobbyRoom() {
      this.lobbyRoom = await this.client.joinOrCreate("lobby_room");

      this.lobbyRoom.onMessage("rooms", (rooms) => {
        this.rooms = rooms;
      });

      this.lobbyRoom.onMessage("+", ([roomId, room]) => {
        const roomIndex = this.rooms.findIndex(
          (room) => room.roomId === roomId
        );
        if (roomIndex !== -1) {
          this.rooms[roomIndex] = room;
        } else {
          this.rooms.push(room);
        }
      });

      this.lobbyRoom.onMessage("-", (roomId) => {
        this.rooms = this.rooms.filter((room) => room.roomId !== roomId);
      });
    },
    toCurrentRoom() {
      if (this.currentRoom) router.push(`/room/${this.currentRoom.id}`);
    },
    async getRooms(roomName) {
      try {
        const rooms = await this.client.getAvailableRooms(roomName);

        return rooms;
      } catch (e) {
        console.error("get error", e);
      }
    },
    async createRoom(roomName, doJoinRoom = true) {
      try {
        const newRoom = await this.client.create(roomName, {
          autoDispose: doJoinRoom,
        });

        if (doJoinRoom) {
          this.currentRoom = newRoom;
          router.push(`/game#debug`);
        } else {
          newRoom.leave();
          this.currentRoom = null;
        }

        return newRoom;
      } catch (e) {
        console.error("join error", e);
      }
    },
    async joinRoom(roomId = null) {
      try {
        let room;
        if (roomId) room = await this.client.joinById(roomId);
        else room = await this.client.joinById(sample(this.rooms).roomId);

        this.currentRoom = room;
        this.toCurrentRoom();
      } catch (e) {
        console.error("join error", e);
      }
    },
    sendData(type, value) {
      this.currentRoom.send(type, value);
    },
  },
});

export default useColyseusStore;
