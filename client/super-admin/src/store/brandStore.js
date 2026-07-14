import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config"
import {ErrorToast, SuccessToast} from "../helper/Helper"


const brandStore = create((set)=>({
    //! create-brand
  createBrandLoading: false,
  createBrandRequest: async (data) => {
    try {
      set({ createBrandLoading: true });
      let res = await axios.post(baseURL + `/brandController`, data, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ createBrandLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ createBrandLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      set({ createBrandLoading: false });
      return false;
    }
  },



    //! all-brand
  totalBrand: null,
  allBrand: null,
  allBrandRequest: async (per_page, page_no) => {
    try {
      let res = await axios.get(baseURL + `/all-brand/${per_page}/${page_no}`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ allBrand: res?.data?.data?.brands });
        set({ totalBrand: res?.data?.data?.totalCount?.[0]?.count });
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },


  
  //! single-brand
  singleBrand: null,
  singleBrandRequest: async (id) => {
    try {
      let res = await axios.get(baseURL + `/single-brand/${id}`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ singleBrand: res?.data?.data });
        return res?.data?.data;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },


    //! delete-brand
  deleteBrandRequest: async (id) => {
    try {
      let res = await axios.delete(baseURL + `/delete-brand/${id}`, {
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



    //! update-brand
  updateBrandRequest: async (id, data) => {
    try {
      let res = await axios.put(baseURL + `/update-brand/${id}`, data, {
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
}))


export default brandStore;