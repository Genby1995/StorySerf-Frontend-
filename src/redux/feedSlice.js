import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import $api from "../http";

const shouldFetchCondition = {// This condition canceles ASYNC function before execution.
    condition: (_, { getState, extra }) => {
        if (
            getState().feed.status == "loading"
            && getState().feed.loadingFolders.includes(getState().feed.folder)
        ) {
            return false
        }
    },
}

export const fetchPosts = createAsyncThunk(
    "feed/fetchPosts",
    async function (_, { rejectWithValue, getState, dispatch }) {


        // Setting parameters {lastPostDate, lastPostRaiting, authorsIds} for fetching to API
        const folder = getState().feed.folder
        const postsData = getState().feed["postsData_" + folder]
        const currentUser = getState().auth.currentUser
        const profileId = getState().profile.pathnameUserId
        const followings = currentUser?.followings
        const favoritePosts = currentUser?.favoritePosts

        // This condition canceles ASYNC function before execution 
        //if the same folder is in progress.
        dispatch(setLoadingFolders({ folder: folder, todo: "add" }))

        let lastPostDate = (postsData.length > 0)
            ? new Date(postsData[postsData.length - 1].createdAt).getTime()
            : new Date(2200, 0, 1).getTime()

        let lastPostRaiting = (postsData.length > 0)
            ? '' + (+postsData[postsData.length - 1].likes.length - +postsData[postsData.length - 1].dislikes.length)
            : '' + 10 ** 10

        let authorsIds = null
        let postsIds = null


        // Making cases
        if (folder == "fresh") {
            lastPostRaiting = null;
            authorsIds = null;
            postsIds = null
        }
        if (folder == "best") {
            authorsIds = null;
            postsIds = null
        }
        if (folder == "follows") {
            lastPostRaiting = null;
            authorsIds = followings;
            postsIds = null
        }
        if (folder == "profile") {
            lastPostRaiting = null;
            authorsIds = [profileId];
            postsIds = null
        }
        if (folder == "favorities") {
            lastPostRaiting = null;
            postsIds = null
            postsIds = (favoritePosts.length > 0) ? favoritePosts : ["ерунда"]
        }

            return await $api.post("/posts/get_posts", { //$api - imported with settings 
                lastPostDate: lastPostDate,
                lastPostRaiting: lastPostRaiting,
                authorsIds: authorsIds,
                postsIds: postsIds,
            })
                .then((res) => {
                    const postData = res.data || [];
                    if (res.status == 204) {
                        throw rejectWithValue("No Content")
                    };
                    return { postData: postData, folder: folder }
                })
                .catch((err) => {
                    throw rejectWithValue(err.payload)
                })
                .finally(() => {
                    dispatch(setLoadingFolders({ folder: folder, todo: "remove" }))
                })

    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);


export const fetchLikeDislike = createAsyncThunk(
    "feed/fetchLikeDislike",
    async function (params, { rejectWithValue, getState, dispatch }) {

        const { folder, postId, postIndex, userId, emotion } = params

        // Taking last post date for fetching to API
        return await $api.put(`/posts/${emotion}/${postId}`, { userId: userId }) //$api - imported with settings 
            .then((res) => {
                const { message, likes, dislikes } = res.data;
                return { message, likes, dislikes, postIndex, folder };
            })
            .catch((err) => {
                console.log("Error with likes/dislikes")
                throw rejectWithValue(err.payload)
            })

    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

export const deletePost = createAsyncThunk(
    "feed/deletePost",
    async function (params, { rejectWithValue, getState, dispatch }) {
        // const currentPost = getState().feed.postsData[params.index]
        const { postId, postIndex, folder } = params
        // Taking last post date for fetching to API
        return await $api.delete(`/posts/delete/${postId}`) //$api - imported with settings 
            .then((res) => {
                const { message } = res.data;
                return {
                    message: message,
                    postId: postId,
                    postIndex: postIndex,
                    folder: folder
                };
            })
            .catch((err) => {
                console.log("Error with post deleting")
                throw rejectWithValue(err.payload)
            })

    },
    shouldFetchCondition// This condition canceles ASYNC function before execution.
);

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        status: null,
        error: null,
        folder: null,
        searchString: "",
        loadingFolders: [],

        postsData_fresh: [],
        postsData_best: [],
        postsData_follows: [],
        postsData_profile: [],
        postsData_favorities: [],
    },
    reducers: {
        setLoadingFolders(state, action) {
            const { folder, todo } = action.payload
            if (todo == "add") state.loadingFolders.push(folder)
            if (todo == "remove") state.loadingFolders.filter(item => item !== folder)
        },
        setFolder(state, action) {
            state.folder = action.payload
        },
        clearPosts(state, action) {
            const { folder } = action.payload
            state["postsData_" + folder] = []
        },
        addFeshPost(state, action) {
            const { post, folder } = action.payload
            state["postsData_" + folder].unshift(post)
        },
        togglePostVisability(state, action) {
            const { postIndex, folder } = action.payload
            console.log(postIndex, folder);
            state["postsData_" + folder][postIndex].hidden = !state["postsData_" + folder][postIndex].hidden
        },
        setAutorsAvatar(state, action) {
            const { folder, postIndex, imgUrl } = action.payload
            state["postsData_" + folder][postIndex].avatarImg = imgUrl
        },
    },
    extraReducers: {
        //Likes and Dislikes
        [fetchLikeDislike.pending]: (state, action) => {
            const { postIndex, folder } = action.meta.arg
            state.status = "loading";
            state.error = null;
            state['postsData_' + folder][postIndex].status = "loading";
        },
        [fetchLikeDislike.fulfilled]: (state, action) => {
            const { message, likes, dislikes, postIndex, folder } = action.payload
            state.status = "resolved";
            state['postsData_' + folder][postIndex].likes = likes;
            state['postsData_' + folder][postIndex].dislikes = dislikes;
            state['postsData_' + folder][postIndex].status = "resolved";
        },
        [fetchLikeDislike.rejected]: (state, action) => {
            const { postIndex, folder } = action.meta.arg
            state.status = "error";
            state.error = action.payload
            state['postsData_' + folder][postIndex].status = "error";
        },
        //Geting posts
        [fetchPosts.pending]: (state) => {
            state.status = "loading";
            state.error = null
        },
        [fetchPosts.fulfilled]: (state, action) => {
            const { postData, folder } = action.payload
            state.status = "resolved";
            state["postsData_" + folder] = state["postsData_" + folder]
                ? state["postsData_" + folder].concat(postData)
                : [].concat(postData);
            state.error = null
        },
        [fetchPosts.rejected]: (state, action) => {
            state.status = "error";
            state.error = action.payload;
        },
        //Deleting posts
        [deletePost.pending]: (state, action) => {
            const { postId, postIndex, folder } = action.meta.arg
            state.status = "loading";
            state.error = null
            state["postsData_" + folder][postIndex].status = "loading";
        },
        [deletePost.fulfilled]: (state, action) => {
            const { message, postId, postIndex, folder, } = action.payload
            state.status = "resolved";
            state.error = null
            state["postsData_" + folder][postIndex].status = "resolved";
            state["postsData_" + folder] = state["postsData_" + folder]
                .filter((item) => item._id !== action.payload.postId)
        },
        [deletePost.rejected]: (state, action) => {
            const { postId, postIndex, folder } = action.meta.arg
            state.status = "error";
            state.error = action.payload;
            state["postsData_" + folder][postIndex].status = "error";
        }
    }
});

export default feedSlice.reducer;
export const {
    setFolder,
    clearPosts,
    addFeshPost,
    togglePostVisability,
    setScrollPositions,
    setShouldFetch,
    setAutorsAvatar,
    setLoadingFolders,
} = feedSlice.actions;