import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  userName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;
