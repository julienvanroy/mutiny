<template>
  <button @click="createRoom">Create Room And Join</button>
  <button @click="createRoom(false)">Simply Create A Room</button>
  <h1>Rooms</h1>
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

export default {
  name: "HomeView",
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
      this.colyseus.joinRoom(roomId);
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
