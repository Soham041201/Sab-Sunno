import { combineReducers } from "@reduxjs/toolkit"
import notificationSlice from "./slice/notificationSlice"
import userSlice from "./slice/userSlice"

const rootReducer = combineReducers({
    user: userSlice,
    notification: notificationSlice
})

export default rootReducer