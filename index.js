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

function jsonStringToUint8Array(json) {
    const object = JSON.parse(json);
    const values = Object.values(object);
    const ret = new Uint8Array(values.length);

    values.forEach((value, index) => {
        ret[index] = value;
    });
    return ret;
}

function createTaskDoc() {
    return from({
        text: new Text(),
        done: false,
    });
}

const startedListState = init();

let listState = from({
    title: 'Some title',
    collaborators: [],
});

const ch1 = getChanges(startedListState, listState);

console.log('\n', JSON.stringify(ch1));

let newListStaet = change(listState, (doc) => {
    doc.title = 'asd';
    doc.collaborators.insertAt(0, 'name');
});

const ch = getChanges(listState, newListStaet);

console.log('\n', JSON.stringify(ch));

const withChanges = applyChanges(init(), ch);

console.log(withChanges);

// let s1 = createTaskDoc();
//
// s1 = change(s1, (doc) => {
//     doc.text.insertAt(0, '1');
// });
//
// let transferDoc = save(s1);
//
// // ----
// let client1 = init();
// client1 = change(client1, (doc) => {
//     doc.text = new Text();
//     doc.text.insertAt(0, 'A');
// });
//
// let client2 = merge(init(), client1);
//
// console.log(client1.text.toString(), client2.text.toString());
//
// let newClient1 = change(client1, (doc) => {
//     doc.text.insertAt(1, 'B');
// });
//
// const client1Changes = getChanges(client1, newClient1);
//
// let newClient2 = change(client2, (doc) => {
//     doc.text.deleteAt(0, 1);
//     doc.text.insertAt(0, 'C');
// });
//
// const client2Changes = getChanges(client2, newClient2);
//
// const client1WithChanges = applyChanges(newClient1, client2Changes);
//
// // console.log(client1WithChanges[0].text.toString(), newClient2.text.toString());
//
// const client1AfterChanges = change(client1WithChanges[0], (doc) => {
//     doc.text.insertAt(2, 'D');
// });
//
// const client2WithChanges = applyChanges(newClient2, client1Changes);
//
// // console.log(client1WithChanges[0].text.toString(), client2WithChanges[0].text.toString());
