import { combineReducers } from "redux";

import collapse from "./reducer_collapse"
import key from "./reducer_siderbar"
import hasVideo from "./reducer_hasVideo"


const appReducer = combineReducers({
    collapse,
    key,
    hasVideo,
});
export default appReducer;