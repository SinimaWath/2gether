import { put, takeEvery } from 'redux-saga/effects';
import { taskDocRegistry } from '../document';
import { change, getChanges } from 'automerge';
import { pushTaskChanges } from '../document/push';
import { message } from 'antd';
import { changeListTitle, changeTaskStatusTitle, fetchStatus } from '../../status/actions';
import { TASK_TITLE_ACTIONS } from './action';

// insertFromPaste
// insertText
// deleteContentBackward
export function* rootChangeTaskTitleSaga() {
    let prevDoc = null;
    let prevDocId = null;
    let lastFireTime = null;

    yield takeEvery(
        TASK_TITLE_ACTIONS.CHANGE,
        function* ({ payload: { id, listId, data, type, selectionStart, selectionEnd } }) {
            if (prevDocId !== id) {
                prevDoc = taskDocRegistry[id];
                prevDocId = id;
            }

            if (!prevDoc) {
                prevDoc = taskDocRegistry[id];
                prevDocId = id;
            }

            taskDocRegistry[id] = change(taskDocRegistry[id], (doc) => {
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

            const changes = getChanges(prevDoc, taskDocRegistry[id]);

            yield put(changeTaskStatusTitle({ id, title: taskDocRegistry[id].title.toString() }));

            console.log(performance.now() - lastFireTime);
            if (changes.length < 5 && performance.now() - lastFireTime < 2000) {
                return;
            }

            lastFireTime = performance.now();
            prevDoc = taskDocRegistry[id];

            const response = yield pushTaskChanges(id, listId, changes);
            if (response.status !== 200) {
                message.error('Unexpected errors');
                yield put(fetchStatus());
            }
        }
    );
}
