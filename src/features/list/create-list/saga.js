import { takeEvery, put, select } from 'redux-saga/effects';
import { CREATE_LIST_ACTIONS } from './actions';
import { Text, init, change, getChanges } from 'automerge';
import { listDocRegistry } from '../document';
import { addList } from '../../status/actions';

export function* rootCreateListSaga() {
    yield takeEvery(CREATE_LIST_ACTIONS.MODAL_CREATE_LIST_OK, function* ({ payload }) {
        const emptyDoc = init();

        const listDoc = change(emptyDoc, (doc) => {
            doc.title = new Text(payload.title);
            doc.collaborators = [];
        });

        listDocRegistry[payload.id] = listDoc;

        const initChanges = getChanges(emptyDoc, listDoc);

        yield fetch('api/push/list', {
            method: 'POST',
            body: JSON.stringify({ listId: payload.id, changes: JSON.stringify(initChanges) }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const email = yield select((state) => console.log(state));

        yield put(
            addList({
                id: payload.id,
                owner: email,
                title: listDocRegistry[payload.id].title.toString(),
                collaborators: listDocRegistry[payload.id].collaborators,
            })
        );
    });
}
