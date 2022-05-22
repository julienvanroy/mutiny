<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "LocaleChanger"
}
</script>

<style scoped>
.locale-changer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
}
</style>
