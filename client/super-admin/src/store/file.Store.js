import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config"
import { ErrorToast, SuccessToast } from "../helper/Helper"

const fileStore = create((set) => ({
  //! file-upload
  fileUploadLoading: false,
  fileUploadRequest: async (file) => {
    try {
      set({ fileUploadLoading: true });
      // create FormData
      const formData = new FormData();
      formData.append("file", file); // must match your backend field name

      const res = await axios.post(baseURL + "/file-upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success === true) {
        set({ fileUploadLoading: false });
        SuccessToast(res?.data?.message || "File uploaded successfully");
        return true;
      } else {
        set({ fileUploadLoading: false });
        ErrorToast(res?.data?.message || "Upload failed");
        return false;
      }
    } catch (error) {
      console.error(error);
      set({ fileUploadLoading: false });
      ErrorToast(error?.response?.data?.message || "Upload failed");
      return false;
    }
  },

  //! all-file
  totalFile: null,
  allFile: null,
  allFileRequest: async (per_page, page_no) => {
    try {
      let res = await axios.get(baseURL + `/all-file/${per_page}/${page_no}`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ allFile: res?.data?.data?.files });
        set({ totalFile: res?.data?.data?.totalCount?.[0]?.count });
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },

  //! file-remove
  fileRemoveRequest: async (data) => {
    try {
      let res = await axios.post(baseURL + `/file-remove`, data, {
        withCredentials: true,
        credentials: "include",
      });
      if (res?.data?.success === true) {
        SuccessToast(res?.data?.message);
        return true;
      } else {
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },
}));

export default fileStore;