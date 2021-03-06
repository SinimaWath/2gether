import { applyChanges, save, init, load, decodeChange } from 'automerge';
import { redis } from '../../../redis';
import { jsonToUint8Array } from '../../parsing';

const REDIS_KEY = 'lists';

export const NotFound = new Error('List Not Found');
export const AlreadyExist = new Error('List Already Exist');
export const Forbidden = new Error('Forbid to change list');
export const InvalidChangesType = new Error('Invalid changes type');

export async function createList({ id, owner, changes }) {
    const state = applyChanges(init(), changes)[0];

    const obj = {
        staticState: {
            owner,
            id,
        },
        state: save(state),
    };

    await redis.hset(REDIS_KEY, id, JSON.stringify(obj));
}

export async function getListById({ id }) {
    const value = await redis.hget(REDIS_KEY, id);
    if (!value) {
        return null;
    }

    return JSON.parse(value);
}

export async function getListTaskIds({ id }) {
    const list = await getListById({ id });

    list.state = load(jsonToUint8Array(list.state));

    return !list ? [] : list.state.taskIds;
}

export async function removeListById({ id, owner }) {
    const list = await getListById({ id });
    if (!list) {
        return;
    }

    if (list.staticState.owner !== owner) {
        return;
    }

    await redis.hset(REDIS_KEY, id, '');
}
export async function getListsByUserEmail({ email }) {
    const lists = {};

    const vals = await redis.hvals(REDIS_KEY);

    vals.forEach((listRaw) => {
        if (!listRaw) {
            return;
        }

        const list = JSON.parse(listRaw);
        const savedState = list.state;

        list.state = load(jsonToUint8Array(list.state));

        if (isUserCanEditList({ list, email })) {
            lists[list.staticState.id] = { ...list, state: JSON.stringify(savedState) };
        }
    });

    return lists;
}

export function isUserCanEditList({ email, list }) {
    return list.staticState.owner === email || list.state.collaborators.includes(email);
}

export async function updateListStateById({ id, changes, owner }) {
    const list = await getListById({ id });
    if (!list) {
        throw NotFound;
    }

    const listState = load(jsonToUint8Array(list.state));
    list.state = listState;

    if (!isUserCanEditList({ list, email: owner })) {
        throw Forbidden;
    }

    if (typeof changes === 'string') {
        throw InvalidChangesType;
    }

    list.state = applyChanges(listState, changes)[0];
    list.state = save(list.state);

    await redis.hset(REDIS_KEY, id, JSON.stringify(list));
}
