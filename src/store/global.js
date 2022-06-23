import { defineStore } from "pinia";
import {stringToBoolean} from "@/utils";

const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            isDebug: stringToBoolean(process.env.VUE_APP_DEBUG),
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            showFullscreenBtn: !(/iPhone|iPad|iPod/i.test(navigator.userAgent) || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)),
            isFullscreen: false,
            isLandscape: true,
            modalShown: null,
            creditsOpen: false
        };
    },
});

export default useGlobalStore;
