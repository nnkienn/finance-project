import { AuthResponse, AuthService, MeResponse } from "@/service/authService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: MeResponse | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await AuthService.login(data.email, data.password);
      return res; // AuthResponse
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

// FETCH ME
export const meUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.me();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Get user failed"
      );
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { fullName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await AuthService.register(
        data.fullName,
        data.email,
        data.password
      ); // Có thể trả AuthResponse hoặc message
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Register failed"
      );
    }
  }
);

// REFRESH ACCESS TOKEN
export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.refresh();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Refresh token failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("auth");
      document.cookie = "accessToken=; Max-Age=0; path=/;";
      AuthService.logout().catch(() => {});
    },
    loadAuthFromStorage: (state) => {
      const data = localStorage.getItem("auth");
      if (data) {
        const parsed = JSON.parse(data);
        state.user = parsed.user;
        state.accessToken = parsed.accessToken;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.accessToken = action.payload.accessToken;
          state.error = null;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: state.user,
              accessToken: state.accessToken,
            })
          );
          document.cookie = `accessToken=${state.accessToken}; path=/;`;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ME
      .addCase(meUser.fulfilled, (state, action: PayloadAction<MeResponse>) => {
        state.user = action.payload;
        localStorage.setItem(
          "auth",
          JSON.stringify({ user: state.user, accessToken: state.accessToken })
        );
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;

        if (action.payload?.accessToken) {
          state.accessToken = action.payload.accessToken;
          document.cookie = `accessToken=${state.accessToken}; path=/;`;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: state.user,
              accessToken: state.accessToken,
            })
          );
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REFRESH
      .addCase(
        refreshAccessToken.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.accessToken = action.payload.accessToken;
          document.cookie = `accessToken=${state.accessToken}; path=/;`;

          const data = localStorage.getItem("auth");
          if (data) {
            const parsed = JSON.parse(data);
            state.user = parsed.user;
          }
        }
      );
  },
});

export const { logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
