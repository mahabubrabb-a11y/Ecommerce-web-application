import ArrivalOne from "../components/ArrivalOne";
import BannerOne from "../components/BannerOne";
import BecomeSellerOne from "../components/BecomeSellerOne";
import BrandSectionOne from "../components/BrandSectionOne";
import FooterOne from "../components/FooterOne";
import HeaderOne from "../components/HeaderOne";
import PerformanceAuthor from "../components/PerformanceAuthor";
import PopularOne from "../components/PopularOne";
import SaleOffer from "../components/SaleOffer";
import Preloader from "../helper/Preloader";

const HomePage = () => {
  return (
    <section className='change-gradient'>
      {/* Preloader */}
      <Preloader />

      {/* SaleOffer */}
      <SaleOffer />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* PopularOne */}
      <PopularOne />

      {/* ArrivalOne */}
      <ArrivalOne />

      {/* PerformanceAuthor */}
      <PerformanceAuthor />

      {/* BecomeSellerOne */}
      <BecomeSellerOne />

      {/* BrandSectionOne */}
      <BrandSectionOne />

      {/* FooterOne */}
      <FooterOne />
    </section>
  );
};

export default HomePage;