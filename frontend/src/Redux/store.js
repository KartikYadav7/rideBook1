import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { thunk }from "redux-thunk"; 

const userPersistConfig = {
  key: "user",
  storage: storageSession,
  whitelist: ["user"], // Only persist the 'user' object, not error/status
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
