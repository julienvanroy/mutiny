<template>
  <div class="homepage">
    <div class="credits">
      <TheButton
        :label="$t('homepage.credits')"
        color="tertiary"
        @click="creditsOpen = true"
      />
    </div>

    <div class="homepage__under">
      <img src="images/home/16_ciel.jpg" />
      <img class="parallax" data-parallax="1" src="images/home/15_brume.png" />
      <img
        class="parallax"
        data-parallax="-1"
        src="images/home/14_nuages.png"
      />
      <img
        class="parallax"
        data-parallax="1.5"
        src="images/home/13_nuages.png"
      />
      <img class="parallax" data-parallax="-2" src="images/home/12_mer.png" />
      <img
        class="parallax"
        data-parallax="2.5"
        src="images/home/11_bateau.png"
      />
      <img
        class="parallax"
        data-parallax="2"
        src="images/home/10_cible_ombre.png"
      />
      <img
        class="parallax"
        data-parallax="2.5"
        src="images/home/09_cible.png"
      />
      <img
        class="parallax"
        data-parallax="2.5"
        src="images/home/08_barriere.png"
      />
      <img
        class="parallax"
        data-parallax="3"
        src="images/home/07_cordage.png"
      />
      <img
        class="parallax"
        data-parallax="3"
        src="images/home/06_cordage.png"
      />
      <img class="parallax" data-parallax="3.5" src="images/home/05_mat.png" />
      <img
        class="parallax"
        data-parallax="-4"
        src="images/home/04_bateau.png"
      />
      <img class="parallax" data-parallax="-5" src="images/home/03_perso.png" />
      <img
        class="parallax voile"
        data-parallax="-4.5"
        src="images/home/02_voile.png"
      />

      <img
        class="parallax mat"
        data-parallax="-5.5"
        src="images/home/01_mat.png"
      />
    </div>
    <transition name="fade">
      <div v-if="!!isMounted" class="homepage__over">
        <img src="images/logo.png" />
        <TheButton
          @click="createRoom"
          :label="$t('homepage.createRoom')"
          color="primary"
        />
        <div class="infos">
          <div>
            <IconPlayers color="#FDEAD7" />
            <span>{{ $t("homepage.infosPlayers") }}</span>
          </div>
          <div>
            <IconEquipment color="#FDEAD7" />
            <span>
              {{ $t("homepage.infosEquipments1") }}
              {{ $t("homepage.infosEquipments2") }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <CreditsOverlay :isOpen="creditsOpen" />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import { mapWritableState } from "pinia";
import useGlobalStore from "@/store/global";
import TheButton from "@/components/ui/TheButton.vue";
import CreditsOverlay from "@/components/CreditsOverlay";
import IconPlayers from "@/components/svg/IconPlayers";
import IconEquipment from "@/components/svg/IconEquipment";

export default {
  name: "HomeViewDesktop",
  components: { TheButton, CreditsOverlay, IconPlayers, IconEquipment },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      roomId: "",
      isMounted: false,
    };
  },
  mounted() {
    this.colyseus.initLobbyRoom();
    document.addEventListener("mousemove", (e) => this.parallax(e));

    this.isMounted = true;
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", (e) => this.parallax(e));
  },
  methods: {
    createRoom(doJoinRoom = true) {
      this.colyseus.createRoom("play_room", doJoinRoom);
    },
    parallax(e) {
      document.querySelectorAll(".parallax").forEach((shift) => {
        const position = shift.getAttribute("data-parallax");
        const x = (window.innerWidth - e.pageX * position) / 100;
        const y = (window.innerHeight - e.pageY * position) / 100;
        shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    },
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["creditsOpen"]),
  },
};
</script>

<style lang="scss" scoped>
.homepage {
  position: relative;
  width: 100%;
  height: 100vh;
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
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 24px;
    img {
      width: 380px;
      @media #{$mq-small} {
        width: 560px;
      }
      margin-bottom: 140px;
    }
    .btn {
      margin-bottom: 100px;
      min-height: 80px;
      padding: 10px 40px;
      font-size: $ft-s-medium;
    }
    .infos {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 32px;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          margin-right: 16px;
        }
        span {
          color: $white;
          font-size: $ft-s-xsmall;
          text-align: center;
        }
        &:first-of-type {
          padding-right: 32px;
          border-right: 1px solid $white;
          svg {
            width: 36px;
          }
        }
        &:last-of-type {
          svg {
            width: 30px;
          }
        }
        & + div {
          padding-left: 32px;
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
    pointer-events: none;
    img {
      position: absolute;
      top: -6%;
      left: -8%;
      right: 0;
      bottom: 0;
      width: 110%;
      height: 106%;
      pointer-events: none;
    }
    .parallax {
      transform-origin: center;
      will-change: transform;
    }
    .voile {
      top: -10%;
    }
    .mat {
      left: -16%;
    }
  }
  .credits {
    position: absolute;
    z-index: 20;
    bottom: 20px;
    left: 20px;
    a {
      color: $purple;
      font-size: $ft-s-small;
      font-weight: $ft-w-regular;
      letter-spacing: 0.01em;
      text-decoration-line: underline;
    }
  }
}
</style>