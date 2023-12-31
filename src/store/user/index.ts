import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../index";
import axios from "axios";

interface UserState {
  data?: {
    name?: string;
    email?: string;
    id?: string;
    registrationStep?: string;
  } | null;
  userSignupDate: null;
  status: "idle" | "loading" | "loggedIn" | "error";
  error?: string | null | any;
  token: string | null;
  tokenExpiry: number | null;
  refreshToken: string | null;
  // timerState: "stopped" | "running" | "paused";
}

const initialState: UserState = {
  data: null,
  status: "idle",
  error: null,
  token: null,
  tokenExpiry: null,
  refreshToken: null,
  userSignupDate: null,
  // timerState: "stopped",
  // token: null,
};

export const checkTokenExpirationMiddleware =
  (store: any) => (next: any) => (action: any) => {
    // If the action being dispatched is not our refreshTokenAction (to avoid infinite loop)
    if (action.type !== refreshTokenAction.fulfilled.type) {
      const tokenExpiry = store.getState().user.tokenExpiry;
      const currentTime = Date.now().valueOf() / 1000; // Convert to seconds

      if (tokenExpiry && currentTime > tokenExpiry) {
        // If the token has expired, dispatch the refreshTokenAction
        store.dispatch(refreshTokenAction());
      }
    }

    return next(action); // Always call next(action) at the end
  };

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    userData: {
      email: string;
      password: string;
      registrationToken?: string;
      productType?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/u/login`, userData);

      // Save the tokens to AsyncStorage
      await AsyncStorage.setItem("token", response.data.token);
      // await AsyncStorage.setItem("refreshToken", response.data.refreshToken);

      // Optionally, if the backend returns the token expiry time or if you can calculate it:
      // await AsyncStorage.setItem("tokenExpiry", response.data.tokenExpiry.toString());

      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async (
    userData: {
      email?: string;
      username?: string;
      password: string;
      registrationToken?: string;
      birthday?: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
      productType?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/u/signup`, userData);

      // Save the token to AsyncStorage
      await AsyncStorage.setItem("token", response.data.token);
      // await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const refreshTokenAction = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    const refreshToken = (getState() as RootState).user.refreshToken;
    if (!refreshToken) {
      return rejectWithValue("No refresh token found");
    }

    try {
      const response = await api.post(`/u/refresh-token`, { refreshToken });
      await AsyncStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const emailExists = createAsyncThunk(
  "user/emailExists",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/u/check-email-exists`, { email });
      return response.data;
    } catch (error: any) {
      console.log(error, "error");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("token");

      console.log("Logout successful");
      return Promise.resolve("Logout successful");
    } catch (error) {
      console.error("Logout failed", error);
      return rejectWithValue("Logout failed");
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get("/api/get-user");
      const { data } = response;

      // Get the existing user data from the state
      const { registrationStep } = (getState() as RootState).user.data || {};

      // Merge the fetched data with the existing data, including the registrationStep
      const userData = {
        ...data,
        registrationStep,
      };

      return userData;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserByValue = createAsyncThunk(
  "user/fetchByValue",
  async (value: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/get-user-by-value?value=${value}`);
      return response.data.user;
    } catch (error: any) {
      console.log(error, "<= Error");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/get-user-by-id/${id}`);
      return response.data.user;
    } catch (error: any) {
      console.log(error, "<= Error");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "user/cancelSubscription",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/u/cancel-subscription/${id}`);
      // const response = await axios.put(
      //   `http://localhost:8000/u/cancel-subscription/${id}`
      // );
      return response.data;
    } catch (error: any) {
      console.log(error, "<= Error");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/u/delete-user/${id}`);
      // const response = await axios.put(
      //   `http://localhost:8000/u/delete-user/${id}`
      // );
      return response.data;
    } catch (error: any) {
      console.log(error, "<= Error");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const confirmUser = createAsyncThunk(
  "user/confirmUser",
  async (
    data: {
      confirmationToken: string;
      email: string;
      hashedPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/u/confirm-user", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const changeMfPassword = createAsyncThunk(
  "user/changeMfPassword",
  async (
    data: {
      oldPassword: string;
      password: string;
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/u/change-profile-password/${data.id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const checkUserExists = createAsyncThunk(
  "user/checkUserExists",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/u/check-user-exists?email=${email}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const resendConfirmation = createAsyncThunk(
  "user/resendConfirmation",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/u/resend-confirmation", { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addPersonalInfo = createAsyncThunk(
  "user/addPersonalInfo",
  async (
    userData: {
      id?: string;
      firstName: string;
      lastName: string;
      birthday: string;
      organizationName?: string;
      username: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/u/add-personal-info/${userData.id}`,
        userData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const sendCode = createAsyncThunk(
  "user/sendCode",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/u/send-code", { phoneNumber });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const confirmPhoneNumber = createAsyncThunk(
  "user/confirmPhoneNumber",
  async (
    data: { phoneNumber: string; otpCode: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/u/confirm-phone-number`, data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/u/forgot-password", { email });
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const confirmOtp = createAsyncThunk(
  "user/confirmOtp",
  async (
    data: { confirmationToken: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/u/confirm-otp", data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/u/resend-otp", { email });
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const resendCode = createAsyncThunk(
  "user/resendCode",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/u/resend-code", { phoneNumber });
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data: { password: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/u/change-password/${data.id}`, data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const setNewPassword = createAsyncThunk(
  "user/setNewPassword",
  async (data: { password: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/u/set-new-password`, data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  "user/create-checkout-session",
  async () => {
    try {
      const response = await api.post("/pay/create-checkout-session");
      return response.data;
    } catch (error: any) {
      // return rejectWithValue(
      //   error.response ? error.response.data : error.message
      // );
      console.log(error.response ? error.response.data : error.message);
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (
    data: { firstName: string; lastName: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/u/edit-profile/${data.id}`, data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (data: { id: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/u/get-user-by-id/${data.id}`, data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const changeEmail = createAsyncThunk(
  "user/changeEmail",
  async (data: { id: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/u/change-email/${data.id}`, data);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const remoteStart = createAsyncThunk(
  "user/remoteStart",
  async (deviceId: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/u/remote-start", { deviceId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(signup.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "loggedIn";
        state.data = action.payload;
        state.error = null;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken; // Add this line
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.data = null;
        state.error = null;
        state.token = null;
        state.refreshToken = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "loggedIn";
        state.data = action.payload;
        state.error = null;
        state.token = action.payload.token;
        state.userSignupDate = action.payload.createdAt;
        state.refreshToken = action.payload.refreshToken; // Add this line
        state.tokenExpiry = action.payload.tokenExpiry; // Add this line if you have tokenExpiry
      })

      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.data = action.payload;
        // state.status = 'loggedIn';
        state.error = null;
        state.userSignupDate = action.payload.createdAt;
        (state.data as { registrationStep?: string }).registrationStep =
          action.payload?.registrationStep ?? "";
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchUserByValue.fulfilled, (state, action) => {
        // Handle success
        console.log(action.payload, "<= Fulfilled payload");
        state.data = action.payload;
        state.userSignupDate = action.payload.createdAt;
        state.error = null;
      })
      .addCase(fetchUserByValue.rejected, (state, action) => {
        console.log(action.payload, "<= Rejected error");
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(confirmUser.fulfilled, (state, action) => {
        // Handle success

        state.error = null;
      })
      .addCase(confirmUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(checkUserExists.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(checkUserExists.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(resendConfirmation.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(resendConfirmation.rejected, (state, action) => {
        // Handle error
        // ...
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(addPersonalInfo.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(addPersonalInfo.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(sendCode.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(confirmPhoneNumber.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(confirmPhoneNumber.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(resendCode.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        // Handle success
        console.log(action.payload, "<= Fulfilled payload");
        state.data = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        console.log(action.payload, "<= Rejected error");
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(confirmOtp.fulfilled, (state, action) => {
        // Handle success
        console.log(action.payload, "<= Fulfilled payload");
        state.data = action.payload;
        state.error = null;
      })
      .addCase(confirmOtp.rejected, (state, action) => {
        console.log(action.payload, "<= Rejected error");
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        // Handle success
        console.log(action.payload, "<= Fulfilled payload");
        state.data = action.payload;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        console.log(action.payload, "<= Rejected error");
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        // Handle success
        console.log(action.payload, "<= Fulfilled payload");
        state.data = action.payload;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        console.log(action.payload, "<= Rejected error");
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(emailExists.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(emailExists.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(setNewPassword.fulfilled, (state, action) => {
        // Handle success
        console.log(action.payload, "<= Fulfilled payload");
        state.data = action.payload;
        state.error = null;
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        console.log(action.payload, "<= Rejected error");
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshTokenAction.rejected, (state) => {
        state.status = "idle";
        state.data = null;
        state.error = null;
        state.token = null;
        state.refreshToken = null;
      })

      .addCase(remoteStart.pending, (state) => {
        // Handle the loading state
        state.status = "loading";
      })
      .addCase(remoteStart.fulfilled, (state, action) => {
        // Handle the success state
        // Update the state based on the response
        state.status = "loggedIn"; // or another appropriate status
        state.data = action.payload; // assuming the response contains user data
        state.error = null;
      })
      .addCase(remoteStart.rejected, (state, action) => {
        // Handle the error state
        state.status = "error";
        state.error = action.payload; // this will contain the error message
      });
  },
});

export default userSlice.reducer;
