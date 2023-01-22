import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Compressor from "compressorjs";
import $api, { API_URL } from "../http";
import convertToBase64 from "../lib/convertToBase64";
import { logout, setCurrentUser, setCurrentUserFollowings } from "./authSlice";



const shouldFetchCondition = {// This condition canceles ASYNC function before execution.
    condition: (_, { getState, extra }) => {
        if (getState().users.status == "loading") {
            return false
        }
    },
}

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async function (_, { rejectWithValue, getState, dispatch }) {

        // Setting parameters {lastUserDate, requesterId} for fetching to API
        const usersData = getState().users.usersData
        const currentUser = getState().auth.currentUser

        let lastUserDate = (usersData.length > 0)
            ? new Date(usersData[usersData.length - 1].createdAt).getTime()
            : new Date(2200, 0, 1).getTime()

        let requesterId = currentUser._id

        // FETCHING //
        return await $api.post(`/users/get_many`, { lastUserDate, requesterId }) //$api - imported with settings 
            .then((res) => {
                if (res.status == 204) {
                    throw rejectWithValue("No Content")
                };
                const { message, usersData } = res.data
                return { message: message, usersData: usersData }
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);


export const toggleFollowUser = createAsyncThunk(
    "users/toggleFollowUser",
    async function (params, { rejectWithValue, getState, dispatch }) {
        // This state stops fetching posts if previous fetching isn't ready.

        const { action, followingUserId, followedUserId, followedUserIdIndex } = params

        // FETCHING //
        return await $api.put(`/users/${action}/${followedUserId}`, { followingUserId: followingUserId }) //$api - imported with settings 
            .then((res) => {
                const { message, clientFollowings, targetFollowers } = res.data
                dispatch(setCurrentUserFollowings(clientFollowings))
                return { message: message, targetFollowers: targetFollowers, userIndex: followedUserIdIndex };
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
);

const usersSlice = createSlice({
    name: "users",
    initialState: {
        status: null,
        error: null,
        usersData: [],
    },

    reducers: {
        changeInput(state, action) {
            state.userEdit[`${action.payload.inputName}`] = action.payload.inputData
        },
        setMessage(state, action) {
            state[`${action.payload.activityName}`].message.text = action.payload.message
            state[`${action.payload.activityName}`].message.color = action.payload.color
        },
    },

    extraReducers: {
        //GETTING USERS
        [fetchUsers.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [fetchUsers.fulfilled]: (state, action) => {
            const { message, usersData } = action.payload
            state.status = "resolved";
            state.error = null
            state.usersData = state.usersData.concat(usersData)
        },
        [fetchUsers.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },

        //TOGGLE FOLLOW USER
        [toggleFollowUser.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [toggleFollowUser.fulfilled]: (state, action) => {
            const { targetFollowers, userIndex } = action.payload
            state.status = "resolved";
            state.usersData[userIndex].followers = targetFollowers;
            state.error = null
        },
        [toggleFollowUser.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
    }
});

export default usersSlice.reducer;
export const {
    changeInput,
    setShouldFetch,
    setMessage,
    submitChanges,
    setIsCurrentlyEdited,
    setPathnameUserId,
} = usersSlice.actions;