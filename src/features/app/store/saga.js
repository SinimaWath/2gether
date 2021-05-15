import { all, fork } from 'redux-saga/effects';
import { rootCreateListSaga } from '../../list/create-list/saga';
import { rootStatusSaga } from '../../status/saga';
import { rootExitSaga, rootInviteSaga, rootRemoveSaga } from '../../list/invite/saga';

function* rootSaga() {
    yield all([
        fork(rootCreateListSaga),
        fork(rootStatusSaga),
        fork(rootInviteSaga),
        fork(rootRemoveSaga),
        fork(rootExitSaga),
    ]);
}

export default rootSaga;
