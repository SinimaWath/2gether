import { redis } from '../../../redis';

export class ChangesQueue {
    constructor(queueName) {
        this.queueName = queueName;
    }

    push(obj) {
        redis.lpush(this.queueName, JSON.stringify(obj));
    }
    getById(id) {
        redis.lpush(this.queueName);
    }
    checkNotUserChanges(pushModel) {
        const queue = this.queueById[pushModel.id];
        if (!queue) {
            return true;
        }

        return queue.find((pushTask) => pushTask.by !== pushModel.by);
    }

    push(pushModel) {
        if (!this.queueById[pushModel.id]) {
            this.queueById[pushModel.id] = [pushModel];
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
