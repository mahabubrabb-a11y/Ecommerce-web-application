import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config"
import { ErrorToast } from "../helper/Helper"

const dashboardStore = create((set) => ({
  dashboard: null,
  dashboardRequest: async () => {
    try {
      let res = await axios.get(baseURL + `/dashboard-summary`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ dashboard: res?.data?.data });
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },
}));

export default dashboardStore;
