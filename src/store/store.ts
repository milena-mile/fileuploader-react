import { configureStore } from '@reduxjs/toolkit';
import files from '../slice/filesSlice';

const store = configureStore({
    reducer: {files},
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
})

export type FilesDispatch = typeof store.dispatch;

export default store;