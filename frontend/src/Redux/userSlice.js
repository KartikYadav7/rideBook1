// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

// Login AsyncThunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email,
        password,
      });

      if (res.data.success === false) {
        return rejectWithValue(res.data.message || "Email Not Found");
      }

      if (!res.data?.token) {
        return rejectWithValue("Server response missing token");
      }

      // Destructure user data to persist
      const { token, userId, userName, userEmail, userRole,} = res.data;
      const user = { token, userId, userName, userEmail, userRole, };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

// Logout AsyncThunk
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  localStorage.removeItem("user");
  return null;
});

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Store full user object
      state.status = "succeeded";
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    markVerified: (state) => {
      if (state.user) state.user.isVerified = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload; // Store full user object
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { setUser, clearUser, markVerified, clearError } = userSlice.actions;
export default userSlice.reducer;
