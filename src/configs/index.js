const configs = {
    character: {
        count: 32, //4
        colors: ["#414182", "#8DDDE9", "#FCA04C", "#4F9C98", "#FC6C4C"],
        sizes: {
            radius: 0.32,
            height: 0.64,
        },
        speed: 1,
        rotationSpeed: 0.032,
        range: 3.2, //10
        body: {
            hat: {
                tag: "Hat",
                modelNames: ["personnage_1"],
            },
            head: {
                tag: "Head",
                modelNames: ["personnage_5"],
            },
            barrel: {
                tag: "Barrel",
                modelNames: ["personnage_2", "personnage_4"],
            },
            weapon: {
                tag: "Weapon",
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
};

export default configs;
