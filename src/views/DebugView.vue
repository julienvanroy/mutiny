<template>
  <div></div>
</template>

<script>
import bidello from "bidello";

export default {
  name: 'DebugView',
  mounted() {
    bidello.trigger({ name: "start" });
  }
}
</script>

<style lang="scss" scoped></style>
