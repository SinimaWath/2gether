export class ChangesQueue {
    constructor() {
        this.queueById = [];
    }

    checkNotUserChanges(pushModel) {
        const queue = this.queueById[pushModel.id];
        if (!queue) {
            return true;
        }

        console.log('checkIsCanBePushed', this.queueById);

        return queue.find((pushTask) => pushTask.by !== pushModel.by);
    }

    push(pushModel) {
        if (!this.queueById[pushModel.id]) {
            this.queueById[pushModel.id][pushModel.listId] = [pushModel];
            return;
        }

        this.queueById[pushModel.id].push(pushModel);
    }

    pull(pushModel) {
        if (!this.queueById[pushModel.id]) {
            return [];
        }

        const changes = this.queueById[pushModel.id].filter((push) => push.by !== pushModel.by);

        // Убираем все изменения которые запулили
        this.queueById[pushModel.id] = this.queueById[pushModel.id].filter(
            (push) => push.by === pushModel.by
        );

        return changes;
    }
}
