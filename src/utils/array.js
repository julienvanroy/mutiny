export const diffArray = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));

export const mapToArray = (map, extractValues = false) => {
    let arr = Array.from(map, ([name, value]) => ({ name, value }));
    if (extractValues) arr = arr.map(({ value }) => value);

    return arr;
};

export const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};

export const flatten = (arr, depth = 1) =>
    arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);
