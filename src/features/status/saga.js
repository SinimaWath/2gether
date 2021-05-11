import { put, all, fork, takeEvery } from 'redux-saga/effects';

import { jsonToUint8Array } from '../parsing';
import { load } from 'automerge';
import { listDocRegistry } from '../list/document';
import { setStatus, STATUS_ACTIONS } from './actions';

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
                title: listDocRegistry[id].title.toString(),
                collaborators: listDocRegistry[id].collaborators,
            };
        });

        console.log(response);
        yield put(setStatus({ lists: listsForState, user: response.user }));
    });
}

export function* rootStatusSaga() {
    yield all([fork(fetchStatusSaga)]);
}
