const assert = require('assert');

const {
    init,
    from,
    Text,
    save,
    change,
    load,
    merge,
    clone,
    getChanges,
    applyChanges,
    getAllChanges,
    getConflicts,
    getHistory,
} = require('automerge');

const startedListState = init();

function jsonToUint8Array(json) {
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

let listStateClient1 = from({
    text: new Text('AB'),
});

let listStateClient2 = merge(init(), listStateClient1);

let listStateClient2_1 = change(listStateClient2, (doc) => {
    doc.text.insertAt(1, 'B');
});

let ch1 = getChanges(listStateClient2, listStateClient2_1);

let listStateClient2_2 = change(listStateClient2_1, (doc) => {
    doc.text.insertAt(0, 'C');
});

let ch2 = getChanges(listStateClient2_1, listStateClient2_2);
