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
        default:
            return state;
    }
};
