import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebContent } from "../Pages/Home/HomeData";
import apiRequest from "../Utils/apiRequest";
import { RootState } from "./store";

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
        url: "/website",
        params: { id },
        token,
      });
      if (response && !response.error) {
        return response.data;
      } else {
        return rejectWithValue(response?.error || "Unknown error");
      }
  
    }
  );
  
  export const postWebContentsThunk = createAsyncThunk<any, WebContent, { state: RootState }>(
    "webContent/post",
    async (webContent, { getState, rejectWithValue }) => {
      const token = getState().auth.token;
  
      const response: any = await apiRequest({
        method: "post",
        url: "/website",
        data: webContent,
        token,
      });
      if (response && !response.error) {
        return response.data;
      } else {
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
        .addCase(postWebContentsThunk.rejected, (state) => {
          state.postStatus = "failed";
        });
    },
  });

  
  export const webContentReducer = webContentSlice.reducer;
