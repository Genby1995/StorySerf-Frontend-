import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Navigate } from "react-router-dom";
import $api from "../http";
import convertToBase64 from "../lib/convertToBase64";
import { addFeshPost } from "./feedSlice";


const shouldFetchCondition = {// This condition canceles ASYNC function before execution.
    condition: (_, { getState, extra }) => {
        if (getState().postMaker.status == "loading") {
            return false
        }
    },
}

export const publishPost = createAsyncThunk(
    "postMaker/publishPost",
    async function (_, { rejectWithValue, getState, dispatch }) {

        // Taking and validating date befor fetching to API 
        const storeData = getState().postMaker;
        const authorId = getState().auth.currentUser;

        if (!authorId || authorId == "") {
            return dispatch(setMessage({ color: "warning", message: "Пользователь не авторизирован", }))
        } else if (!storeData.postTitle || storeData.postTitle == "") {
            return dispatch(setMessage({ color: "warning", message: "Введите название поста", }))
        } else if (!storeData.postTitle || storeData.postTitle == "") {
            return dispatch(setMessage({ color: "warning", message: "Введите название поста", }))
        } else if (!storeData.postBody.length || storeData.postBody.length < 1) {
            return dispatch(setMessage({ color: "warning", message: "Добавьте посту элементы", }))
        } else if (storeData.postBody.find((item) => item.content == "")) {
            return dispatch(setMessage({ color: "warning", message: "Не оставляйте пустые поля. Заполните их или удалите лишние", }))
        }
        dispatch(setMessage({ color: "text", message: "Отправка...", }))

        let postData = {
            authorId: authorId,
            title: storeData.postTitle,
            postBody: [],
        };
        storeData.postBody.forEach((item) => {
            postData.postBody.push({ type: item.type, content: item.content })
        });

        return await $api.post("/posts/add", postData) //$api - imported with settings 
            .then((res) => {
                const { message, post } = res.data
                dispatch(addFeshPost({post: post, folder: "fresh"}))
                return;
            })
            .catch((err) => {
                throw rejectWithValue(err.payload)
            })
    },
    shouldFetchCondition // This condition canceles ASYNC function before execution.
)

export const uploadImg = createAsyncThunk(
    "postMaker/uploadImg",
    async function (params) {
        const itemId = params.itemId
        const file = params.file
        const base64 = await convertToBase64(file);
        return { imgUrl: base64, itemId: itemId }
    },
    shouldFetchCondition // This condition canceles ASYNC function before execution.
);

const postMakerSlice = createSlice({
    name: "postMaker",
    initialState: {
        postTitle: '',
        postBody: [],
        postBodyLastId: "1",
        status: null,
        error: null,
        message: {
            text: "Добавляйте элементы и делитесь историями в StorySerf",
            color: "text",
        },
    },
    reducers: {
        changeTitle(state, action) {
            state.postTitle = action.payload
        },
        reorder(state, action) {
            state.postBody = action.payload;
        },
        changeText(state, action) {
            state.postBody[action.payload.position].content = action.payload.text
        },
        addText(state) {
            state.postBody.push({ id: state.postBodyLastId, type: 'text', content: '' })
            state.postBodyLastId = String(+state.postBodyLastId + 1)
        },
        addImg(state) {
            state.postBody.push({ id: state.postBodyLastId, type: 'img', content: '' })
            state.postBodyLastId = String(+state.postBodyLastId + 1)
        },
        changeImg(state, action) {
            const itemId = action.payload.itemId
            let item = state.postBody.find((item) => item.id == itemId)
            if (action.payload.imgUrl)
                item.content = action.imgUrl
            if (action.payload.file)
                item.file = action.file
        },
        removeItem(state, action) {
            const itemId = action.payload
            state.postBody = state.postBody.filter((item) => item.id !== itemId)
        },
        setMessage(state, action) {
            state.message.text = action.payload.message
            state.message.color = action.payload.color
        }
    },
    extraReducers: {
        //Uploading IMG
        [uploadImg.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [uploadImg.fulfilled]: (state, action) => {
            state.status = "resolved";
            const itemId = action.payload.itemId
            const item = state.postBody.find((item) => item.id == itemId)
            item.content = action.payload.imgUrl
        },
        [uploadImg.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
        //Publishing Post
        [publishPost.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [publishPost.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.message = { color: "text", text: "Пост опубликован. Хотите создать ещё?...", };
            state.postTitle = "";
            state.postBody = [];
        },
        [publishPost.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload
        },
    }
});

export default postMakerSlice.reducer;
export const {
    changeTitle,
    changeText,
    addText,
    addImg,
    changeImg,
    reorder,
    setDraggedElemIndex,
    removeItem,
    setMessage,
} = postMakerSlice.actions;