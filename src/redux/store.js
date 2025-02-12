// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './features/projectSlice';

const store = configureStore({
  reducer: {
    projects: projectReducer,
  },
});

export default store;