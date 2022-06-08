const configs = {
    character: {
        count: 16, //32
        colors: ["#3C365A", "#F3E3DD", "#FAA757", "#F86F43", "#6B8CDB"],
        speed: 1.2, //1.2
        rotationSpeed: 0.032,
        range: 1.2, //10
        animation: {
            idle: {
                chance() {
                    return Math.random() < 0.2;
                },
                duration: 2, // in second
            },
        },
        body: {
            hat: {
                shuffleMesh: true,
                addColor: true,
                meshes: [
                    {
                        name: "Chapeau_01",
                        color: ["#F86F43", "#1E1D22"],
                    },
                    {
                        name: "Chapeau_02",
                        color: ["#F86F43", "#1E1D22"],
                    },
                ],
            },
            beard: {
                shuffleMesh: true,
                alphaTexture: "barbeAlphaTexture",
                addColor: false,
                meshes: [
                    {
                        name: "Barbe",
                        texture: "barbeBlancTexture",
                        color: ["#F3E3DD"],
                    },
                    {
                        name: "Barbe",
                        texture: "barbeJauneTexture",
                        color: ["#FAA757"],
                    },
                    {
                        name: "Barbe",
                        texture: "barbeOrangeTexture",
                        color: ["#F86F43"],
                    },
                    {
                        name: "Barbe",
                        texture: "barbeVioletTexture",
                        color: ["#3C365A"],
                    },
                ],
            },
            barrel: {
                shuffleMesh: true,
                addColor: false,
                meshes: [
                    {
                        name: "Tonneau",
                        texture: "tonneauBlancTexture",
                        color: ["#F3E3DD"],
                    },
                    {
                        name: "Tonneau",
                        texture: "tonneauBleuTexture",
                        color: ["#6B8CDB"],
                    },
                    {
                        name: "Tonneau",
                        texture: "tonneauJauneTexture",
                        color: ["#FAA757"],
                    },
                    {
                        name: "Tonneau",
                        texture: "tonneauOrangeTexture",
                        color: ["#F86F43"],
                    },
                ],
            },
            weapon: {
                shuffleMesh: true,
                addColor: false,
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
        navMesh: ["A", "B", "C"], //["NavMesh", "NavMeshShip"],
        nearRange: 320,
        decors: ["Coffre", "Tonneau", "Canon", "Box", "Boulet"],
    },
};

export default configs;
