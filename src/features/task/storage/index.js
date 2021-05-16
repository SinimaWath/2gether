import { applyChanges, init, load, save } from 'automerge';
import { redis } from '../../../redis';
import { jsonToUint8Array } from '../../parsing';
import { getListById, isUserCanEditList } from '../../list/storage';

const REDIS_KEY_LISTS = 'lists';
const REDIS_KEY = 'tasks';

export const NotFound = new Error('Task Not Found');
export const ListNotFound = new Error('List Not Found');

export const AlreadyExist = new Error('List Already Exist');
export const Forbidden = new Error('Forbid to change list');
export const ForbiddenToList = new Error('Forbid to get tasks from list');

export const InvalidChangesType = new Error('Invalid changes type');

export async function createTask({ id, listId, owner, changes }) {
    const state = applyChanges(init(), changes)[0];

    const obj = {
        staticState: {
            owner,
            id,
            listId,
        },
        state: save(state),
    };

    await redis.hset(REDIS_KEY, id, JSON.stringify(obj));
}

export async function getTaskById({ id }) {
    const value = await redis.hget(REDIS_KEY, id);
    if (!value) {
        return null;
    }

    return JSON.parse(value);
}

export async function removeTaskById({ id, owner }) {
    const list = await getTaskById({ id });
    if (!list) {
        return;
    }

    if (list.staticState.owner !== owner) {
        return;
    }

    await redis.hset(REDIS_KEY, id, '');
}

export async function getTasksByListId({ email, listId }) {
    const list = await getListById({ id: listId });
    if (!list) {
        throw ListNotFound;
    }

    if (!isUserCanEditList({ email, list })) {
        throw ForbiddenToList;
    }

    const tasksToGet = list.tasksIds;
    if (!tasksToGet || !tasksToGet.length) {
        return [];
    }

    const tasks = redis.hmget(REDIS_KEY, tasksToGet);

    const tasksToReturn = [];
    tasks.forEach((taskRaw) => {
        if (!taskRaw) {
            return;
        }

        const task = JSON.parse(taskRaw);

        tasksToReturn.push(task);
    });

    return tasksToReturn;
}

export async function getTasksByEmail({ email }) {
    const tasks = await redis.hvals(REDIS_KEY);
    if (!tasks) {
        return {};
    }

    const tasksToReturn = {};

    for (const taskRaw of tasks) {
        if (!taskRaw) {
            continue;
        }

        const task = JSON.parse(taskRaw);

        if (task.staticState.owner === email) {
            tasksToReturn[task.staticState.id] = task;
            continue;
        }

        const list = await getListById({ id: task.staticState.listId });
        if (!list) {
            continue;
        }

        list.state = load(jsonToUint8Array(list.state));
        if (!isUserCanEditList({ list, email })) {
            continue;
        }

        tasksToReturn[task.staticState.id] = task;
    }

    return tasksToReturn;
}

export async function updateTaskStateById({ id, listId, changes, owner }) {
    const list = await getListById({ id: listId });
    if (!list) {
        throw ListNotFound;
    }

    list.state = load(jsonToUint8Array(list.state));

    if (!isUserCanEditList({ list, email: owner })) {
        throw Forbidden;
    }

    const task = await getTaskById({ id });

    task.state = load(jsonToUint8Array(task.state));

    task.state = applyChanges(task.state, changes)[0];

    task.state = save(task.state);

    await redis.hset(REDIS_KEY, id, JSON.stringify(task));
}
