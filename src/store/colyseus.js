import { defineStore } from "pinia";
import * as Colyseus from "colyseus.js";
import router from "@/router";
import { mapToArray, sample } from "@/utils";
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
            const sortedPlayers = [...state.playersArray].sort((a, b) => (a.points < b.points ? 1 : -1));
            const lastPlayers = sortedPlayers.filter(
                (player) => player.points === sortedPlayers[sortedPlayers.length - 1].points
            );
            const firstPlayers = sortedPlayers.filter((player) => player.points === sortedPlayers[0].points);

            return sortedPlayers.map((player) => ({
                ...player,
                isLast: player.points === 0 || lastPlayers.find((p) => p.id === player.id),
                isFirst: player.points !== 0 && firstPlayers.find((p) => p.id === player.id),
            }));
        },
        roomReadyToPlay(state) {
            return state.playersArray.length > 0 && state.playersArray.every((player) => player.orientationReady);
        },
        playerRanking(state) {
            let rankedPlayers = this.rankedPlayers;
            let rank = rankedPlayers.findIndex((p) => p.id === state.player.id);

            return {
                rank: rank,
                isWinner: rankedPlayers.find((p) => p.id === state.player.id).isFirst,
                isLast: rankedPlayers.find((p) => p.id === state.player.id).isLast,
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
                this.players = new Map(Object.entries(players));
                this.playersArray = mapToArray(this.players, true).filter((p) => !!p.name);

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
        updatePlayerTarget(playerId, playerTarget, playerStealer = false, onGameStart = false) {
            this.sendData("updatePlayerTarget", {
                playerId,
                playerTarget,
                playerStealer,
                onGameStart,
            });
        },
    },
});

export default useColyseusStore;
