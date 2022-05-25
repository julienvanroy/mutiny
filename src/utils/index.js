const diffArray = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));

const mapToArray = (map, extractValues = false) => {
    let arr = Array.from(map, ([name, value]) => ({ name, value }));
    if (extractValues) arr = arr.map(({ value }) => value);

    return arr;
};

const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sampleSize = ([...arr], n = 1) => {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(0, n);
};

const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};

const uuid = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );

export { diffArray, mapToArray, randomNumberInRange, sample, sampleSize, shuffle, uuid };
export { stringToBoolean } from "./stringToBoolean";
