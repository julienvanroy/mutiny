const configs = {
    character: {
        count: 24, //24
        speed: 1.2, //1.2
        range: 3.2,
        animation: {
            idle: {
                chance(amt = 0.2) {
                    return Math.random() < amt;
                },
                duration: 2, // in second
                repeatCount: 2,
                amt: 0.4,
            },
            active: {
                walkingTimeScale: 2,
                runningTimeScale: 3.2,
            },
        },
        size: [1.4, 1.4, 1.4],
        colors: {
            orange: "#9C73FF",
            noir: "#3C365A",
        },
        body: {
            hat: {
                shuffleMesh: true,
                addColor: true,
                refColor: true,
                meshes: [
                    {
                        name: "Chapeau_01",
                        color: ["orange", "noir"],
                    },
                    {
                        name: "Chapeau_02",
                        color: ["orange", "noir"],
                    },
                ],
            },
            beard: {
                shuffleMesh: true,
                alphaTexture: "barbeAlphaTexture",
                addColor: false,
                refColor: false,
                meshes: [
                    {
                        name: "Barbe",
                        texture: "barbeBlancTexture",
                        color: ["blanc"],
                    },
                    {
                        name: "Barbe",
                        texture: "barbeJauneTexture",
                        color: ["jaune"],
                    },
                    {
                        name: "Barbe",
                        texture: "barbeOrangeTexture",
                        color: ["orange"],
                    },
                    {
                        name: "Barbe",
                        texture: "barbeVioletTexture",
                        color: ["violet"],
                    },
                ],
            },
            barrel: {
                shuffleMesh: true,
                addColor: false,
                refColor: false,
                meshes: [
                    {
                        name: "Tonneau",
                        texture: "tonneauBlancTexture",
                        color: ["blanc"],
                    },
                    {
                        name: "Tonneau",
                        texture: "tonneauBleuTexture",
                        color: ["bleu"],
                    },
                    {
                        name: "Tonneau",
                        texture: "tonneauJauneTexture",
                        color: ["jaune"],
                    },
                    {
                        name: "Tonneau",
                        texture: "tonneauOrangeTexture",
                        color: ["orange"],
                    },
                ],
            },
            weapon: {
                shuffleMesh: true,
                addColor: false,
                refColor: false,
                meshes: [
                    {
                        name: "Epee_01",
                        texture: "epee01Texture",
                    },
                ],
            },
            belt: {
                shuffleMesh: false,
                addColor: false,
                refColor: false,
                meshes: [
                    {
                        name: "Cinture_bas",
                        texture: "cintureBas01Texture",
                    },
                    {
                        name: "Cinture_bas001",
                        texture: "cintureBas01Texture",
                    },
                ],
            },
            others: {
                shuffleMesh: false,
                meshes: [
                    { name: "Bras" },
                    { name: "Bras_d_details" },
                    { name: "Bras_g_details" },
                    { name: "Crocher" },
                    { name: "Nez" },
                    { name: "Pied" },
                    { name: "Pied_details" },
                    { name: "Sourcil" },
                ],
            },
        },
    },
    game: {
        maxTime: 150, //150,
        maxPlayers: 8,
        cluesTime: [0, 5, 10, 10],
    },
    map: {
        steerPlanes: ["steer-avant", "steer-milieu", "steer-arriere"],
        steerBotCounts: [16, 0, 0],
        nearRange: 320,
        decors: ["Coffre", "Tonneau", "Canon", "Box", "Boulet"],
    },
};

export default configs;
