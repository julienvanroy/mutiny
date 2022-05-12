<template>
  <h1>Rooms</h1>
  <button @click="createRoom">Create Room And Join</button>
  <button @click="createRoom(false)">Simply Create A Room</button>
  <button @click="joinRandomRoom">Join random room</button>
  <button
    v-for="(room, roomIndex) in colyseus.rooms"
    :key="roomIndex"
    @click="joinRoom(room.roomId)"
  >
    Join {{ room.name === "lobby_room" ? "Lobby" : "" }} Room
    {{ room.roomId }}
  </button>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { PiratesNames } from "@/data/pirates-name";

export default {
  name: "ConnectionView",
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  mounted() {
    this.colyseus.initLobbyRoom();
  },
  methods: {
    createRoom(doJoinRoom = true) {
      this.colyseus.createRoom("play_room", doJoinRoom);
    },
    joinRoom(roomId) {
      // TODO in the futur : get user pseudo from input (if not, set random pseudo) and check if random pseudo is already used for another player
      const playerName = PiratesNames[Math.floor(Math.random() * PiratesNames.length)];
      this.colyseus.joinRoom(roomId, playerName);
    },
    joinRandomRoom() {
      this.colyseus.joinRoom();
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  display: block;
  margin: 8px auto;
}
</style>
