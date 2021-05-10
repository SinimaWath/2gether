import { takeEvery } from 'redux-saga/effects';
import { CREATE_LIST_ACTIONS } from './actions';

export function* rootCreateListSaga() {
    yield takeEvery(CREATE_LIST_ACTIONS.MODAL_CREATE_LIST_OK, function* ({ payload }) {
        console.log(payload);
    });
}
