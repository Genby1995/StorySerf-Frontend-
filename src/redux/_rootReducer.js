import { combineReducers, legacy_createStore as createStore } from "redux";
import messengerReducer from "./messengerReducer";
import feedSlice from "./feedSlice";
import authSlice from "./authSlice";
import postMakerSlice from "./postMakerSlice";
import profileSlice from "./profileSlice";
import usersSlice from "./usersSlice";
import visualModeSlice from "./visualModeSlice";
import searchStringSlice from "./searchStringSlice";

let rootReducer = combineReducers({
    auth: authSlice,
    visualMode: visualModeSlice,
    messenger: messengerReducer,
    feed: feedSlice,
    profile: profileSlice,
    postMaker: postMakerSlice,
    users: usersSlice,
    searchString: searchStringSlice,
})

export default rootReducer;
