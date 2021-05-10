import { generateListId, generateTaskId } from '../id';
import { applyChanges, load, save, init } from 'automerge';
import { getListById, isUserCanEditList } from '../../list/storage';

const taskStorage = new Map();

// to remove
const TaskModel = {
    staticState: {
        id: 'list:',
        owner: 'email',
    },
    state: {
        listId: '',
        done: false,
        text: '',
    },
};

export const NotFound = new Error('Task Not Found');
export const AlreadyExist = new Error('Task Already Exist');
export const Forbidden = new Error('Forbid to change task');
export const InvalidChangesType = new Error('Invalid changes type');

export function create({ id, owner, changes }) {
    const taskId = id || generateTaskId();
    if (taskStorage.has(taskId)) {
        throw AlreadyExist;
    }

    const state = applyChanges(init(), changes)[0];

    taskStorage.set(taskId, {
        staticState: {
            owner,
            id: taskId,
        },
        state,
    });
}

export function getById({ id }) {
    return taskStorage.get(id);
}

export function getByUserEmail({ email }) {
    const tasks = {};

    taskStorage.forEach((task) => {
        if (isUserCanEditList({ email, id: task.state.listId })) {
            tasks[task.staticState.id] = { ...task, state: save(task.state).toString() };
        }
    });

    return tasks;
}

export function updateStateById({ id, changes, owner }) {
    if (!taskStorage.has(id)) {
        throw NotFound;
    }

    if (typeof changes === 'string') {
        throw InvalidChangesType;
    }

    const task = taskStorage.get(id);

    // Если пользователь может менять список => может менять любую задачу в списке
    if (!isUserCanEditList({ email: owner, id: task.state.listId })) {
        throw Forbidden;
    }

    const taskState = task.state;

    console.log('Before apply', taskState, changes);
    task.state = applyChanges(taskState, changes)[0];

    taskStorage.set(id, task);

    console.log('updateTaskStateById', taskStorage.get(id));
}
