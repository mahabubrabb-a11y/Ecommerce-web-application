import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BrandSectionOne from "../components/BrandSectionOne";
import FooterOne from "../components/FooterOne";
import ShoppingBreadcrumb from "../components/ShoppingBreadcrumb";
import Cart from "../components/Cart";

const CartPage = () => {
  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* ShoppingBreadcrumb */}
      <ShoppingBreadcrumb />

      {/* Cart */}
      <Cart />

      {/* BrandSectionOne */}
      <BrandSectionOne />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default CartPage;