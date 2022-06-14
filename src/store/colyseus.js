import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js";
import router from "@/router";
import { sample } from "@/utils";
import useGlobalStore from "./global";

const useColyseusStore = defineStore("colyseus", {
    state: () => ({
        client: new Colyseus.Client(process.env.VUE_APP_COLYSEUS),
        rooms: [],
        currentRoom: null,
        lobbyRoom: null,
        players: new Map(),
        player: {},
        playersArray: [],
    }),
    getters: {
        rankedPlayers(state) {
            return [...state.players].sort((a, b) => (a.points < b.points ? 1 : -1));
        },
        roomReadyToPlay(state) {
            return state.playersArray.length > 0 && state.playersArray.every((player) => player.orientationReady);
        },
    },
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
        async getRooms(roomName) {
            try {
                return await this.client.getAvailableRooms(roomName);
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

                this.updatePlayers(newRoom);

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

                this.updatePlayers(room);

                this.currentRoom = room;

                router.push(`/get-pseudo`);
            } catch (e) {
                console.error("join error", e);
            }
        },
        updatePlayers(room) {
            room.state.players.onAdd = (player, key) => {
                this.players[key] = {};

                player.onChange = (changes) => {
                    changes.forEach((change) => {
                        if (key === room.sessionId) {
                            this.player[change.field] = change.value;
                        }
                        if (this.players[key]) this.players[key][change.field] = change.value;
                    });
                    this.playersArray = Object.values(this.players).filter((p) => !!p.name);
                };
            };
        },
        sendData(type, value) {
            this.currentRoom.send(type, value);
        },
        addPseudo(pseudo) {
            this.sendData("addPseudo", {
                playerId: this.currentRoom.sessionId,
                playerName: pseudo,
            });
        },
        addPlayer() {
            this.sendData("addPlayer", {
                playerId: this.currentRoom.sessionId,
                orientationReady: useGlobalStore().isLandscape,
            });
        },
        getPlayer(playerId) {
            this.sendData("getPlayer", playerId);
        },
        getAllPlayers() {
            this.sendData("getAllPlayers");
        },
        updatePlayerTarget(playerId, playerTarget, onGameStart = false) {
            this.sendData("updatePlayerTarget", {
                playerId,
                playerTarget,
                onGameStart,
            });
        },
    },
});

export default useColyseusStore;
