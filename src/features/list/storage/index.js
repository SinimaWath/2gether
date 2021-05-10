import { generateListId } from '../id';
import { applyChanges, load, save, init } from 'automerge';

const listStorage = new Map();

// to remove
const ListModel = {
    staticState: {
        id: 'list:',
        owner: 'email',
    },
    state: {},
};

export const NotFound = new Error('List Not Found');
export const AlreadyExist = new Error('List Already Exist');
export const Forbidden = new Error('Forbid to change list');
export const InvalidChangesType = new Error('Invalid changes type');

export function createList({ id, owner, changes }) {
    const listId = id || generateListId();
    if (listStorage.has(listId)) {
        throw AlreadyExist;
    }

    const state = applyChanges(init(), changes)[0];

    listStorage.set(listId, {
        staticState: {
            owner,
            id: listId,
        },
        state,
    });

    console.log('createList', listStorage.get(listId));
}

export function getListById({ id }) {
    return listStorage.get(id);
}

export function getListsByUserEmail({ email }) {
    const lists = {};

    listStorage.forEach((list) => {
        if (list.staticState.owner === email || list.state.collaborators.includes(email)) {
            lists[list.staticState.id] = ({  ...list, state: save(list.state).toString() });
        }
    });

    return lists;
}

export function updateListStateById({ id, changes, owner }) {
    if (!listStorage.has(id)) {
        throw NotFound;
    }

    if (typeof changes === 'string') {
        throw InvalidChangesType;
    }

    const list = listStorage.get(id);
    if (list.staticState.owner !== owner) {
        throw Forbidden;
    }

    const listState = list.state;

    console.log('Before apply', listState, changes);
    list.state = applyChanges(listState, changes)[0];

    listStorage.set(id, list);

    console.log('updateListStateById', listStorage.get(id));
}
