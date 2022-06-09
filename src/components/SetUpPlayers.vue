<template>
  <div class="players">
    <h1>{{ $t("setup.playersTitle") }}</h1>
    <div class="placeholder" v-if="!colyseus.players.length">
      <p class="placeholder" v-html="$t('setup.playersPlaceholder')" />
      <p class="infos" v-html="$t('setup.infos')" />
    </div>
    <ul v-if="0 < colyseus.players.length">
      <li class="player" v-for="player in colyseus.players" :key="player.id">
        <div class="player__infos">
          <img :src="`images/players/${player.color}.png`" />
          <span>{{ player.name }}</span>
        </div>
        <div class="player__state">
          <img src="images/icons/valid.png" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";

export default {
  name: "SetUpPlayers",
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
};
</script>

<style lang="scss" scoped>
.players {
  width: 100%;
  background-image: url("../assets/setup/player-board.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 70px 100px 100px;
  h1 {
    margin: 0;
    text-align: center;
    font-weight: $ft-w-bold;
  }
  .placeholder {
    min-height: 280px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: $ft-s-small;
    .placeholder {
      color: rgba($purple, 0.4);
    }
    .infos {
      border-top: 2px solid $purple;
      padding-top: 32px;
    }
  }
  ul {
    height: 320px;
    padding: 0;
    margin: 0;
    overflow-y: scroll;
    .player {
      width: 100%;
      list-style: none;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      &__infos {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 30px;
        }
        span {
          font-weight: $ft-w-bold;
          margin-left: 16px;
        }
      }
      &__state {
        img {
          width: 30px;
        }
      }
    }
  }
}
</style>
