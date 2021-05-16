export const TASK_ITEM_ACIONS = {
    CHANGE_DONE: 'TASK_ITEM_ACIONS/CHANGE_DONE',
};

export const changeDoneTask = (payload) => ({ type: TASK_ITEM_ACIONS.CHANGE_DONE, payload });
