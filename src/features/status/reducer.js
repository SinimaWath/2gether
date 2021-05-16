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
        case STATUS_ACTIONS.REMOVE_LIST: {
            const copy = {
                ...state,
                lists: {
                    ...state.lists,
                },
            };

            delete copy[action.payload.id];

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
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.payload.id]: {
                        ...state.lists[action.payload.id],
                        title: action.payload.title,
                    },
                },
            };
        }
        default:
            return state;
    }
};
