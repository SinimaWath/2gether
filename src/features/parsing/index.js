export function jsonToUint8Array(json) {
    let object = json;
    if (typeof json === 'string') {
        object = JSON.parse(json);
    }

    const values = Object.values(object);
    const ret = new Uint8Array(values.length);

    values.forEach((value, index) => {
        ret[index] = value;
    });
    return ret;
}

export function jsonArrayToUint8Array(json) {
    const array = JSON.parse(json);

    console.log(array);
    return array.map((object) => jsonToUint8Array(object));
}

export function uint8ArrayToJson(array) {
    let str = '';
    for (var i = 0; i < array.length; i++) {
        str += String.fromCharCode(parseInt(array[i]));
    }
    return JSON.parse(str);
}
