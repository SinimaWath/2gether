export const TASK_ITEM_ACIONS = {
    CHANGE_DONE: 'TASK_ITEM_ACIONS/CHANGE_DONE',
    DELETE_TASK: 'TASK_ITEM_ACIONS/DELETE_TASK',
};

export const changeDoneTask = (payload) => ({ type: TASK_ITEM_ACIONS.CHANGE_DONE, payload });
export const deleteTask = (payload) => ({ type: TASK_ITEM_ACIONS.DELETE_TASK, payload });
