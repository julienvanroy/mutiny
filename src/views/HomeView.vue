<template>
  <button @click="createRoom">Create Room</button>
  <h1>Rooms</h1>
  <button
    v-for="(room, roomIndex) in mainStore.rooms"
    :key="roomIndex"
    @click="joinRoom(room.roomId)"
  >
    Join Room {{ room.roomId }}
  </button>
</template>

<script>
import useColyseusStore from "../store/colyseus";

export default {
  name: "HomeView",
  setup() {
    const mainStore = useColyseusStore();
    return { mainStore };
  },
  mounted() {
    this.mainStore.getRooms("my_room");
  },
  methods: {
    async createRoom() {
      this.mainStore.createRoom("my_room");
    },
    joinRoom(roomId) {
      this.mainStore.joinRoom(roomId);
    },
  },
};
</script>
