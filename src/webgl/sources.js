import { sRGBEncoding } from "three";

export default [
    {
        name: "environmentMapTexture",
        type: "cubeTexture",
        path: [
            "textures/environmentMap/px.png",
            "textures/environmentMap/nx.png",
            "textures/environmentMap/py.png",
            "textures/environmentMap/ny.png",
            "textures/environmentMap/pz.png",
            "textures/environmentMap/nz.png",
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
        name: "mapModel",
        type: "gltfModel",
        path: "models/Map/pirate-ship.glb",
    },
    {
        name: "characterModel",
        type: "gltfModel",
        path: "models/Character/personnage03_binary.glb",
    },
    {
        name: "barbeAlphaTexture",
        type: "texture",
        path: "textures/character/Barbe_alpha.png",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "cintureBas01Texture",
        type: "texture",
        path: "textures/character/Cinture_bas_01.png",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "barbeBlancTexture",
        type: "texture",
        path: "textures/character/Barbe_blanc.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "barbeJauneTexture",
        type: "texture",
        path: "textures/character/Barbe_jaune.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "barbeOrangeTexture",
        type: "texture",
        path: "textures/character/Barbe_orange.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "barbeVioletTexture",
        type: "texture",
        path: "textures/character/Barbe_violet.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "epee01Texture",
        type: "texture",
        path: "textures/character/Epee_01.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "tonneauBlancTexture",
        type: "texture",
        path: "textures/character/Tonneau_blanc.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "tonneauBleuTexture",
        type: "texture",
        path: "textures/character/Tonneau_bleu.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "tonneauJauneTexture",
        type: "texture",
        path: "textures/character/Tonneau_jaune.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "tonneauOrangeTexture",
        type: "texture",
        path: "textures/character/Tonneau_orange.jpg",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "fog",
        type: "texture",
        path: "textures/fog/blue.png",
        options: {
            encoding: sRGBEncoding,
            flipY: false,
        },
    },
    {
        name: "musicGame",
        type: "audio",
        path: "sound/music-game.mp3",
        options: {
            volume: 0.3,
        },
    },
    {
        name: "theme",
        type: "audio",
        path: "sound/theme.mp3",
        options: {
            volume: 0.4,
            loop: true,
        },
    },
    {
        name: "click",
        type: "audio",
        path: "sound/click.mp3",
        options: {
            volume: 0.5,
        },
    },
    {
        name: "newPlayer",
        type: "audio",
        path: "sound/new-player.mp3",
        options: {
            volume: 0.5,
        },
    },
    {
        name: "attack",
        type: "audio",
        path: "sound/attack.mp3",
        options: {
            volume: 0.5,
        },
    },
];
