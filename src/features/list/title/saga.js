import { put, takeEvery, fork } from 'redux-saga/effects';
import { INVITE_TO_LIST_ACTION } from '../invite/actions';
import { listDocRegistry } from '../document';
import { change, getChanges } from 'automerge';
import { pushListChanges } from '../document/push';
import { message } from 'antd';
import { addListCollabs, changeListTitle, fetchStatus } from '../../status/actions';
import { TITLE_ACTIONS } from './action';

// insertFromPaste
// insertText
// deleteContentBackward
export function* rootChangeTitleSaga() {
    let prevDoc = null;
    let prevDocId = null;
    let lastFireTime = null;

    yield takeEvery(
        TITLE_ACTIONS.CHANGE,
        function* ({ payload: { id, data, type, selectionStart, selectionEnd, force } }) {
            if (prevDocId !== id) {
                prevDoc = listDocRegistry[id];
                prevDocId = id;
            }

            if (!prevDoc) {
                prevDoc = listDocRegistry[id];
                prevDocId = id;
            }

            if (type) {
                listDocRegistry[id] = change(listDocRegistry[id], (doc) => {
                    switch (type) {
                        case 'insertText': {
                            doc.title.insertAt(selectionStart - 1, data);
                            break;
                        }
                        case 'deleteContentBackward': {
                            if (selectionStart === selectionEnd && selectionStart === 0) {
                                break;
                            }

                            if (selectionStart === selectionEnd) {
                                doc.title.deleteAt(selectionStart - 1, 1);
                                break;
                            }

                            doc.title.deleteAt(selectionStart, selectionEnd - selectionStart);
                            break;
                        }
                    }
                });
            }

            const changes = getChanges(prevDoc, listDocRegistry[id]);

            console.log('changeListTitle', id);
            yield put(changeListTitle({ id, title: listDocRegistry[id].title.toString() }));

            if (changes.length < 5 && performance.now() - lastFireTime < 2000 && !force) {
                return;
            }

            lastFireTime = performance.now();
            prevDoc = listDocRegistry[id];

            const response = yield pushListChanges(id, changes);
            if (response.status !== 200) {
                message.error('Unexpected errors');
                yield put(fetchStatus());
            }
        }
    );
}
