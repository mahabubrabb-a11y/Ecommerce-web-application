import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import FooterOne from "../components/FooterOne";
import ShoppingBreadcrumb from "../components/ShoppingBreadcrumb";
import CartPersonal from "../components/CartPersonal";

const CartPersonalPage = () => {
  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* ShoppingBreadcrumb */}
      <ShoppingBreadcrumb />

      {/* CartPersonal */}
      <CartPersonal />


      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default CartPersonalPage;