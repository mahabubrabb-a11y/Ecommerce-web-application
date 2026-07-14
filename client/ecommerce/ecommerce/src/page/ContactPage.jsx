import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BrandSectionOne from "../components/BrandSectionOne";
import FooterOne from "../components/FooterOne";
import Contact from "../components/Contact";
import Breadcrumb from "../components/Breadcrumb";
const ContactPage = () => {
  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BreadcrumbEight */}
      <Breadcrumb title='Contact' />

      {/* Contact */}
      <Contact />

      {/* BrandSectionOne */}
      <BrandSectionOne />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default ContactPage;