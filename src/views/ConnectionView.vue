<template>
  <ModalWaiting />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import ModalWaiting from "@/components/modals/ModalWaiting";
export default {
  name: "ConnectionView",
  components: { ModalWaiting },
  setup() {
    const store = useColyseusStore();
    const route = useRoute();
    onMounted(() => {
      store.joinRoom(route.params.roomId);
    });
  },
};
</script>
