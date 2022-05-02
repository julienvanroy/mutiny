<template>
  <button @click="createRoom">Create Room And Join</button>
  <button @click="createRoom(false)">Simply Create A Room</button>
  <h1>Rooms</h1>
  <button
    v-for="(room, roomIndex) in colyseus.rooms"
    :key="roomIndex"
    @click="joinRoom(room.roomId)"
  >
    Join Room {{ room.roomId }}
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
    this.colyseus.getRooms("my_room");
  },
  methods: {
    createRoom(doEnterRoom = true) {
      this.colyseus.createRoom("my_room", doEnterRoom);
    },
    joinRoom(roomId) {
      this.colyseus.joinRoom(roomId);
    },
  },
};
</script>
