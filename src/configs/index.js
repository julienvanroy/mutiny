const configs = {
    character: {
        count: 32, //4
        colors: ["#3C365A", "#F3E3DD", "#FAA757", "#F86F43", "#6B8CDB"],
        speed: 1.2, //1.2
        rotationSpeed: 0.032,
        range: 3.2, //10
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
                meshes: [
                    {
                        name: "Chapeau_01",
                        color: ["#1E1D22"],
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
                meshes: [
                    {
                        name: "Epee_01",
                        texture: "epee01Texture",
                    },
                ],
            },
            belt: {
                shuffleMesh: false,
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
    },
    map: {
        navMesh: ["NavMesh", "NavMeshShip"],
        nearRange: 320,
        decors: ["Coffre", "Tonneau", "Canon", "Box", "Boulet"],
    },
};

export default configs;
