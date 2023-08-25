// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/index";
import { checkTokenExpirationMiddleware } from "./user";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenExpirationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
