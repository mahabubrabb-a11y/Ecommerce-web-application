import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import ProductDetails from "../components/ProductDetails";
import FooterOne from "../components/FooterOne";
import BreadcrumbProductDetails from "../components/BreadcrumbProjectDetails";

const ProductDetailsPage = () => {
  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BreadcrumbTwo */}
      <BreadcrumbProductDetails />

      {/* ProductDetails */}
      <ProductDetails />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default ProductDetailsPage;