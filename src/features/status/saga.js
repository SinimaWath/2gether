import { put, all, fork, takeEvery } from 'redux-saga/effects';

import { jsonArrayToUint8Array, jsonToUint8Array } from '../parsing';
import { load } from 'automerge';
import { listDocRegistry } from '../list/document';
import { addList, setStatus, STATUS_ACTIONS } from './actions';
import { applyChanges, save, init } from 'automerge';
import { changeTitle } from '../list/title/action';

export function* fetchStatusSaga() {
    yield takeEvery(STATUS_ACTIONS.FETCH_STATUS, function* () {
        const status = yield fetch('/api/pull/status');
        const response = yield status.json();

        const listsForState = {};

        Object.entries(response.state.lists || {}).forEach(([id, list]) => {
            console.log(id, list);
            const uintDoc = jsonToUint8Array(list.state);

            listDocRegistry[id] = load(uintDoc);

            listsForState[id] = {
                id,
                owner: list.staticState.owner,
                title: listDocRegistry[id].title?.toString() || '',
                collaborators: listDocRegistry[id].collaborators,
            };
        });

        console.log(response);
        yield put(setStatus({ lists: listsForState, user: response.user }));
    });
}

function* pullList() {
    yield takeEvery(STATUS_ACTIONS.PULL_LIST, function* ({ payload: { listId } }) {
        try {
            const response = yield fetch(`/api/pull/list?listId=${listId}`);
            const { changes } = yield response.json();

            console.log(changes);
            const changesAutomerge = jsonArrayToUint8Array(changes);

            listDocRegistry[listId] = applyChanges(listDocRegistry[listId], changesAutomerge);

            console.log(response);
            yield put(changeTitle({ id: listId, title: listDocRegistry[listId].title.toString() }));
        } catch (e) {

        }
    });
}

export function* rootStatusSaga() {
    yield all([fork(fetchStatusSaga), fork(pullList)]);
}
