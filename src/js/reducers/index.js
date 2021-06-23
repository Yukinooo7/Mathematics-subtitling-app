import { combineReducers } from "redux";

import collapse from "./reducer_collapse"
import key from "./reducer_siderbar"


const appReducer = combineReducers({
    collapse,
    key,
});
export default appReducer;