<template>
  <img v-if="src" :src="src" alt="Qr Code Room"/>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import QRCode from "qrcode";
import {onMounted, ref} from "vue";

export default {
  name: "QrCode",
  setup() {
    const colyseus = useColyseusStore();
    const sessionId = colyseus.currentRoom.sessionId
    const src = ref(null)

    onMounted(() => {
      QRCode.toDataURL(`${location.protocol}//${location.host}/room/${sessionId}`)
          .then(url => {
            src.value = url
          })
          .catch(err => {
            console.error(err)
          })
    });

    return {src};
  },
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
