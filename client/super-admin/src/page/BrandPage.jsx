import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/Preloader";
import Brand from "../components/Brand"

const BrandPage = () => {
  return (
    <MasterLayout>
      {/* Preloader */}
      <Preloader />

      {/* Brand */}
      <Brand />
    </MasterLayout>
  );
};

export default BrandPage;
