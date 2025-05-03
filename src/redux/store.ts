// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer, setLogout } from "./authSlice";
import { webContentReducer } from "./webContentSlice";
import { setLogoutCallback } from "../Utils/Axios/axiosInstance"; // <-- import
import { uiReducer } from "./uiSlice";

const persistConfig = { key: "auth", storage, version: 1 };
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    webContent: webContentReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 🛠 Set the logout callback after store created
setLogoutCallback(() => store.dispatch(setLogout()));

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
