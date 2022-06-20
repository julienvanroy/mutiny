<template>
  <div class="connection">
    <h2>{{ $t("setup.codeTitle") }}</h2>
    <div class="connection__inner">
      <div class="code"><CopyCode :code="colyseus.currentRoom.id" /></div>
      <div class="qrcode" @click="() => (modalShown = 'qrcode')">
        <QrCode />
      </div>
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import CopyCode from "@/components/ui/CopyCode";
import QrCode from "@/components/ui/QrCode";
import { mapWritableState } from "pinia";
import useGlobalStore from "@/store/global";

export default {
  name: "SetUpConnection",
  components: {
    CopyCode,
    QrCode,
  },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
    computed: {
    ...mapWritableState(useGlobalStore, ["modalShown"])
  },
};
</script>

<style lang="scss" scoped>
.connection {
  background-image: url("../assets/setup/connection.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 20px 30px;
  height: 160px;
  width: 100%;
  max-width: 380px;
  margin: 20px auto 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  h2 {
    font-size: $ft-s-small;
    font-weight: $ft-w-bold;
    color: $white;
    text-align: center;
  }
  &__inner {
    display: flex;
    justify-content: center;
    align-items: center;
    .code {
      padding-right: 20px;
    }
    .qrcode {
      display: flex;
      justify-content: center;
      padding-left: 20px;
      background-color: $white;
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 4px;

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 60px;
      }
      @media (any-hover: hover) {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
