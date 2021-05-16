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
} from '../../status/actions';
import { TASK_ITEM_ACIONS } from './action';

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
