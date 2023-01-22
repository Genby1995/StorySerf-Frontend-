import { createSlice } from "@reduxjs/toolkit";

const searchStringSlice = createSlice({
    name: "searchString",
    initialState: {
        searchString: ""
    },

    reducers: {
        changeSearchString(state, action) {
            state.searchString = action.payload
        },
    },
})

export default searchStringSlice.reducer;

export const {
    changeSearchString,
} = searchStringSlice.actions;