<template>
  <div class="modal-waiting">WAITING...</div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import {onMounted} from "vue";
import {useRoute} from "vue-router";

export default {
  name: "ConnectionView",
  setup() {
    const store = useColyseusStore()
    const route = useRoute()

    onMounted(() => {
      store.joinRoom(route.params.roomId)
    })

  }
};
</script>

<style lang="scss" scoped>
.modal-waiting {
  position: absolute;
  z-index: 16;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $black;
  color: $white;
  font-weight: $ft-w-bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
