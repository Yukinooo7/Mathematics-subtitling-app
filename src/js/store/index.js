import { createStore, combineReducers } from "redux";
import collapseReducer from "../reducers/reduces"

export default function configureStore() {

    // const store = createStore(() => { 
    //     return {
    //         message: "Hello world",
    //         data1: "testing 1",
    //         collapse: true,
    //     }

    // });

    // const store = createStore(
    //     combineReducers({
    //         collapse: collapseReducer
    //     }), []);

    const store = createStore(collapseReducer)
    
    // console.log(store.getState())
    // console.log("fsdsd")
    return store
}