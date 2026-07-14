import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/Preloader";
import AllOrders from "../components/AllOrders"

const AllOrdersPage = () => {
  return (
    <MasterLayout>
      {/* Preloader */}
      <Preloader />

      {/* AllOrders */}
      <AllOrders />
    </MasterLayout>
  );
};

export default AllOrdersPage;