import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  userName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expireIn: number
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  expireIn: 180000
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string, refreshToken: string, expireIn?: number }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.expireIn = action.payload.expireIn || 180000;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.expireIn = 180000;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;
