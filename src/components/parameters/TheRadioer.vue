<template>
  <div :class="`radioer ${label}`">
    <p class="subtitle" v-if="!!subtitle">{{ subtitle }}</p>
    <div class="radios">
      <div class="radio" v-for="(value, idx) in values" :key="`val-${idx}`">
        <input
          type="radio"
          :id="label + value"
          :name="label"
          :value="value"
          :defaultChecked="defaultValue === value"
        />
        <label :for="label + value">{{ value }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheRadioer",
  props: {
    label: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    values: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.radioer {
  .subtitle {
    font-size: $ft-s-small;
  }
  .radios {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    .radio {
      position: relative;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      input[type="radio"] {
        position: relative;
        width: 21px;
        height: 24px;
        &:before {
          content: "";
          display: block;
          width: 21px;
          height: 24px;
          background-color: #FEF4F3;
          background-image: url("../../assets/parameters/radio.png");
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
            background-image: url("../../assets/parameters/radio-checked.png");
            transform: scale(1.5);
            transition: 0.3s all ease-in-out;
          }
        }
      }
      label {
        font-size: $ft-s-xsmall;
        margin-top: 10px;
        @media (any-hover: hover) {
          &:hover {
            cursor: pointer;
          }
        }
      }
      & + .radio {
        margin-left: 60px;
        input[type="radio"] {
          &:after {
            content: "";
            width: 80px;
            height: 2px;
            background-color: #dec5cc;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(-114%, -50%);
          }
        }
      }
    }
  }
}
</style>