import { generateListId } from '../id';
import { applyChanges, load, save, init } from 'automerge';

const listStorage = new Map();

// to remove
const ListModel = {
    staticState: {
        id: 'list:',
        owner: 'email',
    },
    state: {
        collaborators: [],
        title: '',
    },
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
        if (isUserCanEditList({ id: list.staticState.id, email })) {
            lists[list.staticState.id] = { ...list, state: JSON.stringify(save(list.state)) };
        }
    });

    return lists;
}

export function isUserCanEditList({ email, id }) {
    const list = listStorage.get(id);

    console.log(list);
    return list.staticState.owner === email || list.state.collaborators.includes(email);
}

export function updateListStateById({ id, changes, owner }) {
    if (!listStorage.has(id)) {
        throw NotFound;
    }

    if (!isUserCanEditList({ id, email: owner })) {
        throw Forbidden;
    }

    if (typeof changes === 'string') {
        throw InvalidChangesType;
    }

    const list = listStorage.get(id);

    const listState = list.state;

    console.log('Before apply', listState, changes);
    list.state = applyChanges(listState, changes)[0];

    listStorage.set(id, list);

    console.log('updateListStateById', listStorage.get(id));
}
