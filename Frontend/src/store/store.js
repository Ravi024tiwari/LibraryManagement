import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import bookReducer from "./bookSlice.js"
import adminDashboardReduder from "./adminSlice.js"
import issueReducer from "./issueSlice.js"

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // localStorage


const rootReducer = combineReducers({
  auth: authReducer,
  books:bookReducer,
  admin:adminDashboardReduder,
  issue:issueReducer
});

/* ===============================
   Persist Config
================================ */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"] // only auth will persist
};


const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

/* ===============================
   Store
================================ */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    })
});

export const persistor = persistStore(store);
