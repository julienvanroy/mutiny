import bidello from "bidello";
import Experience from "@/webgl/Experience";

export default class Raf {
    constructor() {
        this.time = window.performance.now();

        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.onTick = this.onTick.bind(this);
        this.start();
        this.onTick(this.startTime);

        this.onDebug()
    }

    start() {
        this.startTime = window.performance.now();
        this.oldTime = this.startTime;
        this.isPaused = false;
    }

    pause() {
        this.isPaused = true;
    }

    onTick(now) {
        this.time = now;

        if (!this.isPaused) {
            this.delta = (now - this.oldTime) / 1000;
            this.oldTime = now;

            bidello.trigger({name: "fpsBegin"})

            bidello.trigger(
                {name: "raf"},
                {
                    delta: this.delta,
                    now,
                }
            );

            bidello.trigger({name: "fpsEnd"})
        }

        window.requestAnimationFrame(this.onTick);
    }

    onDebug() {
        const experience = new Experience()
        const debug = experience.debug
        if(!debug.active) return

        const folderDebug = debug.pane.addFolder({
            title: "RAF",
            expanded: false,
        });

        const playPauseDebug = folderDebug.addButton({title: this.isPaused ? "Play" : "Pause"}).on("click", () => {
            if(this.isPaused) this.start()
            else this.pause()
            playPauseDebug.title = this.isPaused ? "Play" : "Pause"
        });
    }
}
