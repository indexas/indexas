import ApiService from "@/services/api-service-new";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateIndexControllerDID } from "@/store/slices/indexSlice"; // Ensure correct path
import { Users } from "@/types/entity";

type UpdateProfilePayload = {
  profile: Partial<Users>;
  api: ApiService;
};

type UploadAvatarPayload = {
  file: File;
  api: ApiService;
};

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (
    { profile, api }: UpdateProfilePayload,
    { dispatch, rejectWithValue },
  ) => {
    try {
      const newProfile = await api.updateProfile(profile);
      dispatch(updateIndexControllerDID(newProfile)); // Dispatch index slice action
      return newProfile;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async ({ file, api }: UploadAvatarPayload, { rejectWithValue }) => {
    try {
      const res = await api.uploadAvatar(file);
      return res?.cid;
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      return rejectWithValue(error.response.data || error.message);
    }
  },
);
