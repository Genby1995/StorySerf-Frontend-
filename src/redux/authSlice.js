import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import $api, { API_URL } from "../http";

const shouldFetchCondition = {// This condition canceles ASYNC function before execution.
    condition: (_, { getState, extra }) => {
        if (getState().auth.status == "loading") {
            return false
        }
    },
}

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async function (_, { rejectWithValue, getState, dispatch }) {

        // FETCHING //
        return await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true, }) //$api - imported with settings 
            .then((res) => {
                localStorage.setItem("accessToken", res.data.accessToken);
                return res.data.user
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

export const logout = createAsyncThunk(
    "auth/logout",
    async function (_, { rejectWithValue, getState, dispatch }) {
        console.log("Logout");

        // FETCHING //
        return await $api.post("/auth/logout") //$api - imported with settings 
            .then((res) => {
                dispatch(setCurrentUser(null));
                localStorage.removeItem("accessToken");
                dispatch(setStatusAndError({ status: "", error: "" }))
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

export const login = createAsyncThunk(
    "auth/login",
    async function (_, { rejectWithValue, getState, dispatch }) {
        console.log("Login");

        // Taking and validation date befor fetching to API 
        const loginData = getState().auth.login

        if (loginData.username.length < 1 || loginData.password.length < 1) {
            return rejectWithValue("Не оставляйте поля пустым.")
        } else if (loginData.username.length < 3 || loginData.password.length < 6) {
            return rejectWithValue("Логин не меньше 3 символов, пароль - не меньше 6.")
        } else if (loginData.username.length > 25 || loginData.password.length > 25) {
            return rejectWithValue("Логин и пароль не длиннее 30 символов каждый")
        }

        // FETCHING //
        return await $api.post("/auth/login", loginData) //$api - imported with settings 
            .then((res) => {
                const { user, accessToken } = res.data
                localStorage.setItem("accessToken", accessToken);
                return user
            })
            .catch((err) => {
                throw rejectWithValue(err.response.data.message)
            })
    },

    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

export const register = createAsyncThunk(
    "posts/register",
    async function (_, { rejectWithValue, getState, dispatch }) {

        // Taking last post date for fetching to API 
        const registerData = getState().auth.register

        // Taking and validation date befor fetching to API 
        if (registerData.username.length < 0 || registerData.password.length < 0) {
            return rejectWithValue("Не оставляйте поля пустым.")
        } else if (registerData.username.length < 3 || registerData.password.length < 6) {
            return rejectWithValue("Логин не меньше 3 символов, пароль - не меньше 6.")
        } else if (registerData.username.length > 25 || registerData.password.length > 25) {
            return rejectWithValue("Логин и пароль не длиннее 30 символов каждый.")
        } else if (registerData.password != registerData.passwordVerification) {
            return rejectWithValue("Пароль должен совпадать с его подтверждением.")
        }

        // FETCHING //
        return $api.post("/auth/register", registerData) //$api - imported with settings 
            .then((res) => {
                const { user, accessToken } = res.data
                localStorage.setItem("accessToken", accessToken);
                console.log(res.data);
                return user
            })
            .catch((err) => {
                throw rejectWithValue(err.response.data.message)
            })
    },

    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: null,
        error: null,
        // currentActivity: "login", // This state decides current activity: registration or logging in.
        login: {
            username: "",
            password: "",
        },
        register: {
            username: '',
            password: '',
            passwordVerification: '',
            firstName: '',
            familyName: '',
        },
        currentUser: null
    },

    reducers: {
        setStatusAndError(state, action) {
            const { error, status } = action.payload
            state.error = error
            state.status = status
        },
        changeInput(state, action) {
            state[`${action.payload.activityName}`][`${action.payload.inputName}`] = action.payload.inputData
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        setCurrentUserFollowings(state, action) {
            state.currentUser.followings = action.payload
        },
        setCurrentUserBookmarks(state, action) {
            state.currentUser.favoritePosts = action.payload
        }
    },

    extraReducers: {
        //LOGGING IN
        [login.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [login.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.currentUser = action.payload
        },
        [login.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
        //REGISTRAITING
        [register.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [register.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.currentUser = action.payload
        },
        [register.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
        //REFRESHING
        [checkAuth.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [checkAuth.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.currentUser = action.payload
        },
        [checkAuth.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
        //LOGGIN OUT
        [logout.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [logout.fulfilled]: (state,) => {
            state.status = "resolved";
        },
        [logout.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },

    }
});

export default authSlice.reducer;
export const {
    setStatusAndError,
    changeInput,
    setMessage,
    setCurrentUser,
    setCurrentUserFollowings,
    setCurrentUserBookmarks,
} = authSlice.actions;