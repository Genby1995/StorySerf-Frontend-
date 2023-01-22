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
                dispatch(setMessage({
                    activityName: "login",
                    message: err.response.data.message,
                    color: "warning",
                }))
                throw rejectWithValue(err.payload)
            })
            .finally(() => {
                dispatch(setShouldFetch(true));
            })
    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

export const logout = createAsyncThunk(
    "auth/logout",
    async function (_, { rejectWithValue, getState, dispatch }) {
        console.log("ASYNC");

        // FETCHING //
        return await $api.post("/auth/logout") //$api - imported with settings 
            .then((res) => {
                dispatch(setCurrentUser(null));
                localStorage.removeItem("accessToken");
                dispatch(setMessage({
                    activityName: "login",
                    message: "Введите данные пользователя",
                    color: "main",
                }))
                console.log("THEN");
            })
            .catch((err) => {
                dispatch(setMessage({
                    activityName: "login",
                    message: err.response.data.message,
                    color: "warning",
                }))
                console.log("CATCH");
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
        if (loginData.username == "" || loginData.password == "") {
            return dispatch(setMessage({
                activityName: "login",
                message: "Не оставляйте поля пустым.",
                color: "warning",
            }))

        } else if (loginData.username.length < 3 || loginData.password.length < 6) {
            return dispatch(setMessage({
                activityName: "login",
                message: "Логин не меньше 3 символов, пароль - не меньше 6.",
                color: "warning",
            }))

        } else if (loginData.username.length > 25 || loginData.password.length > 25) {
            return dispatch(setMessage({
                activityName: "login",
                message: "Логин и пароль не длиннее 30 символов каждый",
                color: "warning",
            }))
        }

        // FETCHING //
        return await $api.post("/auth/login", loginData) //$api - imported with settings 
            .then((res) => {
                dispatch(setCurrentUser(res.data.user));
                localStorage.setItem("accessToken", res.data.accessToken);
                dispatch(setMessage({
                    activityName: "login",
                    message: "Вход выполнен",
                    color: "main",
                }))
                return res.data.user
            })
            .catch((err) => {
                dispatch(setMessage({
                    activityName: "login",
                    message: err.response.data.message,
                    color: "warning",
                }))
                throw rejectWithValue(err.payload)
            })
    },

    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

export const register = createAsyncThunk(
    "posts/submitRegister",
    async function (_, { rejectWithValue, getState, dispatch }) {

        // Taking last post date for fetching to API 
        const registerData = getState().auth.register

        // Taking and validation date befor fetching to API 
        if (registerData.username == "" || registerData.password == "") {
            return dispatch(setMessage({
                activityName: "register",
                message: "Не оставляйте поля пустым.",
                color: "warning",
            }))

        } else if (registerData.username.length < 3 || registerData.password.length < 6) {
            return dispatch(setMessage({
                activityName: "register",
                message: "Логин не меньше 3 символов, пароль - не меньше 6.",
                color: "warning",
            }))

        } else if (registerData.username.length > 25 || registerData.password.length > 25) {
            return dispatch(setMessage({
                activityName: "register",
                message: "Логин и пароль не длиннее 30 символов каждый",
                color: "warning",
            }))
        } else if (registerData.password != registerData.passwordVerification) {
            return dispatch(setMessage({
                activityName: "register",
                message: "Пароль должен совпадать с его подтверждением",
                color: "warning",
            }))
        }

        // FETCHING //
        return $api.post("/auth/register", registerData) //$api - imported with settings 
            .then((res) => {
                if (res.data.accessToken) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                }
                dispatch(setMessage({
                    activityName: "register",
                    message: "Регистрация выполнена",
                    color: "main",
                }))
                return res.data.user
            })
            .catch((err) => {
                dispatch(setMessage({
                    activityName: "login",
                    message: err.response.data.message,
                    color: "warning",
                }))
                throw rejectWithValue(err.payload)
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
            username: '',
            password: '',
            message: {
                text: "Введите данные пользователя",
                color: "text",
            },
        },
        register: {
            username: '',
            password: '',
            passwordVerification: '',
            firstName: '',
            familyName: '',
            message: {
                text: "Введите данные для регистрации",
                color: "text",
            },
        },
        currentUser: null
    },

    reducers: {
        changeInput(state, action) {
            state[`${action.payload.activityName}`][`${action.payload.inputName}`] = action.payload.inputData
        },
        setShouldFetch(state, action) {
            state.shouldFetch = action.payload
        },
        setMessage(state, action) {
            state[`${action.payload.activityName}`].message.text = action.payload.message
            state[`${action.payload.activityName}`].message.color = action.payload.color
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        setCurrentUserFollowings(state, action) {
            state.currentUser.followings = action.payload
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
            console.log("Я тут");
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
    changeInput,
    setShouldFetch,
    setMessage,
    setCurrentUser,
    setCurrentUserFollowings,
} = authSlice.actions;