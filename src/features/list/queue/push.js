const listPushQueueByListId = {};

const PushListModel = {
    listId: 'asd',
    by: 'email',
    changes: '',
};

export function checkAreThereOtherChanges(pushModel) {
    const queue = listPushQueueByListId[pushModel.listId];
    if (!queue) {
        return true;
    }

    console.log('checkIsCanBePushed', listPushQueueByListId);

    return queue.find((pushTask) => pushTask.by !== pushModel.by);
}

export function pushListChanges(pushModel) {
    if (!listPushQueueByListId[pushModel.listId]) {
        listPushQueueByListId[pushModel.listId] = [pushModel];
        return;
    }

    // Убираем все прошлые пуши, так как последний в changes содержит все необходимое
    listPushQueueByListId[pushModel.listId] = listPushQueueByListId[pushModel.listId].filter(
        (push) => push.by !== pushModel.by
    );
    listPushQueueByListId[pushModel.listId].push(pushModel);
    console.log('pushListChanges', listPushQueueByListId);
}

export function pullChanges({ listId, by }) {
    if (!listPushQueueByListId[listId]) {
        return null;
    }

    const pull = listPushQueueByListId[listId].reverse().find((push) => push.by !== by);

    console.log('pullChanges', listPushQueueByListId);
    return pull;
}
