export const TASK_TITLE_ACTIONS = {
    CHANGE: 'TASK_TITLE_ACTIONS/CHANGE',
};

export const changeTaskTitle = (payload) => ({ type: TASK_TITLE_ACTIONS.CHANGE, payload });
