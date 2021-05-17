import { STATUS_ACTIONS } from './actions';

export const initialState = {
    lists: {},
    tasks: {},
    user: {},
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case STATUS_ACTIONS.SET_STATUS:
            return {
                ...state,
                ...action.payload,
                lists: {
                    ...state.lists,
                    ...action.payload.lists,
                },
                tasks: {
                    ...state.tasks,
                    ...action.payload.tasks,
                },
            };
        case STATUS_ACTIONS.ADD_LIST: {
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.payload.id]: {
                        ...action.payload,
                    },
                },
            };
        }
        case STATUS_ACTIONS.ADD_TASKS: {
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    ...action.payload.tasks,
                },
            };
        }
        case STATUS_ACTIONS.ADD_TASK: {
            const staten = {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.payload.id]: {
                        ...action.payload,
                    },
                },
                lists: {
                    ...state.lists,
                    [action.payload.listId]: {
                        ...state.lists[action.payload.listId],
                        taskIds: action.payload.taskIds,
                    },
                },
            };
            return staten;
        }
        case STATUS_ACTIONS.REMOVE_TASK: {
            const copy = {
                ...state,
                lists: {
                    ...state.lists,
                    [action.payload.listId]: {
                        ...state.lists[action.payload.listId],
                        taskIds: state.lists[action.payload.listId].taskIds.filter(
                            (v) => v !== action.payload.id
                        ),
                    },
                },
                tasks: {
                    ...state.tasks,
                },
            };

            delete copy.tasks[action.payload.id];

            return copy;
        }
        case STATUS_ACTIONS.REMOVE_LIST: {
            const copy = {
                ...state,
                lists: {
                    ...state.lists,
                },
            };

            delete copy.lists[action.payload.id];

            return copy;
        }
        case STATUS_ACTIONS.ADD_LIST_COLLABS: {
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.payload.id]: {
                        ...state.lists[action.payload.id],
                        collaborators: action.payload.collaborators,
                    },
                },
            };
        }
        case STATUS_ACTIONS.CHANGE_LIST_TITLE: {
            if (!state.lists[action.payload.id]) {
                return state;
            }

            const st = {
                ...state,
                lists: {
                    ...state.lists,
                    [action.payload.id]: {
                        ...state.lists[action.payload.id],
                        title: action.payload.title,
                    },
                },
            };

            if (action.payload.taskIds) {
                st.lists[action.payload.id].taskIds = action.payload.taskIds;
            }

            if (action.payload.collaborators) {
                st.lists[action.payload.id].collaborators = action.payload.collaborators;
            }

            return st;
        }
        case STATUS_ACTIONS.CHANGE_TASK_TITLE: {
            const st = {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.payload.id]: {
                        ...state.tasks[action.payload.id],
                        title: action.payload.title,
                    },
                },
            };

            if (typeof action.payload.done === 'boolean') {
                st.tasks[action.payload.id].done = action.payload.done;
            }

            return st;
        }
        case STATUS_ACTIONS.CHANGE_TASK_DONE: {
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.payload.id]: {
                        ...state.tasks[action.payload.id],
                        done: action.payload.done,
                    },
                },
            };
        }
        default:
            return state;
    }
};
