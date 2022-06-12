import { Vector3, Box3 } from 'three'

export default function getSize (mesh) {
    const target = new Vector3()

    new Box3().setFromObject(mesh).getSize(target)

    return target
}
