import axios from "axios";
import { baseURL } from "../helper/config"
import { create } from "zustand";
import {ErrorToast, SuccessToast} from "../helper/Helper"
import { from } from "form-data";
//import { adminLogout } from "../../../../src/controllers/adminController";
const adminStore = create((set) => ({
  // ! admin-register
  adminRegisterLoading: false,

  adminRegisterRequest: async (data) => {
    try {
      set({ adminRegisterLoading: true });

    
      let res = await axios.post(baseURL + `admin-register`, data, {
        withCredentials: true,
        credentials: "include",
      });

      // ৩. রেসপন্স সফল হলে (success === true)
      if (res?.data?.success === true) {
        set({ adminRegisterLoading: false });
        SuccessToast(res?.data?.message || "Registration Successful!");
        return true;
      } else {
      
        set({ adminRegisterLoading: false });
        ErrorToast(res?.data?.message || "Registration Failed!");
        return false;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      set({ adminRegisterLoading: false });
      return false;
    }
  },


  // !admin-login
  adminLoginLoading: false,
  adminLoginRequest : async (data) =>{
   try {
    set ({adminLoginLoading: true});
    let res = await axios.post(baseURL + `/admin-login`, data,{
         withCredentials: true,
        credentials: "include",
    })

    //3.respons true hole
      if (res?.data?.success === true) {
        set({ adminLoginLoading: false });
        SuccessToast(res?.data?.message || "Login Successful!");
        return true;
      } else {
      
        set({ adminLoginLoading: false });
        ErrorToast(res?.data?.message || "Login Failed!");
        return false;
      }

    

   } catch (error) {
    console.log(error);
      ErrorToast("Something went wrong");
      set({ adminLoginLoading: false });
      return false;
   }
  },


  //!admin-verify
 adminVerifyRequest: async () => {
  try {
    await axios.get(baseURL + "/adminVerify", {
      withCredentials: true,
      credentials: "include",
    });

    return true;
  } catch (error) {
    console.log(error);

    if (error?.response?.status === 401) {
      window.location.href = "/super-admin/login";
    }

    ErrorToast("Something went wrong");
    return false;
  }
},


  //!admin-get
     admin: null,
  adminRequest: async () => {
    try {
      let res = await axios.get(baseURL + `/admin`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ admin: res?.data?.data });

        return true;
      }
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong");
      return false;
    }
  },


    //! admin-update
  adminUpdateLoading: false,
  adminUpdateRequest: async (data) => {
    try {
      set({ adminUpdateLoading: true });
      let res = await axios.put(baseURL + `/adminUpdate`, data, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        set({ adminUpdateLoading: false });
        SuccessToast(res?.data?.message);
        return true;
      } else {
        set({ adminUpdateLoading: false });
        ErrorToast(res?.data?.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      set({ adminUpdateLoading: false });
      ErrorToast("Something went wrong");
      return false;
    }
  },


  //!admin-logout
  adminLogoutRequest: async() =>{
    try {
       let res = await axios.get(baseURL + `/adminLogout`, {
        withCredentials: true,
        credentials: "include",
      });

      if (res?.data?.success === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error)
      ErrorToast('some wrong wait')
      return false
    }
  }


}));




export default adminStore;