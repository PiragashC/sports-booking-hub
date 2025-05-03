import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  editMode: boolean;
}

const initialState: UIState = {
  editMode: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleEditMode: (state) => {
      state.editMode = !state.editMode;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
  },
});

export const { toggleEditMode, setEditMode } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
