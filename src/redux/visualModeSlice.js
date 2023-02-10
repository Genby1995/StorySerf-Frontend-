import { createSlice } from "@reduxjs/toolkit";

const visualModeSlice = createSlice({
    name: "visualMode",
    initialState: {
        darkmode: JSON.parse(localStorage.getItem("darkmode")) || false,
        mobileMode: false,
        sideMenuOpen: false,
    },

    reducers: {
        toggleDarkmode(state) {
            localStorage.setItem("darkmode", !state.darkmode);
            state.darkmode = !state.darkmode;
        },
        setMobileMode(state, action) {
            const clientWidth = action.payload
            if (clientWidth < 800) state.mobileMode = true
            if (clientWidth >= 800) state.mobileMode = false
        },
        toggleSideMenuOpen(state) {
            state.sideMenuOpen = !state.sideMenuOpen;
        },
    },
})

export default visualModeSlice.reducer;

export const {
    toggleDarkmode,
    setMobileMode,
    toggleSideMenuOpen,
} = visualModeSlice.actions;