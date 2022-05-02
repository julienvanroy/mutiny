import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

const client = () => new Colyseus.Client("ws://localhost:2567");

const getRooms = async (client, roomName) => {
  try {
    const rooms = await client.getAvailableRooms(roomName);
    return rooms;
  } catch (e) {
    console.error("get error", e);
  }
};

const createRoom = async (client, roomName) => {
  try {
    const room = await client.create(roomName, {
      /* options */
    });
    console.log("joined successfully", room);
  } catch (e) {
    console.error("join error", e);
  }
};

const joinRoom = async (client, roomId) => {
  try {
    const room = await client.joinById(roomId, {
      /* options */
    });
    console.log("joined successfully", room);
  } catch (e) {
    console.error("join error", e);
  }
};

export { client, getRooms, createRoom, joinRoom };
