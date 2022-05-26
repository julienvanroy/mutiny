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
        name: "woodTexture",
        type: "texture",
        path: "textures/wood.jpeg",
    },
    {
        name: "waterTexture",
        type: "texture",
        path: "textures/water/normals.jpeg",
    },
    {
        name: "mapTutoModel",
        type: "gltfModel",
        path: "models/Map/hextile.glb",
    },
    {
        name: "mapModel",
        type: "gltfModel",
        path: "models/Map/pirate-ship-with-navmesh-2.glb",
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
