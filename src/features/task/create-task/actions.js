export const CREATE_TASK_ACTIONS = {
    CREATE_TASK: 'CREATE_TASK_ACTIONS/CREATE_TASK_OK',
};

export const createTask = (payload) => ({
    type: CREATE_TASK_ACTIONS.CREATE_TASK,
    payload,
});
