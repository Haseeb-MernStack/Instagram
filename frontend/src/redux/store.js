import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux"; // Import combineReducers
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createSlice } from "@reduxjs/toolkit"; // For authSlice
import postSlice from "./postSlice.js";

// Define the authSlice
const authSlice = createSlice({
    name: "auth",
    initialState: { user: null },
    reducers: {
        login(state, action) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
    },
});

// Export authSlice actions
export const { login, logout } = authSlice.actions;

// Persist configuration
const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authSlice.reducer, // Use the reducer from the slice
    post: postSlice
});

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
