// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './features/projectSlice';
import customerReducer from './features/customerSlice';
const store = configureStore({
	reducer: {
		projects: projectReducer,
		customers: customerReducer,
	},
});

export default store;