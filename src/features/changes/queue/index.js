import { redis } from '../../../redis';

export class ChangesQueue {
    constructor(scopeName) {
        this.scopeName = scopeName;
    }

    async _setToRedis(id, data) {
        await redis.hset(this.scopeName, id, JSON.stringify(data));
    }

    async _getByIdFromRedis(id) {
        const queue = await redis.hget(this.scopeName, id);
        if (!queue) {
            return null;
        }

        return JSON.parse(queue);
    }

    checkNotUserChanges(pushModel) {
        const queue = this.queueById[pushModel.id];
        if (!queue) {
            return true;
        }

        return queue.find((pushTask) => pushTask.by !== pushModel.by);
    }

    async push(pushModel) {
        const queue = await this._getByIdFromRedis(pushModel.id);
        console.log(queue);
        if (!queue) {
            await this._setToRedis(pushModel.id, [pushModel]);
            return;
        }

        queue.push(pushModel);
        await this._setToRedis(pushModel.id, queue);
    }

    async pull(pushModel) {
        let queue = await this._getByIdFromRedis(pushModel.id);

        if (!queue) {
            return [];
        }

        const changes = queue
            .filter((push) => push.by !== pushModel.by)
            .map(({ changes }) => changes);
        console.log(changes);

        const filteredQueue = queue.filter((push) => push.by === pushModel.by);

        await this._setToRedis(pushModel.id, filteredQueue);

        return changes;
    }
}
