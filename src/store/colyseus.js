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
        hasPlayer(state) {
            return Object.keys(state.player).length !== 0;
        },
        rankedPlayers(state) {
            return [...state.playersArray].sort((a, b) => (a.points < b.points ? 1 : -1));
        },
        roomReadyToPlay(state) {
            return state.playersArray.length > 0 && state.playersArray.every((player) => player.orientationReady);
        },
        playerRanking(state) {
            let rank = state.playersArray.findIndex((p) => p.id === state.player.id);
            let isLast = rank === state.playersArray.length - 1;
            return {
                isWinner: rank === 0 && state.player.points !== 0,
                rank,
                isLast,
            };
        },
        stalkersCount(state) {
            return state.player.target ? JSON.parse(state.player.target).stalkersCount : undefined;
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
            room.onMessage("getAllPlayers", (players) => {
                for (const [key, value] of Object.entries(players)) {
                    const p = this.players.get(key) || {};
                    const values = Object.values(value);

                    Object.keys(value).forEach((k, i) => {
                        p[k] = values[i];
                    });
                    this.players.set(key, p);
                }

                this.playersArray = Object.entries(players)
                    .map(([key, value]) => ({ id: key, ...value }))
                    .filter((p) => !!p.name);

                const player = players[room.sessionId];
                if (player) this.player = player;
            });
        },
        sendData(type, value) {
            this.currentRoom?.send(type, value);
        },
        addPlayer(pseudo) {
            this.sendData("addPlayer", {
                playerId: this.currentRoom.sessionId,
                playerName: pseudo,
                orientationReady: useGlobalStore().isLandscape,
            });
        },
        getPlayer(playerId) {
            this.sendData("getPlayer", playerId);
        },
        getAllPlayers() {
            this.sendData("getAllPlayers");
        },
        updatePlayerTarget(playerId, playerTarget, targetGotStolen = false, onGameStart = false) {
            this.sendData("updatePlayerTarget", {
                playerId,
                playerTarget,
                targetGotStolen,
                onGameStart,
            });
        },
    },
});

export default useColyseusStore;
