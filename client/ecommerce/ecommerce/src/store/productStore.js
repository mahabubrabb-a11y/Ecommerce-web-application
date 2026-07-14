import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";

const productStore = create((set) => ({
  // all Products
  totalProducts: null,
  allProducts: null,
  allProductsRequest: async (
    category_id,
    brand_id,
    remark,
    keyword,
    per_page,
    page_no
  ) => {
    try {
      let res = await axios.get(
        baseURL +
          `/all-products/${category_id}/${brand_id}/${remark}/${keyword}/${per_page}/${page_no}`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      if (res?.data?.success === true) {
        set({ allProducts: res?.data?.data?.products });
        set({ totalProducts: res?.data?.data?.totalCount?.[0]?.count });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // all New Arrival Products
  allNewArrivalProducts: null,
  newArrivalProductsRequest: async (item) => {
    try {
      let res = await axios.get(baseURL + `/all-products/0/0/0/0/${item}/1`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ allNewArrivalProducts: res?.data?.data?.products });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // single-product
  singleProduct: null,
  singleProductsRequest: async (id) => {
    try {
      let res = await axios.get(baseURL + `/single-product/${id}`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ singleProduct: res?.data?.data?.[0] });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
}));

export default productStore;