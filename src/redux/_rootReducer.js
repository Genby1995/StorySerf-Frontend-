import { combineReducers, legacy_createStore as createStore } from "redux";
import messengerReducer from "./messengerReducer";
import feedSlice from "./feedSlice";
import authSlice from "./authSlice";
import postMakerSlice from "./postMakerSlice";
import profileSlice from "./profileSlice";
import usersSlice from "./usersSlice";
import darkmodeSlice from "./darkmodeSlice";
import searchStringSlice from "./searchStringSlice";

let rootReducer = combineReducers({
    auth: authSlice,
    darkmode: darkmodeSlice,
    messenger: messengerReducer,
    feed: feedSlice,
    profile: profileSlice,
    postMaker: postMakerSlice,
    users: usersSlice,
    searchString: searchStringSlice,
})

export default rootReducer;
