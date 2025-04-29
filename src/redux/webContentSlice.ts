import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebContent } from "../Pages/Home/HomeData";
import apiRequest from "../Utils/Axios/apiRequest";
import { RootState } from "./store";
import { showErrorToast, showSuccessToast } from "../Utils/commonLogic";

interface WebContentState {
  data: WebContent | null;
  loading: boolean;
  error: string | null;
  postStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: WebContentState = {
  data: null,
  loading: false,
  error: null,
  postStatus: "idle",
};

// Thunks
export const getWebContentsThunk = createAsyncThunk<WebContent, { id: string }, { state: RootState }>(
  "webContent/get",
  async ({ id }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    const response: any = await apiRequest({
      method: "get",
      url: "/website/get-by-id",
      params: { id },
      token,
    });
    if (response && !response.error) {
      return response;
    } else {
      return rejectWithValue(response?.error || "Unknown error");
    }

  }
);

export const postWebContentsThunk = createAsyncThunk<any, {
  webContent: WebContent;
  toastRef?: React.RefObject<any>;
}, { state: RootState }>(
  "webContent/post",
  async ({ webContent, toastRef }, { getState, rejectWithValue, dispatch }) => {
    const token = getState().auth.token;

    const response: any = await apiRequest({
      method: "post",
      url: "/website",
      data: webContent,
      token,
    });

    if (response && !response.error) {
      const newId = response.message;
      // Immediately fetch the newly created content
      await dispatch(getWebContentsThunk({ id: newId }));

      // Show success toast if toastRef is provided
      if (toastRef?.current) {
        showSuccessToast(toastRef, "Success", "Content updated successfully");
      }

      return newId;
    } else {
      if (toastRef?.current) {
        showErrorToast(toastRef, "Error", response?.error || "Unknown error");
      }
      return rejectWithValue(response?.error || "Unknown error");
    }
  }
);
// Slice
export const webContentSlice = createSlice({
  name: "webContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWebContentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWebContentsThunk.fulfilled, (state, action: PayloadAction<WebContent>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getWebContentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postWebContentsThunk.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(postWebContentsThunk.fulfilled, (state) => {
        state.postStatus = "succeeded";
      })
      .addCase(postWebContentsThunk.rejected, (state, action) => {
        state.postStatus = "failed";
        state.error = action.payload as string;
      });
  },
});


export const webContentReducer = webContentSlice.reducer;
