export const actionNames = {
    TOGGLE_DARKMODE:'TOGGLE_DARKMODE',
};

export const initialState = {
    darkmode: JSON.parse(localStorage.getItem("darkmode")) || false,
};


function darkmodeReducer (state = initialState, action) {

    switch(action.type) {
        case actionNames.TOGGLE_DARKMODE:
            localStorage.setItem("darkmode", !state.darkmode)
            return { 
                ...state, 
                darkmode: !state.darkmode,
            }
        default:
            return state;
    }
}

export default darkmodeReducer;