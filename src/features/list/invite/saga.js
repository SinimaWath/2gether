import { takeEvery, put } from 'redux-saga/effects';
import { INVITE_TO_LIST_ACTION } from './actions';
import { change, getChanges } from 'automerge';
import { listDocRegistry } from '../document';
import { pushListChanges } from '../document/push';
import { addListCollabs, removeList } from '../../status/actions';

import { message } from 'antd';

export function* rootInviteSaga() {
    yield takeEvery(INVITE_TO_LIST_ACTION.INVITE, function* ({ payload: { email, id } }) {
        const prevDoc = listDocRegistry[id];
        if (prevDoc?.collaborators?.includes(email)) {
            return;
        }

        listDocRegistry[id] = change(listDocRegistry[id], (doc) => {
            doc.collaborators.push(email);
        });

        const changes = getChanges(prevDoc, listDocRegistry[id]);

        const response = yield pushListChanges(id, changes);
        console.log(response);
        if (response.status !== 200) {
            message.error('Unexpected errors');
            return;
        }

        yield put(addListCollabs({ id, collaborators: listDocRegistry[id].collaborators }));
    });
}

export function* rootRemoveSaga() {
    yield takeEvery(INVITE_TO_LIST_ACTION.REMOVE, function* ({ payload: { email, id } }) {
        const prevDoc = listDocRegistry[id];
        console.log(prevDoc?.collaborators);
        if (!prevDoc?.collaborators?.includes(email)) {
            return;
        }

        listDocRegistry[id] = change(listDocRegistry[id], (doc) => {
            const index = doc.collaborators.findIndex((v) => v === email);
            doc.collaborators.splice(index, 1);
        });

        const changes = getChanges(prevDoc, listDocRegistry[id]);

        const response = yield pushListChanges(id, changes);
        if (response.status !== 200) {
            message.error('Unexpected errors');
            return;
        }

        yield put(addListCollabs({ id, collaborators: listDocRegistry[id].collaborators }));
    });
}

export function* rootExitSaga() {
    yield takeEvery(INVITE_TO_LIST_ACTION.EXIT, function* ({ payload: { email, id } }) {
        const prevDoc = listDocRegistry[id];
        console.log(prevDoc?.collaborators);
        if (!prevDoc?.collaborators?.includes(email)) {
            return;
        }

        listDocRegistry[id] = change(listDocRegistry[id], (doc) => {
            const index = doc.collaborators.findIndex((v) => v === email);
            doc.collaborators.splice(index, 1);
        });

        const changes = getChanges(prevDoc, listDocRegistry[id]);

        const response = yield pushListChanges(id, changes);
        if (response.status !== 200) {
            message.error('Unexpected errors');
            return;
        }

        yield put(removeList({ id }));

        Promise.resolve().then(() => (location.pathname = '/app'));
    });
}
