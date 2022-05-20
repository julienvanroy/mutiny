export default [
    {
        name: "environmentMapTexture",
        type: "cubeTexture",
        path: [
            "textures/environmentMap/px.jpg",
            "textures/environmentMap/nx.jpg",
            "textures/environmentMap/py.jpg",
            "textures/environmentMap/ny.jpg",
            "textures/environmentMap/pz.jpg",
            "textures/environmentMap/nz.jpg",
        ],
    },
    {
        name: "grassColorTexture",
        type: "texture",
        path: "textures/dirt/color.jpg",
    },
    {
        name: "grassNormalTexture",
        type: "texture",
        path: "textures/dirt/normal.jpg",
    },
    {
        name: "mapModel",
        type: "gltfModel",
        path: "models/Map/hextile.glb",
    },
    {
        name: "characterModel",
        type: "gltfModel",
        path: "models/Character/personnage01_binary.glb",
    },
];
