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
        name: "foxModel",
        type: "gltfModel",
        path: "models/Fox/glTF/Fox.gltf",
    },
    {
        name: "prisonModel",
        type: "gltfModel",
        path: "models/Prison/prison.gltf",
    },
    {
        name: "appartmentModel",
        type: "gltfModel",
        path: "models/Appartment/appartment.gltf",
    },
    {
        name: "robotModel",
        type: "gltfModel",
        path: "models/Robot/robot.gltf",
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
    {
        name: "musicGame",
        type: "audio",
        path: "sound/music.mp3",
        options: {
            loop: true,
            volume: 0.5,
        },
    },
];
