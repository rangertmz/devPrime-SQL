import currentReducer from './reducers/getCurrentDbReducer';
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";




const rootReducer = combineReducers({
    currentDatabase : currentReducer
})



const store = configureStore(
    {
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
    }
)

export default store