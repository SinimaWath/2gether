export const INVITE_TO_LIST_ACTION = {
    INVITE: 'INVITE_TO_LIST_ACTION/invite',
    REMOVE: 'INVITE_TO_LIST_ACTION/remove',
    EXIT: 'INVITE_TO_LIST_ACTION/exit',
    REMOVE_LIST: 'INVITE_TO_LIST_ACTION/REMOVE_LIST',
};

export const invite = (payload) => ({ type: INVITE_TO_LIST_ACTION.INVITE, payload });
export const remove = (payload) => ({ type: INVITE_TO_LIST_ACTION.REMOVE, payload });
export const exit = (payload) => ({ type: INVITE_TO_LIST_ACTION.EXIT, payload });
export const removeList = (payload) => ({ type: INVITE_TO_LIST_ACTION.REMOVE_LIST, payload });
