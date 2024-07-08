import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import fetchFiles from "../services/asyncThunks/fetchFiles";
import { PayloadAction } from "@reduxjs/toolkit";
import { FileData } from "../components/FilesList/types";

export const filesAdapter = createEntityAdapter();

const initialState = filesAdapter.getInitialState({
	filesLoadingStatus: "idle",
});

export const filesSlice = createSlice({
	name: "files",
	initialState,
	reducers: {
		fileAdded: (state, action) => {
			filesAdapter.addOne(state, action.payload);
		},
		fileDeleted: (state, action) => {
			filesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFiles.pending, (state) => {
				state.filesLoadingStatus = "loading";
			})
			.addCase(fetchFiles.fulfilled, (state, action: PayloadAction<FileData[]>) => {
				if (action.payload) {
					filesAdapter.setAll(state, action.payload);
				}
				state.filesLoadingStatus = "idle";
			})
			.addCase(fetchFiles.rejected, (state) => {
				state.filesLoadingStatus = "error";
			})
			.addDefaultCase(() => {});
	},
});

const { actions, reducer } = filesSlice;
export default reducer;
export const { fileAdded, fileDeleted } = actions;
