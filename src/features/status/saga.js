import { put, all, fork, takeEvery } from 'redux-saga/effects';

import { jsonArrayToUint8Array, jsonToUint8Array } from '../parsing';
import { load } from 'automerge';
import { listDocRegistry } from '../list/document';
import { changeListTitle, changeTaskStatusTitle, setStatus, STATUS_ACTIONS } from './actions';
import { applyChanges, decodeChange } from 'automerge';
import { taskDocRegistry } from '../task/document';

const LIST_RE = /\/list\/([^\/\?]+)/;
let currentLoaded = false;
let firstTasksList = true;

export function* fetchStatusSaga() {
    yield takeEvery(STATUS_ACTIONS.FETCH_STATUS, function* () {
        const status = yield fetch('/api/pull/status');
        const response = yield status.json();

        const listsForState = {};

        const pathname = window.location.pathname;

        let currentList = null;
        const match = pathname.match(LIST_RE);
        if (match && match[1]) {
            currentList = match[1];
        }

        Object.entries(response.state.lists || {}).forEach(([id, list]) => {
            if (id === currentList && currentLoaded) {
                return;
            }

            if (id === currentList) {
                currentLoaded = true;
            }

            const uintDoc = jsonToUint8Array(list.state);

            listDocRegistry[id] = load(uintDoc);

            listsForState[id] = {
                id,
                owner: list.staticState.owner,
                title: listDocRegistry[id].title?.toString() || '',
                collaborators: listDocRegistry[id].collaborators,
                taskIds: listDocRegistry[id].taskIds,
            };
        });

        const tasksForState = {};

        Object.entries(response.state.tasks || {}).forEach(([id, task]) => {
            if (task.staticState.listId === currentList && !firstTasksList) {
                return;
            }

            const uintDoc = jsonToUint8Array(task.state);

            taskDocRegistry[id] = load(uintDoc);

            console.log(id, taskDocRegistry);
            tasksForState[id] = {
                id,
                owner: task.staticState.owner,
                title: taskDocRegistry[id].title?.toString() || '',
                listId: task.staticState.listId,
                done: taskDocRegistry[id].done,
            };
        });

        firstTasksList = false;
        yield put(setStatus({ lists: listsForState, tasks: tasksForState, user: response.user }));
    });
}

function* pullList() {
    yield takeEvery(STATUS_ACTIONS.PULL_LIST, function* ({ payload: { listId } }) {
        try {
            const response = yield fetch(`/api/pull/list?listId=${listId}`);
            const { changes, taskChanges } = yield response.json();

            if (changes && !!changes.length) {
                changes.forEach((change) => {
                    const changesAutomerge = jsonArrayToUint8Array(change);
                    console.log('CHANGES LIST');
                    changesAutomerge.forEach((c) => console.log(decodeChange(c)));

                    listDocRegistry[listId] = applyChanges(
                        listDocRegistry[listId],
                        changesAutomerge
                    )[0];
                });
            }

            if (taskChanges && !!taskChanges.length) {
                for (const { id, changes } of taskChanges) {
                    if (!changes || !changes.length) {
                        continue;
                    }

                    for (const change of changes) {
                        if (!change) {
                            continue;
                        }

                        const changesAutomerge = jsonArrayToUint8Array(changes);
                        taskDocRegistry[id] = applyChanges(
                            taskDocRegistry[id],
                            changesAutomerge
                        )[0];

                        yield put(
                            changeTaskStatusTitle({
                                id,
                                listId,
                                done: taskDocRegistry[id].done,
                                title: taskDocRegistry[id].title.toString(),
                            })
                        );
                    }
                }
            }

            console.log('changeListTitle', listId);
            yield put(
                changeListTitle({
                    id: listId,
                    title: listDocRegistry[listId].title.toString(),
                    taskIds: listDocRegistry[listId].taskIds,
                    collaborators: listDocRegistry[listId].collaborators,
                })
            );
        } catch (e) {
            console.log(e);
        }
    });
}

export function* rootStatusSaga() {
    yield all([fork(fetchStatusSaga), fork(pullList)]);
}
