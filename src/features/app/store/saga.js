import { all, fork } from 'redux-saga/effects';
import { rootCreateListSaga } from '../../list/create-list/saga';
import { rootStatusSaga } from '../../status/saga';
import {
    rootExitSaga,
    rootInviteSaga,
    rootRemoveListSaga,
    rootRemoveSaga,
} from '../../list/invite/saga';
import { rootChangeTitleSaga } from '../../list/title/saga';

function* rootSaga() {
    yield all([
        fork(rootCreateListSaga),
        fork(rootStatusSaga),
        fork(rootInviteSaga),
        fork(rootRemoveSaga),
        fork(rootExitSaga),
        fork(rootChangeTitleSaga),
        fork(rootRemoveListSaga),
    ]);
}

export default rootSaga;
