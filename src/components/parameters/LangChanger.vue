<template>
  <div class="lang-changer">
    <div
      class="radio"
      v-for="locale in $i18n.availableLocales"
      :key="`locale-${locale}`"
    >
      <input type="radio" :id="locale" name="lang" :value="locale" :checked="$i18n.locale === locale" v-model="$i18n.locale"/>
      <label :for="locale">{{ "en" === locale ? $t('lang.en') : $t('lang.fr') }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "LangChanger",
};
</script>

<style lang="scss" scoped>
.lang-changer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .radio {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    label {
      font-size: $ft-s-small;
      margin-left: 20px;
      @media (any-hover: hover) {
        &:hover {
          cursor: pointer;
        }
      }
    }
    input[type="radio"] {
      position: relative;
      width: 21px;
      height: 24px;
      &:before {
        content: "";
        display: block;
        width: 32px;
        height: 32px;
        background-color: #FEF4F3;
        background-image: url("../../assets/parameters/button-off.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform-origin: center;
        transition: 0.3s all ease-in-out;
      }
      @media (any-hover: hover) {
        &:hover {
          cursor: pointer;
        }
      }
      &:checked {
        &:before {
          background-image: url("../../assets/parameters/button.png");
          transition: 0.3s all ease-in-out;
        }
        & + label {
          color: $blue;
          font-weight: $ft-w-bold;
        }
      }
    }
  }
}
</style>
