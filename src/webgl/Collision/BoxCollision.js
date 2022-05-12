import {Box3, Matrix4} from "three";

export default class BoxCollision {
    constructor() {
        this._box = new Box3();
        this._box.min.set( - 0.5, - 0.5, - 0.5 );
        this._box.max.set( 0.5, 0.5, 0.5 );
    }

    hit(playerMesh, targetMesh) {
        const transformMatrix = new Matrix4()
            .copy( playerMesh.matrixWorld )
            .invert()
            .multiply( targetMesh.matrixWorld );

        return targetMesh.geometry.boundsTree.intersectsBox( this._box, transformMatrix );
    }
}
