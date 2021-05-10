export const CREATE_LIST_ACTIONS = {
    MODAL_CREATE_LIST_OK: 'CREATE_LIST_ACTIONS/MODAL_CREATE_LIST_OK',
};

export const createListModalOk = (payload) => ({
    type: CREATE_LIST_ACTIONS.MODAL_CREATE_LIST_OK,
    payload,
});
