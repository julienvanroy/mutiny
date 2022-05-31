import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js";
import router from "@/router";
import { mapToArray, sample } from "@/utils";

const useColyseusStore = defineStore("colyseus", {
    state: () => {
        return {
            client: new Colyseus.Client(process.env.VUE_APP_COLYSEUS),
            rooms: [],
            currentRoom: null,
            lobbyRoom: null,
            players: {},
            playerName: "",
            playerColor: "",
            playerPoints: 0,
            playerTarget: {},
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

                newRoom.onStateChange((state) => this.updatePlayers(state.players.$items));

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

                room.onStateChange((state) => this.updateCurrentPlayer(state.players.$items, room.sessionId));

                this.currentRoom = room;

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
            this.playerPoints = this.player.points;
            this.playerName = this.player.name;
            this.playerColor = this.player.color;
            if (this.player.target) {
                console.log(this.player.target);
                this.playerTarget = JSON.parse(this.player.target);
            }
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
            this.sendData("addPlayer", { playerId: this.currentRoom.sessionId });
        },
        getPlayer(playerId) {
            this.sendData("getPlayer", playerId);
        },
        getAllPlayers() {
            this.sendData("getAllPlayers");
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
