import { takeEvery, put, select, all } from 'redux-saga/effects';
import { CREATE_TASK_ACTIONS } from './actions';
import { Text, init, change, getChanges } from 'automerge';
import { addList, addTask, fetchStatus } from '../../status/actions';
import { taskDocRegistry } from '../document';
import { listDocRegistry } from '../../list/document';
import { message } from 'antd';

export function* rootTasksListSaga() {
    yield takeEvery(
        CREATE_TASK_ACTIONS.CREATE_TASK,
        function* ({ payload: { title, id, listId } }) {
            if (!listDocRegistry[listId]) {
                return;
            }

            const emptyDoc = init();

            const taskDoc = change(emptyDoc, (doc) => {
                doc.title = new Text(title);
            });

            taskDocRegistry[id] = taskDoc;
            const prevListDoc = listDocRegistry[listId];

            listDocRegistry[listId] = change(listDocRegistry[listId], (doc) => {
                doc.taskIds.push(id);
                doc.done = false;
            });

            const initChanges = getChanges(emptyDoc, taskDoc);
            const listChanges = getChanges(prevListDoc, listDocRegistry[listId]);

            const tasksPush = yield fetch('/api/push/task', {
                method: 'POST',
                body: JSON.stringify({ id, listId, changes: JSON.stringify(initChanges) }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (tasksPush.status !== 200) {
                message.error('Unexpected errors');
                yield put(fetchStatus());
                return;
            }

            const listPush = yield fetch('/api/push/list', {
                method: 'POST',
                body: JSON.stringify({ listId, changes: JSON.stringify(listChanges) }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (listPush.status !== 200) {
                message.error('Unexpected errors');
                yield put(fetchStatus());
                return;
            }

            const email = yield select((state) => state.status.user.email);

            yield put(
                addTask({
                    id,
                    listId,
                    owner: email,
                    title: taskDocRegistry[id].title.toString(),
                    taskIds: listDocRegistry[listId].taskIds,
                    done: false,
                })
            );
        }
    );
}
