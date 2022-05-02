<template>
  <button @click="createRoom">Create Room</button>
  <h1>Rooms</h1>
  <button
    v-for="(room, roomIndex) in rooms"
    :key="roomIndex"
    @click="joinRoom(room.roomId)"
  >
    Join Room {{ room.roomId }}
  </button>
</template>

<script>
import {
  client,
  getRooms,
  createRoom as create,
  joinRoom as join,
} from "../colyseus";

export default {
  name: "HomeView",
  data() {
    return {
      client: null,
      rooms: [],
    };
  },
  mounted() {
    this.client = client();
  },
  methods: {
    async createRoom() {
      create(this.client, "my_room");
      this.rooms = await getRooms(this.client, "my_room");
    },
    joinRoom(roomId) {
      join(this.client, roomId);
    },
  },
};
</script>
