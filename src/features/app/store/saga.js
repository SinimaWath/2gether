import { all, fork } from 'redux-saga/effects';
import { rootCreateListSaga } from '../../list/create-list/saga';

function* rootSaga() {
    yield all([fork(rootCreateListSaga)]);
}

export default rootSaga;
