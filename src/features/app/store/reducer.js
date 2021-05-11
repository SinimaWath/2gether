import { reducer as statusReducer, initialState as statusInitialState } from '../../status/reducer';

const initialState = {
    status: statusInitialState,
};

function reducer(state = initialState, action) {
    return {
        status: statusReducer(state.status, action),
    };
}

export default reducer;
