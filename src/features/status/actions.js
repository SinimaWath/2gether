export const STATUS_ACTIONS = {
    SET_STATUS: 'STATUS_ACTIONS/SET_STATUS',
    FETCH_STATUS: 'STATUS_ACTIONS/FETCH_STATUS',
    PULL_LIST: 'STATUS_ACTIONS/PULL_LIST',
    ADD_LIST: 'STATUS_ACTIONS/ADD_LIST',
    ADD_TASK: 'STATUS_ACTIONS/ADD_TASK',
    ADD_TASKS: 'STATUS_ACTIONS/ADD_TASKS',
    ADD_LIST_COLLABS: 'STATUS_ACTIONS/ADD_LIST_COLLABS',
    REMOVE_LIST: 'STATUS_ACTIONS/REMOVE_LIST',
    REMOVE_TASK: 'STATUS_ACTIONS/REMOVE_TASK',
    CHANGE_LIST_TITLE: 'STATUS_ACTIONS/CHANGE_LIST_TITLE',
    CHANGE_TASK_TITLE: 'STATUS_ACTIONS/CHANGE_TASK_TITLE',
    CHANGE_TASK_DONE: 'STATUS_ACTIONS/CHANGE_TASK_DONE',
};

export const setStatus = (payload) => ({ type: STATUS_ACTIONS.SET_STATUS, payload });
export const fetchStatus = () => ({ type: STATUS_ACTIONS.FETCH_STATUS });
export const addList = (payload) => ({ type: STATUS_ACTIONS.ADD_LIST, payload });
export const addTasks = (payload) => ({ type: STATUS_ACTIONS.ADD_TASKS, payload });
export const changeListTitle = (payload) => ({ type: STATUS_ACTIONS.CHANGE_LIST_TITLE, payload });
export const removeList = (payload) => ({ type: STATUS_ACTIONS.REMOVE_LIST, payload });
export const removeTask = (payload) => ({ type: STATUS_ACTIONS.REMOVE_TASK, payload });
export const pullList = (payload) => ({ type: STATUS_ACTIONS.PULL_LIST, payload });
export const addListCollabs = (payload) => ({ type: STATUS_ACTIONS.ADD_LIST_COLLABS, payload });
export const addTask = (payload) => ({ type: STATUS_ACTIONS.ADD_TASK, payload });
export const changeTaskStatusTitle = (payload) => ({
    type: STATUS_ACTIONS.CHANGE_TASK_TITLE,
    payload,
});

export const changeTaskStatusDone = (payload) => ({
    type: STATUS_ACTIONS.CHANGE_TASK_DONE,
    payload,
});
