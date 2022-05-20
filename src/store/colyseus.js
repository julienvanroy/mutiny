import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js";
import router from "@/router";
import { mapToArray, sample } from "@/utils";
import { PiratesNames } from "@/data/pirates-name";

const useColyseusStore = defineStore("colyseus", {
    state: () => {
        return {
            client: new Colyseus.Client(process.env.VUE_APP_COLYSEUS),
            rooms: [],
            currentRoom: null,
            lobbyRoom: null,
            players: {},
            player: {},
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
                const roomIndex = this.rooms.findIndex((room) => room.roomId === roomId);
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
                    router.push("/setup");
                } else {
                    newRoom.leave();
                    this.currentRoom = null;
                }

                newRoom.onStateChange((state) => this.updatePlayers(state.players.$items));

                return newRoom;
            } catch (e) {
                console.error("join error", e);
            }
        },
        async joinRoom(roomId = null) {
            try {
                // TODO in the futur : get user pseudo from input (if not, set random pseudo)
                // TODO check if random pseudo is already used for another player
                const playerName = PiratesNames[Math.floor(Math.random() * PiratesNames.length)];

                let room;
                if (roomId) room = await this.client.joinById(roomId, { name: playerName });
                else room = await this.client.joinById(sample(this.rooms).roomId, { name: playerName });

                room.onStateChange((state) => this.updateCurrentPlayer(state.players.$items, room.sessionId));

                this.currentRoom = room;

                this.sendData("addPlayer", { playerId: this.currentRoom.sessionId, playerName });

                router.push(`/get-pseudo`);
            } catch (e) {
                console.error("join error", e);
            }
        },
        updatePlayers(players) {
            this.players = mapToArray(players, true).filter((p) => !!p.name);
        },
        updateCurrentPlayer(players, playerId) {
            this.player = players.get(playerId);
        },
        sendData(type, value) {
            this.currentRoom.send(type, value);
        },
        getPlayer(playerId) {
            this.sendData("getPlayer", playerId);
        },
        updatePlayerTarget(playerId, playerTarget) {
            this.sendData("updatePlayerTarget", {
                playerId,
                playerTarget,
            });
        },
    },
});

export default useColyseusStore;
