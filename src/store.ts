import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./slices/MessagesSlice";
import swapReducer from "./slices/SwapSlice";
import darkModeReducer from './slices/DarkmodeSlice';
import walletStattusReducer from './slices/WalletstatusSlice'
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    swap: swapReducer,
    darkmode:darkModeReducer,
    walletStatus: walletStattusReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
