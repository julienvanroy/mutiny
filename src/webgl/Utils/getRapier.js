import RAPIER from "@dimforge/rapier3d-compat";

export function getRapier() {
    return RAPIER.init().then(() => RAPIER);
}
