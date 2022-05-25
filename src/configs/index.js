const configs = {
    character: {
        count: 4, //4
        colors: ["#414182", "#8DDDE9", "#FCA04C", "#4F9C98", "#FC6C4C"],
        speed: 3.2, //1.2
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
                tag: "Hat",
                modelNames: ["personnage_1"],
            },
            head: {
                tag: "Beard",
                modelNames: ["personnage_5"],
            },
            barrel: {
                tag: "Barrel",
                modelNames: ["personnage_2", "personnage_4"],
            },
            weapon: {
                tag: "Sword",
                modelNames: ["personnage_6"],
            },
            others: {
                tag: "Others",
                modelNames: ["personnage_3"],
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
