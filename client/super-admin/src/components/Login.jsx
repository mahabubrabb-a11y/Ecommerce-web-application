import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle"
import adminStore from "../store/adminStore"
import {useState} from "react"
import { ErrorToast, IsEmpty } from "../helper/Helper";
//import e from "express";

const Login = () => {
const navigate =  useNavigate()
    let{adminLoginLoading,adminLoginRequest } = adminStore() 
    let[data, setData] = useState({email : "", password : ""})
   
   const validations = [
  { field: data.email, message: "Email required" },
  { field: data.password, message: "Password required" },
  ];
  

  let userSubmit = async() =>{
    for(const {field, message} of validations){
      if(IsEmpty(field)){
        return ErrorToast(message)
      }
    }

    let res = await adminLoginRequest(data);

    if (res) {
      navigate('/')
    }
  }

  return (
    <>
      {/* ================================== Account Page Start =========================== */}
      <section className="account d-flex">
        <img
          src="/super-admin/assets/images/thumbs/account-img.png"
          alt=""
          className="account__img"
        />
        <div className="account__left d-md-flex d-none flx-align section-bg position-relative z-index-1 overflow-hidden">
          <img
            src="/super-admin/assets/images/shapes/pattern-curve-seven.png"
            alt=""
            className="position-absolute end-0 top-0 z-index--1 h-100"
          />
          <div className="account-thumb">
            <img
              src="/super-admin/assets/images/thumbs/banner-img.png"
              alt=""
            />
            <div className="statistics animation bg-main text-center">
              <h5 className="statistics__amount text-white">50k</h5>
              <span className="statistics__text text-white font-14">
                Customers
              </span>
            </div>
          </div>
        </div>
        <div className="account__right padding-y-120 flx-align">
          <div className="dark-light-mode">
            {/* Light Dark Mode */}
            <ThemeToggle />
          </div>
          <div className="account-content">
            <Link to="/" className="logo mb-64">
              <img
                src="/super-admin/assets/images/logo/logo.png"
                alt=""
                className="white-version"
              />
              <img
                src="/super-admin/assets/images/logo/white-logo-two.png"
                alt=""
                className="dark-version"
              />
            </Link>
            <h4 className="account-content__title mb-48 text-capitalize">
              Please Sign In (Super Admin)
            </h4>
            <div>
              <div className="row gy-4">
                <div className="col-12">
                  <label
                    htmlFor="email"
                    className="form-label mb-2 font-18 font-heading fw-600"
                  >

                    Email
                  </label>
                  <div className="position-relative">
                    <input
                     
                     onChange={(e) => setData({...data, email: e.target.value})}
                      required
                      type="email"
                      className="common-input common-input--bg common-input--withIcon"
                      id="email"
                      placeholder="infoname@mail.com"
                    />
                    <span className="input-icon">
                      <img
                        src="/super-admin/assets/images/icons/envelope-icon.svg"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <label
                    htmlFor="your-password"
                    className="form-label mb-2 font-18 font-heading fw-600"
                  >
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                    onChange={(e) => setData({...data, password: e.target.value})}
                      required
                      type="password"
                      className="common-input common-input--bg common-input--withIcon"
                      id="your-password"
                      placeholder="6+ characters, 1 Capital letter"
                    />
                    <span
                      className="input-icon toggle-password cursor-pointer"
                      id="#your-password"
                    >
                      <img
                        src="/super-admin/assets/images/icons/lock-icon.svg"
                        alt=""
                      />
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <button
                   disabled = {adminLoginLoading}
                   onClick={userSubmit}
                    className="btn btn-main btn-lg w-100 pill"
                  >
                   {adminLoginLoading? "Loading" : "SignIn"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================================== Account Page End =========================== */}
    </>
  );
};

export default Login;
