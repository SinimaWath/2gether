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
import { rootTasksListSaga } from '../../task/create-task/saga';
import { rootChangeTaskTitleSaga } from '../../task/title/saga';
import { rootChangeTaskDoneSaga } from '../../task/task-item/saga';

function* rootSaga() {
    yield all([
        fork(rootCreateListSaga),
        fork(rootStatusSaga),
        fork(rootInviteSaga),
        fork(rootRemoveSaga),
        fork(rootExitSaga),
        fork(rootChangeTitleSaga),
        fork(rootRemoveListSaga),
        fork(rootTasksListSaga),
        fork(rootChangeTaskTitleSaga),
        fork(rootChangeTaskDoneSaga),
    ]);
}

export default rootSaga;
