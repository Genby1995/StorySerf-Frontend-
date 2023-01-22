import { createSlice } from "@reduxjs/toolkit";

const darkmodeSlice = createSlice({
    name: "darkmode",
    initialState: {
        darkmode: JSON.parse(localStorage.getItem("darkmode")) || false,
    },

    reducers: {
        toggleDarkmode(state) {
            localStorage.setItem("darkmode", !state.darkmode);
            state.darkmode = !state.darkmode;
        },
    },
})

export default darkmodeSlice.reducer;

export const {
    toggleDarkmode,
} = darkmodeSlice.actions;