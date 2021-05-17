import { put, takeEvery, throttle } from 'redux-saga/effects';
import { taskDocRegistry } from '../document';
import { change, getChanges } from 'automerge';
import { pushTaskChanges } from '../document/push';
import { message } from 'antd';
import {
    changeListTitle,
    changeTaskStatusDone,
    changeTaskStatusTitle,
    fetchStatus,
    removeList,
    removeTask,
} from '../../status/actions';
import { deleteTask, TASK_ITEM_ACIONS } from './action';
import { listDocRegistry } from '../../list/document';
import { pushListChanges } from '../../list/document/push';

export function* rootChangeTaskDoneSaga() {
    yield throttle(
        100,
        TASK_ITEM_ACIONS.CHANGE_DONE,
        function* ({ payload: { id, listId, done } }) {
            let prevDoc = taskDocRegistry[id];

            taskDocRegistry[id] = change(taskDocRegistry[id], (doc) => {
                doc.done = done;
            });

            const changes = getChanges(prevDoc, taskDocRegistry[id]);

            yield put(changeTaskStatusDone({ id, done: taskDocRegistry[id].done }));

            const response = yield pushTaskChanges(id, listId, changes);
            if (response.status !== 200) {
                message.error('Unexpected errors');
                yield put(fetchStatus());
            }
        }
    );
}

export function* rootDeleteTaskSaga() {
    yield takeEvery(TASK_ITEM_ACIONS.DELETE_TASK, function* ({ payload: { id, listId } }) {
        yield fetch(`/api/push/remove-task?taskId=${id}`);

        const prevListDoc = listDocRegistry[listId];

        listDocRegistry[listId] = change(listDocRegistry[listId], (doc) => {
            const index = doc.taskIds.findIndex((v) => v === id);
            doc.taskIds.splice(index, 1);
        });

        delete taskDocRegistry[id];

        yield put(removeTask({ id, listId }));

        yield pushListChanges(listId, getChanges(prevListDoc, listDocRegistry[listId]));
    });
}
