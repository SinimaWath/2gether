import { redis } from '../../../redis';

export class ChangesQueue {
    constructor(scopeName) {
        this.scopeName = scopeName;
    }

    async _setToRedis(channel, array) {
        await redis.lpush(channel, ...array);
    }

    async _getByIdFromRedis(channelId) {
        const queue = await redis.lrange(channelId, 0, -1);
        if (!queue) {
            return null;
        }

        return queue;
    }

    async push(pushModel) {
        const channels = await this._getPushAllChannels(pushModel);
        await Promise.all(
            channels.map((channel) => this._setToRedis(channel, [JSON.stringify(pushModel)]))
        );
    }

    async _getPushAllChannels(pushModel, by) {
        const keys = await redis.keys(this.scopeName + '*');

        return keys.filter((key) => key.includes(pushModel.id) && !key.includes(by));
    }

    async pull(pushModel) {
        let queue = await this._getByIdFromRedis(
            `${this.scopeName}/${pushModel.id}/${pushModel.by}`
        );

        if (!queue || !queue.length) {
            await this._setToRedis(`${this.scopeName}/${pushModel.id}/${pushModel.by}`, ['']);
            return [];
        }

        const changes = [];
        for (const value of queue) {
            if (!value) {
                continue;
            }

            changes.push(JSON.parse(value).changes);
        }

        if (!changes.length) {
            return [];
        }

        await redis.del([`${this.scopeName}/${pushModel.id}/${pushModel.by}`]);
        await this._setToRedis(`${this.scopeName}/${pushModel.id}/${pushModel.by}`, ['']);
        return changes;
    }
}
