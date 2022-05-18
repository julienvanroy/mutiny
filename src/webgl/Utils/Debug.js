import { Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { component } from "bidello";

export default class Debug extends component() {
  init() {
    this.active = process.env.VUE_APP_DEBUG === 'true';

    if(this.active) {
      this.pane = new Pane({
        title: "Parameters",
        expanded: true,
      });
      this.pane.registerPlugin(EssentialsPlugin);

      this._fpsGraph = this.pane.addBlade({
        view: "fpsgraph",
        label: "fpsgraph",
      });

      this.pane.addSeparator();

      this._setupImport();
      this._setupExport();
    }
  }

  onFpsBegin() {
    this.active && this._fpsGraph?.begin();
  }

  onFpsEnd() {
    this.active && this._fpsGraph?.end();
  }

  _setupImport() {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "application/JSON";
    input.style.display = "none";

    document.body.appendChild(input);

    input.addEventListener("change", this._importDataFile.bind(this, input));

    this.pane.addButton({ title: "Import" }).on("click", () => {
      input.value = "";
      input.click();
    });
  }

  _setupExport() {
    this.pane.addButton({ title: "Export" }).on("click", () => {
      const a = document.createElement("a");
      const json = JSON.stringify(this.pane.exportPreset(), null, 2);
      const file = new Blob([json], { type: "text/plain" });

      a.href = URL.createObjectURL(file);
      a.download = "config.json";

      a.click();
    });
  }

  _importDataFile(input) {
    if (input.files.length === 0) {
      return;
    }

    const fileReader = new FileReader();
    const onload = () => {
      const parsedJSON = JSON.parse(fileReader.result || "");
      this.pane.importPreset(parsedJSON);
    };

    fileReader.onload = onload.bind(this);
    fileReader.readAsText(input.files[0]);
  }
}
