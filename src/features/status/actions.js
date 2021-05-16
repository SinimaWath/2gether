export const STATUS_ACTIONS = {
    SET_STATUS: 'STATUS_ACTIONS/SET_STATUS',
    FETCH_STATUS: 'STATUS_ACTIONS/FETCH_STATUS',
    PULL_LIST: 'STATUS_ACTIONS/PULL_LIST',
    ADD_LIST: 'STATUS_ACTIONS/ADD_LIST',
    ADD_LIST_COLLABS: 'STATUS_ACTIONS/ADD_LIST_COLLABS',
    REMOVE_LIST: 'STATUS_ACTIONS/REMOVE_LIST',
    CHANGE_LIST_TITLE: 'STATUS_ACTIONS/CHANGE_LIST_TITLE',
};

export const setStatus = (payload) => ({ type: STATUS_ACTIONS.SET_STATUS, payload });
export const fetchStatus = () => ({ type: STATUS_ACTIONS.FETCH_STATUS });
export const addList = (payload) => ({ type: STATUS_ACTIONS.ADD_LIST, payload });
export const changeListTitle = (payload) => ({ type: STATUS_ACTIONS.CHANGE_LIST_TITLE, payload });
export const removeList = (payload) => ({ type: STATUS_ACTIONS.REMOVE_LIST, payload });
export const pullList = (payload) => ({ type: STATUS_ACTIONS.PULL_LIST, payload });
export const addListCollabs = (payload) => ({ type: STATUS_ACTIONS.ADD_LIST_COLLABS, payload });
