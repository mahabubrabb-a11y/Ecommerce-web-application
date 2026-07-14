import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";
import { ErrorToast, SuccessToast } from "../helper/helper";

const cartStore = create((set) => ({
  // create-cart
  createCartLoading: false,
  createCartRequest: async (data) => {
    try {
      set({ createCartLoading: true });
      let res = await axios.post(baseURL + "/create-cart", data, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ createCartLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ createCartLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      if (error?.status === 401) {
        return 401;
      }
      set({ createCartLoading: false });
      return false;
    }
  },

  // update-cart
  updateCartLoading: false,
  updateCartRequest: async (cart_id, data) => {
    try {
      set({ updateCartLoading: true });
      let res = await axios.put(baseURL + "/update-cart/" + cart_id, data, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ updateCartLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ updateCartLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      if (error?.status === 401) {
        return 401;
      }
      set({ updateCartLoading: false });
      return false;
    }
  },

  // read-cart
  allCart: null,
  allCartRequest: async () => {
    try {
      let res = await axios.get(baseURL + `/read-cart`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ allCart: res?.data?.data });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // delete-cart
  deleteCartLoading: false,
  deleteCartRequest: async (id) => {
    try {
      set({ deleteCartLoading: true });
      let res = await axios.delete(baseURL + "/delete-cart/" + id, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ deleteCartLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ deleteCartLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      set({ deleteCartLoading: false });
      return false;
    }
  },
}));

export default cartStore;