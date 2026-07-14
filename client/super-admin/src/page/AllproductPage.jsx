import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/preloader"
import AllProducts from "../components/AllProducts"

const AllProductPage = () => {
  return (
    <MasterLayout>
      {/* Preloader */}
      <Preloader />

      {/* AllProducts */}
      <AllProducts />
    </MasterLayout>
  );
};

export default AllProductPage;

