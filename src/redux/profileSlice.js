import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Compressor from "compressorjs";
import $api, { API_URL } from "../http";
import convertToBase64 from "../lib/convertToBase64";
import { logout, setCurrentUser, setCurrentUserFollowings } from "./authSlice";



const shouldFetchCondition = {// This condition canceles ASYNC function before execution.
    condition: (_, { getState, extra }) => {
        if (getState().profile.status == "loading") {
            return false
        }
    },
}

export const fetchUser = createAsyncThunk(
    "profile/fetchUser",
    async function (params, { rejectWithValue, getState, dispatch }) {
        console.log("Fetch User");

        // Taking and validation date befor fetching to API 
        const userId = params.userId

        // FETCHING //
        return await $api.get(`/users/get_one/${userId}`) //$api - imported with settings 
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
);

export const uploadImg = createAsyncThunk(
    "profile/uploadImg",
    async function (params) {
        const itemName = params.inputName
        const file = params.file
        const base64 = await convertToBase64(file);
        return { imgUrl: base64, itemName: itemName }
    },
);

export const updataUser = createAsyncThunk(
    "profile/updataUser",
    async function (_, { rejectWithValue, getState, dispatch }) {
        // This state stops fetching posts if previous fetching isn't ready.


        console.log("Update User");
        const userId = getState().profile.user._id
        const userData = getState().profile.userEdit

        // FETCHING //
        return await $api.put(`/users/update/${userId}`, userData) //$api - imported with settings 
            .then((res) => {
                dispatch(setCurrentUser(res.data));
                return res.data
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
    shouldFetchCondition
);

export const deleteAccount = createAsyncThunk(
    "profile/deleteAccount",
    async function (params, { rejectWithValue, getState, dispatch }) {
        // This state stops fetching posts if previous fetching isn't ready.

        console.log("Delete User");
        const userId = params.userId

        // FETCHING //
        return await $api.delete(`/users/delete/${userId}`) //$api - imported with settings 
            .then((res) => {
                console.log(res.data.message);
                dispatch(logout())
                return userId
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
);

export const toggleFollowUser = createAsyncThunk(
    "profile/toggleFollowUser",
    async function (params, { rejectWithValue, getState, dispatch }) {
        // This state stops fetching posts if previous fetching isn't ready.

        const { action, followingUserId, followedUserId } = params

        // FETCHING //
        return await $api.put(`/users/${action}/${followedUserId}`, { followingUserId: followingUserId }) //$api - imported with settings 
            .then((res) => {
                const { message, clientFollowings, targetFollowers } = res.data
                dispatch(setCurrentUserFollowings(clientFollowings))
                return {message: message, targetFollowers: targetFollowers};
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        user: null,
        userEdit: null,
        pathnameUserId: null,
        isCurrentlyEdited: false,
        status: null,
        error: null,
    },

    reducers: {
        changeInput(state, action) {
            state.userEdit[`${action.payload.inputName}`] = action.payload.inputData
        },
        setMessage(state, action) {
            state[`${action.payload.activityName}`].message.text = action.payload.message
            state[`${action.payload.activityName}`].message.color = action.payload.color
        },

        setPathnameUserId(state, action) {
            state.pathnameUserId = action.payload
        },

        setIsCurrentlyEdited(state, action) {
            state.isCurrentlyEdited = action.payload
            if (!action.payload) {
                const userEditData = {
                    firstName: state.user.firstName,
                    familyName: state.user.familyName,
                    about: state.user.about,
                    avatarImg: state.user.avatarImg,
                    coverImg: state.user.coverImg,
                }
                state.userEdit = userEditData
            }
        }
    },

    extraReducers: {
        //GETTING ONE USER
        [fetchUser.pending]: (state) => {
            state.status = "loading";
            state.user = {
                username: "Загрузка",
                firstName: "Загрузка",
                familyName: "",
                about: "Сейчас подгрузим",
            }
            state.error = null
        },
        [fetchUser.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.user = action.payload;
            const userEditData = {
                firstName: action.payload.firstName,
                familyName: action.payload.familyName,
                about: action.payload.about,
                avatarImg: action.payload.avatarImg,
                coverImg: action.payload.coverImg,
            }
            state.userEdit = userEditData;
            state.error = null
        },
        [fetchUser.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
        //Uploading IMG
        [uploadImg.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [uploadImg.fulfilled]: (state, action) => {
            state.status = "resolved";
            const itemName = action.payload.itemName
            const imgUrl = action.payload.imgUrl
            state.userEdit[itemName] = imgUrl
            state.error = null
        },
        [uploadImg.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },

        //UPDATING ONE USER
        [updataUser.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [updataUser.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.user = action.payload;
            state.isCurrentlyEdited = false
            const userEditData = {
                firstName: action.payload.firstName,
                familyName: action.payload.familyName,
                about: action.payload.about,
                avatarImg: action.payload.avatarImg,
                coverImg: action.payload.coverImg,
            }
            state.userEdit = userEditData;
            state.error = null
        },
        [updataUser.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },

        //TOGGLE FOLLOW USER
        [toggleFollowUser.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [toggleFollowUser.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.user.followers = action.payload.targetFollowers;
            state.error = null
        },
        [toggleFollowUser.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
    }
});

export default profileSlice.reducer;
export const {
    changeInput,
    setShouldFetch,
    setMessage,
    submitChanges,
    setIsCurrentlyEdited,
    setPathnameUserId,
} = profileSlice.actions;