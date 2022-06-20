<template>
  <div :class="`credits ${!!isOpen ? 'open' : ''}`">
    <div class="credits__inner">
      <div class="credits__under">
        <img src="images/credits/background.png" />
      </div>
      <div class="credits__over">
        <h1>{{ $t("homepage.credits") }}</h1>
        <p>{{ $t("credits.p") }}</p>
        <h2>{{ $t("credits.thanks") }}</h2>
        <p>{{ $t("credits.pThanks") }}</p>
        <div class="team">
          <ul>
            <li><h2>Développement</h2></li>
            <li>
              <a
                href="https://www.linkedin.com/in/thi-van-an-truong"
                target="_blank"
                >An Truong</a
              >
            </li>
            <li>
              <a href="https://linktr.ee/jujuonelove" target="_blank"
                >Julien Vanroy</a
              >
            </li>
            <li>
              <a href="https://morganesauneuf.com/" target="_blank"
                >Morgane Sauneuf</a
              >
            </li>
          </ul>
          <ul>
            <li><h2>Design</h2></li>
            <li>
              <a
                href="https://www.linkedin.com/in/marie-liesse-de-solages-90038315a"
                target="_blank"
                >Marie-Liesse Prunier-Duparge</a
              >
            </li>
            <li>
              <a href="https://www.instagram.com/vincent_calas/" target="_blank"
                >Vincent Calas</a
              >
            </li>
          </ul>
        </div>
        <TheButton
          :label="$t('modals.modalOptions.btnLabel')"
          color="primary"
          @click="creditsOpen = false"
        />
        <div class="footer">
          <img src="images/credits/footer-left.png" />
          <a href="https://www.gobelins.fr/" target="_blank"
            ><img class="gobelins" src="images/credits/gobelins.png"
          /></a>
          <img src="images/credits/footer-right.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import useGlobalStore from "@/store/global";
import TheButton from "@/components/ui/TheButton.vue";

export default {
  name: "CreditsOverlay",
  components: { TheButton },
  props: {
    isOpen: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["creditsOpen"]),
  },
};
</script>

<style lang="scss" scoped>
.credits {
  position: absolute;
  z-index: 20;
  top: 0;
  right: 0;
  left: -100%;
  bottom: 0;
  width: 100%;
  transition: 0.6s all ease-in-out;
  &.open {
    left: 0;
    transition: 0.6s all ease-in-out;
    backdrop-filter: blur(4px);
  }
  &__inner {
    position: relative;
    width: 65%;
    height: 100%;
  }
  &__over {
    position: absolute;
    z-index: 14;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    h1 {
      font-size: $ft-s-xlarge;
      font-weight: $ft-w-bold;
      margin: 0 0 32px 0;
    }
    h2 {
      font-size: $ft-s-medium;
      font-weight: $ft-w-bold;
      margin: 46px 0 16px 0;
    }
    p {
      max-width: 600px;
    }
    .team {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      ul {
        padding: 0;
        li {
          list-style: none;
          a {
            color: $purple;
            text-decoration: none;
            font-size: $ft-s-xsmall;
            transition: 0.3s color ease-in-out;
            @media (any-hover) {
              &:hover {
                color: $blue;
                transition: 0.3s color ease-in-out;
              }
            }
          }
          & + li {
            margin-top: 8px;
          }
        }
        & + ul {
          margin-left: 100px;
        }
      }
    }
    button {
      margin: 48px 0;
    }
    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 150px;
        &.gobelins {
          width: 80px;
        }
      }
    }
  }

  &__under {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
