// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null, // will only contain { userId, email, isVerified }
  status: "idle",
  error: null,
};

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
      // Only keep the fields you want to persist
      const { userId, userEmail, isVerified } = res.data;
      const user = { userId, email: userEmail, isVerified };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  localStorage.removeItem("user");
  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Only store the fields you want to persist
      const { userId, email, isVerified } = action.payload;
      state.user = { userId, email, isVerified };
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
        // Only store the fields you want to persist
        const { userId, email, isVerified } = action.payload;
        state.user = { userId, email, isVerified };
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
