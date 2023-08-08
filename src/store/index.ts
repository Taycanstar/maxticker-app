// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/index"; // Import the user slice reducer here.

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
