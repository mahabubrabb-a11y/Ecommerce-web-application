import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config"
import {ErrorToast, SuccessToast} from "../helper/Helper"

const categoryStore = create ((set)=> ({
    //!create category
     createCategoryLoading: false,
  createCategoryRequest: async (data) => {
    try {
      set({ createCategoryLoading: true });
      let res = await axios.post(baseURL + `/create-category`, data, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ createCategoryLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ createCategoryLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      set({ createCategoryLoading: false });
      return false;
    }
  },

  // !all-category
  totalCategory: null,
  allCategory: null,
  allCategoryRequest: async (per_page, page_no) => {
    try {
      let res = await axios.get(
        baseURL + `/all-category/${per_page}/${page_no}`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      if (res?.data?.success === true) {
        set({ allCategory: res?.data?.data?.categories });
        set({ totalCategory: res?.data?.data?.totalCount?.[0]?.count });
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },

  // single-category
  singleCategory: null,
  singleCategoryRequest: async (id) => {
    try {
      let res = await axios.get(baseURL + `/singleCategory/${id}`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ singleCategory: res?.data?.data });
        return res?.data?.data;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },


 //! delete-category
   deleteCategoryRequest: async (id) => {
    try {
      let res = await axios.delete(baseURL + `/delete-category/${id}`, {
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

  //! update-category
  updateCategoryRequest: async (id, data) => {
    try {
      let res = await axios.put(baseURL + `/update-category/${id}`, data, {
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

export default categoryStore;