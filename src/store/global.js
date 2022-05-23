import { defineStore } from "pinia";

const useGlobalStore = defineStore("webgl", {
    state: () => {
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            showFullscreenBtn: !(/iPhone|iPad|iPod/i.test(navigator.userAgent) || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)),
            isFullscreen: false,
            isLandscape: false,
        };
    },
});

export default useGlobalStore;
