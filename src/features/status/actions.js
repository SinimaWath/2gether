export const STATUS_ACTIONS = {
    SET_STATUS: 'STATUS_ACTIONS/SET_STATUS',
    FETCH_STATUS: 'STATUS_ACTIONS/FETCH_STATUS',
    ADD_LIST: 'STATUS_ACTIONS/ADD_LIST',
    ADD_LIST_COLLABS: 'STATUS_ACTIONS/ADD_LIST_COLLABS',
    REMOVE_LIST: 'STATUS_ACTIONS/REMOVE_LIST',
};

export const setStatus = (payload) => ({ type: STATUS_ACTIONS.SET_STATUS, payload });
export const fetchStatus = () => ({ type: STATUS_ACTIONS.FETCH_STATUS });
export const addList = (payload) => ({ type: STATUS_ACTIONS.ADD_LIST, payload });
export const removeList = (payload) => ({ type: STATUS_ACTIONS.REMOVE_LIST, payload });

export const addListCollabs = (payload) => ({ type: STATUS_ACTIONS.ADD_LIST_COLLABS, payload });
