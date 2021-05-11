import { all, fork } from 'redux-saga/effects';
import { rootCreateListSaga } from '../../list/create-list/saga';
import { rootStatusSaga } from '../../status/saga';

function* rootSaga() {
    yield all([fork(rootCreateListSaga), fork(rootStatusSaga)]);
}

export default rootSaga;
