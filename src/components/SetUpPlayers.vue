<template>
  <div class="players">
    <h1>{{ $t("setup.playersTitle") }}</h1>
    <div class="placeholder" v-if="colyseus.playersArray.length === 0">
      <p class="placeholder">
        {{ $t("setup.playersPlaceholder1") }}
        <br />
        {{ $t("setup.playersPlaceholder2") }}
      </p>
      <p class="infos">
        {{ $t("setup.infos1") }}
        <strong>{{ $t("setup.infos2") }}</strong>
        {{ $t("setup.infos3") }}
        <strong>{{ $t("setup.infos4") }}</strong>
      </p>
    </div>
    <ul v-if="0 < colyseus.playersArray.length" class="players-list">
      <li class="player" v-for="(n, index) in 8" :key="index">
        <PlayerAdded
          :player="!!colyseus.playersArray[index] ? colyseus.playersArray[index] : ''"
          :isEmpty="!colyseus.playersArray[index]"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import PlayerAdded from "@/components/ui/PlayerAdded";

export default {
  name: "SetUpPlayers",
  components: { PlayerAdded },
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
  padding: 80px 84px 90px 90px;

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
      border-top: 2px solid rgba($purple, 0.2);
      padding-top: 32px;
    }
  }
  &-list {
    height: 320px;
    margin: 30px 0 0 0;
    overflow-y: scroll;
    .player {
      width: 100%;
      list-style: none;
      transition: 0.3s all ease-in-out;
      & + .player {
        border-top: 1px solid #dedcea;
      }
    }
  }
}
</style>
