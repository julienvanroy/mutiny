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
    const src = ref(null)


    onMounted(() => {
      const id = colyseus.currentRoom.id
      QRCode.toDataURL(`${location.protocol}//${location.host}/room/${id}`)
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
  border-radius: 4px;
}
</style>
