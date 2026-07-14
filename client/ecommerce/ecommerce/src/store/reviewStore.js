import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";
import { ErrorToast, SuccessToast } from "../helper/helper";

const reviewStore = create((set) => ({
  // create-review
  createReviewLoading: false,
  createReviewRequest: async (data) => {
    try {
      set({ createCartLoading: true });
      let res = await axios.post(baseURL + "/create-review", data, {
        withCredentials: true,
        credentials: "include",
      });
      if (res?.data?.success === true) {
        set({ createReviewLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ createReviewLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      set({ createReviewLoading: false });
      return false;
    }
  },

  // all-review
  totalReview: null,
  allReview: null,
  allReviewRequest: async (per_page, page_no) => {
    try {
      let res = await axios.get(
        baseURL + `/all-review/${per_page}/${page_no}`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      if (res?.data?.success === true) {
        set({ allReview: res?.data?.data?.data });
        set({ totalReview: res?.data?.data?.totalCount?.[0]?.count });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // single-review
  singleReview: null,
  singleReviewRequest: async (data) => {
    try {
      let res = await axios.post(baseURL + `/single-review`, data, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ singleReview: res?.data?.data?.[0] });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // all-review-by-product
  allReviewByProduct: null,
  allReviewByProductRequest: async (id) => {
    try {
      let res = await axios.get(baseURL + `/review-by-product/${id}`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ allReviewByProduct: res?.data?.data });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
}));

export default reviewStore; 